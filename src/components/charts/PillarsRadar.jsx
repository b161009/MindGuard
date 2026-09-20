const PILLARS = [
  { key: 'mood', label: 'Tinh thần', icon: '☼' },
  { key: 'comfort', label: 'Thư thái', icon: '⌁' },
  { key: 'energy', label: 'Năng lượng', icon: '✦' },
  { key: 'sleep', label: 'Giấc ngủ', icon: '☾' },
  { key: 'interest', label: 'Hứng thú', icon: '✳' },
  { key: 'social', label: 'Kết nối', icon: '◌' },
];

const point = (index, value, radius = 88) => {
  const angle = (-Math.PI / 2) + (index * Math.PI * 2 / PILLARS.length);
  const scaledRadius = radius * (value / 10);
  return [120 + Math.cos(angle) * scaledRadius, 120 + Math.sin(angle) * scaledRadius];
};

const pathFor = (values, radius) => values.map((value, index) => point(index, value, radius).join(',')).join(' ');
const average = (entries, key) => entries.length
  ? entries.reduce((sum, item) => sum + Number(item[key] ?? (key === 'interest' ? 5 : 0)), 0) / entries.length
  : 0;

export default function PillarsRadar({ entries = [], mode = 'latest' }) {
  const latest = entries[0];
  const values = PILLARS.map(({ key }) => mode === 'average' ? average(entries.slice(0, 7), key) : Number(latest?.[key] ?? (key === 'interest' ? 5 : 0)));
  const grid = [2.5, 5, 7.5, 10];
  const title = mode === 'average' ? 'Tổng quan 7 ngày' : 'Tổng quan hôm nay';

  if (!latest) {
    return <section className="panel pillars-panel"><p className="eyebrow">CHECK-IN CỦA BẠN</p><h2>Tổng quan hôm nay</h2><p className="empty-chart">Hoàn thành check-in đầu tiên để xem tổng quan của bạn.</p></section>;
  }

  return (
    <section className="panel pillars-panel">
      <div className="chart-heading"><div><p className="eyebrow">CHECK-IN CỦA BẠN</p><h2>{title}</h2></div></div>
      <div className="radar-layout">
        <svg className="radar-chart" viewBox="0 0 240 240" role="img" aria-label={`Biểu đồ ${title}`}>
          {grid.map((value) => <polygon key={value} points={pathFor(PILLARS.map(() => value), 88)} className="radar-grid" />)}
          {PILLARS.map((_, index) => { const [x, y] = point(index, 10, 88); return <line key={index} x1="120" y1="120" x2={x} y2={y} className="radar-axis" />; })}
          <polygon points={pathFor(values, 88)} className="radar-area" />
          {values.map((value, index) => { const [x, y] = point(index, value, 88); return <circle key={index} cx={x} cy={y} r="3.8" className="radar-point" />; })}
        </svg>
        <div className="pillar-legend">{PILLARS.map(({ key, label, icon }, index) => <div key={key}><span>{icon}</span><p>{label}</p><strong>{Math.round(values[index] * 10) / 10}<small>/10</small></strong></div>)}</div>
      </div>
    </section>
  );
}
