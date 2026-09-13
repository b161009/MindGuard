import { RISK_LEVEL } from '../ai/riskScore';

export function generateFeedback(assessment) {
  const { level, reasons = [], needsHumanFollowUp } = assessment;
  if (needsHumanFollowUp) return {
    title: 'Bạn không cần ở một mình với điều này',
    message: 'Phần chia sẻ có tín hiệu cần được một con người quan tâm ngay. Hãy liên hệ người bạn tin cậy, chuyên gia, hoặc dịch vụ khẩn cấp tại nơi bạn đang ở nếu bạn thấy mình không an toàn.',
    actions: ['Đến gần một người bạn tin cậy ngay bây giờ', 'Gọi 115 hoặc dịch vụ khẩn cấp tại địa phương nếu có nguy cơ tức thời', 'Mở trang Hỗ trợ để xem các bước an toàn ngắn'],
  };
  if (level === RISK_LEVEL.SUPPORT) return {
    title: 'Có lẽ bạn nên tìm thêm sự hỗ trợ',
    message: 'Hôm nay có vài chỉ số đang tạo nhiều áp lực. Đây không phải chẩn đoán; một cuộc trò chuyện với người tin cậy hoặc chuyên gia có thể là bước hữu ích.',
    actions: ['Chọn một người bạn có thể nhắn tin hôm nay', 'Tạm giảm một việc không cấp thiết', 'Cân nhắc đặt lịch với chuyên gia tâm lý hoặc bác sĩ'],
  };
  if (level === RISK_LEVEL.WATCH) return {
    title: 'Hôm nay có một vài điều cần được chăm sóc',
    message: reasons.length ? `Hệ thống ghi nhận ${reasons.join(', ')}.` : 'Một số chỉ số hôm nay thấp hơn mức dễ chịu của bạn.',
    actions: ['Dành 10 phút nghỉ khỏi màn hình và hít thở chậm', 'Ưu tiên một bữa ăn, nước uống hoặc giấc ngủ đủ hơn', 'Check-in lại vào ngày mai để xem thay đổi có kéo dài không'],
  };
  return {
    title: 'Bạn đang duy trì một nhịp tương đối ổn',
    message: 'Kết quả hôm nay là một lát cắt ngắn, không phải đánh giá sức khỏe. Hãy tiếp tục để ý những điều giúp bạn thấy dễ chịu.',
    actions: ['Giữ một thói quen nhỏ giúp bạn hồi phục', 'Ghi lại điều khiến hôm nay nhẹ nhàng hơn', 'Quay lại check-in vào ngày mai'],
  };
}
