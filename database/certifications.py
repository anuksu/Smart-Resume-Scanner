"""
certifications.py - CRUD operations for the certifications table in Supabase.
"""

from typing import Optional
from database.db import get_supabase


def add_certification(user_id: str, name: str, year: str = "") -> dict:
    """Add a certification for a user."""
    supabase = get_supabase()
    data = {
        "user_id": user_id,
        "name": name,
        "year": year,
    }
    response = supabase.table("user_certification").insert(data).execute()
    return response.data[0] if response.data else data


def get_user_certifications(user_id: str) -> list[dict]:
    """Get all certifications for a user."""
    supabase = get_supabase()
    response = (
        supabase.table("user_certification")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return response.data or []


def update_certification(cert_id: str, user_id: str, updates: dict) -> Optional[dict]:
    """Update a certification."""
    supabase = get_supabase()
    allowed = {"name", "year"}
    filtered = {k: v for k, v in updates.items() if k in allowed}
    if not filtered:
        return None
    response = (
        supabase.table("user_certification")
        .update(filtered)
        .eq("id", cert_id)
        .eq("user_id", user_id)
        .execute()
    )
    return response.data[0] if response.data else None


def delete_certification(cert_id: str, user_id: str) -> bool:
    """Delete a certification."""
    supabase = get_supabase()
    response = (
        supabase.table("user_certification")
        .delete()
        .eq("id", cert_id)
        .eq("user_id", user_id)
        .execute()
    )
    return bool(response.data)
