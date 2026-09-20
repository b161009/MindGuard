"""Explainable Vietnamese rule baseline, replaceable by a trained local model."""

from __future__ import annotations

from typing import Any

SIGNALS = [
    ("urgent-safety", "Nội dung có thể cho thấy bạn đang không an toàn", 40, True,
     ["tự tử", "tu tu", "muốn chết", "không muốn sống", "kết thúc tất cả", "làm hại bản thân", "tự làm đau mình"]),
    ("hopelessness", "Cảm giác tuyệt vọng hoặc bế tắc", 10, False,
     ["tuyệt vọng", "bế tắc", "vô vọng", "không lối thoát", "vô dụng"]),
    ("overload", "Căng thẳng hoặc quá tải", 7, False,
     ["quá tải", "kiệt sức", "căng thẳng", "áp lực", "mệt mỏi", "không chịu nổi"]),
    ("isolation", "Cảm giác cô đơn hoặc muốn tách mình ra", 7, False,
     ["cô đơn", "một mình", "không ai hiểu", "không muốn gặp ai", "tránh mọi người"]),
    ("low-mood", "Tâm trạng buồn hoặc chùng xuống", 5, False,
     ["buồn", "trống rỗng", "chán nản", "khóc", "thất vọng"]),
]

EMOTIONS = {
    "căng thẳng": ["căng thẳng", "áp lực", "lo lắng", "quá tải"],
    "buồn": ["buồn", "trống rỗng", "chán nản", "khóc"],
    "mệt mỏi": ["mệt", "kiệt sức", "uể oải", "không còn năng lượng"],
    "tích cực": ["vui", "ổn", "nhẹ nhõm", "biết ơn", "hạnh phúc"],
}


def analyze_text(text: str) -> dict[str, Any]:
    normalized = " ".join(text.lower().split())
    if not normalized:
        return {
            "emotion": "chưa xác định", "detectedSignals": [], "signalScore": 0,
            "needsHumanFollowUp": False, "summary": "Bạn chưa chia sẻ thêm nội dung hôm nay.",
        }

    matches = []
    for signal_id, label, weight, urgent, patterns in SIGNALS:
        if any(pattern in normalized for pattern in patterns):
            matches.append({"id": signal_id, "label": label, "weight": weight, "urgent": urgent})
    emotion, count = max(((label, sum(word in normalized for word in words)) for label, words in EMOTIONS.items()), key=lambda item: item[1])
    return {
        "emotion": emotion if count else "trung tính",
        "detectedSignals": [{"id": item["id"], "label": item["label"]} for item in matches],
        "signalScore": sum(item["weight"] for item in matches),
        "needsHumanFollowUp": any(item["urgent"] for item in matches),
        "summary": "Hệ thống nhận thấy một vài cụm từ đáng lưu tâm trong phần chia sẻ." if matches else "Phần chia sẻ của bạn đã được ghi nhận để theo dõi cùng các check-in sau.",
    }


def calculate_assessment(answers: dict[str, float], text_analysis: dict[str, Any]) -> dict[str, Any]:
    value = lambda key: float(answers.get(key, 5 if key == "interest" else 0))
    factors = [
        ("stress", "mức căng thẳng cao", max(0, value("stress") - 3) * 3.2, value("stress") >= 7),
        ("mood", "tâm trạng thấp", max(0, 6 - value("mood")) * 3.2, value("mood") <= 3),
        ("comfort", "mức dễ chịu thấp", max(0, 6 - value("comfort")) * 2, value("comfort") <= 3),
        ("sleep", "giấc ngủ chưa phục hồi", max(0, 6 - value("sleep")) * 2.5, value("sleep") <= 3),
        ("energy", "năng lượng thấp", max(0, 6 - value("energy")) * 2.5, value("energy") <= 3),
        ("interest", "mức hứng thú với hoạt động hằng ngày thấp", max(0, 6 - value("interest")) * 2, value("interest") <= 3),
        ("social", "ít mong muốn kết nối", max(0, 4 - value("social")), value("social") <= 2),
    ]
    quantitative = sum(item[2] for item in factors)
    text_score = min(22, float(text_analysis["signalScore"]))
    urgent = bool(text_analysis["needsHumanFollowUp"])
    score = 100 if urgent else round(max(0, min(100, quantitative + text_score)))
    level = "Nên tìm hỗ trợ" if urgent or score >= 60 else "Cần chú ý" if score >= 25 else "Bình thường"
    reasons = [label for _, label, _, active in factors if active]
    reasons.extend(signal["label"] for signal in text_analysis["detectedSignals"])
    return {
        "score": score, "level": level, "needsHumanFollowUp": urgent, "reasons": reasons[:4],
        "breakdown": {"quantitativeScore": round(quantitative, 1), "textScore": text_score},
    }
