import { formatDate } from '../../utils/date';

const WIDTH = 520;
const HEIGHT = 230;
const PADDING = { top: 20, right: 16, bottom: 34, left: 30 };

export default function LineChart({ entries = [], valueKey, max = 10, color, label }) {
  // Chart callers provide entries from oldest to newest.
  const data = entries;
  const chartWidth = WIDTH - PADDING.left - PADDING.right;
  const chartHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const x = (index) => PADDING.left + (data.length === 1 ? chartWidth / 2 : (index / (data.length - 1)) * chartWidth);
  const y = (value) => PADDING.top + chartHeight - (Math.min(max, Math.max(0, Number(value) || 0)) / max) * chartHeight;
  const points = data.map((entry, index) => `${x(index)},${y(entry[valueKey])}`).join(' ');
  const area = data.length ? `${PADDING.left},${PADDING.top + chartHeight} ${points} ${x(data.length - 1)},${PADDING.top + chartHeight}` : '';
  const labelEvery = Math.max(1, Math.ceil(data.length / 5));
  const ticks = [0, max / 2, max];

  return (
    <div className="line-chart" role="img" aria-label={`${label} trong ${data.length} lần check-in gần nhất`}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none">
        {ticks.map((tick) => <g key={tick}><line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={y(tick)} y2={y(tick)} className="line-grid" /><text x="0" y={y(tick) + 4} className="line-y-label">{tick}</text></g>)}
        {data.length > 1 && <polygon points={area} className="line-area" style={{ fill: color }} />}
        {data.length > 1 && <polyline points={points} className="line-path" style={{ stroke: color }} />}
        {data.map((entry, index) => <g key={entry.id || entry.dateKey}><circle cx={x(index)} cy={y(entry[valueKey])} r="4" className="line-point" style={{ fill: color }} /><title>{`${formatDate(entry.dateKey)}: ${entry[valueKey]}/${max}`}</title>{(index % labelEvery === 0 || index === data.length - 1) && <text x={x(index)} y={HEIGHT - 8} textAnchor="middle" className="line-x-label">{formatDate(entry.dateKey).slice(0, 5)}</text>}</g>)}
      </svg>
    </div>
  );
}
