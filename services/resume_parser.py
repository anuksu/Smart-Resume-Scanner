"""
resume_parser.py - Extract structured data from resume text using AI.
Parses resume into profile info, job experience, education, skills, and certifications.
"""

import os
import json
from openai import OpenAI

_client = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    return _client


PARSER_PROMPT = """You are an expert resume parser. Extract structured data from the following resume text.

RESUME TEXT:
{resume_text}

Return ONLY valid JSON (no markdown, no code fences) with this exact structure:
{{
  "profile": {{
    "name": "<full name>",
    "email": "<email address or null>",
    "phone": "<phone number or null>",
    "location": "<city, state or full location or null>",
    "linkedin_url": "<LinkedIn URL or null>",
    "profile_picture": null
  }},
  "job_experience": [
    {{
      "job_title": "<job title, e.g. 'AI/ML & Data Engineer'>",
      "company": "<company name>",
      "location": "<city, state or null>",
      "start_date": "<e.g. 'May 2025' or '2025'>",
      "end_date": "<e.g. 'Present' or 'Dec 2024' or null>",
      "description": "<bullet points or summary of responsibilities>"
    }}
  ],
  "education": [
    {{
      "education": "<degree and field, e.g. 'MS Software Engineering'>",
      "specialisation": "<university/institution name>",
      "year": "<year range, e.g. '2024-2025'>"
    }}
  ],
  "skills": [
    "<skill1>", "<skill2>", "<skill3>"
  ],
  "certifications": [
    {{
      "name": "<certification name>",
      "year": "<year or null>"
    }}
  ]
}}

IMPORTANT RULES:
1. Extract ALL job experience entries with title, company, dates, and description/bullet points.
2. Extract ALL education entries. Include degree, field of study in "education" and university name in "specialisation".
3. Extract ALL individual skills. Split compound skills (e.g. "Java, Python" → ["Java", "Python"]). Include programming languages, frameworks, tools, platforms, soft skills.
4. Extract ALL certifications. If none found, return an empty array [].
5. For profile, extract whatever contact info is available. Set missing fields to null.
6. Do NOT invent or assume data that is not in the resume.
7. Return ONLY the JSON, nothing else.
"""


def parse_resume(resume_text: str) -> dict:
    """
    Parse resume text into structured data using AI.
    Returns dict with profile, job_experience, education, skills, and certifications.
    """
    prompt = PARSER_PROMPT.format(resume_text=resume_text[:6000])

    response = _get_client().chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an expert resume parser. Return only valid JSON."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.1,
        max_tokens=3000,
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
