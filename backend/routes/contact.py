"""
contact.py - Contact form API route.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from database.contact import save_contact_message

router = APIRouter()


class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


@router.post("/contact")
def submit_contact(req: ContactRequest):
    """Save a contact form submission."""
    if not req.name.strip() or not req.message.strip():
        raise HTTPException(status_code=400, detail="Name and message are required.")
    try:
        result = save_contact_message(req.name, req.email, req.subject, req.message)
        return {"message": "Message sent successfully", "id": result.get("id")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send message: {str(e)}")
