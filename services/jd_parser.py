"""
jd_parser.py - Extract structured data from job description text using AI.
Parses JD into title, company, location, experience, education, and skills.
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


PARSER_PROMPT = """You are an expert job description parser. Extract structured data from the following job description.

JOB DESCRIPTION:
{jd_text}

Return ONLY valid JSON (no markdown, no code fences) with this exact structure:
{{
  "title": "<job title, e.g. 'Full Stack Engineer'>",
  "company": "<company name or null if not found>",
  "location": "<location or 'Remote' or null if not found>",
  "experience_required": "<e.g. 'Entry-level', '3+ years', '5-7 years', or 'Not specified'>",
  "education_required": "<e.g. \"Bachelor's in CS\", \"Master's preferred\", or 'Not specified'>",
  "skills_required": ["<skill1>", "<skill2>", "<skill3>"]
}}

IMPORTANT RULES:
1. Extract the exact job title from the JD.
2. Extract ALL required and desired skills as individual items.
3. For experience, use exactly what the JD states. If it says "entry-level", use "Entry-level". If no years mentioned, use "Not specified".
4. For education, extract the degree level and field if mentioned.
5. Do NOT invent data that is not in the JD. Use null or "Not specified" for missing fields.
6. Return ONLY the JSON, nothing else.
"""


def parse_job_description(jd_text: str) -> dict:
    """
    Parse job description text into structured data using AI.
    Returns dict with title, company, location, experience, education, skills.
    """
    prompt = PARSER_PROMPT.format(jd_text=jd_text[:4000])

    response = _get_client().chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an expert job description parser. Return only valid JSON."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.1,
        max_tokens=2000,
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
