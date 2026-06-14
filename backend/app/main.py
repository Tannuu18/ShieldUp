from fastapi import FastAPI
from app.routes.scam_analyzer import router
from app.routes.screenshot_detector import router

app = FastAPI()

app.include_router(router)


@app.get("/")
def home():

    return {
        "message": "Scam Analyzer Backend Running"
    }