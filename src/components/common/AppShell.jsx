import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../services/firebase/auth';
import { useAuth } from '../../hooks/useAuth';

const activeClass = ({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`;
const mobileActiveClass = ({ isActive }) => `mobile-nav-link${isActive ? ' mobile-nav-link-active' : ''}`;

export default function AppShell({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('mind-guard-theme') === 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
    localStorage.setItem('mind-guard-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

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
            <NavLink end className={activeClass} to="/dashboard">Tổng quan</NavLink>
            <NavLink className={activeClass} to="/checkin">Check-in</NavLink>
            <NavLink className={activeClass} to="/history">Lịch sử</NavLink>
            <NavLink className={activeClass} to="/profile">Hồ sơ</NavLink>
        </nav>
        )}
        <div className="header-actions">
          <button className="theme-toggle" type="button" onClick={() => setDarkMode((current) => !current)} aria-label={darkMode ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'} title={darkMode ? 'Giao diện sáng' : 'Giao diện tối'}>
            <span aria-hidden="true">{darkMode ? '☀' : '⏾'}</span>
          </button>
          <Link className="support-link" to="/support">Cần hỗ trợ?</Link>
          {!loading && user && <button className="text-button" onClick={handleLogout}>Đăng xuất</button>}
        </div>
      </header>
      {children}
      {!loading && user && <nav className="mobile-nav" aria-label="Điều hướng trên điện thoại">
        <NavLink end className={mobileActiveClass} to="/dashboard"><span aria-hidden="true">⌂</span>Tổng quan</NavLink>
        <NavLink className={mobileActiveClass} to="/checkin"><span aria-hidden="true">＋</span>Check-in</NavLink>
        <NavLink className={mobileActiveClass} to="/history"><span aria-hidden="true">⌁</span>Lịch sử</NavLink>
        <NavLink className={mobileActiveClass} to="/profile"><span aria-hidden="true">◌</span>Hồ sơ</NavLink>
      </nav>}
      <Link className="floating-support" to="/support" aria-label="Mở trang hỗ trợ">♥ <span>Hỗ trợ</span></Link>
    </>
  );
}
