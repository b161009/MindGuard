# Bộ dữ liệu nghiên cứu NLP tiếng Việt

Thư mục này là khung làm việc cho dữ liệu nghiên cứu, **không phải nơi lưu dữ liệu check-in thật**. Không đưa `userId`, email, tên, ngày giờ chính xác, địa chỉ, trường/lớp, số điện thoại hoặc chi tiết nhận diện vào dữ liệu nghiên cứu.

## Quy trình tối thiểu

1. Có sự đồng ý nghiên cứu riêng, tự nguyện; không dùng dữ liệu của người không đồng ý.
2. Khử định danh trước khi xuất dữ liệu: thay tên người bằng `[NGƯỜI]`, nơi chốn bằng `[ĐỊA_ĐIỂM]`, thời gian cụ thể bằng `[THỜI_GIAN]`.
3. Hai người gán nhãn độc lập theo [labeling-guide.md](./labeling-guide.md).
4. So sánh nhãn, thảo luận bất đồng và lưu lý do quyết định cuối cùng.
5. Chia train/validation/test theo **người dùng**, không theo từng câu, để một người không xuất hiện ở nhiều tập.
6. Chỉ sau bước kiểm tra quyền riêng tư và phê duyệt của giáo viên/người phụ trách mới dùng dữ liệu cho huấn luyện.

## Cấu trúc đề nghị

```text
research/
  label_schema.json          # nhãn hợp lệ
  labeling-guide.md          # quy tắc và ví dụ
  annotation_template.jsonl  # dữ liệu giả lập minh hoạ định dạng
  dataset/                   # dữ liệu đã khử định danh, không commit dữ liệu thật
    train.jsonl
    validation.jsonl
    test.jsonl
```

Chạy kiểm tra cấu trúc trước khi huấn luyện:

```bash
node research/scripts/validateDataset.mjs research/annotation_template.jsonl
```

## Các bài toán đánh giá

- `emotion`: multi-class hoặc multi-label, báo cáo Macro-F1 và confusion matrix.
- `signals`: multi-label, báo cáo Precision/Recall/F1 cho từng nhãn và micro/macro average.
- `riskLevel`: 3 mức theo toàn bộ bản ghi (text + câu trả lời định lượng + xu hướng), báo cáo Accuracy, Macro-F1 và confusion matrix.

Baseline để so sánh là luật hiện tại tại `src/services/ai/nlp.js` và `src/services/ai/riskScore.js`.
