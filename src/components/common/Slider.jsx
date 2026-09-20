export default function Slider({ label, min = 0, max = 10, value, onChange, lowLabel = 'Rất thấp', highLabel = 'Rất cao', ...props }) {
  const progress = ((value - min) / (max - min)) * 100;
  return (
    <div className="range-control">
      <div className="range-heading"><label htmlFor={props.id}>{label}</label><output aria-live="polite">{value}<small>/10</small></output></div>
      <input
        id={props.id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        {...props}
        style={{ '--range-progress': `${progress}%` }}
      />
      <div className="range-ticks" aria-hidden="true">{Array.from({ length: max - min + 1 }, (_, index) => <i className={index <= value - min ? 'is-active' : ''} key={index} />)}</div>
      <div className="range-ends"><span>{lowLabel} <b>{min}</b></span><span><b>{max}</b> {highLabel}</span></div>
    </div>
  );
}
