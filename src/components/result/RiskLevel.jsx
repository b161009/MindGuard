export default function RiskLevel({ level = 'Bình thường', urgent = false }) {
  const palette = {
    'Bình thường': 'var(--mint-strong)',
    'Cần chú ý': 'var(--warning)',
    'Nên tìm hỗ trợ': 'var(--danger)'
  };

  return (
    <div className="panel" style={{ textAlign: 'center' }}>
      <p className="muted" style={{ margin: 0 }}>Mức độ cần chú ý hôm nay</p>
      <h2 style={{ margin: '0.75rem 0 0', color: palette[level] || 'var(--muted)', fontSize: '2.1rem' }}>{level}</h2>
      {urgent && <p className="urgent-note">Bạn xứng đáng được một người thật sự lắng nghe ngay lúc này.</p>}
    </div>
  );
}
