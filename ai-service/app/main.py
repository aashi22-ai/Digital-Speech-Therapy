from fastapi import FastAPI
from app.routers import asr, feedback

app = FastAPI(title="Speech Therapy AI Service")

app.include_router(asr.router, prefix="/ai", tags=["asr"])
app.include_router(feedback.router, prefix="/ai", tags=["feedback"])


@app.get("/ai/health")
def health():
    return {"status": "ok", "service": "ai-service"}
