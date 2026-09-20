import LineChart from './LineChart';

export default function MoodChart({ entries = [], days = 7 }) {
  const data = [...entries].reverse().slice(-days);
  return (
    <section className="panel chart-panel">
      <div className="chart-heading"><div><p className="eyebrow">{days} NGÀY GẦN ĐÂY</p><h2>Tâm trạng</h2></div><span className="chart-key mood-key">● Mood</span></div>
      {!data.length ? <p className="empty-chart">Check-in đầu tiên sẽ xuất hiện ở đây.</p> : (
        <LineChart entries={data} valueKey="mood" color="#3caa7d" label="Tâm trạng" />
      )}
    </section>
  );
}
