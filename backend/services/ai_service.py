import os
import json
from openai import OpenAI

_client = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    return _client

ANALYSIS_PROMPT = """You are an expert ATS (Applicant Tracking System) resume optimizer. Your goal is to help the user UPDATE their resume to match the job description 100% — passing ATS screening, AI screening, and manual human review.

RESUME TEXT:
{resume_text}

JOB DESCRIPTION:
{job_description}

{experience_context}

Return ONLY valid JSON (no markdown, no code fences) with this exact structure:
{{
  "overallScore": <number 0-100>,
  "experience": {{
    "required": "<ONLY what JD explicitly states. If JD says 'entry-level' or no years mentioned, say 'Entry-level' or 'Not specified'>",
    "resume": "<List job titles and durations found in resume, e.g. 'AI/ML Engineer (~1 year)'. If no work experience found, say 'Not specified'. The backend will compute exact total years separately.>",
    "match": <true/false>,
    "applicable": <true/false>
  }},
  "education": {{
    "required": "<what JD asks, e.g. 'Bachelor's in CS'>",
    "resume": "<what resume shows>",
    "match": <true/false>,
    "applicable": <true/false>
  }},
  "location": {{
    "required": "<JD location or Remote/Hybrid/On-site>",
    "resume": "<resume location if found>",
    "match": <true/false>,
    "applicable": <true/false>
  }},
  "skills": [
    {{"name": "<skill>", "match": <true/false>}}
  ],
  "responsibilities": [
    {{"text": "<responsibility from JD>", "match": <true/false>}}
  ],
  "certifications": [
    {{"name": "<cert>", "match": <true/false>, "required": <true/false>}}
  ],
  "missingKeywords": [
    {{
      "keyword": "<missing keyword>",
      "section": "<where to add: Skills/Experience/Summary/Qualifications>",
      "example": "<exact sentence user can copy-paste into their resume>"
    }}
  ],
  "rewriteSuggestions": [
    {{
      "original": "<weak bullet point from resume>",
      "improved": "<rewritten version with JD keywords, metrics, and impact>",
      "keywords": ["<keyword1>", "<keyword2>"]
    }}
  ],
  "atsBulletPoints": [
    "<ATS-optimized bullet point ready to copy-paste>"
  ],
  "resumeUpdateGuide": {{
    "summary": {{
      "current": "<user's current summary/objective if found, or 'Not found'>",
      "suggested": "<rewritten professional summary tailored to this JD. MUST start with the candidate's role and explicitly state their total experience (e.g. 'Results-driven AI/ML Engineer with 1 year of experience in...'). Use key JD terms. 3-4 sentences.>"
    }},
    "skillsToAdd": {{
      "technical": ["<technical skill from JD missing in resume>"],
      "tools": ["<tool/platform from JD missing in resume>"],
      "soft": ["<soft skill from JD missing in resume>"]
    }},
    "atsOptimizedSkills": {{
      "current": "<user's current skills section exactly as written in the resume>",
      "suggested": "<COMPLETE rewritten skills section, ATS-optimized. Flat comma-separated list. Every skill as a standalone keyword. Include both abbreviation and full form. Include ALL JD skills that the user has. Use JD's exact phrasing. Format: 'Technical Skills: skill1, skill2, skill3, ...'>",
      "changes": [
        "<brief explanation of each change made, e.g. 'Expanded ML to Machine Learning (ML)', 'Extracted Azure App Services from parentheses', 'Added Kubernetes from JD'>"
      ]
    }},
    "experienceUpdates": [
      {{
        "action": "<'rewrite' or 'add'>",
        "original": "<existing bullet to rewrite, or null if new>",
        "suggested": "<new/rewritten bullet point aligned to JD>",
        "targetSection": "<which job/section in resume to add this under>"
      }}
    ],
    "qualifications": [
      {{
        "requirement": "<qualification from JD>",
        "status": "<'matched' or 'missing' or 'partial'>",
        "suggestion": "<what to add/change in resume if not matched>"
      }}
    ],
    "formatTips": [
      "<ATS formatting tip specific to this resume, e.g. 'Add a dedicated Skills section', 'Use standard section headings', 'Remove graphics/tables'>"
    ]
  }}
}}

IMPORTANT RULES:
1. overallScore: Reflects how well the resume currently matches the JD.
2. Skills: Use semantic matching (e.g., "JS" = "JavaScript", "k8s" = "Kubernetes"). Extract ALL skills from the JD.
17. SKILLS ATS COACHING — Dumb ATS systems do exact keyword scanning. For EACH JD skill, check these issues:
    a) HIDDEN IN PARENTHESES: If a skill exists in the resume but is buried inside parentheses (e.g., "Microsoft Azure (App Services, Storage Blobs)"), add a missingKeywords entry telling the user to list it as a standalone item. ATS often skips content inside parentheses. Example: suggest adding "Azure App Services" and "Azure Storage Blobs" as separate skills.
    b) BUNDLED PHRASES: If skills are written as descriptions instead of keywords (e.g., "LLM-based OCR and automation solutions"), suggest breaking them into standalone keywords: "LLM", "OCR", "Automation". ATS scans for individual keywords, not sentences.
    c) ABBREVIATION vs FULL FORM: ALWAYS include BOTH the abbreviation AND the full form for EVERY skill that has one. This is critical — different JDs and ATS systems search for different forms. Common examples:
       - LLM → "Large Language Models (LLM)"
       - ML → "Machine Learning (ML)"
       - AI → "Artificial Intelligence (AI)"
       - JS → "JavaScript (JS)"
       - TS → "TypeScript (TS)"
       - CI/CD → "CI/CD (Continuous Integration/Continuous Deployment)"
       - NLP → "Natural Language Processing (NLP)"
       - CV → "Computer Vision (CV)"
       - RAG → "Retrieval-Augmented Generation (RAG)"
       - OCR → "Optical Character Recognition (OCR)"
       - API → "API (Application Programming Interface)"
       - SQL → "SQL (Structured Query Language)"
       - OOP → "Object-Oriented Programming (OOP)"
       - AWS → "Amazon Web Services (AWS)"
       - GCP → "Google Cloud Platform (GCP)"
       - K8s → "Kubernetes (K8s)"
       - DL → "Deep Learning (DL)"
       - BI → "Business Intelligence (BI)"
       - ETL → "ETL (Extract, Transform, Load)"
       - ERP → "ERP (Enterprise Resource Planning)"
       - DAX → "DAX (Data Analysis Expressions)"
       - MCP → "MCP (Model Context Protocol)"
       Apply this to ALL abbreviations found in the resume or JD — not just the examples above. If a skill has a known abbreviation or full form, ALWAYS include both. We do NOT want to take any chance of the user getting rejected.
    d) SLASHES AND SEPARATORS: Skills like "AI / ML / LLM" with spaces around slashes may not match "AI/ML" or "Machine Learning". Suggest writing each as a separate keyword: "AI", "ML", "Machine Learning", "LLM".
    e) SKILLS FORMAT: If the resume uses paragraph-style or category-based skills (e.g., "Programming & web: Java, Python..."), add a formatTip suggesting a flat, ATS-friendly format — a simple comma-separated list under a "Skills" or "Technical Skills" heading with no category labels. Category labels confuse some ATS parsers.
    f) JD EXACT PHRASING: For each skill, use the JD's EXACT wording. If JD says "CI/CD pipelines", suggest "CI/CD pipelines" not just "CI/CD". If JD says "cloud computing", suggest "cloud computing" not just "Azure".
    g) MISSING SKILLS: If a JD skill is genuinely not in the resume at all, list it in resumeUpdateGuide.skillsToAdd AND in missingKeywords with a note: "Add this skill to your Skills section if you have experience with it."
18. ATS-OPTIMIZED SKILLS SECTION — You MUST generate a complete, copy-paste ready skills section in resumeUpdateGuide.atsOptimizedSkills:
    a) "current": Copy the user's existing skills section exactly as it appears in the resume.
    b) "suggested": Rewrite the ENTIRE skills section as a single flat comma-separated list. Rules:
       - Heading should be "Technical Skills:" (no category sub-headings)
       - Every skill is a standalone keyword separated by commas
       - Un-bundle ALL parenthetical skills into standalone items
       - Include BOTH abbreviation and full form: "Machine Learning (ML)"
       - Use the JD's EXACT phrasing for each skill
       - Include ALL skills from the resume + any JD skills the user likely has
       - Do NOT include skills the user clearly doesn't have
       - Order: Put JD-matching skills FIRST, then remaining skills
    c) "changes": List each specific change you made so the user understands why
3. Experience & Education: Only highlight these if they DON'T match. If they match, set match=true and move on.
15. Education matching: Use SEMANTIC matching for education, just like you do for skills. Related fields count as a match. For example:
    - "Software Engineering" matches "Computer Science", "Engineering", "IT", or "related field"
    - "Information Systems" matches "IT", "Computer Science", or "related field"
    - "Data Science" matches "AI/ML", "Computer Science", "Statistics", or "related field"
    - "Electrical Engineering" matches "Engineering" or "related field"
    - If the JD says "or related field", be generous — any STEM or tech-adjacent degree should match.
    - A Master's degree satisfies a Bachelor's requirement (higher degree meets lower requirement).
    - Only set match=false if the degree is clearly unrelated (e.g., "BA in History" vs "CS degree required").
4. Certifications: If the JD says "preferred" or "nice to have", set required=false. Only penalize the score for required certifications that are missing.
5. resumeUpdateGuide.summary: Write a tailored professional summary the user can directly paste into their resume. Use keywords from the JD naturally.
6. resumeUpdateGuide.skillsToAdd: Only list skills that are in the JD but NOT in the resume. Categorize them.
7. resumeUpdateGuide.experienceUpdates: For "rewrite" — take a weak existing bullet and make it stronger with JD keywords. For "add" — create new bullet points that fill gaps between resume and JD.
8. resumeUpdateGuide.qualifications: List each qualification from the JD and whether the resume matches it. Only provide suggestions for missing/partial ones.
9. resumeUpdateGuide.formatTips: Give 2-4 ATS-specific formatting tips based on the actual resume content.
10. The goal is to make the resume pass ATS, AI screening, AND manual human review. Every suggestion should be specific and copy-paste ready.
11. Be thorough but honest — don't inflate the score.
12. Experience: The backend computes total experience from resume dates separately. For the "resume" field, just describe the roles found (e.g. "AI/ML Engineer at test Inc."). For "required", use exactly what the JD says. Focus on whether the experience level is a match.
13. CRITICAL FOR ATS: If the resume does NOT contain an explicit experience statement like "X years of experience" or "X+ years", you MUST add a missingKeywords entry with keyword like "1 year of experience" (use the computed experience provided), section "Summary", and a copy-paste example sentence. Many ATS systems cannot calculate experience from dates — the resume must state it in plain text.
14. The suggested summary in resumeUpdateGuide MUST always include the computed total experience explicitly (e.g. "with 1 year of experience"). This ensures the resume passes even ATS systems that cannot do date math.
16. EDUCATION ATS COACHING — Many ATS systems do dumb keyword matching on education. You MUST check for these issues and add missingKeywords/formatTips entries:
    a) ABBREVIATIONS: If the resume uses abbreviated degree names (MS, BS, MBA, M.S., B.S., B.Tech, M.Tech, PhD), add a formatTip suggesting the user spell it out fully AND keep the abbreviation. Example: "MS Software Engineering" → "Master of Science (MS) in Software Engineering". This ensures ATS finds both "Master" and "MS".
    b) JD KEYWORD MISMATCH: If the JD lists specific fields (e.g., "Computer Science, Engineering, IT") but the resume degree field doesn't contain those exact words (e.g., resume says "Software Engineering" but JD says "Computer Science"), add a missingKeywords entry suggesting the user add the JD's keywords in parentheses. Example: "MS Software Engineering" → "Master of Science (MS) in Software Engineering (Computer Science & Engineering)". The match is still true (it IS a related field), but the user needs the exact keywords for dumb ATS systems.
    c) GRADUATION YEAR FORMAT: If the resume shows year ranges like "2024-2025", suggest writing it as "Expected Graduation: May 2025" or "Graduated: 2025" for ATS clarity. Add this as a formatTip.
    d) DEGREE LEVEL IN SUMMARY: The suggested summary should mention the degree level using the JD's exact phrasing. If JD says "Master's degree", the summary should say "Master's degree" not just "MS".
"""


def analyze_with_ai(resume_text: str, job_description: str, computed_experience: str = "") -> dict:
    """
    Use OpenAI GPT to perform intelligent resume-to-JD matching.
    Returns structured analysis with scores, gaps, and suggestions.
    """
    experience_context = ""
    if computed_experience and computed_experience != "Not specified":
        experience_context = f"COMPUTED EXPERIENCE (calculated by backend from resume dates): {computed_experience}. Use this value when writing the suggested summary and when checking if the resume explicitly states experience duration."
    else:
        experience_context = "COMPUTED EXPERIENCE: Could not be determined from resume dates. Flag this in missingKeywords if the resume lacks explicit experience statements."

    prompt = ANALYSIS_PROMPT.format(
        resume_text=resume_text[:6000],  # Limit to avoid token overflow
        job_description=job_description[:3000],
        experience_context=experience_context,
    )

    response = _get_client().chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an expert ATS resume analyzer. Return only valid JSON."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.3,
        max_tokens=6000,
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
