import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';

export default function Landing() {
  const { user } = useAuth();
  return (
    <main className="page landing-page">
      <div className="container landing-hero">
        <section>
          <span className="eyebrow">MỘT KHOẢNG DỪNG NHỎ MỖI NGÀY</span>
          <h1>Nhận ra những thay đổi trước khi chúng trở nên quá nặng nề.</h1>
          <p>Mind Guard giúp bạn ghi lại tâm trạng, căng thẳng và điều bạn muốn chia sẻ — để nhìn thấy xu hướng của chính mình theo thời gian.</p>
          <div className="hero-actions">
            <Link to={user ? '/dashboard' : '/register'}><Button>{user ? 'Vào không gian của tôi' : 'Bắt đầu miễn phí'}</Button></Link>
            {!user && <Link to="/login"><Button variant="secondary">Đăng nhập</Button></Link>}
          </div>
          <p className="landing-note">Không chẩn đoán. Không thay thế chuyên gia. Chỉ là một chiếc radar sớm bên cạnh bạn.</p>
        </section>
        <section className="hero-preview" aria-label="Minh hoạ giao diện check-in">
          <div className="preview-top"><span>Hôm nay · Check-in ngắn</span><strong>1 phút</strong></div>
          <h2>Hôm nay bạn thế nào?</h2>
          <p>Mức độ căng thẳng của bạn</p>
          <div className="preview-scale"><i /><i /><i /><i className="selected" /><i /><i /><i /><i /><i /><i /></div>
          <div className="preview-card"><span>Góc nhìn theo thời gian</span><strong>Nhìn xu hướng 7 / 30 ngày</strong></div>
          <div className="preview-safe">♥ Luôn có lối để tìm hỗ trợ</div>
        </section>
      </div>
      <div className="container landing-features">
        <article><span>◌</span><h2>Chạm vào hiện tại</h2><p>Check-in nhanh với các câu hỏi đơn giản, không phán xét.</p></article>
        <article><span>⌁</span><h2>Nhìn vào xu hướng</h2><p>Nhận ra thay đổi kéo dài, không vội kết luận từ một ngày khó khăn.</p></article>
        <article><span>♥</span><h2>Kết nối đúng lúc</h2><p>Khi có tín hiệu đáng lo, ưu tiên con người và nguồn hỗ trợ phù hợp.</p></article>
      </div>
    </main>
  );
}
