import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../services/firebase/auth';
import { useAuth } from '../../hooks/useAuth';

const activeClass = ({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`;

export default function AppShell({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <header className="site-header">
        <Link className="brand" to={user ? '/dashboard' : '/'}>
          <span className="brand-mark" aria-hidden="true">M</span>
          <span>Mind Guard</span>
        </Link>
        {!loading && user && (
          <nav className="site-nav" aria-label="Điều hướng chính">
            <NavLink className={activeClass} to="/dashboard">Tổng quan</NavLink>
            <NavLink className={activeClass} to="/checkin">Check-in</NavLink>
            <NavLink className={activeClass} to="/history">Lịch sử</NavLink>
            <NavLink className={activeClass} to="/profile">Hồ sơ</NavLink>
          </nav>
        )}
        <div className="header-actions">
          <Link className="support-link" to="/support">Cần hỗ trợ?</Link>
          {!loading && user && <button className="text-button" onClick={handleLogout}>Đăng xuất</button>}
        </div>
      </header>
      {children}
      <Link className="floating-support" to="/support" aria-label="Mở trang hỗ trợ">♥ <span>Hỗ trợ</span></Link>
    </>
  );
}
