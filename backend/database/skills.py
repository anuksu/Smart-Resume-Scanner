"""
skills.py - CRUD operations for the skills table in Supabase.
"""

from database.db import get_supabase


def add_skill(user_id: str, skill_name: str) -> dict:
    """Add a skill for a user."""
    supabase = get_supabase()
    data = {
        "user_id": user_id,
        "skill_name": skill_name,
    }
    response = supabase.table("user_skills").insert(data).execute()
    return response.data[0] if response.data else data


def add_skills_bulk(user_id: str, skill_names: list[str]) -> list[dict]:
    """Add multiple skills at once for a user."""
    supabase = get_supabase()
    data = [{"user_id": user_id, "skill_name": name} for name in skill_names]
    response = supabase.table("user_skills").insert(data).execute()
    return response.data or []


def get_user_skills(user_id: str) -> list[dict]:
    """Get all skills for a user."""
    supabase = get_supabase()
    response = (
        supabase.table("user_skills")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return response.data or []


def delete_skill(skill_id: str, user_id: str) -> bool:
    """Delete a skill."""
    supabase = get_supabase()
    response = (
        supabase.table("user_skills")
        .delete()
        .eq("id", skill_id)
        .eq("user_id", user_id)
        .execute()
    )
    return bool(response.data)
