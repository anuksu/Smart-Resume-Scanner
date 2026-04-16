"""
storage.py - Upload and manage files in Supabase Storage.
"""

import uuid
import os
from database.db import get_supabase

BUCKET_NAME = "resumes"


def upload_resume(user_id: str, file_bytes: bytes, filename: str) -> str:
    """
    Upload a resume file to Supabase Storage.
    Returns the public URL of the uploaded file.
    """
    supabase = get_supabase()

    # Create a unique path: resumes/{user_id}/{uuid}_{filename}
    ext = os.path.splitext(filename)[1].lower()
    unique_name = f"{uuid.uuid4().hex}{ext}"
    storage_path = f"{user_id}/{unique_name}"

    # Determine content type
    content_type_map = {
        ".pdf": "application/pdf",
        ".doc": "application/msword",
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }
    content_type = content_type_map.get(ext, "application/octet-stream")

    # Upload to Supabase Storage
    supabase.storage.from_(BUCKET_NAME).upload(
        path=storage_path,
        file=file_bytes,
        file_options={"content-type": content_type},
    )

    # Return the storage path (can generate signed URLs later for download)
    return f"{BUCKET_NAME}/{storage_path}"


def get_signed_url(storage_path: str, expires_in: int = 3600) -> str:
    """Generate a signed URL for downloading a private file. Expires in 1 hour by default."""
    supabase = get_supabase()
    # storage_path format: "resumes/{user_id}/{filename}"
    path = storage_path.replace(f"{BUCKET_NAME}/", "", 1)
    result = supabase.storage.from_(BUCKET_NAME).create_signed_url(path, expires_in)
    return result.get("signedURL", "")


def delete_resume_file(storage_path: str) -> bool:
    """Delete a resume file from Supabase Storage by its storage path."""
    if not storage_path:
        return False
    supabase = get_supabase()
    try:
        path = storage_path.replace(f"{BUCKET_NAME}/", "", 1)
        supabase.storage.from_(BUCKET_NAME).remove([path])
        return True
    except Exception:
        return False
