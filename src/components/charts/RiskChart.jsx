import { formatDate } from '../../utils/date';

export default function RiskChart({ entries = [] }) {
  const data = [...entries].reverse().slice(-7);
  return (
    <section className="panel chart-panel">
      <div className="chart-heading"><div><p className="eyebrow">7 NGÀY GẦN ĐÂY</p><h2>Mức cần chú ý</h2></div><span className="chart-key risk-key">● Theo dõi</span></div>
      {!data.length ? <p className="empty-chart">Biểu đồ chỉ số theo dõi sẽ được tạo sau check-in đầu tiên.</p> : (
        <div className="bar-chart" aria-label="Biểu đồ mức cần chú ý 7 ngày">
          {data.map((entry) => <div className="bar-column" key={entry.id || entry.dateKey}>
            <span className="bar-value">{entry.riskScore}</span>
            <div className="bar-track"><div className={`bar-fill risk-fill ${entry.riskScore >= 60 ? 'risk-high' : entry.riskScore >= 25 ? 'risk-watch' : ''}`} style={{ height: `${Math.max(8, Number(entry.riskScore))}%` }} /></div>
            <span className="bar-label">{formatDate(entry.dateKey).slice(0, 5)}</span>
          </div>)}
        </div>
      )}
    </section>
  );
}
