"""
skill_validator.py - Compare structured user skills vs company skills using AI.
Takes parsed skill lists (not raw text) and returns detailed match results.
"""

import os
import re
import json
from openai import OpenAI

_client = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    return _client


SKILL_COMPARE_PROMPT = """You are an expert ATS skill-matching engine.

USER SKILLS (from resume): {user_skills}
COMPANY SKILLS (from job description): {company_skills}
USER EXPERIENCE LEVEL: {experience_level}

Your job:
1. First, show the user's current skills.
2. Then show the company's required skills.
3. Compare EVERY company skill against user skills — find ALL gaps.
4. For EVERY gap, tell the user EXACTLY what to add to their resume using FULL FORM first then abbreviation so they pass dumb ATS keyword scanning.

Return ONLY valid JSON (no markdown, no code fences) with this EXACT structure:
{{
  "user_skills": ["<each user skill as a separate item>"],
  "company_skills": ["<each company skill as a separate item>"],
  "comparison_table": [
    {{
      "user_skill": "<user's matching skill or null if they don't have it>",
      "company_skill": "<skill the company requires>",
      "gap": "<'no gap' | 'partial' | 'missing'>",
      "suggestion": "<what to write in resume — see rules below. null if no gap>"
    }}
  ],
  "skill_matches": [
    {{
      "company_skill": "<skill from JD>",
      "user_skill": "<matching user skill or null>",
      "match": <true/false>,
      "match_type": "<exact | semantic | partial | missing>",
      "note": "<brief explanation or null>"
    }}
  ],
  "summary": {{
    "total_company_skills": <number>,
    "exact_matches": <number>,
    "semantic_matches": <number>,
    "partial_matches": <number>,
    "missing": <number>,
    "match_percentage": <number 0-100>
  }},
  "skills_to_add": [
    {{
      "skill": "<Full Form (Abbreviation) — e.g. 'Continuous Integration/Continuous Deployment (CI/CD) pipelines'>",
      "reason": "<why — e.g. 'Company requires CI/CD pipelines but not found in your resume'>",
      "resume_line": "<exact sentence user can copy-paste into resume>"
    }}
  ],
  "ats_optimized_skills": "<Complete comma-separated list of ALL skills the user should have in their resume Skills section. For EVERY skill: write Full Form (Abbreviation) first. Put company-matching skills first. Include user's existing skills rewritten for ATS + the gap skills they should add. This is the final copy-paste ready skills section.>",
  "suggestions": [
    "<actionable tip>"
  ]
}}

CRITICAL RULES:

1. COMPARISON TABLE — This is the main output. One row per company skill:
   - gap = "no gap": User has this skill (exact or semantic match). suggestion = null.
   - gap = "partial": User has a RELATED skill but not the exact one (e.g., Azure vs AWS, Docker vs Kubernetes). Write a suggestion tailored to experience level.
   - gap = "missing": User does NOT have this skill at all. Tell them to add it.

2. ATS FULL FORM RULE — For EVERY skill in skills_to_add and ats_optimized_skills:
   - ONLY expand actual abbreviations/acronyms into "Full Form (Abbreviation)". Examples:
     * "CI/CD" → "Continuous Integration/Continuous Deployment (CI/CD) pipelines"
     * "ML" → "Machine Learning (ML)"
     * "AWS" → "Amazon Web Services (AWS)"
     * "K8s" → "Kubernetes (K8s)"
   - Do NOT repeat a skill that is already a full word/phrase. Just write it once. Examples:
     * "Python" → "Python" (NOT "Python (Python)")
     * "Docker" → "Docker" (NOT "Docker (Docker)")
     * "Software Development" → "Software Development" (NOT "Software Development (Software Development)")
     * "React" → "React"
     * "Java" → "Java"
     * "Full-Stack Engineering" → "Full-Stack Engineering"
   - Rule: If the skill name IS already the full form, just write it as-is. Only add (Abbreviation) when there is an ACTUAL shorter abbreviation.
   - This ensures the user passes DUMB ATS systems that do exact keyword matching.
   - Use YOUR knowledge to expand ANY abbreviation from ANY industry.

3. EXPERIENCE-BASED SUGGESTIONS for gaps:
   - FRESHER / JUNIOR (0-2 years):
     * PARTIAL: "Hands-on experience with [user_skill]; familiar with [company_skill]"
       Example: User has Azure, JD wants AWS → "Hands-on experience with Microsoft Azure; familiar with Amazon Web Services (AWS)"
     * MISSING: "Add [skill] if you have any exposure from coursework, projects, or tutorials"
       Example: JD wants React → "Add React to your skills if you've used it in any project or tutorial"
     * Always provide a resume_line they can copy-paste.
   - MID-LEVEL (2-5 years):
     * PARTIAL: "Add [company_skill] only if you have used it in a real project"
     * MISSING: "This skill is required. Add it only if you have real experience."
   - SENIOR (5+ years):
     * PARTIAL: Flag the gap directly. Seniors need exact skills.
     * MISSING: "Critical gap — this skill is required for this role."
   - UNKNOWN: Default to junior-friendly advice.

4. MATCH TYPE definitions:
   - exact: Same skill (e.g., "Python" = "Python", "React" = "React.js")
   - semantic: Same concept, different wording (e.g., "ML" = "Machine Learning", "MySQL" matches "SQL")
   - partial: Related but different (e.g., "Azure" vs "AWS", "Docker" vs "Kubernetes")
   - missing: No related skill at all

5. skills_to_add: ONLY gaps (partial + missing). Each entry must have:
   - skill in Full Form (Abbreviation) format
   - reason why it's needed
   - resume_line the user can copy-paste

6. ats_optimized_skills: The FINAL skills section for the resume. ALL skills in Full Form (Abbreviation) format. Company-matching skills first, then remaining user skills. This is what the user copies into their resume Skills section.

7. Be thorough — check EVERY company skill. Miss nothing.
8. Return ONLY the JSON, nothing else.
"""


