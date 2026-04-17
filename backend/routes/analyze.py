import os
import traceback
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Header
from services.ocr_service import extract_text_from_resume
from services.validation import validate_and_extract, apply_defaults, ValidationError
from services.ai_service import analyze_with_ai
from database.user import get_user_from_token
from database.resumes import save_resume
from database.storage import upload_resume
from database.job_descriptions import save_user_job_experience, get_user_job_experiences
from database.company_jobdescriptions import save_company_jobdescription, get_user_company_jobdescriptions, delete_company_jobdescription
from database.company_skills import save_company_skills
from database.validations import save_skill_validations, save_jd_validation, get_all_user_validations, get_jd_validation_by_id, get_skill_validations, delete_jd_validation
from database.profiles import update_profile
from database.education import add_education
from database.skills import add_skills_bulk
from database.certifications import add_certification
from services.resume_parser import parse_resume
from services.jd_parser import parse_job_description
from services.experience_calculator import calculate_total_experience
from services.skill_validator import validate_skills

router = APIRouter()

# Ensure uploads directory exists
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
    authorization: Optional[str] = Header(None),
):
    """
    Upload a resume file and job description text.
    Runs full validation pipeline: input check → OCR → GPT analysis.
    If the user is authenticated, saves the results to the database.
    Returns detailed match analysis between the two.
    """
    # Validate file type
    ALLOWED_EXTENSIONS = {'.pdf', '.doc', '.docx'}
    ALLOWED_MIME_TYPES = {
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    }
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

    filename = resume.filename or "resume.pdf"
    ext = os.path.splitext(filename)[1].lower()

    if ext not in ALLOWED_EXTENSIONS and resume.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{ext}'. Only PDF, DOC, DOCX resume files are allowed."
        )

    file_path = None
    try:
        # Read file bytes
        file_bytes = await resume.read()

        if len(file_bytes) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File size exceeds 10MB limit.")

        # Save file temporarily
        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as f:
            f.write(file_bytes)

        # Step 1: Validate inputs + OCR extract full resume text
        resume_text = validate_and_extract(file_bytes, filename, job_description)

        # Step 2: Parse resume to extract structured data + compute experience
        computed_exp = ""
        parsed = None
        try:
            parsed = parse_resume(resume_text)
            job_exp = parsed.get("job_experience", [])
            computed_exp = calculate_total_experience(job_exp)
        except Exception:
            pass  # Resume parsing is non-blocking

        # Step 3: AI analysis with computed experience passed to GPT
        results = analyze_with_ai(resume_text, job_description.strip(), computed_experience=computed_exp)

        # Step 4: Attach metadata and apply defaults
        results["resumeTextPreview"] = (
            resume_text[:500] + "..." if len(resume_text) > 500 else resume_text
        )
        results["resumeFullText"] = resume_text
        results["resumeCharCount"] = len(resume_text)
        results["jdCharCount"] = len(job_description.strip())
        apply_defaults(results)

        # Step 5: Override experience.resume with computed value
        if computed_exp and computed_exp != "Not specified":
            results["experience"]["resume"] = computed_exp

        if parsed:
            results["parsed_profile"] = parsed

        # Save to database if user is authenticated
        if authorization:
            token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization
            user = get_user_from_token(token)
            if user:
                user_id = user["id"]

                # Upload file to Supabase Storage
                file_url = ""
                try:
                    file_url = upload_resume(user_id, file_bytes, filename)
                except Exception:
                    pass  # Storage upload is non-blocking

                # Save resume record with file URL and full extracted text
                resume_record = save_resume(
                    user_id=user_id,
                    filename=filename,
                    extracted_text=resume_text,
                    file_url=file_url,
                )

                # Save structured data from parsed resume to tables
                if parsed:
                    try:
                        # Update user profile with extracted info
                        profile_data = parsed.get("profile", {})
                        profile_updates = {
                            k: v for k, v in profile_data.items()
                            if v is not None and k in ("name", "phone", "location", "linkedin_url")
                        }
                        if profile_updates:
                            update_profile(user_id, profile_updates)

                        # Save education records
                        for edu in parsed.get("education", []):
                            if edu.get("education"):
                                add_education(
                                    user_id=user_id,
                                    education=edu["education"],
                                    specialisation=edu.get("specialisation", ""),
                                    year=edu.get("year", ""),
                                )

                        # Save skills
                        skill_names = parsed.get("skills", [])
                        if skill_names:
                            add_skills_bulk(user_id, skill_names)

                        # Save certifications
                        for cert in parsed.get("certifications", []):
                            if cert.get("name"):
                                add_certification(
                                    user_id=user_id,
                                    name=cert["name"],
                                    year=cert.get("year", ""),
                                )

                        # Save job experience from resume to user_jobdescription
                        for job in parsed.get("job_experience", []):
                            if job.get("job_title"):
                                save_user_job_experience(
                                    user_id=user_id,
                                    job_title=job["job_title"],
                                    company=job.get("company", ""),
                                    location=job.get("location", ""),
                                    start_date=job.get("start_date", ""),
                                    end_date=job.get("end_date", ""),
                                    description=job.get("description", ""),
                                )
                    except Exception:
                        pass  # Structured data saving is non-blocking

                # Parse company JD and save to company_jobdescription
                jd_title = ""
                jd_company = ""
                jd_location = ""
                jd_experience = ""
                jd_education = ""
                jd_skills = []
                try:
                    parsed_jd = parse_job_description(job_description)
                    jd_title = parsed_jd.get("title", "") or ""
                    jd_company = parsed_jd.get("company", "") or ""
                    jd_location = parsed_jd.get("location", "") or ""
                    jd_experience = parsed_jd.get("experience_required", "") or ""
                    jd_education = parsed_jd.get("education_required", "") or ""
                    jd_skills = parsed_jd.get("skills_required", []) or []
                    results["parsed_jd"] = parsed_jd
                except Exception:
                    pass  # JD parsing is non-blocking

                company_jd_record = save_company_jobdescription(
                    user_id=user_id,
                    description=job_description,
                    title=jd_title,
                    company=jd_company,
                    location=jd_location,
                    experience_required=jd_experience,
                    education_required=jd_education,
                )
                company_jd_id = company_jd_record.get("id")

                # Save company skills to company_skill table
                if jd_skills and company_jd_id:
                    save_company_skills(user_id, company_jd_id, jd_skills)

                # Structured skill validation: compare user skills vs company skills
                user_skill_names = parsed.get("skills", []) if parsed else []
                if user_skill_names and jd_skills and company_jd_id:
                    try:
                        skill_validation_result = validate_skills(user_skill_names, jd_skills, experience=computed_exp)
                        skill_matches = skill_validation_result.get("skill_matches", [])
                        if skill_matches:
                            save_skill_validations(user_id, company_jd_id, skill_matches)
                        results["skill_validation"] = skill_validation_result
                    except Exception:
                        # Fallback: save basic match data from AI analysis
                        skills = results.get("skills", [])
                        skill_data = [
                            {"company_skill": s.get("name", ""), "match": s.get("match", False), "match_type": "exact" if s.get("match") else "missing"}
                            for s in skills if s.get("name")
                        ]
                        if skill_data:
                            save_skill_validations(user_id, company_jd_id, skill_data)

                # Save full JD validation (AI analysis results)
                if company_jd_id:
                    jd_val = save_jd_validation(
                        user_id=user_id,
                        company_jobdescription_id=company_jd_id,
                        results=results,
                        resume_id=resume_record.get("id"),
                    )
                    results["validation_id"] = jd_val.get("id")
                    results["company_jobdescription_id"] = company_jd_id

        return results

    except ValidationError as e:
        raise HTTPException(status_code=400, detail={"message": e.message, "field": e.field})
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
    finally:
        # Clean up uploaded file
        if file_path and os.path.exists(file_path):
            os.remove(file_path)


