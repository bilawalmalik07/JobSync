import json
import os
import uuid

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from resume_parser import extract_text_from_file
from schemas import BatchJobInput, BatchJobResponse, JobDescriptionInput
from security import verify_api_key
from worker import process_batch

load_dotenv()

app = FastAPI(title="JobSync AI")

raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
allowed_origins = [o.strip() for o in raw_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"status": "ok"}


@app.post("/analyze", response_model=BatchJobResponse)
async def analyze(
    resume: UploadFile = File(...),
    jobs: str = Form(...),
    _: None = Depends(verify_api_key),
):
    resume_detail = await extract_text_from_file(resume)

    try:
        jobs_data = json.loads(jobs)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid jobs JSON")

    job_list = [JobDescriptionInput(**j) for j in jobs_data]
    batch = BatchJobInput(resume_detail=resume_detail, jobs=job_list)

    batch_id = str(uuid.uuid4())
    results = await process_batch(batch, batch_id)
    return BatchJobResponse(
        batch_id=batch_id,
        result=results,
        total_jobs=len(results),
    )