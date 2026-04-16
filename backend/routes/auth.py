"""
auth.py - Authentication API routes using Supabase Auth.
"""

from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, EmailStr
from typing import Optional
from database.user import create_user, login_user, get_user_from_token, sign_out_user

router = APIRouter()


# --- Request Models ---

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "seeker"  # "seeker" or "hiring"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# --- Routes ---

@router.post("/signup")
def signup(req: SignupRequest):
    """Register a new user via Supabase Auth."""
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")
    if req.role not in ("seeker", "hiring"):
        raise HTTPException(status_code=400, detail="Role must be 'seeker' or 'hiring'.")
    try:
        user = create_user(req.name, req.email, req.password, req.role)
        return {"message": "Account created successfully", "user": user}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
def login(req: LoginRequest):
    """Authenticate via Supabase Auth and return a token."""
    try:
        user = login_user(req.email, req.password)
        return {"message": "Login successful", "user": user}
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.get("/profile")
def profile(authorization: Optional[str] = Header(None)):
    """Get current user profile. Requires Supabase access token in header."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization token required.")

    token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization
    user = get_user_from_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token.")

    return {"user": user}


@router.post("/signout")
def signout(authorization: Optional[str] = Header(None)):
    """Sign out user (invalidate Supabase session)."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization token required.")

    token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization
    sign_out_user(token)
    return {"message": "Signed out successfully"}
