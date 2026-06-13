from fastapi import APIRouter
from app.services.url_scanner_service import analyze_url

router = APIRouter()

@router.post("/scan-url")
def scan_url(data: dict):

    url = data["url"]

    result = analyze_url(url)

    return {
        "analysis": result
    }