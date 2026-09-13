export default function Input({ label, ...props }) {
  return (
    <label style={{ display: 'grid', gap: '0.5rem', color: '#486057', fontWeight: 650 }}>
      {label && <span>{label}</span>}
      <input
        {...props}
        style={{
          width: '100%',
          padding: '0.8rem 0.9rem',
          borderRadius: '10px',
          border: '1px solid rgba(148, 163, 184, 0.22)',
          background: '#fff',
          color: '#20332d'
        }}
      />
    </label>
  );
}
