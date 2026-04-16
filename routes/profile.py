"""
profile.py - API routes for user profile, education, certifications, and skills.
"""

from typing import Optional
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from database.user import get_user_from_token
from database.profiles import create_profile, get_profile, update_profile
from database.education import add_education, get_user_education, update_education, delete_education
from database.certifications import add_certification, get_user_certifications, update_certification, delete_certification
from database.skills import add_skill, add_skills_bulk, get_user_skills, delete_skill

router = APIRouter()


# --- Helpers ---

def _get_user(authorization: Optional[str]) -> dict:
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization token required.")
    token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization
    user = get_user_from_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token.")
    return user


# --- Request Models ---

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin_url: Optional[str] = None
    profile_picture: Optional[str] = None


class EducationRequest(BaseModel):
    education: str
    specialisation: str = ""
    year: str = ""


class CertificationRequest(BaseModel):
    name: str
    year: str = ""


class SkillRequest(BaseModel):
    skill_name: str


class SkillsBulkRequest(BaseModel):
    skill_names: list[str]


# --- Profile Routes ---

@router.get("/profile")
def get_user_profile(authorization: Optional[str] = Header(None)):
    """Get the full user profile."""
    user = _get_user(authorization)
    profile = get_profile(user["id"])
    if not profile:
        profile = create_profile(
            user_id=user["id"],
            name=user.get("name", ""),
            email=user.get("email", ""),
        )
    return {"profile": profile}


@router.put("/profile")
def update_user_profile(req: ProfileUpdate, authorization: Optional[str] = Header(None)):
    """Update the user profile."""
    user = _get_user(authorization)
    updates = req.model_dump(exclude_none=True)
    profile = update_profile(user["id"], updates)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found.")
    return {"profile": profile}


# --- Education Routes ---

@router.get("/education")
def list_education(authorization: Optional[str] = Header(None)):
    """Get all education records."""
    user = _get_user(authorization)
    return {"education": get_user_education(user["id"])}


@router.post("/education")
def create_education(req: EducationRequest, authorization: Optional[str] = Header(None)):
    """Add an education record."""
    user = _get_user(authorization)
    edu = add_education(user["id"], req.education, req.specialisation, req.year)
    return {"education": edu}


@router.put("/education/{edu_id}")
def edit_education(edu_id: str, req: EducationRequest, authorization: Optional[str] = Header(None)):
    """Update an education record."""
    user = _get_user(authorization)
    edu = update_education(edu_id, user["id"], req.model_dump())
    if not edu:
        raise HTTPException(status_code=404, detail="Education record not found.")
    return {"education": edu}


@router.delete("/education/{edu_id}")
def remove_education(edu_id: str, authorization: Optional[str] = Header(None)):
    """Delete an education record."""
    user = _get_user(authorization)
    if not delete_education(edu_id, user["id"]):
        raise HTTPException(status_code=404, detail="Education record not found.")
    return {"message": "Education deleted."}


# --- Certification Routes ---

@router.get("/certifications")
def list_certifications(authorization: Optional[str] = Header(None)):
    """Get all certifications."""
    user = _get_user(authorization)
    return {"certifications": get_user_certifications(user["id"])}


@router.post("/certifications")
def create_certification(req: CertificationRequest, authorization: Optional[str] = Header(None)):
    """Add a certification."""
    user = _get_user(authorization)
    cert = add_certification(user["id"], req.name, req.year)
    return {"certification": cert}


@router.put("/certifications/{cert_id}")
def edit_certification(cert_id: str, req: CertificationRequest, authorization: Optional[str] = Header(None)):
    """Update a certification."""
    user = _get_user(authorization)
    cert = update_certification(cert_id, user["id"], req.model_dump())
    if not cert:
        raise HTTPException(status_code=404, detail="Certification not found.")
    return {"certification": cert}


@router.delete("/certifications/{cert_id}")
def remove_certification(cert_id: str, authorization: Optional[str] = Header(None)):
    """Delete a certification."""
    user = _get_user(authorization)
    if not delete_certification(cert_id, user["id"]):
        raise HTTPException(status_code=404, detail="Certification not found.")
    return {"message": "Certification deleted."}


# --- Skills Routes ---

@router.get("/skills")
def list_skills(authorization: Optional[str] = Header(None)):
    """Get all skills."""
    user = _get_user(authorization)
    return {"skills": get_user_skills(user["id"])}


@router.post("/skills")
def create_skill(req: SkillRequest, authorization: Optional[str] = Header(None)):
    """Add a single skill."""
    user = _get_user(authorization)
    skill = add_skill(user["id"], req.skill_name)
    return {"skill": skill}


@router.post("/skills/bulk")
def create_skills_bulk(req: SkillsBulkRequest, authorization: Optional[str] = Header(None)):
    """Add multiple skills at once."""
    user = _get_user(authorization)
    skills = add_skills_bulk(user["id"], req.skill_names)
    return {"skills": skills}


@router.delete("/skills/{skill_id}")
def remove_skill(skill_id: str, authorization: Optional[str] = Header(None)):
    """Delete a skill."""
    user = _get_user(authorization)
    if not delete_skill(skill_id, user["id"]):
        raise HTTPException(status_code=404, detail="Skill not found.")
    return {"message": "Skill deleted."}
