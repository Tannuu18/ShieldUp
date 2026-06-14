from fastapi import APIRouter
from app.services.emergency_copilot_service import get_emergency_guidance

router = APIRouter()

@router.post("/emergency-copilot")
def emergency_copilot(data: dict):
    # Receive the user's panicked message
    message = data["message"]

    result = get_emergency_guidance(message)

    return {
        "analysis": result
    }