def validate_skills(user_skills: list[str], company_skills: list[str], experience: str = "") -> dict:
    """
    Compare user skills against company skills using AI.
    Returns structured match results with types, gap analysis, suggestions, and ATS-optimized list.
    experience: computed experience string, e.g. '1 year 3 months' or 'Not specified'.
    """
    if not user_skills or not company_skills:
        return {
            "user_skills": user_skills or [],
            "company_skills": company_skills or [],
            "comparison_table": [],
            "skill_matches": [],
            "summary": {
                "total_company_skills": len(company_skills) if company_skills else 0,
                "exact_matches": 0,
                "semantic_matches": 0,
                "partial_matches": 0,
                "missing": len(company_skills) if company_skills else 0,
                "match_percentage": 0,
            },
            "skills_to_add": [],
            "ats_optimized_skills": ", ".join(user_skills) if user_skills else "",
            "suggestions": [],
        }

    # Determine experience level label for the AI
    exp_label = "Unknown (treat as junior/fresher)"
    if experience and experience != "Not specified":
        exp_lower = experience.lower()
        # Try to extract years
        year_match = re.search(r"(\d+)\s*year", exp_lower)
        years = int(year_match.group(1)) if year_match else 0
        if years <= 2:
            exp_label = f"Junior/Fresher ({experience})"
        elif years <= 5:
            exp_label = f"Mid-level ({experience})"
        else:
            exp_label = f"Senior ({experience})"
    
    prompt = SKILL_COMPARE_PROMPT.format(
        user_skills=", ".join(user_skills),
        company_skills=", ".join(company_skills),
        experience_level=exp_label,
    )

    response = _get_client().chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an expert ATS skill-matching engine. Return only valid JSON."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.1,
        max_tokens=4000,
    )

    content = response.choices[0].message.content.strip()

    # Clean up markdown code fences if present
    if content.startswith("```"):
        content = content.split("\n", 1)[1]
    if content.endswith("```"):
        content = content.rsplit("```", 1)[0]
    content = content.strip()

    result = json.loads(content)
    return result
