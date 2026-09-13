export default function Loading({ message = 'Đang tải…' }) {
  return (
    <div style={{ display: 'grid', placeItems: 'center', padding: '2rem', color: '#687a73' }}>
      <div style={{ display: 'grid', gap: '0.75rem', justifyItems: 'center' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            border: '3px solid rgba(29, 128, 94, 0.16)',
            borderTopColor: '#1d805e',
            animation: 'spin 0.8s linear infinite'
          }}
        />
        <span>{message}</span>
      </div>
    </div>
  );
}
