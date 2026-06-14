from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.scam_analyzer import router
from app.routes.url_scanner import router as url_router
from app.routes.qr_scanner import router as qr_router
from app.routes.emergency_copilot import router as emergency_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(url_router)
app.include_router(qr_router)
app.include_router(emergency_router)

@app.get("/")
def home():
    return {
        "message": "Scam Analyzer Backend Running"
    }