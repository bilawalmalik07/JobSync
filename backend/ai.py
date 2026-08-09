import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

from schemas import MatchResult

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is missing! Check your .env file.")

client = genai.Client(api_key=GEMINI_API_KEY)


async def analyze_match(resume_detail: str, description: str) -> MatchResult:
    prompt = f"""
You are a technical recruiter. Compare the following resume against the job description.

Resume:
{resume_detail}

Job Description:
{description}

Score the match from 0 to 100 based on overlap in technical skills, tools, and qualifications only — ignore soft skills and tone.

Identify any specific technical skills, tools, or qualifications mentioned in the job description that are missing from the resume.
"""

    response = await client.aio.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=MatchResult,
        ),
    )

    return response.parsed