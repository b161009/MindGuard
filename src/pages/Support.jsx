import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function Support() {
  return (
    <main className="page">
      <div className="container support-container">
        <div className="page-intro"><span className="eyebrow">BẠN KHÔNG PHẢI ĐI MỘT MÌNH</span><h1>Tìm một người ở bên bạn lúc này.</h1><p>Nếu bạn đang có nguy cơ làm hại bản thân, hãy ưu tiên an toàn trước màn hình và liên hệ một con người ngay.</p></div>
        <section className="support-emergency" role="alert"><div><strong>Nếu bạn thấy mình không an toàn ngay bây giờ</strong><p>Hãy gọi <b>115</b> hoặc số khẩn cấp tại nơi bạn đang ở, đến cơ sở y tế gần nhất, hoặc nhờ một người bạn tin cậy ở cùng bạn.</p></div><a href="tel:115"><Button>Gọi 115</Button></a></section>
        <div className="support-grid">
          <section className="panel"><span className="support-number">01</span><h2>Liên hệ một người bạn tin cậy</h2><p>Bạn có thể gửi một tin ngắn: “Mình đang không ổn lắm, bạn có thể ở bên hoặc nói chuyện với mình một lúc không?”</p></section>
          <section className="panel"><span className="support-number">02</span><h2>Đưa bản thân đến nơi an toàn hơn</h2><p>Đi đến nơi có người, tránh ở một mình nếu bạn lo lắng về sự an toàn của mình, và tạm để xa những thứ có thể làm bạn bị thương.</p></section>
          <section className="panel"><span className="support-number">03</span><h2>Tìm hỗ trợ chuyên môn</h2><p>Bạn có thể liên hệ bác sĩ, chuyên gia tâm lý, cơ sở y tế hoặc dịch vụ tham vấn đáng tin cậy tại địa phương.</p></section>
        </div>
        <section className="panel support-reminder"><h2>Mind Guard chỉ là điểm bắt đầu</h2><p>Hệ thống không thể đánh giá đầy đủ hoàn cảnh của bạn hoặc thay thế sự chăm sóc chuyên môn. Khi có tín hiệu đáng lo, quyết định hỗ trợ luôn cần sự tham gia của con người.</p><Link to="/checkin"><Button variant="secondary">Quay lại check-in</Button></Link></section>
      </div>
    </main>
  );
}
