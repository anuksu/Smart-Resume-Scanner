# Resume Scanner API - Backend

Python FastAPI backend for the Smart Resume Scanner. Uses Mistral OCR to extract text from resumes and matches them against job descriptions.

## Setup

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run server
python main.py
```

Server runs at `http://localhost:8000`

## API Endpoints

### `POST /api/analyze`
Upload a resume + job description, get full match analysis.
- **resume** (file): PDF or image file
- **job_description** (form field): Job description text

### `POST /api/extract-text`
Extract text from a resume using Mistral OCR.
- **resume** (file): PDF or image file

### `GET /`
Health check.

## Environment Variables
Create a `.env` file:
```
MISTRAL_API_KEY=your_key_here
PORT=8000
```
