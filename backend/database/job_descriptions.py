"""
job_descriptions.py - CRUD operations for the user_jobdescription table.
Stores user's own job experience extracted from their resume.
"""

from typing import Optional
from database.db import get_supabase


def save_user_job_experience(user_id: str, job_title: str, company: str = "",
                              location: str = "", start_date: str = "",
                              end_date: str = "", description: str = "") -> dict:
    """Save a job experience entry extracted from the user's resume."""
    supabase = get_supabase()
    data = {
        "user_id": user_id,
        "job_title": job_title,
        "company": company,
        "location": location,
        "start_date": start_date,
        "end_date": end_date,
        "description": description,
    }
    response = supabase.table("user_jobdescription").insert(data).execute()
    return response.data[0] if response.data else data


def get_user_job_experiences(user_id: str) -> list[dict]:
    """Get all job experiences for a user, most recent first."""
    supabase = get_supabase()
    response = (
        supabase.table("user_jobdescription")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return response.data or []


def get_user_job_experience_by_id(exp_id: str, user_id: str) -> Optional[dict]:
    """Get a single job experience by ID."""
    supabase = get_supabase()
    response = (
        supabase.table("user_jobdescription")
        .select("*")
        .eq("id", exp_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    return response.data


def delete_user_job_experience(exp_id: str, user_id: str) -> bool:
    """Delete a job experience."""
    supabase = get_supabase()
    response = (
        supabase.table("user_jobdescription")
        .delete()
        .eq("id", exp_id)
        .eq("user_id", user_id)
        .execute()
    )
    return bool(response.data)
