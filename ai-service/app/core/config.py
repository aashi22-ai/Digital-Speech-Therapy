import os
from pathlib import Path

from dotenv import load_dotenv

# Search for .env in ai-service, project root, and backend
base_dir = Path(__file__).resolve().parent
for p in [base_dir.parents[1] / ".env", base_dir.parents[2] / ".env", base_dir.parents[2] / "backend" / ".env"]:
    if p.exists():
        load_dotenv(p, override=False)

PORT = int(os.getenv("PORT", 8000))
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
WHISPER_MODEL_SIZE = os.getenv("WHISPER_MODEL_SIZE", "base")
WHISPER_DEVICE = os.getenv("WHISPER_DEVICE", "cpu")
WHISPER_COMPUTE_TYPE = os.getenv("WHISPER_COMPUTE_TYPE", "int8")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
