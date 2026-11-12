from fastapi import APIRouter, HTTPException
from app.schemas.feedback import AnalyzeRequest, AnalyzeResponse
from app.services.llm_service import GeminiConfigurationError, generate_feedback
from app.services.word_diff_service import compute_word_diff

router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(payload: AnalyzeRequest):
    """
    Combines two independent, real computations:
    1. A deterministic word-level diff (pure code, always accurate to
       what was actually transcribed).
    2. Real Gemini API scoring + feedback, grounded in that diff.
    """
    try:
        diff_result = compute_word_diff(payload.target_text, payload.transcript)

        diff_summary = ", ".join(
            f'{item["word"]}={item["status"]}' for item in diff_result["word_diff"]
        )
        if diff_result["extra_words"]:
            diff_summary += f'. Extra words said: {", ".join(diff_result["extra_words"])}'

        llm_result = generate_feedback(
            payload.transcript, payload.target_text, payload.language, diff_summary
        )
    except GeminiConfigurationError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Feedback generation failed: {str(e)}")

    return {
        **llm_result,
        "word_diff": diff_result["word_diff"],
        "extra_words": diff_result["extra_words"],
    }
