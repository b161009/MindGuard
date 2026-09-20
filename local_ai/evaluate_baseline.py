"""Evaluate the explainable baseline against a labeled JSONL test set.

Usage:
  .venv\Scripts\python evaluate_baseline.py ..\research\annotation_template.jsonl
"""

from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path

from app.baseline import analyze_text, calculate_assessment

EMOTION_MAP = {
    "tích cực": "tích_cực",
    "trung tính": "trung_tính",
    "chưa xác định": "trung_tính",
    "buồn": "buồn",
    "căng thẳng": "lo_lắng_căng_thẳng",
    "mệt mỏi": "mệt_mỏi",
}
SIGNAL_MAP = {
    "urgent-safety": "an_toàn_khẩn_cấp",
    "hopelessness": "tuyệt_vọng",
    "overload": "quá_tải",
    "isolation": "cô_lập",
}


def safe_divide(top: int, bottom: int) -> float:
    return round(top / bottom, 4) if bottom else 0.0


def multilabel_metrics(rows: list[dict], labels: list[str], field: str) -> dict:
    per_label, all_tp, all_fp, all_fn = {}, 0, 0, 0
    for label in labels:
        tp = fp = fn = 0
        for row in rows:
            actual, predicted = set(row[f"actual_{field}"]), set(row[f"predicted_{field}"])
            tp += label in actual and label in predicted
            fp += label not in actual and label in predicted
            fn += label in actual and label not in predicted
        precision, recall = safe_divide(tp, tp + fp), safe_divide(tp, tp + fn)
        f1 = safe_divide(2 * precision * recall, precision + recall)
        per_label[label] = {"precision": precision, "recall": recall, "f1": f1, "support": sum(label in set(row[f"actual_{field}"]) for row in rows)}
        all_tp, all_fp, all_fn = all_tp + tp, all_fp + fp, all_fn + fn
    micro_precision, micro_recall = safe_divide(all_tp, all_tp + all_fp), safe_divide(all_tp, all_tp + all_fn)
    return {
        "micro": {"precision": micro_precision, "recall": micro_recall, "f1": safe_divide(2 * micro_precision * micro_recall, micro_precision + micro_recall)},
        "macroF1": round(sum(item["f1"] for item in per_label.values()) / len(labels), 4) if labels else 0,
        "perLabel": per_label,
    }


def risk_metrics(rows: list[dict]) -> dict:
    labels = ["Bình thường", "Cần chú ý", "Nên tìm hỗ trợ"]
    matrix = {actual: {predicted: 0 for predicted in labels} for actual in labels}
    correct = 0
    for row in rows:
        actual, predicted = row["actual_risk"], row["predicted_risk"]
        matrix[actual][predicted] += 1
        correct += actual == predicted
    per_label = {}
    for label in labels:
        tp = matrix[label][label]
        fp = sum(matrix[actual][label] for actual in labels if actual != label)
        fn = sum(matrix[label][predicted] for predicted in labels if predicted != label)
        precision, recall = safe_divide(tp, tp + fp), safe_divide(tp, tp + fn)
        per_label[label] = {"precision": precision, "recall": recall, "f1": safe_divide(2 * precision * recall, precision + recall)}
    return {
        "accuracy": safe_divide(correct, len(rows)),
        "macroF1": round(sum(metric["f1"] for metric in per_label.values()) / len(labels), 4),
        "perLabel": per_label,
        "confusionMatrix": matrix,
    }


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("Dùng: python evaluate_baseline.py <test.jsonl>")
    rows = []
    for line in Path(sys.argv[1]).read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        item = json.loads(line)
        text_analysis = analyze_text(item["text"])
        assessment = calculate_assessment(item.get("quantitative", {}), text_analysis)
        predicted_signals = {SIGNAL_MAP[signal["id"]] for signal in text_analysis["detectedSignals"] if signal["id"] in SIGNAL_MAP}
        rows.append({
            "actual_emotion": item["emotion"],
            "predicted_emotion": [EMOTION_MAP[text_analysis["emotion"]]],
            "actual_signals": item["signals"],
            "predicted_signals": list(predicted_signals or {"none"}),
            "actual_risk": item["riskLevel"],
            "predicted_risk": assessment["level"],
        })

    report = {
        "samples": len(rows),
        "emotion": multilabel_metrics(rows, ["tích_cực", "trung_tính", "buồn", "lo_lắng_căng_thẳng", "mệt_mỏi", "tức_giận"], "emotion"),
        "signals": multilabel_metrics(rows, ["none", "quá_tải", "cô_lập", "tuyệt_vọng", "an_toàn_khẩn_cấp"], "signals"),
        "riskLevel": risk_metrics(rows),
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
