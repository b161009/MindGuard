# Local AI service

Dịch vụ này chạy **trên máy Acer Nitro**, không gửi nội dung check-in sang máy chủ AI bên ngoài. Khi chưa có checkpoint, API dùng baseline theo luật. Khi có `models/mindguard-emotion-v0`, API tự dùng PhoBERT để nhận diện cảm xúc; các tín hiệu khẩn cấp vẫn do luật an toàn xử lý.

## Chạy lần đầu

```bash
cd local_ai
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
$env:JAVA_HOME = "C:\Program Files\Java\jdk-26"
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Kiểm tra tại `http://127.0.0.1:8000/health`.

## Kết nối React

Tạo tệp `.env.local` ở thư mục gốc dự án:

```text
VITE_USE_LOCAL_AI=true
VITE_LOCAL_AI_URL=http://127.0.0.1:8000
```

Khởi động lại Vite sau khi thay đổi `.env.local`. Nếu dịch vụ local chưa chạy hoặc gặp lỗi, web app tự quay về baseline trên trình duyệt để không làm mất check-in.

## Chuẩn bị, train và đánh giá PhoBERT

```bash
$env:JAVA_HOME = "C:\Program Files\Java\jdk-26"
.venv\Scripts\python prepare_emotion_dataset.py
.venv\Scripts\python train_phobert_emotion.py
```

Model được lưu vào `models/mindguard-emotion-v0`. Script tự đánh giá validation để chọn checkpoint tốt nhất, sau đó đánh giá một lần trên test set giữ riêng và lưu `validation_metrics.json`, `test_metrics.json`, gồm Precision, Recall, Macro-F1 và Confusion Matrix nhị phân cho từng nhãn.

PhoBERT chỉ được dùng cho emotion. Không dùng model emotion để tự quyết định cảnh báo khẩn cấp hoặc chẩn đoán.

## Đánh giá baseline hiện tại

Sau khi có tập `test.jsonl` đã gán nhãn, chạy:

```bash
.venv\Scripts\python evaluate_baseline.py ..\research\dataset\test.jsonl
```

Script in báo cáo JSON cho emotion, signals và riskLevel, gồm Accuracy (riskLevel), Precision, Recall, Macro-F1 và Confusion Matrix. Dữ liệu mẫu chỉ để kiểm tra kỹ thuật; không dùng kết quả từ 3 bản ghi mẫu làm kết luận nghiên cứu.
