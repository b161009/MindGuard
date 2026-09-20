import LineChart from './LineChart';

export default function StressChart({ entries = [], days = 7 }) {
  const data = [...entries].reverse().slice(-days);
  return (
    <section className="panel chart-panel">
      <div className="chart-heading"><div><p className="eyebrow">{days} NGÀY GẦN ĐÂY</p><h2>Căng thẳng</h2></div><span className="chart-key stress-key">● Stress</span></div>
      {!data.length ? <p className="empty-chart">Khi có dữ liệu, bạn sẽ thấy các thay đổi theo ngày ở đây.</p> : (
        <LineChart entries={data} valueKey="stress" color="#e5a13d" label="Căng thẳng" />
      )}
    </section>
  );
}
