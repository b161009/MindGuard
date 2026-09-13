import { formatDate } from '../../utils/date';

export default function StressChart({ entries = [] }) {
  const data = [...entries].reverse().slice(-7);
  return (
    <section className="panel chart-panel">
      <div className="chart-heading"><div><p className="eyebrow">7 NGÀY GẦN ĐÂY</p><h2>Căng thẳng</h2></div><span className="chart-key stress-key">● Stress</span></div>
      {!data.length ? <p className="empty-chart">Khi có dữ liệu, bạn sẽ thấy các thay đổi theo ngày ở đây.</p> : (
        <div className="bar-chart" aria-label="Biểu đồ căng thẳng 7 ngày">
          {data.map((entry) => <div className="bar-column" key={entry.id || entry.dateKey}>
            <span className="bar-value">{entry.stress}</span>
            <div className="bar-track"><div className="bar-fill stress-fill" style={{ height: `${Math.max(8, Number(entry.stress) * 10)}%` }} /></div>
            <span className="bar-label">{formatDate(entry.dateKey).slice(0, 5)}</span>
          </div>)}
        </div>
      )}
    </section>
  );
}
