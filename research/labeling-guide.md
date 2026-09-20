# Hướng dẫn gán nhãn Mind Guard v2.1

## 1. Mục tiêu

Bộ nhãn dùng để mô tả các trạng thái và tín hiệu được thể hiện trực tiếp
trong văn bản của người dùng.

Nhãn không phải chẩn đoán bệnh lý, không đại diện cho đặc điểm cố định
của một người và không được suy diễn thông tin không xuất hiện trong dữ liệu.

---

## 2. Nguyên tắc chung

1. Chỉ gán nhãn dựa trên thông tin thể hiện trong văn bản.
2. Một văn bản có thể có nhiều nhãn emotion và nhiều signals.
3. Không suy đoán nguyên nhân hoặc tình trạng tâm lý nếu người viết không thể hiện.
4. Khi không chắc chắn, ghi lý do vào trường `annotation.notes`.
5. `riskLevel` không phải nhãn đầu ra trực tiếp của PhoBERT.
6. Nếu bản ghi có dữ liệu định lượng, riskLevel phải xét cả văn bản và dữ liệu định lượng.
7. Nội dung liên quan an toàn khẩn cấp phải được đưa vào quy trình có con người tham gia.

---

# 3. Emotion / State

`emotion` là một mảng và có thể chứa nhiều nhãn.

## tích_cực

Dùng khi văn bản thể hiện rõ trạng thái tích cực như:

- vui
- hài lòng
- nhẹ nhõm
- bình an
- biết ơn
- hào hứng

Ví dụ:

"Hôm nay mình rất vui vì hoàn thành được công việc."

→ ["tích_cực"]

---

## trung_tính

Dùng khi văn bản chủ yếu mô tả sự việc và không thể hiện rõ trạng thái
cảm xúc thuộc các nhóm khác.

Ví dụ:

"Hôm nay mình đi học rồi về nhà."

→ ["trung_tính"]

`trung_tính` là nhãn loại trừ.

Không gán `trung_tính` cùng với một emotion/state rõ ràng khác.

SAI:

["trung_tính", "buồn"]

ĐÚNG:

["buồn"]

---

## buồn

Dùng khi văn bản thể hiện:

- buồn
- hụt hẫng
- trống rỗng
- thất vọng
- muốn khóc

Ví dụ:

"Mình buồn vì kết quả hôm nay không như mong đợi."

→ ["buồn"]

---

## lo_lắng_căng_thẳng

Dùng khi văn bản thể hiện:

- lo lắng
- căng thẳng
- áp lực
- bất an
- hồi hộp theo hướng tiêu cực

Ví dụ:

"Mai thi rồi mà mình lo quá."

→ ["lo_lắng_căng_thẳng"]

---

## mệt_mỏi

Dùng khi văn bản thể hiện:

- mệt
- uể oải
- thiếu năng lượng
- kiệt sức

Ví dụ:

"Mấy hôm nay mình lúc nào cũng thấy mệt."

→ ["mệt_mỏi"]

Đây được xem là trạng thái tâm lý/thể chất được biểu hiện trong văn bản,
không khẳng định nguyên nhân y khoa.

---

## tức_giận

Dùng khi văn bản thể hiện:

- tức giận
- bực bội
- cáu
- khó chịu mạnh

Ví dụ:

"Mình rất bực vì chuyện xảy ra hôm nay."

→ ["tức_giận"]

---

# 4. Quy tắc multi-label cho Emotion

Nếu nhiều trạng thái được thể hiện rõ, gán tất cả nhãn phù hợp.

Ví dụ:

"Mình vừa mệt vừa lo vì mai phải thi."

→ ["mệt_mỏi", "lo_lắng_căng_thẳng"]

Không cố chọn một "cảm xúc chính" nếu văn bản thể hiện rõ nhiều trạng thái.

---

# 5. Signals

`signals` là một mảng.

Nếu không phát hiện signal:

[]

Không sử dụng nhãn `none`.

---

## quá_tải

Dùng khi văn bản thể hiện áp lực hoặc khối lượng công việc/trách nhiệm
vượt quá khả năng chịu đựng hiện tại.

Ví dụ:

"Việc dồn quá nhiều, mình cảm giác không xử lý nổi nữa."

→ ["quá_tải"]

Không tự động gán `quá_tải` chỉ vì xuất hiện từ "mệt".

---

## cô_lập

Dùng khi văn bản thể hiện:

- cảm giác cô đơn
- thiếu người để chia sẻ/kết nối
- chủ động tránh giao tiếp
- cảm giác bị tách khỏi mọi người

Ví dụ:

"Mình chẳng muốn nói chuyện với ai và cứ ở một mình."

→ ["cô_lập"]

---

## tuyệt_vọng

Dùng khi văn bản thể hiện rõ:

- không còn hy vọng
- bế tắc
- không thấy tình hình có thể tốt hơn
- không thấy lối ra

Ví dụ:

"Mình cảm giác mọi thứ sẽ chẳng bao giờ khá hơn."

→ ["tuyệt_vọng"]

Không gán `tuyệt_vọng` chỉ vì người viết đang buồn.

---

## an_toàn_khẩn_cấp

Chỉ dùng khi nội dung thể hiện trực tiếp tín hiệu nghiêm trọng liên quan
đến an toàn của người viết.

Nhãn này không phải chẩn đoán và không được để mô hình tự quyết định
quy trình hỗ trợ.

Khi xuất hiện nội dung thuộc nhóm này, bản ghi phải được xử lý theo
quy trình an toàn có người phụ trách.

