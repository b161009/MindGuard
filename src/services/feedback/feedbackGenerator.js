import { RISK_LEVEL } from '../ai/riskScore';
import { copyVariant } from '../../utils/copyVariant';

export function generateFeedback(assessment) {
  const { level, reasons = [], needsHumanFollowUp } = assessment;
  if (needsHumanFollowUp) return {
    title: 'Bạn không cần ở một mình với điều này',
    message: 'Phần chia sẻ có tín hiệu cần được một con người quan tâm ngay. Hãy liên hệ người bạn tin cậy, chuyên gia, hoặc dịch vụ khẩn cấp tại nơi bạn đang ở nếu bạn thấy mình không an toàn.',
    actions: ['Đến gần một người bạn tin cậy ngay bây giờ', 'Gọi 1900 1267 nếu có nguy cơ tức thời', 'Mở trang Hỗ trợ để xem các bước an toàn ngắn'],
  };
  if (level === RISK_LEVEL.SUPPORT) return {
    title: copyVariant('Có lẽ bạn nên tìm thêm sự hỗ trợ', 'Bạn xứng đáng được lắng nghe và hỗ trợ'),
    message: copyVariant('Hôm nay có vài chỉ số đang tạo nhiều áp lực. Đây không phải chẩn đoán; một cuộc trò chuyện với người tin cậy hoặc chuyên gia có thể là bước hữu ích.', 'Câu trả lời hôm nay có một số dấu hiệu cần chú ý. Bạn không cần tự gánh hết mọi điều; hãy cân nhắc chia sẻ với người tin cậy hoặc chuyên gia. Kết quả này không phải chẩn đoán.'),
    actions: ['Chọn một người bạn có thể nhắn tin hôm nay', 'Tạm giảm một việc không cấp thiết', 'Cân nhắc đặt lịch với chuyên gia tâm lý hoặc bác sĩ'],
  };
  if (level === RISK_LEVEL.WATCH) return {
    title: copyVariant('Hôm nay có một vài điều cần được chăm sóc', 'Hôm nay, hãy nhẹ nhàng với mình một chút'),
    message: reasons.length ? copyVariant(`Hệ thống ghi nhận ${reasons.join(', ')}.`, `Các câu trả lời ghi nhận ${reasons.join(', ')}. Nếu đang buồn hay tủi thân, bạn không cần ép mình vui lên ngay.`) : copyVariant('Một số chỉ số hôm nay thấp hơn mức dễ chịu của bạn.', 'Một số câu trả lời cho thấy bạn có thể cần thêm sự chăm sóc hôm nay. Bạn có thể bắt đầu bằng một khoảng nghỉ nhỏ.'),
    actions: ['Dành 10 phút nghỉ khỏi màn hình và hít thở chậm', 'Ưu tiên một bữa ăn, nước uống hoặc giấc ngủ đủ hơn', 'Check-in lại vào ngày mai để xem thay đổi có kéo dài không'],
  };
  return {
    title: copyVariant('Bạn đang duy trì một nhịp tương đối ổn', 'Cảm xúc của bạn vẫn đáng được lắng nghe'),
    message: copyVariant('Hãy tiếp tục để ý những điều giúp bạn thấy dễ chịu và quay lại khi bạn muốn ghi nhận thêm.', 'Các chỉ số hôm nay chưa cho thấy mức cần chú ý cao. Dù vậy, nếu trong lòng vẫn buồn, cảm giác ấy cũng có ý nghĩa — một con số không nói hết ngày của bạn.'),
    actions: ['Giữ một thói quen nhỏ giúp bạn hồi phục', 'Ghi lại điều khiến hôm nay nhẹ nhàng hơn', 'Quay lại check-in vào ngày mai'],
  };
}