def _get_user_from_header(authorization: Optional[str]) -> dict:
    """Extract and validate user from Authorization header."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization token required.")
    token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization
    user = get_user_from_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token.")
    return user


@router.get("/history")
def list_history(authorization: Optional[str] = Header(None)):
    """Get all past validation results for the authenticated user."""
    user = _get_user_from_header(authorization)
    validations = get_all_user_validations(user["id"])
    return {"validations": validations}


@router.get("/history/{validation_id}")
def get_single_validation(validation_id: str, authorization: Optional[str] = Header(None)):
    """Get a single validation by ID with skill matches."""
    user = _get_user_from_header(authorization)
    validation = get_jd_validation_by_id(validation_id, user["id"])
    if not validation:
        raise HTTPException(status_code=404, detail="Validation not found.")
    # Also fetch skill validations for this company JD
    company_jd_id = validation.get("company_jobdescription_id")
    skill_vals = get_skill_validations(user["id"], company_jd_id) if company_jd_id else []
    return {"validation": validation, "skill_validations": skill_vals}


@router.delete("/history/{validation_id}")
def remove_validation(validation_id: str, authorization: Optional[str] = Header(None)):
    """Delete a validation by ID."""
    user = _get_user_from_header(authorization)
    deleted = delete_jd_validation(validation_id, user["id"])
    if not deleted:
        raise HTTPException(status_code=404, detail="Validation not found.")
    return {"message": "Validation deleted successfully."}


@router.get("/job-descriptions")
def list_job_descriptions(authorization: Optional[str] = Header(None)):
    """Get all company job descriptions pasted by the user."""
    user = _get_user_from_header(authorization)
    jds = get_user_company_jobdescriptions(user["id"])
    return {"job_descriptions": jds}


@router.get("/job-experiences")
def list_job_experiences(authorization: Optional[str] = Header(None)):
    """Get all job experiences extracted from the user's resume."""
    user = _get_user_from_header(authorization)
    experiences = get_user_job_experiences(user["id"])
    return {"job_experiences": experiences}


@router.delete("/job-descriptions/{jd_id}")
def remove_job_description(jd_id: str, authorization: Optional[str] = Header(None)):
    """Delete a company job description (cascades to its validations)."""
    user = _get_user_from_header(authorization)
    deleted = delete_company_jobdescription(jd_id, user["id"])
    if not deleted:
        raise HTTPException(status_code=404, detail="Job description not found.")
    return {"message": "Job description and related validations deleted."}


@router.post("/extract-text")
async def extract_text(resume: UploadFile = File(...)):
    """
    Extract text from a resume file using Mistral OCR.
    Returns raw extracted text.
    """
    allowed_extensions = {".pdf", ".png", ".jpg", ".jpeg"}
    file_ext = os.path.splitext(resume.filename or "")[1].lower()
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file_ext}. Allowed: {', '.join(allowed_extensions)}"
        )

    try:
        file_bytes = await resume.read()
        text = extract_text_from_resume(file_bytes, resume.filename or "resume.pdf")
        return {"text": text, "filename": resume.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR extraction failed: {str(e)}")
