export default function ResultCard({ title, value, hint }) {
  return (
    <div className="panel">
      <p className="muted" style={{ margin: 0 }}>{title}</p>
      <h3 style={{ margin: '0.5rem 0', fontSize: '2rem' }}>{value}</h3>
      <small className="muted">{hint}</small>
    </div>
  );
}
