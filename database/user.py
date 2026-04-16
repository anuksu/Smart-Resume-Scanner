"""
user.py - User authentication using Supabase Auth.
Supabase handles password hashing, JWT tokens, and session management.
"""

from typing import Optional
from database.db import get_supabase
from database.profiles import create_profile


def create_user(name: str, email: str, password: str, role: str = "seeker") -> dict:
    """
    Create a new user via Supabase Auth (signup).
    Stores name and role in user_metadata.
    """
    supabase = get_supabase()

    response = supabase.auth.sign_up({
        "email": email,
        "password": password,
        "options": {
            "data": {
                "name": name,
                "role": role,
            }
        }
    })

    if response.user is None:
        raise ValueError("Signup failed. Please try again.")

    user = response.user
    session = response.session

    # Auto-create profile row with role in the profiles table
    try:
        create_profile(
            user_id=user.id,
            name=name,
            email=email,
            role=role,
        )
    except Exception:
        pass  # Profile creation is non-blocking; user can update later

    return {
        "id": user.id,
        "name": name,
        "email": user.email,
        "role": role,
        "token": session.access_token if session else None,
        "refresh_token": session.refresh_token if session else None,
    }


def login_user(email: str, password: str) -> dict:
    """
    Authenticate a user via Supabase Auth (login).
    Returns user info with access token.
    """
    supabase = get_supabase()

    response = supabase.auth.sign_in_with_password({
        "email": email,
        "password": password,
    })

    if response.user is None:
        raise ValueError("Invalid email or password.")

    user = response.user
    session = response.session
    metadata = user.user_metadata or {}

    return {
        "id": user.id,
        "name": metadata.get("name", ""),
        "email": user.email,
        "role": metadata.get("role", "seeker"),
        "token": session.access_token if session else None,
        "refresh_token": session.refresh_token if session else None,
    }


def get_user_from_token(access_token: str) -> Optional[dict]:
    """
    Get user profile from a Supabase access token.
    """
    supabase = get_supabase()

    response = supabase.auth.get_user(access_token)

    if response.user is None:
        return None

    user = response.user
    metadata = user.user_metadata or {}

    return {
        "id": user.id,
        "name": metadata.get("name", ""),
        "email": user.email,
        "role": metadata.get("role", "seeker"),
        "created_at": str(user.created_at) if user.created_at else None,
    }


def sign_out_user(access_token: str) -> bool:
    """Sign out a user (invalidate session)."""
    supabase = get_supabase()
    try:
        supabase.auth.sign_out(access_token)
        return True
    except Exception:
        return False
