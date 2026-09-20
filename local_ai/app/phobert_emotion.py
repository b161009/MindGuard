"""Local PhoBERT emotion inference.

This module deliberately classifies emotion only. Safety signals and the
human-support pathway remain rule-based until they have a separately reviewed
and evaluated dataset.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer

from .preprocess import preprocess_text

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models" / "mindguard-emotion-v0"
LABELS = ["tích_cực", "trung_tính", "buồn", "lo_lắng_căng_thẳng", "tức_giận"]
DISPLAY_LABELS = {
    "tích_cực": "tích cực",
    "trung_tính": "trung tính",
    "buồn": "buồn",
    "lo_lắng_căng_thẳng": "căng thẳng",
    "tức_giận": "tức giận",
}
THRESHOLD = 0.5

_tokenizer = None
_model = None


def model_is_available() -> bool:
    return (MODEL_DIR / "config.json").exists()


def _load_model() -> None:
    global _model, _tokenizer
    if _model is not None or not model_is_available():
        return
    _tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR, local_files_only=True)
    _model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR, local_files_only=True)
    _model.eval()


def predict_emotion(text: str) -> dict[str, Any] | None:
    """Return a transparent local prediction or None when no checkpoint exists."""
    if not text or not text.strip():
        return None
    _load_model()
    if _model is None or _tokenizer is None:
        return None

    prepared = preprocess_text(text)
    encoded = _tokenizer(prepared, return_tensors="pt", truncation=True, max_length=128)
    with torch.no_grad():
        probabilities = torch.sigmoid(_model(**encoded).logits)[0].tolist()

    ranked = sorted(zip(LABELS, probabilities), key=lambda item: item[1], reverse=True)
    selected = [label for label, probability in ranked if probability >= THRESHOLD]
    primary = selected[0] if selected else ranked[0][0]
    return {
        "emotion": DISPLAY_LABELS[primary],
        "labels": [DISPLAY_LABELS[label] for label in selected],
        "confidence": round(float(dict(ranked)[primary]), 4),
        "modelVersion": "mindguard-emotion-v0",
    }
