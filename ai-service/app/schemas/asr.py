from pydantic import BaseModel


class TranscribeResponse(BaseModel):
    transcript: str
    language: str
