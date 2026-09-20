import argparse
import json
import random
from pathlib import Path

import numpy as np
import torch
from sklearn.metrics import (
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from torch.utils.data import DataLoader, Dataset
from transformers import AutoModelForSequenceClassification, AutoTokenizer


BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent

MODEL_DIR = BASE_DIR / "models" / "phobert-base-v2"

DATA_DIR = (
    PROJECT_ROOT
    / "research"
    / "dataset"
    / "splits"
    / "emotion_v0"
)

OUTPUT_DIR = (
    BASE_DIR
    / "models"
    / "mindguard-emotion-v0"
)

LABELS = [
    "tích_cực",
    "trung_tính",
    "buồn",
    "lo_lắng_căng_thẳng",
    "tức_giận",
]

NUM_LABELS = len(LABELS)

MAX_LENGTH = 128
BATCH_SIZE = 8
GRAD_ACCUM_STEPS = 2
LEARNING_RATE = 2e-5
EPOCHS = 3
THRESHOLD = 0.5
SEED = 42


def set_seed(seed):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)

    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)


def load_jsonl(path):
    records = []

    with path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()

            if line:
                records.append(json.loads(line))

    return records


class EmotionDataset(Dataset):
    def __init__(
        self,
        records,
        tokenizer,
        max_length=128,
    ):
        self.records = records
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __len__(self):
        return len(self.records)

    def __getitem__(self, index):
        record = self.records[index]

        encoded = self.tokenizer(
            record["text"],
            truncation=True,
            max_length=self.max_length,
            padding="max_length",
            return_tensors="pt",
        )

        item = {
            key: value.squeeze(0)
            for key, value in encoded.items()
        }

        item["labels"] = torch.tensor(
            record["labels"],
            dtype=torch.float32,
        )

        return item


def evaluate(model, loader, device):
    model.eval()

    all_probs = []
    all_labels = []

    with torch.no_grad():
        for batch in loader:
            labels = batch.pop("labels").to(device)

            batch = {
                key: value.to(device)
                for key, value in batch.items()
            }

            with torch.autocast(
                device_type="cuda",
                dtype=torch.float16,
                enabled=device.type == "cuda",
            ):
                outputs = model(**batch)

            probs = torch.sigmoid(
                outputs.logits
            )

            all_probs.append(
                probs.cpu().numpy()
            )

            all_labels.append(
                labels.cpu().numpy()
            )

    probs = np.concatenate(all_probs)
    y_true = np.concatenate(all_labels)

    y_pred = (
        probs >= THRESHOLD
    ).astype(int)

    metrics = {
        "macro_precision": precision_score(
            y_true,
            y_pred,
            average="macro",
            zero_division=0,
        ),
        "macro_recall": recall_score(
            y_true,
            y_pred,
            average="macro",
            zero_division=0,
        ),
        "macro_f1": f1_score(
            y_true,
            y_pred,
            average="macro",
            zero_division=0,
        ),
        "micro_f1": f1_score(
            y_true,
            y_pred,
            average="micro",
            zero_division=0,
        ),
    }

    per_label = {}
    confusion_matrices = {}

    for index, label in enumerate(LABELS):
        per_label[label] = {
            "precision": precision_score(
                y_true[:, index],
                y_pred[:, index],
                zero_division=0,
            ),
            "recall": recall_score(
                y_true[:, index],
                y_pred[:, index],
                zero_division=0,
            ),
            "f1": f1_score(
                y_true[:, index],
                y_pred[:, index],
                zero_division=0,
            ),
        }
        matrix = confusion_matrix(
            y_true[:, index],
            y_pred[:, index],
            labels=[0, 1],
        )
        confusion_matrices[label] = {
            "labels": ["absent", "present"],
            "matrix": matrix.tolist(),
        }

    return metrics, per_label, confusion_matrices


