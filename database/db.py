"""
db.py - Supabase client connection.
Uses Supabase for auth and database.
"""

import os
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")


def get_supabase() -> Client:
    """Get a Supabase client instance."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError(
            "SUPABASE_URL and SUPABASE_KEY must be set in the .env file. "
            "Find them in Supabase Dashboard → Settings → API."
        )
    return create_client(SUPABASE_URL, SUPABASE_KEY)
