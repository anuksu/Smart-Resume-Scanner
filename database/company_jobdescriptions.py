"""
company_jobdescriptions.py - CRUD operations for the company_jobdescription table.
Stores job descriptions pasted from company job portals.
"""

from typing import Optional
from database.db import get_supabase


def save_company_jobdescription(user_id: str, description: str, title: str = "",
                                 company: str = "", location: str = "",
                                 experience_required: str = "",
                                 education_required: str = "") -> dict:
    """Save a company job description."""
    supabase = get_supabase()
    data = {
        "user_id": user_id,
        "title": title,
        "company": company,
        "description": description,
        "location": location,
        "experience_required": experience_required,
        "education_required": education_required,
    }
    response = supabase.table("company_jobdescription").insert(data).execute()
    return response.data[0] if response.data else data


def get_user_company_jobdescriptions(user_id: str) -> list[dict]:
    """Get all company job descriptions for a user."""
    supabase = get_supabase()
    response = (
        supabase.table("company_jobdescription")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return response.data or []


def get_company_jobdescription_by_id(jd_id: str, user_id: str) -> Optional[dict]:
    """Get a single company job description by ID."""
    supabase = get_supabase()
    response = (
        supabase.table("company_jobdescription")
        .select("*")
        .eq("id", jd_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    return response.data


def delete_company_jobdescription(jd_id: str, user_id: str) -> bool:
    """Delete a company job description (cascades to validations)."""
    supabase = get_supabase()
    response = (
        supabase.table("company_jobdescription")
        .delete()
        .eq("id", jd_id)
        .eq("user_id", user_id)
        .execute()
    )
    return bool(response.data)
