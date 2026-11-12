from pydantic import BaseModel, Field
from typing import List


class AnalyzeRequest(BaseModel):
    transcript: str = Field(..., description="What the ASR heard the user say")
    target_text: str = Field(..., description="What the exercise asked the user to say")
    language: str = Field(default="en", description="ISO language code of the exercise")


class WordDiffItem(BaseModel):
    word: str
    status: str  # "correct" | "different" | "missing"


class AnalyzeResponse(BaseModel):
    pronunciation_score: float = Field(..., ge=0, le=100)
    fluency_score: float = Field(..., ge=0, le=100)
    feedback: str
    word_diff: List[WordDiffItem] = []
    extra_words: List[str] = []
