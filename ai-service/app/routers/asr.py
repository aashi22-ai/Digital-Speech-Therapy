import shutil
import tempfile
import os
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.schemas.asr import TranscribeResponse
from app.services.asr_service import transcribe_audio_file

router = APIRouter()


@router.post("/transcribe", response_model=TranscribeResponse)
async def transcribe(file: UploadFile = File(...), language: str = Form(None)):
    """
    Accepts an audio file and an optional language hint, runs real
    faster-whisper transcription, and returns the transcript.
    """
    suffix = os.path.splitext(file.filename or "")[1] or ".webm"

    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        # Treat "", "auto", or omitted as "let Whisper auto-detect".
        lang_hint = language if language and language.lower() != "auto" else None
        result = transcribe_audio_file(tmp_path, language=lang_hint)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")
    finally:
        os.remove(tmp_path)

    return result
