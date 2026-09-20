import LineChart from './LineChart';

export default function RiskChart({ entries = [], days = 7 }) {
  const data = [...entries].reverse().slice(-days);
  return (
    <section className="panel chart-panel">
      <div className="chart-heading"><div><p className="eyebrow">{days} NGÀY GẦN ĐÂY</p><h2>Mức cần chú ý</h2></div><span className="chart-key risk-key">● Theo dõi</span></div>
      {!data.length ? <p className="empty-chart">Biểu đồ sẽ xuất hiện sau check-in đầu tiên.</p> : (
        <LineChart entries={data} valueKey="riskScore" max={100} color="#8579c7" label="Mức cần chú ý" />
      )}
    </section>
  );
}
