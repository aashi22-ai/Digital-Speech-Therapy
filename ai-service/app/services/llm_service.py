import json
import re
import logging
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeoutError
from google import genai
from google.genai import types
from app.core import config

logger = logging.getLogger(__name__)

class GeminiConfigurationError(Exception):
    pass

SYSTEM_PROMPT = """You are an encouraging, expert speech therapy assistant for short daily practice drills.
You compare what a user said (transcript) against what they were asked to say (target text), and provide constructive, motivating feedback in English.

You are given a deterministic word-by-word comparison showing exactly which target words were correct, different, or missing, plus any extra words.

IMPORTANT RULES:
- If the user said nothing, transcript is empty, or no words matched, award pronunciation_score: 0 and fluency_score: 0.
- These are brief pronunciation exercises designed to take 3 to 10 seconds.
- NEVER ask the user to speak longer or record for 30, 40, or 60 seconds.
- Give accurate pronunciation and fluency scores (0-100) reflecting how well the spoken words matched the target text.
- If all target words were said clearly and accurately, award 90-100.
- Reference specific words that were said well, and gently highlight any words that need practice.

Respond with ONLY a JSON object in this exact format:
{
  "pronunciation_score": <number 0-100>,
  "fluency_score": <number 0-100>,
  "feedback": "<2-3 encouraging sentences referencing specific words>"
}
"""


def _generate_fallback_feedback(transcript: str, target_text: str, diff_summary: str) -> dict:
    """
    Computes an honest, deterministic speech score based on the real word-diff
    when the Gemini API is unreachable or times out, ensuring the user is never
    blocked by an error.
    """
    target_words = [w.strip(".,!?;:\"'()").lower() for w in target_text.split() if w.strip()]
    said_words = [w.strip(".,!?;:\"'()").lower() for w in transcript.split() if w.strip()]

    # If user did not speak anything or transcript is empty:
    if not said_words or not transcript.strip():
        return {
            "pronunciation_score": 0,
            "fluency_score": 0,
            "feedback": "No speech detected. Please check that your microphone is unmuted, tap Retry, and speak clearly.",
        }

    total_target = max(1, len(target_words))

    correct_words = []
    diff_words = []

    for item in diff_summary.split(","):
        parts = item.strip().split("=")
        if len(parts) == 2:
            w, status = parts[0].strip(), parts[1].strip()
            if "correct" in status:
                correct_words.append(w)
            elif "different" in status or "missing" in status:
                diff_words.append(w)

    correct_count = len(correct_words)
    diff_count = len(diff_words)

    if correct_count == 0 and said_words:
        for tw in target_words:
            if tw in said_words:
                correct_count += 1
            else:
                diff_count += 1

    if correct_count == 0:
        return {
            "pronunciation_score": 0,
            "fluency_score": 0,
            "feedback": "We couldn't match any spoken words with the target phrase. Tap Listen to hear the pronunciation, then tap Retry.",
        }

    p_ratio = correct_count / total_target
    p_score = max(0, min(100, round(p_ratio * 100)))

    extra_count = max(0, len(said_words) - total_target)
    f_penalty = (extra_count * 4) + (diff_count * 5)
    f_score = max(10, min(100, 100 - f_penalty))

    if p_score >= 88:
        feedback = (
            f"Outstanding pronunciation! Your delivery was clear, and you articulated "
            f"'{target_text[:35]}...' with natural rhythm."
        )
    elif p_score >= 65:
        needs_work = ", ".join(diff_words[:2]) if diff_words else "a few consonants"
        feedback = (
            f"Great effort! You pronounced most words well. Practice pacing and give special "
            f"attention to {needs_work}."
        )
    else:
        feedback = (
            "Good start! Try listening to the slow turtle pronunciation first, then speak each word "
            "with a steady, relaxed breath."
        )

    return {
        "pronunciation_score": p_score,
        "fluency_score": f_score,
        "feedback": feedback,
    }


def _call_gemini_api(transcript: str, target_text: str, language: str, diff_summary: str) -> dict:
    user_message = (
        f"Language: {language}\n"
        f'Target text: "{target_text}"\n'
        f'What user said (transcript): "{transcript}"\n'
        f"Word-by-word comparison: {diff_summary}"
    )

    client = genai.Client(api_key=config.GEMINI_API_KEY)
    response = client.models.generate_content(
        model=config.GEMINI_MODEL,
        contents=user_message,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            response_mime_type="application/json",
            max_output_tokens=1024,
        ),
    )

    raw_text = (response.text or "").strip()
    cleaned = re.sub(r"^```(?:json)?|```$", "", raw_text, flags=re.MULTILINE).strip()
    parsed = json.loads(cleaned)

    pronunciation_score = float(parsed["pronunciation_score"])
    fluency_score = float(parsed["fluency_score"])
    feedback = parsed["feedback"]

    if not (0 <= pronunciation_score <= 100 and 0 <= fluency_score <= 100 and feedback.strip()):
        raise ValueError("Values out of range")

    return {
        "pronunciation_score": pronunciation_score,
        "fluency_score": fluency_score,
        "feedback": feedback,
    }


_executor = ThreadPoolExecutor(max_workers=4)


def generate_feedback(transcript: str, target_text: str, language: str, diff_summary: str) -> dict:
    """
    Calls Gemini API with a strict 3.5-second timeout, falling back immediately
    to deterministic word-diff scoring so attempts NEVER fail or throw 500 errors.
    """
    # If the user did not say anything, return 0% pronunciation and fluency immediately:
    if not transcript or not transcript.strip():
        return {
            "pronunciation_score": 0,
            "fluency_score": 0,
            "feedback": "No speech detected. Please check that your microphone is unmuted, tap Retry, and speak clearly.",
        }

    if not config.GEMINI_API_KEY:
        return _generate_fallback_feedback(transcript, target_text, diff_summary)

    future = _executor.submit(_call_gemini_api, transcript, target_text, language, diff_summary)
    try:
        return future.result(timeout=3.5)
    except Exception as e:
        logger.warning("Gemini API call timed out or failed (%s); using deterministic scoring.", e)
        return _generate_fallback_feedback(transcript, target_text, diff_summary)
