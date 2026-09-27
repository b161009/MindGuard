import { copyVariant } from '../../utils/copyVariant';

export default function DiaryInput({ value, onChange }) {
  return (
    <div className="panel" style={{ display: 'grid', gap: '0.75rem' }}>
      <h3 style={{ margin: 0 }}>{copyVariant('Bạn muốn chia sẻ thêm điều gì không?', 'Có điều gì bạn đang giữ trong lòng không?')}</h3>
      <p className="muted small" style={{ margin: 0 }}>{copyVariant('Không bắt buộc. Bạn có thể viết về suy nghĩ, cảm xúc hoặc điều khiến hôm nay trở nên khó khăn.', 'Bạn có thể viết vài từ, kể một chút hoặc bỏ qua. Không cần viết thật hay hay giải thích mọi chuyện ngay lúc này.')}</p>
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
          background: 'var(--card)',
          color: 'var(--ink)',
          padding: '0.9rem 1rem'
        }}
      />
      <div className="diary-footer"><span>Riêng tư · Bạn có thể bỏ qua phần này.</span><span>{value.length}/1000</span></div>
    </div>
  );
}
