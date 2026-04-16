"""
profiles.py - CRUD operations for the profiles table in Supabase.
"""

from typing import Optional
from database.db import get_supabase


def create_profile(user_id: str, name: str, email: str, role: str = "seeker",
                   phone: str = "", location: str = "", linkedin_url: str = "",
                   profile_picture: str = "") -> dict:
    """Create a user profile."""
    supabase = get_supabase()
    data = {
        "id": user_id,
        "name": name,
        "role": role,
        "email": email,
        "phone": phone,
        "location": location,
        "linkedin_url": linkedin_url,
        "profile_picture": profile_picture,
    }
    response = supabase.table("user_profile").insert(data).execute()
    return response.data[0] if response.data else data


def get_profile(user_id: str) -> Optional[dict]:
    """Get a user's profile."""
    supabase = get_supabase()
    response = (
        supabase.table("user_profile")
        .select("*")
        .eq("id", user_id)
        .single()
        .execute()
    )
    return response.data


def update_profile(user_id: str, updates: dict) -> Optional[dict]:
    """Update a user's profile. Only provided fields are updated."""
    supabase = get_supabase()
    allowed = {"name", "role", "phone", "location", "linkedin_url", "profile_picture"}
    filtered = {k: v for k, v in updates.items() if k in allowed}
    if not filtered:
        return get_profile(user_id)
    response = (
        supabase.table("user_profile")
        .update(filtered)
        .eq("id", user_id)
        .execute()
    )
    return response.data[0] if response.data else None
