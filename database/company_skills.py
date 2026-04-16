"""
company_skills.py - CRUD operations for the company_skill table.
Stores skills extracted from company job descriptions.
"""

from database.db import get_supabase


def save_company_skills(user_id: str, company_jobdescription_id: str,
                        skill_names: list[str]) -> list[dict]:
    """Save skills extracted from a company job description."""
    supabase = get_supabase()
    data = [
        {
            "user_id": user_id,
            "company_jobdescription_id": company_jobdescription_id,
            "skill_name": name,
        }
        for name in skill_names if name
    ]
    if not data:
        return []
    response = supabase.table("company_skill").insert(data).execute()
    return response.data or []


def get_company_skills(user_id: str, company_jobdescription_id: str) -> list[dict]:
    """Get all skills for a company job description."""
    supabase = get_supabase()
    response = (
        supabase.table("company_skill")
        .select("*")
        .eq("user_id", user_id)
        .eq("company_jobdescription_id", company_jobdescription_id)
        .execute()
    )
    return response.data or []
