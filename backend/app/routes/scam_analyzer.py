"""Route for scam analysis endpoints."""

from fastapi import APIRouter
from app.services.gemini_service import analyze_message

router = APIRouter()


@router.post("/analyze-message")
def analyze(data: dict):
    """Analyze a message payload and return the analysis.

    Expected payload: {"message": "..."}
    """

    message = data.get("message")
    if message is None:
        return {"error": "message field is required"}

    result = analyze_message(message)

    return {"analysis": result}