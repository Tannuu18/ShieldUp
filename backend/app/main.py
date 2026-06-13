from fastapi import FastAPI
from app.routes.scam_analyzer import router

app = FastAPI()

app.include_router(router)

@app.get("/")
def home():
    return {"message": "Backend is running"}