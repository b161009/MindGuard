from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .baseline import analyze_text, calculate_assessment
from .phobert_emotion import model_is_available, predict_emotion

app = FastAPI(title="Mind Guard Local AI", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class Answers(BaseModel):
    mood: float = Field(ge=0, le=10)
    comfort: float = Field(ge=0, le=10)
    stress: float = Field(ge=0, le=10)
    sleep: float = Field(ge=0, le=10)
    energy: float = Field(ge=0, le=10)
    interest: float = Field(ge=0, le=10)
    social: float = Field(ge=0, le=10)


class AnalyzeRequest(BaseModel):
    text: str = Field(default="", max_length=4000)
    answers: Answers


@app.get("/health")
def health():
    return {
        "status": "ok",
        "modelVersion": "mindguard-emotion-v0" if model_is_available() else "vi-rule-baseline-v1",
        "localOnly": True,
    }


@app.post("/analyze")
def analyze(payload: AnalyzeRequest):
    text_analysis = analyze_text(payload.text)
    try:
        prediction = predict_emotion(payload.text)
    except Exception:
        # A missing Java setup or model file must never prevent a check-in.
        prediction = None
    if prediction:
        text_analysis["emotion"] = prediction["emotion"]
        text_analysis["emotionModel"] = prediction
    assessment = calculate_assessment(payload.answers.model_dump(), text_analysis)
    return {
        "textAnalysis": text_analysis,
        "assessment": assessment,
        "source": "local-phobert-emotion-v0" if prediction else "local-rule-baseline-v1",
        "disclaimer": "Kết quả hỗ trợ theo dõi, không phải chẩn đoán.",
    }
