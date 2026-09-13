import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CheckIn from './pages/CheckIn';
import Result from './pages/Result';
import History from './pages/History';
import Profile from './pages/Profile';
import Support from './pages/Support';
import Privacy from './pages/Privacy';
import AppShell from './components/common/AppShell';
import ProtectedRoute from './components/common/ProtectedRoute';

const protectedPage = (Page) => (
  <ProtectedRoute><Page /></ProtectedRoute>
);

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={protectedPage(Dashboard)} />
          <Route path="/checkin" element={protectedPage(CheckIn)} />
          <Route path="/result" element={protectedPage(Result)} />
          <Route path="/history" element={protectedPage(History)} />
          <Route path="/profile" element={protectedPage(Profile)} />
          <Route path="/support" element={<Support />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
