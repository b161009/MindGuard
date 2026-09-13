import Slider from '../common/Slider';

export default function MoodSlider({ label, value, onChange }) {
  return (
    <div className="panel" style={{ padding: '1rem' }}>
      <Slider label={label} min={0} max={10} value={value} onChange={onChange} />
    </div>
  );
}
