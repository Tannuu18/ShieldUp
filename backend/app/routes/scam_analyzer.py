from fastapi import APIRouter
from app.services.gemini_service import analyze_message

router = APIRouter()


@router.post("/analyze-message")
def analyze(data: dict):

    message = data["message"]

    result = analyze_message(message)

    return {
        "analysis": result
    }