# Mind Guard

Ứng dụng web hỗ trợ mỗi người quan sát thay đổi sức khỏe tinh thần qua check-in hằng ngày. Mind Guard là công cụ theo dõi sớm, **không chẩn đoán** và không thay thế bác sĩ hoặc chuyên gia tâm lý.

## MVP hiện có

- Đăng ký/đăng nhập Firebase Authentication, có tên hiển thị.
- Check-in tiếng Việt: tâm trạng, mức dễ chịu, căng thẳng, giấc ngủ, năng lượng, mong muốn giao tiếp và nội dung tự do.
- Lưu mỗi check-in tại `users/{userId}/checkins/{YYYY-MM-DD}` trên Firestore.
- Baseline NLP theo luật cho tiếng Việt: cảm xúc nổi bật và các tín hiệu cần lưu tâm.
- Risk Score có thể giải thích được, với 3 mức: `Bình thường`, `Cần chú ý`, `Nên tìm hỗ trợ`.
- Phản hồi phù hợp tình huống, trang hỗ trợ khẩn và điểm truy cập Hỗ trợ luôn hiện trên giao diện.
- Biểu đồ lịch sử, phân tích xu hướng 7/30 ngày; chỉ đưa ra nhận xét xu hướng khi đã có tối thiểu 3 check-in.
- Đồng ý xử lý dữ liệu bắt buộc, đồng ý nghiên cứu tự nguyện tách riêng, trang minh bạch dữ liệu và luồng xoá tài khoản có xác thực lại.

## Dữ liệu check-in

Mỗi bản ghi gồm `userId`, `date`, `dateKey`, `mood`, `comfort`, `stress`, `sleep`, `energy`, `social`, `content`, `riskScore`, `emotion`, `riskLevel`, `detectedSignals`, `feedback`, `explanation` và `needsHumanFollowUp`.

## Thiết lập Firestore an toàn

Tệp [firestore.rules](./firestore.rules) chỉ cho người đã đăng nhập đọc/ghi tài liệu của chính họ. Triển khai quy tắc này vào Firebase project trước khi dùng dữ liệu thật:

```bash
firebase deploy --only firestore:rules
```

## Chạy dự án

```bash
npm install
npm run dev
```

Kiểm tra bản dựng:

```bash
npm run build
```

## Định hướng nghiên cứu tiếp theo

Baseline hiện tại có chủ đích đơn giản và minh bạch để làm mốc so sánh. Thư mục [research](./research) đã có schema nhãn, hướng dẫn gán nhãn, dữ liệu giả lập và script kiểm tra JSONL. Bước nghiên cứu tiếp theo là xây dựng bộ dữ liệu tiếng Việt có nhãn (cảm xúc/tín hiệu), tách train–validation–test theo người dùng, huấn luyện mô hình local, rồi so sánh với baseline bằng Accuracy, Precision, Recall, F1-score và Confusion Matrix. Mọi mô hình vẫn cần giữ luồng hỗ trợ do con người quyết định khi có tín hiệu nguy hiểm.
