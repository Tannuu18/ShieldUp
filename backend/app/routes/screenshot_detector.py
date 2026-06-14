from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
import os

from app.services.screenshot_detector_service import analyze_screenshot

router = APIRouter()

UPLOAD_FOLDER = "uploads"

@router.post("/detect-phishing")

async def detect_phishing(
    file: UploadFile = File(...)
):

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        buffer.write(
            await file.read()
        )

    result = analyze_screenshot(
        file_path
    )

    return {
        "analysis": result
    }