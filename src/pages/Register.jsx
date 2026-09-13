import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';

export default function Register() {
  return (
    <main className="page">
      <div className="container" style={{ maxWidth: '560px', paddingTop: '4rem' }}>
        <div className="panel" style={{ padding: '2rem' }}>
          <h1 style={{ marginTop: 0 }}>Tạo không gian của bạn</h1>
          <p className="muted" style={{ marginBottom: '1.5rem' }}>Chỉ mất một phút để bắt đầu theo dõi những thay đổi nhỏ mỗi ngày.</p>
          <RegisterForm />
          <p className="muted" style={{ marginTop: '1rem' }}>
            Đã có tài khoản? <Link to="/login" className="inline-link">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
