import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import MoodChart from '../components/charts/MoodChart';
import StressChart from '../components/charts/StressChart';
import RiskChart from '../components/charts/RiskChart';
import { useAuth } from '../hooks/useAuth';
import { getCheckIns } from '../services/firebase/firestore';
import { analyzeTrend } from '../services/ai/trendAnalysis';

const shortName = (name, email) => (name || email?.split('@')[0] || 'bạn').split(' ')[0];

export default function Dashboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const trend = useMemo(() => analyzeTrend(entries), [entries]);
  const latest = entries[0];

  useEffect(() => {
    getCheckIns(user.uid, 30)
      .then(setEntries)
      .catch(() => setError('Chưa thể tải lịch sử check-in. Bạn vẫn có thể tạo check-in mới.'))
      .finally(() => setLoading(false));
  }, [user.uid]);

  if (loading) return <Loading message="Đang mở không gian của bạn…" />;
  return (
    <main className="page">
      <div className="container">
        <div className="dashboard-heading">
          <div><span className="eyebrow">KHÔNG GIAN CỦA BẠN</span><h1>Chào {shortName(user.displayName, user.email)}.</h1><p>Hôm nay bạn muốn lắng nghe bản thân một chút không?</p></div>
          <Link to="/checkin"><Button>Bắt đầu check-in</Button></Link>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        {!latest ? (
          <section className="first-checkin panel"><div><span className="eyebrow">BƯỚC ĐẦU TIÊN</span><h2>Chưa có check-in nào</h2><p>Chỉ cần một phút để ghi lại tâm trạng, mức căng thẳng và những điều bạn muốn chia sẻ hôm nay.</p></div><Link to="/checkin"><Button>Check-in đầu tiên</Button></Link></section>
        ) : (
          <>
            <div className="summary-cards">
              <article className="summary-card"><span>Tâm trạng gần nhất</span><strong>{latest.mood}<small>/10</small></strong><em>đã ghi nhận</em></article>
              <article className="summary-card"><span>Căng thẳng gần nhất</span><strong>{latest.stress}<small>/10</small></strong><em>đã ghi nhận</em></article>
              <article className="summary-card"><span>Mức cần chú ý</span><strong className="level-value">{latest.riskLevel}</strong><em>chỉ để theo dõi</em></article>
            </div>
            <section className={`trend-callout ${trend.risingRisk || trend.sustained ? 'trend-callout-watch' : ''}`}>
              <span aria-hidden="true">⌁</span><div><strong>Góc nhìn 7 ngày</strong><p>{trend.summary}</p></div><Link to="/history">Xem chi tiết →</Link>
            </section>
          </>
        )}
        <div className="dashboard-charts">
          <MoodChart entries={entries} />
          <StressChart entries={entries} />
          <RiskChart entries={entries} />
          <section className="panel quick-panel"><p className="eyebrow">NHẮC NHỞ NHẸ</p><h2>Không cần hoàn hảo.</h2><p>Điều quan trọng là bạn có một nơi để nhận ra những thay đổi nhỏ trước khi chúng trở nên quá nặng nề.</p><Link to="/support"><Button variant="secondary">Xem các nguồn hỗ trợ</Button></Link></section>
        </div>
      </div>
    </main>
  );
}
