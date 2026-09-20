import Slider from '../common/Slider';

export default function MoodSlider({ label, hint, icon, value, onChange, id, lowLabel, highLabel }) {
  return (
    <div className="panel checkin-slider-card">
      <div className="checkin-slider-copy"><span className="checkin-icon" aria-hidden="true">{icon}</span><div><h3>{label}</h3>{hint && <p>{hint}</p>}</div></div>
      <Slider id={id} label="Chọn mức phù hợp" min={0} max={10} value={value} onChange={onChange} lowLabel={lowLabel} highLabel={highLabel} />
    </div>
  );
}
