export default function DiaryInput({ value, onChange }) {
  return (
    <div className="panel" style={{ display: 'grid', gap: '0.75rem' }}>
      <h3 style={{ margin: 0 }}>Bạn muốn chia sẻ thêm điều gì không?</h3>
      <p className="muted small" style={{ margin: 0 }}>Không bắt buộc. Bạn có thể viết về suy nghĩ, cảm xúc hoặc điều khiến hôm nay trở nên khó khăn.</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        maxLength={1000}
        placeholder="Ví dụ: Hôm nay mình thấy…"
        style={{
          width: '100%',
          resize: 'vertical',
          borderRadius: '12px',
          border: '1px solid rgba(148, 163, 184, 0.22)',
          background: '#fff',
          color: '#20332d',
          padding: '0.9rem 1rem'
        }}
      />
      <div className="diary-footer"><span>Riêng tư · Bạn có thể bỏ qua phần này.</span><span>{value.length}/1000</span></div>
    </div>
  );
}
