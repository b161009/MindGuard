import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import { register } from '../../services/firebase/auth';
import { saveUserProfile } from '../../services/firebase/firestore';
import { validateEmail, validatePassword } from '../../utils/validation';

export default function RegisterForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '', dataProcessing: false, researchParticipation: false });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.name.trim().length < 2) {
      setError('Hãy nhập tên bạn muốn Mind Guard gọi.');
      return;
    }
    if (!validateEmail(form.email) || !validatePassword(form.password)) {
      setError('Email chưa hợp lệ hoặc mật khẩu cần có ít nhất 6 ký tự.');
      return;
    }
    if (!form.dataProcessing) {
      setError('Bạn cần đồng ý để Mind Guard lưu dữ liệu check-in phục vụ ứng dụng.');
      return;
    }
    try {
      setSubmitting(true);
      const credentials = await register(form.email.trim(), form.password, form.name.trim());
      await saveUserProfile(credentials.user, form.name.trim(), {
        dataProcessing: true,
        researchParticipation: form.researchParticipation,
      });
      navigate('/dashboard', { replace: true });
    } catch (firebaseError) {
      const messages = {
        'auth/email-already-in-use': 'Email này đã có tài khoản. Hãy đăng nhập thay vì đăng ký.',
        'auth/invalid-email': 'Email chưa hợp lệ.',
        'auth/weak-password': 'Mật khẩu cần có ít nhất 6 ký tự.',
      };
      setError(messages[firebaseError.code] || 'Chưa thể tạo tài khoản. Hãy thử lại sau ít phút.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
      <Input label="Tên bạn muốn dùng" autoComplete="name" value={form.name} onChange={handleChange('name')} placeholder="Ví dụ: Minh" />
      <Input label="Email" type="email" autoComplete="email" value={form.email} onChange={handleChange('email')} placeholder="ban@example.com" />
      <Input label="Mật khẩu" type="password" autoComplete="new-password" value={form.password} onChange={handleChange('password')} placeholder="Tối thiểu 6 ký tự" />
      <label className="consent-row">
        <input type="checkbox" checked={form.dataProcessing} onChange={(event) => setForm((previous) => ({ ...previous, dataProcessing: event.target.checked }))} />
        <span>Tôi đã đọc <Link className="inline-link" to="/privacy" target="_blank" rel="noreferrer">thông báo dữ liệu</Link> và đồng ý để Mind Guard lưu check-in của tôi nhằm cung cấp chức năng theo dõi cá nhân. *</span>
      </label>
      <label className="consent-row consent-optional">
        <input type="checkbox" checked={form.researchParticipation} onChange={(event) => setForm((previous) => ({ ...previous, researchParticipation: event.target.checked }))} />
        <span>Tôi tự nguyện cho phép dữ liệu đã được khử định danh được xem xét cho nghiên cứu NLP tiếng Việt. Việc này không ảnh hưởng đến khả năng sử dụng ứng dụng.</span>
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <Button type="submit" disabled={submitting}>{submitting ? 'Đang tạo tài khoản…' : 'Tạo tài khoản'}</Button>
    </form>
  );
}
