"""
validations.py - CRUD operations for validate_skills and validate_jobdescription tables.
"""

import json
from typing import Optional
from database.db import get_supabase


# ---- Skill Validations ----

def save_skill_validations(user_id: str, company_jobdescription_id: str,
                           skills: list[dict]) -> list[dict]:
    """
    Save skill validation results after structured skill comparison.
    skills: list of {"company_skill": str, "user_skill": str|None, "match": bool, "match_type": str, "note": str|None}
    """
    supabase = get_supabase()
    data = [
        {
            "user_id": user_id,
            "company_jobdescription_id": company_jobdescription_id,
            "skill_name": s.get("company_skill", s.get("skill_name", "")),
            "match": s.get("match", False),
            "match_type": s.get("match_type", "missing"),
            "user_skill": s.get("user_skill"),
            "note": s.get("note"),
        }
        for s in skills
    ]
    if not data:
        return []
    response = supabase.table("validate_skills").insert(data).execute()
    return response.data or []


def get_skill_validations(user_id: str, company_jobdescription_id: str) -> list[dict]:
    """Get skill validation results for a specific company JD."""
    supabase = get_supabase()
    response = (
        supabase.table("validate_skills")
        .select("*")
        .eq("user_id", user_id)
        .eq("company_jobdescription_id", company_jobdescription_id)
        .execute()
    )
    return response.data or []


# ---- JD Validations (full analysis) ----

def save_jd_validation(user_id: str, company_jobdescription_id: str,
                       results: dict, resume_id: str = None) -> dict:
    """
    Save full JD validation/analysis results.
    Extracts key fields from the GPT results into dedicated columns.
    """
    supabase = get_supabase()
    data = {
        "user_id": user_id,
        "company_jobdescription_id": company_jobdescription_id,
        "resume_id": resume_id,
        "overall_score": results.get("overallScore", 0),
        "experience_match": results.get("experience", {}).get("match", False),
        "education_match": results.get("education", {}).get("match", False),
        "location_match": results.get("location", {}).get("match", False),
        "missing_keywords": results.get("missingKeywords", []),
        "rewrite_suggestions": results.get("rewriteSuggestions", []),
        "ats_bullet_points": results.get("atsBulletPoints", []),
        "resume_update_guide": results.get("resumeUpdateGuide", {}),
        "results": json.loads(json.dumps(results, default=str)),
    }
    response = supabase.table("validate_jobdescription").insert(data).execute()
    return response.data[0] if response.data else data


def get_jd_validations(user_id: str, company_jobdescription_id: str) -> list[dict]:
    """Get all JD validation results for a specific company JD."""
    supabase = get_supabase()
    response = (
        supabase.table("validate_jobdescription")
        .select("*")
        .eq("user_id", user_id)
        .eq("company_jobdescription_id", company_jobdescription_id)
        .order("created_at", desc=True)
        .execute()
    )
    return response.data or []


def get_all_user_validations(user_id: str, limit: int = 20) -> list[dict]:
    """Get all JD validations for a user (history), most recent first."""
    supabase = get_supabase()
    response = (
        supabase.table("validate_jobdescription")
        .select("*, company_jobdescription(title, company)")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return response.data or []


def get_jd_validation_by_id(validation_id: str, user_id: str) -> Optional[dict]:
    """Get a single JD validation by ID."""
    supabase = get_supabase()
    response = (
        supabase.table("validate_jobdescription")
        .select("*, company_jobdescription(title, company, description)")
        .eq("id", validation_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    return response.data


def delete_jd_validation(validation_id: str, user_id: str) -> bool:
    """Delete a JD validation."""
    supabase = get_supabase()
    response = (
        supabase.table("validate_jobdescription")
        .delete()
        .eq("id", validation_id)
        .eq("user_id", user_id)
        .execute()
    )
    return bool(response.data)