---

# 6. Multi-label Signals

Một văn bản có thể có nhiều signals.

Ví dụ:

"Mình bị công việc đè nặng và dạo này chẳng muốn gặp bất kỳ ai."

→ ["quá_tải", "cô_lập"]

Nếu không có signal:

[]

---

# 7. Risk Level

Các mức:

- Bình thường
- Cần chú ý
- Nên tìm hỗ trợ

`riskLevel` không phải nhãn mà PhoBERT trực tiếp dự đoán.

Risk Engine sẽ tổng hợp:

- emotion/state
- signals
- 6 chỉ số wellbeing
- stress
- xu hướng 7 ngày
- xu hướng 30 ngày
- các quy tắc an toàn

Không kết luận riskLevel chỉ dựa vào một từ khóa hoặc một emotion.

---

# 8. Quy tắc annotation

Mỗi bản ghi cần có:

- annotator
- notes

Ví dụ:

{
  "annotator": "A1",
  "notes": "Có biểu hiện lo lắng và mệt mỏi rõ; không có tín hiệu quá tải."
}

Annotation phải giải thích ngắn gọn lý do gán nhãn khi trường hợp có thể
gây tranh luận.

---

# 9. Nguyên tắc dữ liệu

Không đưa thông tin nhận dạng cá nhân vào dataset.

Dữ liệu thực tế chỉ được sử dụng khi có cơ sở đồng thuận phù hợp và đã
được khử nhận dạng.

Dữ liệu synthetic phải được đánh dấu:

"sourceType": "synthetic"

Dữ liệu được đồng thuận và khử nhận dạng:

"sourceType": "consented_deidentified"

---

# 10. Quy tắc chia dataset

Không dùng cùng một bản ghi ở nhiều split.

Các split dự kiến:

- train
- validation
- test

Nếu có nhiều bản ghi từ cùng một người, toàn bộ bản ghi của người đó
phải nằm trong cùng một split để tránh data leakage.
## Quy tắc phân biệt các nhãn dễ nhầm 

### 1. Mệt mỏi và quá tải

`mệt_mỏi` mô tả trạng thái thiếu năng lượng, uể oải, kiệt sức hoặc cảm giác không còn sức.

`quá_tải` là tín hiệu cho thấy khối lượng công việc, áp lực hoặc yêu cầu hiện tại đang vượt quá khả năng đối phó của người viết.

Không gán `quá_tải` chỉ vì văn bản biểu đạt mức độ mệt mỏi cao.

Ví dụ:

- "Hôm nay mình mệt quá."  
  → emotion: [`mệt_mỏi`]  
  → signals: []

- "Cả người mệt rã rời."  
  → emotion: [`mệt_mỏi`]  
  → signals: []

- "Việc dồn liên tục, mình không xử lý nổi nữa."  
  → signals: [`quá_tải`]

- "Bài vở dồn quá nhiều, mình vừa kiệt sức vừa không xoay xở nổi."  
  → emotion: [`mệt_mỏi`]  
  → signals: [`quá_tải`]


### 2. Mệt mỏi và tuyệt vọng

Mức độ mệt mỏi cao không tự động đồng nghĩa với `tuyệt_vọng`.

Chỉ gán `tuyệt_vọng` khi văn bản trực tiếp thể hiện sự mất hy vọng, cảm giác không còn lối ra hoặc không tin tình hình có thể được cải thiện.

Ví dụ:

- "Mình kiệt sức thật sự rồi."  
  → emotion: [`mệt_mỏi`]  
  → signals: []

Không tự động thêm `tuyệt_vọng`.


### 3. Tuyệt vọng và an toàn khẩn cấp

`tuyệt_vọng` và `an_toàn_khẩn_cấp` là hai tín hiệu riêng biệt.

Không tự động suy ra `an_toàn_khẩn_cấp` từ `tuyệt_vọng`.

`an_toàn_khẩn_cấp` chỉ được gán khi văn bản chứa tín hiệu trực tiếp và đủ rõ về nguy cơ an toàn nghiêm trọng cần quy trình hỗ trợ con người.

Không suy ra tín hiệu này chỉ dựa trên cường độ của từ ngữ cảm xúc.


### 4. Không suy diễn cảm xúc từ trạng thái thể chất

Các biểu đạt như:

- "khỏe"
- "hết mệt"
- "đỡ mệt"
- "có sức lại"

không tự động được gán `tích_cực`.

Chỉ gán `tích_cực` khi văn bản thực sự biểu đạt trạng thái cảm xúc tích cực như vui, hài lòng, phấn khởi, lạc quan hoặc tương đương.

Ví dụ:

- "Hôm qua mình mệt nhưng hôm nay khỏe hẳn rồi."  
  → emotion: []  
  → signals: []

- "Hôm nay khỏe lại rồi, mình vui ghê."  
  → emotion: [`tích_cực`]  
  → signals: []


### 5. Nguyên tắc bằng chứng tối thiểu

Chỉ gán nhãn khi có bằng chứng đủ rõ trong chính văn bản.

Không suy ra nhãn dựa trên:

- nguyên nhân chưa được đề cập;
- chẩn đoán hoặc giả định tâm lý;
- mức độ nghiêm trọng tưởng tượng;
- quan hệ thường gặp giữa hai trạng thái;
- kiến thức ngoài nội dung người viết cung cấp.

Khi phân vân giữa "có nhãn" và "không đủ bằng chứng", ưu tiên không gán và ghi chú trường hợp cần thảo luận.