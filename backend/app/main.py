from fastapi import FastAPI
from app.routes.scam_analyzer import router
from app.routes.url_scanner import router as url_router

app = FastAPI()

app.include_router(router)
app.include_router(url_router)


@app.get("/")
def home():

    return {
        "message": "Scam Analyzer Backend Running"
    }