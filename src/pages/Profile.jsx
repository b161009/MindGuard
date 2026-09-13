import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Loading from '../components/common/Loading';
import { useAuth } from '../hooks/useAuth';
import {
  deleteAllUserData,
  getUserProfile,
  saveUserProfile,
  updateResearchConsent,
} from '../services/firebase/firestore';
import { deleteAuthUser, reauthenticateWithPassword } from '../services/firebase/auth';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user.displayName || '');
  const [researchConsent, setResearchConsent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteForm, setDeleteForm] = useState({ confirmation: '', password: '' });
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getUserProfile(user.uid)
      .then((profile) => {
        setName(profile?.displayName || user.displayName || '');
        setResearchConsent(Boolean(profile?.researchConsent?.granted));
      })
      .catch(() => setNotice('Chưa thể tải đầy đủ hồ sơ. Bạn có thể thử lại sau.'))
      .finally(() => setLoading(false));
  }, [user]);

  const save = async (event) => {
    event.preventDefault();
    if (name.trim().length < 2) { setNotice('Tên cần có ít nhất 2 ký tự.'); return; }
    try {
      setSaving(true); setNotice('');
      await updateProfile(user, { displayName: name.trim() });
      await saveUserProfile(user, name.trim());
      setNotice('Đã lưu thay đổi.');
    } catch { setNotice('Chưa thể lưu thay đổi. Hãy thử lại sau.'); } finally { setSaving(false); }
  };

  const changeResearchConsent = async (event) => {
    const nextValue = event.target.checked;
    setResearchConsent(nextValue);
    try {
      await updateResearchConsent(user.uid, nextValue);
      setNotice(nextValue ? 'Bạn đã đồng ý tham gia nghiên cứu tự nguyện.' : 'Bạn đã rút đồng ý tham gia nghiên cứu.');
    } catch {
      setResearchConsent(!nextValue);
      setNotice('Chưa thể cập nhật lựa chọn. Hãy thử lại sau.');
    }
  };

  const deleteAccount = async (event) => {
    event.preventDefault();
    setDeleteError('');
    if (deleteForm.confirmation !== 'XÓA TÀI KHOẢN') {
      setDeleteError('Hãy nhập chính xác: XÓA TÀI KHOẢN.');
      return;
    }
    if (!deleteForm.password) {
      setDeleteError('Hãy nhập mật khẩu để xác nhận danh tính.');
      return;
    }
    try {
      setDeleting(true);
      await reauthenticateWithPassword(user, deleteForm.password);
      await deleteAllUserData(user.uid);
      await deleteAuthUser(user);
      navigate('/', { replace: true });
    } catch (error) {
      const messages = {
        'auth/wrong-password': 'Mật khẩu chưa đúng.',
        'auth/invalid-credential': 'Mật khẩu chưa đúng.',
        'auth/requires-recent-login': 'Hãy đăng xuất, đăng nhập lại rồi thử xoá tài khoản.',
      };
      setDeleteError(messages[error.code] || 'Chưa thể xoá tài khoản. Dữ liệu của bạn chưa bị xoá hoàn toàn; hãy thử lại.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loading message="Đang tải hồ sơ…" />;
  return (
    <main className="page"><div className="container profile-container">
      <div className="page-intro"><span className="eyebrow">HỒ SƠ & CÀI ĐẶT</span><h1>Không gian của bạn.</h1><p>Bạn kiểm soát tên hiển thị, lựa chọn nghiên cứu và dữ liệu được liên kết với tài khoản này.</p></div>
      <form className="panel profile-form" onSubmit={save}>
        <Input label="Tên hiển thị" value={name} onChange={(event) => setName(event.target.value)} />
        <div className="profile-email"><span>Email</span><strong>{user.email}</strong></div>
        {notice && <p className={notice.startsWith('Đã') || notice.startsWith('Bạn đã') ? 'success-text' : 'form-error'}>{notice}</p>}
        <Button type="submit" disabled={saving}>{saving ? 'Đang lưu…' : 'Lưu thay đổi'}</Button>
      </form>

      <section className="panel privacy-settings">
        <p className="eyebrow">QUYỀN RIÊNG TƯ</p>
        <h2>Nghiên cứu NLP tiếng Việt</h2>
        <p>Dữ liệu này chỉ được sử dụng khi bạn chủ động đồng ý; từ chối không làm thay đổi trải nghiệm sử dụng Mind Guard.</p>
        <label className="consent-row consent-optional"><input type="checkbox" checked={researchConsent} onChange={changeResearchConsent} /><span>Tôi đồng ý cho dữ liệu đã được khử định danh được sử dụng trong nghiên cứu, đánh giá và cải thiện mô hình NLP.</span></label>
        <Link className="inline-link" to="/privacy">Xem thông báo dữ liệu</Link>
      </section>

      <section className="data-note"><h2>Mind Guard không chẩn đoán</h2><p>Mỗi check-in có thể lưu câu trả lời, nội dung tự nguyện chia sẻ, mức cần chú ý và phản hồi. Các kết quả chỉ hỗ trợ quan sát thay đổi; chúng không thể thay thế chuyên gia hoặc dịch vụ khẩn cấp.</p></section>

      <section className="danger-zone"><div><p className="eyebrow">VÙNG NGUY HIỂM</p><h2>Xoá tài khoản và dữ liệu</h2><p>Thao tác này xoá hồ sơ, toàn bộ check-in đang lưu và tài khoản đăng nhập. Không thể khôi phục từ ứng dụng.</p></div><Button variant="secondary" onClick={() => { setDeleteOpen(true); setDeleteError(''); }}>Xoá tài khoản</Button></section>

      <Modal isOpen={deleteOpen} title="Xoá vĩnh viễn tài khoản" onClose={() => !deleting && setDeleteOpen(false)}>
        <form className="delete-form" onSubmit={deleteAccount}>
          <p>Để bảo vệ bạn khỏi xoá nhầm, hãy nhập <strong>XÓA TÀI KHOẢN</strong> và mật khẩu hiện tại. Dữ liệu Firestore được xoá trước, rồi tài khoản đăng nhập được xoá.</p>
          <Input label="Nhập XÓA TÀI KHOẢN" value={deleteForm.confirmation} onChange={(event) => setDeleteForm((previous) => ({ ...previous, confirmation: event.target.value }))} />
          <Input label="Mật khẩu hiện tại" type="password" autoComplete="current-password" value={deleteForm.password} onChange={(event) => setDeleteForm((previous) => ({ ...previous, password: event.target.value }))} />
          {deleteError && <p className="form-error" role="alert">{deleteError}</p>}
          <div className="modal-actions"><Button type="button" variant="secondary" onClick={() => setDeleteOpen(false)} disabled={deleting}>Huỷ</Button><button className="danger-button" type="submit" disabled={deleting}>{deleting ? 'Đang xoá…' : 'Xoá vĩnh viễn'}</button></div>
        </form>
      </Modal>
    </div></main>
  );
}