def save_best(
    model,
    tokenizer,
    metrics,
    per_label,
    confusion_matrices,
    epoch,
):
    OUTPUT_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    model.save_pretrained(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)

    result = {
        "epoch": epoch,
        "threshold": THRESHOLD,
        "labels": LABELS,
        "metrics": metrics,
        "per_label": per_label,
        "confusion_matrices": confusion_matrices,
    }

    (
        OUTPUT_DIR / "validation_metrics.json"
    ).write_text(
        json.dumps(
            result,
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )


def main():
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--dry-run",
        action="store_true",
    )

    args = parser.parse_args()

    set_seed(SEED)

    device = torch.device(
        "cuda"
        if torch.cuda.is_available()
        else "cpu"
    )

    print("=== Mind Guard PhoBERT Emotion v0 ===")
    print("Device :", device)

    if device.type == "cuda":
        print(
            "GPU    :",
            torch.cuda.get_device_name(0),
        )

    print("Model  :", MODEL_DIR)
    print("Data   :", DATA_DIR)

    tokenizer = AutoTokenizer.from_pretrained(
        MODEL_DIR,
        local_files_only=True,
    )

    model = (
        AutoModelForSequenceClassification
        .from_pretrained(
            MODEL_DIR,
            num_labels=NUM_LABELS,
            problem_type=(
                "multi_label_classification"
            ),
            local_files_only=True,
        )
        .to(device)
    )
    model.config.id2label = {index: label for index, label in enumerate(LABELS)}
    model.config.label2id = {label: index for index, label in enumerate(LABELS)}

    train_records = load_jsonl(
        DATA_DIR / "train.jsonl"
    )

    val_records = load_jsonl(
        DATA_DIR / "validation.jsonl"
    )
    test_records = load_jsonl(
        DATA_DIR / "test.jsonl"
    )

    if args.dry_run:
        train_records = train_records[:32]
        val_records = val_records[:32]

        print(
            "\n⚙ DRY RUN: "
            "32 train + 32 validation"
        )

    train_dataset = EmotionDataset(
        train_records,
        tokenizer,
        MAX_LENGTH,
    )

    val_dataset = EmotionDataset(
        val_records,
        tokenizer,
        MAX_LENGTH,
    )

    train_loader = DataLoader(
        train_dataset,
        batch_size=BATCH_SIZE,
        shuffle=True,
        pin_memory=device.type == "cuda",
    )

    val_loader = DataLoader(
        val_dataset,
        batch_size=BATCH_SIZE,
        shuffle=False,
        pin_memory=device.type == "cuda",
    )
    test_dataset = EmotionDataset(test_records, tokenizer, MAX_LENGTH)
    test_loader = DataLoader(
        test_dataset,
        batch_size=BATCH_SIZE,
        shuffle=False,
        pin_memory=device.type == "cuda",
    )

    optimizer = torch.optim.AdamW(
        model.parameters(),
        lr=LEARNING_RATE,
    )

    scaler = torch.amp.GradScaler(
        "cuda",
        enabled=device.type == "cuda",
    )

    print(
        f"Train samples : {len(train_dataset)}"
    )
    print(
        f"Val samples   : {len(val_dataset)}"
    )
    print(
        f"Batch size    : {BATCH_SIZE}"
    )
    print(
        f"Grad accum    : {GRAD_ACCUM_STEPS}"
    )
    print(
        f"Effective BS  : "
        f"{BATCH_SIZE * GRAD_ACCUM_STEPS}"
    )

    best_f1 = -1.0

    epochs = 1 if args.dry_run else EPOCHS

    for epoch in range(1, epochs + 1):
        model.train()
        optimizer.zero_grad(set_to_none=True)

        running_loss = 0.0

        print(
            f"\n=== EPOCH {epoch}/{epochs} ==="
        )

        for step, batch in enumerate(
            train_loader,
            start=1,
        ):
            labels = batch.pop(
                "labels"
            ).to(device)

            batch = {
                key: value.to(
                    device,
                    non_blocking=True,
                )
                for key, value in batch.items()
            }

            with torch.autocast(
                device_type="cuda",
                dtype=torch.float16,
                enabled=device.type == "cuda",
            ):
                outputs = model(
                    **batch,
                    labels=labels,
                )

                loss = (
                    outputs.loss
                    / GRAD_ACCUM_STEPS
                )

            scaler.scale(loss).backward()

            if (
                step % GRAD_ACCUM_STEPS == 0
                or step == len(train_loader)
            ):
                scaler.unscale_(optimizer)

                torch.nn.utils.clip_grad_norm_(
                    model.parameters(),
                    1.0,
                )

                scaler.step(optimizer)
                scaler.update()

                optimizer.zero_grad(
                    set_to_none=True
                )

            running_loss += (
                loss.item()
                * GRAD_ACCUM_STEPS
            )

            if (
                step % 100 == 0
                or step == len(train_loader)
            ):
                print(
                    f"Step "
                    f"{step:4}/{len(train_loader)}"
                    f" | loss="
                    f"{running_loss / step:.4f}"
                )

        metrics, per_label, confusion_matrices = evaluate(
            model,
            val_loader,
            device,
        )

        print("\nValidation:")
        print(
            f"Macro Precision: "
            f"{metrics['macro_precision']:.4f}"
        )
        print(
            f"Macro Recall   : "
            f"{metrics['macro_recall']:.4f}"
        )
        print(
            f"Macro F1       : "
            f"{metrics['macro_f1']:.4f}"
        )
        print(
            f"Micro F1       : "
            f"{metrics['micro_f1']:.4f}"
        )

        print("\nPer label:")

        for label in LABELS:
            values = per_label[label]

            print(
                f"{label:24} "
                f"P={values['precision']:.3f} "
                f"R={values['recall']:.3f} "
                f"F1={values['f1']:.3f}"
            )

        if metrics["macro_f1"] > best_f1:
            best_f1 = metrics["macro_f1"]

            if not args.dry_run:
                save_best(
                    model,
                    tokenizer,
                    metrics,
                    per_label,
                    confusion_matrices,
                    epoch,
                )

                print(
                    "\n💾 Best checkpoint saved."
                )

    if args.dry_run:
        print(
            "\n✅ DRY RUN PASSED."
        )
        print(
            "Không lưu checkpoint từ dry-run."
        )
    else:
        best_model = AutoModelForSequenceClassification.from_pretrained(
            OUTPUT_DIR,
            local_files_only=True,
        ).to(device)
        test_metrics, test_per_label, test_confusion_matrices = evaluate(
            best_model,
            test_loader,
            device,
        )
        (OUTPUT_DIR / "test_metrics.json").write_text(
            json.dumps({
                "split": "held-out test",
                "threshold": THRESHOLD,
                "labels": LABELS,
                "metrics": test_metrics,
                "per_label": test_per_label,
                "confusion_matrices": test_confusion_matrices,
            }, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        print(
            f"\n🏁 Training complete. "
            f"Best Macro F1: {best_f1:.4f}"
        )
        print(f"Test metrics: {OUTPUT_DIR / 'test_metrics.json'}")
        print(
            f"Checkpoint: {OUTPUT_DIR}"
        )


if __name__ == "__main__":
    main()
