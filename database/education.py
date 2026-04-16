"""
education.py - CRUD operations for the education table in Supabase.
"""

from typing import Optional
from database.db import get_supabase


def add_education(user_id: str, education: str, specialisation: str = "",
                  year: str = "") -> dict:
    """Add an education record for a user."""
    supabase = get_supabase()
    data = {
        "user_id": user_id,
        "education": education,
        "specialisation": specialisation,
        "year": year,
    }
    response = supabase.table("user_education").insert(data).execute()
    return response.data[0] if response.data else data


def get_user_education(user_id: str) -> list[dict]:
    """Get all education records for a user."""
    supabase = get_supabase()
    response = (
        supabase.table("user_education")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return response.data or []


def update_education(edu_id: str, user_id: str, updates: dict) -> Optional[dict]:
    """Update an education record."""
    supabase = get_supabase()
    allowed = {"education", "specialisation", "year"}
    filtered = {k: v for k, v in updates.items() if k in allowed}
    if not filtered:
        return None
    response = (
        supabase.table("user_education")
        .update(filtered)
        .eq("id", edu_id)
        .eq("user_id", user_id)
        .execute()
    )
    return response.data[0] if response.data else None


def delete_education(edu_id: str, user_id: str) -> bool:
    """Delete an education record."""
    supabase = get_supabase()
    response = (
        supabase.table("user_education")
        .delete()
        .eq("id", edu_id)
        .eq("user_id", user_id)
        .execute()
    )
    return bool(response.data)
