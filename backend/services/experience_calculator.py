"""
experience_calculator.py - Compute total work experience from parsed job entries.
Takes job_experience list from resume_parser and calculates total duration.
"""

from datetime import datetime
from dateutil.relativedelta import relativedelta
from typing import List, Optional


# Common month formats the parser might return
MONTH_FORMATS = ["%B %Y", "%b %Y", "%m/%Y", "%Y-%m", "%B, %Y", "%b, %Y"]


def _parse_date(date_str: str) -> Optional[datetime]:
    """Parse a date string like 'May 2025', 'Jan 2023', '2024', '01/2023', etc."""
    if not date_str:
        return None

    cleaned = date_str.strip()

    # Handle "Present" / "Current" → use today's date
    if cleaned.lower() in ("present", "current", "now", "ongoing"):
        return datetime.now()

    # Try various month+year formats
    for fmt in MONTH_FORMATS:
        try:
            return datetime.strptime(cleaned, fmt)
        except ValueError:
            continue

    # Try year-only (e.g. "2024")
    try:
        return datetime(int(cleaned), 1, 1)
    except (ValueError, TypeError):
        pass

    return None


def _compute_duration(start: datetime, end: datetime) -> relativedelta:
    """Compute the duration between two dates."""
    if end < start:
        start, end = end, start
    return relativedelta(end, start)


def calculate_total_experience(job_experience: List[dict]) -> str:
    """
    Calculate total work experience from a list of job entries.
    Each entry should have 'start_date' and 'end_date' strings.

    Returns a human-readable string like '1 year 3 months', '6 months', '3+ years'.
    Returns 'Not specified' if no valid dates found.
    """
    if not job_experience:
        return "Not specified"

    total_months = 0
    valid_entries = 0

    for job in job_experience:
        start_str = job.get("start_date", "")
        end_str = job.get("end_date", "") or "Present"

        start = _parse_date(start_str)
        end = _parse_date(end_str)

        if start and end:
            delta = _compute_duration(start, end)
            months = delta.years * 12 + delta.months
            # Count at least 1 month for very recent entries
            if months == 0 and delta.days > 0:
                months = 1
            total_months += months
            valid_entries += 1

    if valid_entries == 0:
        return "Not specified"

    years = total_months // 12
    months = total_months % 12

    if years == 0 and months == 0:
        return "Less than 1 month"
    elif years == 0:
        return f"{months} month{'s' if months != 1 else ''}"
    elif months == 0:
        return f"{years} year{'s' if years != 1 else ''}"
    else:
        return f"{years} year{'s' if years != 1 else ''} {months} month{'s' if months != 1 else ''}"
