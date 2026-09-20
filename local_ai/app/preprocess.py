from pathlib import Path
import py_vncorenlp

BASE_DIR = Path(__file__).resolve().parent.parent
VNCORENLP_DIR = BASE_DIR / "models" / "vncorenlp"

segmenter = None


def get_segmenter():
    """Load Java/VnCoreNLP only when a trained PhoBERT checkpoint is used."""
    global segmenter
    if segmenter is None:
        segmenter = py_vncorenlp.VnCoreNLP(
            annotators=["wseg"],
            save_dir=str(VNCORENLP_DIR),
        )
    return segmenter


def preprocess_text(text: str) -> str:
    """Tách từ tiếng Việt trước khi đưa vào PhoBERT."""
    if not text or not text.strip():
        return ""

    segmented = get_segmenter().word_segment(text.strip())
    return " ".join(segmented)
