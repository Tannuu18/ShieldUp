from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.scam_analyzer import router as scam_router
from app.routes.screenshot_detector import router as screenshot_router
from app.routes.url_scanner import router as url_router
from app.routes.qr_scanner import router as qr_router
from app.routes.emergency_copilot import router as emergency_router

app = FastAPI()

# CORS middleware (keep yours)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# routers
app.include_router(scam_router)
app.include_router(screenshot_router)
app.include_router(url_router)
app.include_router(qr_router)
app.include_router(emergency_router)


@app.get("/")
def home():
    return {
        "message": "Scam Analyzer Backend Running"
    }