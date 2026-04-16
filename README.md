# Smart Resume Scanner

AI-powered resume analysis tool that helps users optimize their resumes to pass any ATS (Applicant Tracking System) — from the dumbest keyword scanners to smart AI-based screening.

## Project Structure

```
├── backend/          # FastAPI Python backend
│   ├── database/     # Supabase database modules
│   ├── routes/       # API endpoints (analyze, auth, profile, contact)
│   ├── services/     # AI service, OCR, parsers, experience calculator
│   ├── main.py       # FastAPI app entry point
│   └── requirements.txt
├── frontend/         # React TypeScript frontend
│   ├── public/
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Features

- **Resume-to-JD Matching** — Upload resume + paste job description → get detailed match analysis
- **Experience Calculator** — Programmatically computes total work experience from resume dates
- **ATS-Optimized Skills** — Generates a copy-paste ready flat skills section that passes any ATS
- **Education Matching** — Semantic matching for related fields + ATS coaching for degree formatting
- **Missing Keywords** — Flags missing keywords with copy-paste examples for each section
- **Rewrite Suggestions** — Improves weak bullet points with JD keywords and metrics
- **Summary Generator** — Creates a tailored professional summary with explicit experience duration

## Tech Stack

- **Backend**: Python, FastAPI, OpenAI GPT-4o-mini, Mistral OCR
- **Frontend**: React, TypeScript
- **Database**: Supabase (PostgreSQL + Auth + Storage)

## Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Create .env with OPENAI_API_KEY, MISTRAL_API_KEY, SUPABASE_URL, SUPABASE_KEY, SUPABASE_SERVICE_ROLE_KEY
python main.py
```

### Frontend
```bash
cd frontend
npm install
npm start
```
