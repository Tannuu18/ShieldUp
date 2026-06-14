from fastapi import APIRouter
from app.services.qr_scanner_service import analyze_qr

router = APIRouter()

@router.post("/scan-qr")
def scan_qr(data: dict):
    # Receive the decoded destination URL from the QR scanner frontend
    url = data["url"]

    result = analyze_qr(url)

    return {
        "analysis": result
    }