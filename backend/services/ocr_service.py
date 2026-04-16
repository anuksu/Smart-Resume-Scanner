import os
import io
import base64
from mistralai.client import Mistral
from mistralai.client.models.ocrrequest import DocumentURLChunk

_client = None


def _get_client() -> Mistral:
    global _client
    if _client is None:
        _client = Mistral(api_key=os.getenv("MISTRAL_API_KEY"))
    return _client


def _extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract text from a DOCX/DOC file using python-docx."""
    from docx import Document
    doc = Document(io.BytesIO(file_bytes))
    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
    return "\n".join(paragraphs)


def extract_text_from_resume(file_bytes: bytes, filename: str) -> str:
    """
    Extract text from a resume file.
    - PDF: uses Mistral OCR
    - DOCX/DOC: uses python-docx
    Only PDF, DOC, and DOCX are supported.
    """
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    # DOCX/DOC → python-docx
    if ext in ("docx", "doc"):
        return _extract_text_from_docx(file_bytes)

    # PDF → Mistral OCR
    b64_data = base64.standard_b64encode(file_bytes).decode("utf-8")
    data_url = f"data:application/pdf;base64,{b64_data}"
    document = DocumentURLChunk(document_url=data_url)

    ocr_response = _get_client().ocr.process(
        model="mistral-ocr-latest",
        document=document,
    )

    full_text = ""
    for page in ocr_response.pages:
        full_text += page.markdown + "\n"

    return full_text.strip()
