import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function Support() {
  return (
    <main className="page">
      <div className="container support-container">
        <div className="page-intro"><span className="eyebrow">BẠN KHÔNG PHẢI ĐI MỘT MÌNH</span><h1>Tìm một người ở bên bạn lúc này.</h1><p>Nếu bạn đang có nguy cơ làm hại bản thân, hãy ưu tiên an toàn trước màn hình và liên hệ một con người ngay.</p></div>
        <section className="support-emergency" role="alert"><div><strong>Nếu bạn thấy mình không an toàn ngay bây giờ</strong><p>Hãy gọi <b>1900 1267</b>, đến cơ sở y tế gần nhất, hoặc nhờ một người bạn tin cậy ở cùng bạn.</p></div><a href="tel:19001267"><Button>Gọi 1900 1267</Button></a></section>
        <div className="support-grid">
          <section className="panel"><span className="support-number">01</span><h2>Liên hệ một người bạn tin cậy</h2><p>Bạn có thể gửi một tin ngắn: “Mình đang không ổn lắm, bạn có thể ở bên hoặc nói chuyện với mình một lúc không?”</p></section>
          <section className="panel"><span className="support-number">02</span><h2>Đưa bản thân đến nơi an toàn hơn</h2><p>Đi đến nơi có người, tránh ở một mình nếu bạn lo lắng về sự an toàn của mình, và tạm để xa những thứ có thể làm bạn bị thương.</p></section>
          <section className="panel"><span className="support-number">03</span><h2>Tìm hỗ trợ chuyên môn</h2><p>Bạn có thể liên hệ bác sĩ, chuyên gia tâm lý, cơ sở y tế hoặc dịch vụ tham vấn đáng tin cậy tại địa phương.</p></section>
        </div>
        <section className="panel support-contact"><div><p className="eyebrow">KÊNH HỖ TRỢ</p><h2>Liên hệ với Ngày Mai</h2><p>Nếu bạn cần một người lắng nghe hoặc muốn tìm thêm thông tin hỗ trợ, bạn có thể liên hệ Ngày Mai. Khi có nguy cơ tức thời, hãy gọi 1900 1267 hoặc đến cơ sở y tế gần nhất trước.</p></div><div className="support-contact-actions"><a href="tel:0963061414"><Button>Gọi 096 306 1414</Button></a><a href="mailto:hotlinengaymai@gmail.com"><Button variant="secondary">Gửi email</Button></a></div></section>
        <section className="panel support-reminder"><h2>Mind Guard chỉ là điểm bắt đầu</h2><p>Hệ thống không thể đánh giá đầy đủ hoàn cảnh của bạn hoặc thay thế sự chăm sóc chuyên môn. Khi có tín hiệu đáng lo, quyết định hỗ trợ luôn cần sự tham gia của con người.</p><Link to="/checkin"><Button variant="secondary">Quay lại check-in</Button></Link></section>
      </div>
    </main>
  );
}
