# JobSync AI

**Batch Job Market & Resume Keyword Analyzer**

JobSync AI is a fast, AI-powered web dashboard that lets job seekers test one resume against dozens of job descriptions at once — instead of copy-pasting them one by one.

🔗 Live: _not deployed yet_
🎥 Demo: _coming soon_

## Overview

Job seekers waste hours manually comparing their resume against job postings, one at a time. JobSync AI flips that: upload a resume once, paste in up to 50 job descriptions, and get back a ranked list of match scores with the exact skills missing from each role — all processed concurrently in seconds.

Built for speed. Structured, cached, and accurate.

## Features

- 📎 **Multi-Format Resume Upload** — Accepts PDF, DOCX, TXT, JPG, and PNG (OCR-powered text extraction for scanned/photographed resumes)
- ⚡ **Concurrent Batch Processing** — Analyzes up to 50 job descriptions simultaneously using async Python, not one at a time
- 🎯 **AI Match Scoring** — Google Gemini scores technical skill overlap (0–100) between resume and job description
- 🧩 **Skill Gap Detection** — Highlights the specific tools, technologies, and qualifications missing from the resume for each role
- 🚀 **Instant Re-Checks** — Content-hash caching layer returns previously scored resume/job pairs in milliseconds, skipping redundant AI calls
- 🔒 **API Key Protected** — Backend routes gated behind a custom API key, separate from third-party service keys
- 🎨 **Clean, Responsive UI** — Drag-and-drop resume upload with a light, professional interface

## Functionality

- **Resume Parsing** — Extracts plain text from uploaded resumes regardless of format, including OCR for image-based resumes
- **Batch Job Input** — Paste multiple job descriptions in one box, separated by a simple delimiter, no manual entry per job
- **Ranked Results** — Jobs are sorted best-match to worst-match with a visual score ring and a missing-skills panel per result
- **Caching Layer** — Every resume/job pair is hashed and cached in Postgres so repeat comparisons skip the AI call entirely

## Tech Stack

| Layer      | Tools                                                        |
| ---------- | ------------------------------------------------------------- |
| Frontend   | React, Vite, custom CSS                                       |
| Backend    | FastAPI, PostgreSQL (Neon), SQLAlchemy (async)                 |
| AI         | Google Gemini 2.5 Flash (structured output)                    |
| Resume OCR | pytesseract, Pillow, pdfplumber, python-docx                   |
| Auth       | Custom API key middleware                                      |
| Hosting    | _not deployed yet_                                             |

## Project Background

JobSync AI was built as a personal portfolio project to demonstrate async backend architecture, AI-powered structured data extraction, and full-stack integration — from database schema design through a working production-style UI.

## Local Development

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

Create a `.env` file in `/backend` with:

```
DATABASE_URL=
GEMINI_API_KEY=
APP_API_KEY=
ALLOWED_ORIGINS=http://localhost:5173
```

Create a `.env` file in `/frontend` with:

```
VITE_API_URL=http://127.0.0.1:8000
VITE_API_KEY=
```

Note: image-based resume uploads (JPG/PNG) require the Tesseract OCR engine installed separately (e.g. `brew install tesseract` on macOS) in addition to the Python packages in `requirements.txt`.
