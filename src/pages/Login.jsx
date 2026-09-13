import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

export default function Login() {
  return (
    <main className="page">
      <div className="container" style={{ maxWidth: '520px', paddingTop: '4rem' }}>
        <div className="panel" style={{ padding: '2rem' }}>
          <h1 style={{ marginTop: 0 }}>Chào mừng bạn quay lại</h1>
          <p className="muted" style={{ marginBottom: '1.5rem' }}>Tiếp tục hành trình lắng nghe sức khỏe tinh thần của bạn.</p>
          <LoginForm />
          <p className="muted" style={{ marginTop: '1rem' }}>
            Chưa có tài khoản? <Link to="/register" className="inline-link">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
