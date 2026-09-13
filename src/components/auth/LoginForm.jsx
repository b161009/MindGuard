import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import { login } from '../../services/firebase/auth';
import { validateEmail } from '../../utils/validation';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!validateEmail(form.email) || !form.password) {
      setError('Hãy nhập email hợp lệ và mật khẩu của bạn.');
      return;
    }
    try {
      setSubmitting(true);
      await login(form.email.trim(), form.password);
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (firebaseError) {
      const messages = {
        'auth/invalid-credential': 'Email hoặc mật khẩu chưa đúng.',
        'auth/too-many-requests': 'Bạn đã thử quá nhiều lần. Hãy chờ một lát rồi thử lại.',
      };
      setError(messages[firebaseError.code] || 'Chưa thể đăng nhập. Hãy kiểm tra kết nối và thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
      <Input label="Email" type="email" autoComplete="email" value={form.email} onChange={handleChange('email')} placeholder="ban@example.com" />
      <Input label="Mật khẩu" type="password" autoComplete="current-password" value={form.password} onChange={handleChange('password')} placeholder="••••••••" />
      {error && <p className="form-error" role="alert">{error}</p>}
      <Button type="submit" disabled={submitting}>{submitting ? 'Đang đăng nhập…' : 'Đăng nhập'}</Button>
    </form>
  );
}
