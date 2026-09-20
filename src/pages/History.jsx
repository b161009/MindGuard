import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import MoodChart from '../components/charts/MoodChart';
import StressChart from '../components/charts/StressChart';
import RiskChart from '../components/charts/RiskChart';
import PillarsRadar from '../components/charts/PillarsRadar';
import { useAuth } from '../hooks/useAuth';
import { getCheckIns } from '../services/firebase/firestore';
import { analyzeTrend } from '../services/ai/trendAnalysis';
import { formatDate } from '../utils/date';

const averageText = (value) => value === null ? '—' : value.toFixed(1);

export default function History() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(7);
  const trend = useMemo(() => analyzeTrend(entries), [entries]);
  const visibleEntries = entries.slice(0, period);

  useEffect(() => {
    getCheckIns(user.uid, 30).then(setEntries).finally(() => setLoading(false));
  }, [user.uid]);
  if (loading) return <Loading message="Đang đọc xu hướng của bạn…" />;

  return (
    <main className="page">
      <div className="container history-container">
        <div className="history-heading"><div className="page-intro"><span className="eyebrow">LỊCH SỬ CÁ NHÂN</span><h1>Nhìn vào xu hướng, không chỉ một ngày.</h1><p>Mind Guard ưu tiên các thay đổi kéo dài trong 7 và 30 ngày hơn là kết luận từ một câu trả lời riêng lẻ.</p></div><div className="period-toggle" role="group" aria-label="Khoảng thời gian"><button className={period === 7 ? 'is-selected' : ''} onClick={() => setPeriod(7)}>7 ngày</button><button className={period === 30 ? 'is-selected' : ''} onClick={() => setPeriod(30)}>30 ngày</button></div></div>
        <div className="window-stats">
          <article className="panel"><p className="eyebrow">7 NGÀY</p><strong>{averageText(trend.sevenDay.mood)}<small>/10</small></strong><span>Tâm trạng trung bình · {trend.sevenDay.count} check-in</span></article>
          <article className="panel"><p className="eyebrow">30 NGÀY</p><strong>{averageText(trend.thirtyDay.stress)}<small>/10</small></strong><span>Căng thẳng trung bình · {trend.thirtyDay.count} check-in</span></article>
          <article className="panel"><p className="eyebrow">THEO DÕI</p><strong>{averageText(trend.thirtyDay.risk)}<small>/100</small></strong><span>Chỉ số cần chú ý trung bình</span></article>
        </div>
        <section className={`trend-explanation ${trend.risingRisk || trend.sustained ? 'trend-explanation-watch' : ''}`}><strong>Nhận xét xu hướng</strong><p>{trend.summary}</p></section>
        <div className="history-charts"><PillarsRadar entries={visibleEntries} mode="average" /><MoodChart entries={visibleEntries} days={period} /><StressChart entries={visibleEntries} days={period} /><RiskChart entries={visibleEntries} days={period} /></div>
        <section className="panel entry-list-panel"><div className="list-heading"><div><p className="eyebrow">GẦN ĐÂY</p><h2>Những lần check-in của bạn</h2></div><Link to="/checkin"><Button variant="secondary">Check-in mới</Button></Link></div>
          {!entries.length ? <div className="empty-list"><p>Bạn chưa có check-in nào để hiển thị.</p><Link to="/checkin"><Button>Bắt đầu ngay</Button></Link></div> : <div className="entry-list">{visibleEntries.map((entry) => <article className="entry-row" key={entry.id || entry.dateKey}><div><strong>{formatDate(entry.dateKey)}</strong><span>{entry.emotion ? `Cảm xúc nổi bật: ${entry.emotion}` : 'Không có nội dung bổ sung'}</span></div><div className="entry-metrics"><span>Tâm trạng <b>{entry.mood}/10</b></span><span>Căng thẳng <b>{entry.stress}/10</b></span><span className={`level-chip level-${entry.riskLevel?.replaceAll(' ', '-').toLowerCase()}`}>{entry.riskLevel}</span></div></article>)}</div>}
        </section>
      </div>
    </main>
  );
}
