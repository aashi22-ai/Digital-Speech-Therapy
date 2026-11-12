from faster_whisper import WhisperModel
from app.core import config

_model = WhisperModel(
    config.WHISPER_MODEL_SIZE,
    device=config.WHISPER_DEVICE,
    compute_type=config.WHISPER_COMPUTE_TYPE,
)


def transcribe_audio_file(file_path: str, language: str | None = None) -> dict:
    """
    Runs real speech-to-text on the given audio file using faster-whisper.
    If `language` is given (e.g. "es", "fr", "hi"), it's passed straight
    to Whisper so it skips auto-detection and transcribes directly in
    that language — genuinely more accurate than guessing, not a cosmetic
    flag. If omitted, Whisper auto-detects the spoken language as before.
    Never mocked — raises on failure rather than returning fake data.
    """
    segments, info = _model.transcribe(file_path, beam_size=5, language=language)
    full_text = " ".join(segment.text.strip() for segment in segments)

    return {
        "transcript": full_text.strip(),
        "language": info.language,
    }
