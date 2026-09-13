export default function Question({ question, children }) {
  return (
    <div className="panel" style={{ display: 'grid', gap: '1rem' }}>
      <h3 style={{ margin: 0 }}>{question}</h3>
      {children}
    </div>
  );
}
