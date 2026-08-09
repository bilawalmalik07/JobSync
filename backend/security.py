from fastapi import Header, HTTPException
from dotenv import load_dotenv
import os

load_dotenv()
APP_API_KEY = os.getenv("APP_API_KEY")

if not APP_API_KEY:
    raise ValueError("APP_API_KEY is missing! Check your .env file.")


async def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != APP_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API Key")