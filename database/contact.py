"""
contact.py - Save contact form submissions to Supabase.
"""

from database.db import get_supabase


def save_contact_message(name: str, email: str, subject: str, message: str) -> dict:
    """Save a contact form submission."""
    supabase = get_supabase()
    data = {
        "name": name,
        "email": email,
        "subject": subject,
        "message": message,
    }
    response = supabase.table("user_contact_message").insert(data).execute()
    return response.data[0] if response.data else data
