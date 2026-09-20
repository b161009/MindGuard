import json
from collections import Counter
from pathlib import Path

from app.preprocess import preprocess_text


PROJECT_ROOT = Path(__file__).resolve().parent.parent

INPUT_DIR = (
    PROJECT_ROOT
    / "research"
    / "dataset"
    / "annotated"
)

OUTPUT_DIR = (
    PROJECT_ROOT
    / "research"
    / "dataset"
    / "splits"
    / "emotion_v0"
)

LABELS = [
    "tích_cực",
    "trung_tính",
    "buồn",
    "lo_lắng_căng_thẳng",
    "tức_giận",
]

LABEL_TO_ID = {
    label: index
    for index, label in enumerate(LABELS)
}

FILES = {
    "train": "vigo_train.jsonl",
    "validation": "vigo_validation.jsonl",
    "test": "vigo_test.jsonl",
}


def load_jsonl(path):
    records = []

    with path.open("r", encoding="utf-8") as f:
        for line_number, line in enumerate(f, 1):
            line = line.strip()

            if not line:
                continue

            try:
                records.append(json.loads(line))
            except json.JSONDecodeError as e:
                raise ValueError(
                    f"{path.name}, line {line_number}: "
                    f"invalid JSON: {e}"
                ) from e

    return records


def make_vector(emotions):
    return [
        1 if label in emotions else 0
        for label in LABELS
    ]


def prepare_split(split_name, input_path):
    records = load_jsonl(input_path)

    prepared = []
    label_counts = Counter()

    seen_ids = set()
    seen_texts = set()

    duplicate_ids = 0
    duplicate_texts = 0

    for record in records:
        record_id = str(record["id"])
        text = str(record["text"]).strip()

        emotions = record.get("emotion", [])

        unknown = set(emotions) - set(LABELS)

        if unknown:
            raise ValueError(
                f"{record_id}: unknown emotion(s): "
                f"{sorted(unknown)}"
            )

        if not text:
            raise ValueError(
                f"{record_id}: empty text"
            )

        if (
            "trung_tính" in emotions
            and len(emotions) > 1
        ):
            raise ValueError(
                f"{record_id}: trung_tính must be exclusive"
            )

        if not emotions:
            raise ValueError(
                f"{record_id}: no emotion label"
            )

        if record_id in seen_ids:
            duplicate_ids += 1
        seen_ids.add(record_id)

        normalized_text = " ".join(
            text.lower().split()
        )

        if normalized_text in seen_texts:
            duplicate_texts += 1
        seen_texts.add(normalized_text)

        label_counts.update(emotions)

        prepared.append(
            {
                "id": record_id,
                "text": preprocess_text(text),
                "labels": make_vector(emotions),
            }
        )

    output_path = (
        OUTPUT_DIR / f"{split_name}.jsonl"
    )

    with output_path.open(
        "w",
        encoding="utf-8",
    ) as f:
        for record in prepared:
            f.write(
                json.dumps(
                    record,
                    ensure_ascii=False,
                )
                + "\n"
            )

    return {
        "split": split_name,
        "samples": len(prepared),
        "label_counts": label_counts,
        "duplicate_ids": duplicate_ids,
        "duplicate_texts": duplicate_texts,
        "ids": seen_ids,
        "texts": seen_texts,
        "output": output_path,
    }


def check_split_overlap(results):
    print("\n=== SPLIT OVERLAP ===")

    names = list(results.keys())

    found_overlap = False

    for i in range(len(names)):
        for j in range(i + 1, len(names)):
            a = results[names[i]]
            b = results[names[j]]

            id_overlap = a["ids"] & b["ids"]
            text_overlap = a["texts"] & b["texts"]

            print(
                f"{names[i]} <-> {names[j]}:"
            )
            print(
                f"  ID overlap   : {len(id_overlap)}"
            )
            print(
                f"  Text overlap : {len(text_overlap)}"
            )

            if id_overlap or text_overlap:
                found_overlap = True

    return found_overlap


def main():
    OUTPUT_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    print("=== Mind Guard Emotion Dataset v0 ===")
    print(f"Input : {INPUT_DIR}")
    print(f"Output: {OUTPUT_DIR}")

    results = {}

    for split_name, filename in FILES.items():
        input_path = INPUT_DIR / filename

        if not input_path.exists():
            raise FileNotFoundError(
                f"Không tìm thấy: {input_path}"
            )

        result = prepare_split(
            split_name,
            input_path,
        )

        results[split_name] = result

        print(
            f"\n[{split_name.upper()}]"
        )
        print(
            f"Samples        : {result['samples']}"
        )
        print(
            f"Duplicate IDs  : "
            f"{result['duplicate_ids']}"
        )
        print(
            f"Duplicate texts: "
            f"{result['duplicate_texts']}"
        )

        print("Labels:")

        for label in LABELS:
            count = result[
                "label_counts"
            ][label]

            percentage = (
                count
                / result["samples"]
                * 100
            )

            print(
                f"  {label:25}"
                f"{count:6} "
                f"({percentage:6.2f}%)"
            )

    overlap = check_split_overlap(results)

    metadata = {
        "version": "emotion_v0",
        "task": "multi_label_emotion_classification",
        "base_model": "vinai/phobert-base-v2",
        "labels": LABELS,
        "label_to_id": LABEL_TO_ID,
        "splits": {
            name: {
                "samples": result["samples"],
                "file": result[
                    "output"
                ].name,
            }
            for name, result in results.items()
        },
    }

    metadata_path = (
        OUTPUT_DIR / "metadata.json"
    )

    metadata_path.write_text(
        json.dumps(
            metadata,
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    print("\n=== RESULT ===")

    if overlap:
        print(
            "⚠ Có overlap giữa các split. "
            "Chưa nên train trước khi kiểm tra."
        )
    else:
        print(
            "✅ Không phát hiện exact overlap "
            "giữa train/validation/test."
        )

    print(
        f"✅ Metadata: {metadata_path}"
    )


if __name__ == "__main__":
    main()
