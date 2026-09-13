export default function FeedbackCard({ title, text }) {
  return (
    <div className="panel">
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <p className="muted" style={{ margin: 0 }}>{text}</p>
    </div>
  );
}
