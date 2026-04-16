"""
validation.py - Resume-to-Job Description Matching Orchestrator

Flow:
1. Validate inputs (resume file + job description text)
2. Extract text from resume using Mistral OCR
3. Send both texts to OpenAI GPT for smart analysis
4. Format and return structured results

Supported resume formats: PDF, PNG, JPG, JPEG
Job description: Plain text pasted from any job portal (LinkedIn, Indeed, etc.)
"""

from typing import Any

from services.ocr_service import extract_text_from_resume
from services.ai_service import analyze_with_ai


ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx"}
MAX_FILE_SIZE_MB = 10
MAX_JD_LENGTH = 10000  # characters


class ValidationError(Exception):
    """Raised when input validation fails."""
    def __init__(self, message: str, field: str):
        self.message = message
        self.field = field
        super().__init__(self.message)


def validate_resume_file(file_bytes: bytes, filename: str) -> None:
    """Validate resume file type and size."""
    if not filename:
        raise ValidationError("No filename provided.", field="resume")

    ext = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise ValidationError(
            f"Unsupported file type: '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
            field="resume",
        )

    size_mb = len(file_bytes) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise ValidationError(
            f"File too large ({size_mb:.1f}MB). Maximum: {MAX_FILE_SIZE_MB}MB.",
            field="resume",
        )

    if len(file_bytes) == 0:
        raise ValidationError("File is empty.", field="resume")


def validate_job_description(job_description: str) -> None:
    """Validate job description text."""
    if not job_description or not job_description.strip():
        raise ValidationError("Job description is empty.", field="job_description")

    stripped = job_description.strip()
    if len(stripped) < 50:
        raise ValidationError(
            "Job description is too short. Please paste the full job posting.",
            field="job_description",
        )

    if len(stripped) > MAX_JD_LENGTH:
        raise ValidationError(
            f"Job description is too long ({len(stripped)} chars). Maximum: {MAX_JD_LENGTH} characters.",
            field="job_description",
        )


RESULT_DEFAULTS = {
    "overallScore": 0,
    "experience": {"required": None, "resume": None, "match": False, "applicable": False},
    "education": {"required": None, "resume": None, "match": False, "applicable": False},
    "location": {"required": None, "resume": None, "match": False, "applicable": False},
    "skills": [],
    "responsibilities": [],
    "certifications": [],
    "missingKeywords": [],
    "rewriteSuggestions": [],
    "atsBulletPoints": [],
    "resumeUpdateGuide": {
        "summary": {"current": "Not found", "suggested": ""},
        "skillsToAdd": {"technical": [], "tools": [], "soft": []},
        "atsOptimizedSkills": {"current": "", "suggested": "", "changes": []},
        "experienceUpdates": [],
        "qualifications": [],
        "formatTips": [],
    },
}


def apply_defaults(results: dict) -> dict:
    """Ensure all expected keys exist with defaults."""
    for key, default_val in RESULT_DEFAULTS.items():
        if key not in results:
            results[key] = default_val
    return results


def validate_and_extract(file_bytes: bytes, filename: str, job_description: str) -> str:
    """
    Validate inputs and extract resume text via OCR.
    Returns the full extracted resume text.
    Raises ValidationError if inputs or extracted text are invalid.
    """
    validate_resume_file(file_bytes, filename)
    validate_job_description(job_description)

    resume_text = extract_text_from_resume(file_bytes, filename)

    if not resume_text or not resume_text.strip():
        raise ValidationError(
            "Could not extract text from the resume. The file may contain only images or be corrupted. Please upload a text-based resume (PDF, DOC, DOCX).",
            field="resume",
        )

    if len(resume_text.strip()) < 50:
        raise ValidationError(
            "The uploaded file does not appear to be a valid resume. It contains very little text. Please upload a proper resume document.",
            field="resume",
        )

    return resume_text


def run_validation(file_bytes: bytes, filename: str, job_description: str, computed_experience: str = "") -> dict[str, Any]:
    """
    Full validation pipeline:
    1. Validate inputs
    2. OCR extract resume text (Mistral)
    3. AI analysis against JD (OpenAI GPT)
    4. Return structured results

    Returns:
        dict with keys: overallScore, experience, education, location,
        skills, responsibilities, certifications, missingKeywords,
        rewriteSuggestions, atsBulletPoints, resumeTextPreview
    """
    resume_text = validate_and_extract(file_bytes, filename, job_description)

    # AI-powered analysis (OpenAI GPT)
    results = analyze_with_ai(resume_text, job_description.strip(), computed_experience=computed_experience)

    # Attach metadata
    results["resumeTextPreview"] = (
        resume_text[:500] + "..." if len(resume_text) > 500 else resume_text
    )
    results["resumeFullText"] = resume_text
    results["resumeCharCount"] = len(resume_text)
    results["jdCharCount"] = len(job_description.strip())

    apply_defaults(results)

    return results
