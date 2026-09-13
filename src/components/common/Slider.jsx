export default function Slider({ label, min = 0, max = 10, value, onChange, ...props }) {
  return (
    <label style={{ display: 'grid', gap: '0.5rem', color: '#486057', fontWeight: 650 }}>
      <span>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        {...props}
        style={{ width: '100%' }}
      />
      <strong>{value}</strong>
    </label>
  );
}
