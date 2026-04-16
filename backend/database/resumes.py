"""
resumes.py - CRUD operations for the resumes table in Supabase.
"""

from typing import Optional
from database.db import get_supabase


def save_resume(user_id: str, filename: str, extracted_text: str,
                file_url: str = "") -> dict:
    """Save a resume record after upload and OCR."""
    supabase = get_supabase()
    data = {
        "user_id": user_id,
        "filename": filename,
        "file_url": file_url,
        "extracted_text": extracted_text,
    }
    response = supabase.table("user_resume").insert(data).execute()
    return response.data[0] if response.data else data


def get_user_resumes(user_id: str) -> list[dict]:
    """Get all resumes for a user, most recent first."""
    supabase = get_supabase()
    response = (
        supabase.table("user_resume")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return response.data or []


def get_resume_by_id(resume_id: str, user_id: str) -> Optional[dict]:
    """Get a single resume by ID scoped to user."""
    supabase = get_supabase()
    response = (
        supabase.table("user_resume")
        .select("*")
        .eq("id", resume_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    return response.data


def delete_resume(resume_id: str, user_id: str) -> bool:
    """Delete a resume by ID scoped to user."""
    supabase = get_supabase()
    response = (
        supabase.table("user_resume")
        .delete()
        .eq("id", resume_id)
        .eq("user_id", user_id)
        .execute()
    )
    return bool(response.data)
