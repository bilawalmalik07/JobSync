from io import BytesIO

import pdfplumber
import pytesseract
from docx import Document
from fastapi import UploadFile, HTTPException
from PIL import Image


async def extract_text_from_file(file: UploadFile) -> str:
    filename = (file.filename or "").lower()
    content = await file.read()

    if filename.endswith(".pdf"):
        text = ""
        with pdfplumber.open(BytesIO(content)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        text = text.strip()
        if not text:
            raise HTTPException(
                status_code=400, detail="Could not extract text from this PDF.")
        return text

    elif filename.endswith(".docx"):
        doc = Document(BytesIO(content))
        text = "\n".join(p.text for p in doc.paragraphs).strip()
        if not text:
            raise HTTPException(
                status_code=400, detail="Could not extract text from this DOCX.")
        return text

    elif filename.endswith((".jpg", ".jpeg", ".png")):
        image = Image.open(BytesIO(content))
        text = pytesseract.image_to_string(image).strip()
        if not text:
            raise HTTPException(
                status_code=400,
                detail="Could not read any text from this image. Try a clearer photo or scan.",
            )
        return text

    elif filename.endswith(".txt"):
        return content.decode("utf-8").strip()

    else:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Please upload a PDF, DOCX, TXT, JPG, or PNG file.",
        )
