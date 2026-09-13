import { formatDate } from '../../utils/date';

export default function MoodChart({ entries = [] }) {
  const data = [...entries].reverse().slice(-7);
  return (
    <section className="panel chart-panel">
      <div className="chart-heading"><div><p className="eyebrow">7 NGÀY GẦN ĐÂY</p><h2>Tâm trạng</h2></div><span className="chart-key mood-key">● Mood</span></div>
      {!data.length ? <p className="empty-chart">Check-in đầu tiên sẽ xuất hiện ở đây.</p> : (
        <div className="bar-chart" aria-label="Biểu đồ tâm trạng 7 ngày">
          {data.map((entry) => <div className="bar-column" key={entry.id || entry.dateKey}>
            <span className="bar-value">{entry.mood}</span>
            <div className="bar-track"><div className="bar-fill mood-fill" style={{ height: `${Math.max(8, Number(entry.mood) * 10)}%` }} /></div>
            <span className="bar-label">{formatDate(entry.dateKey).slice(0, 5)}</span>
          </div>)}
        </div>
      )}
    </section>
  );
}
