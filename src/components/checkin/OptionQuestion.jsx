export default function OptionQuestion({ question, options, value, onChange }) {
  return (
    <div className="panel" style={{ display: 'grid', gap: '1rem' }}>
      <h3 style={{ margin: 0 }}>{question}</h3>
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {options.map((option) => (
          <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#486057' }}>
            <input
              type="radio"
              name={question}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}
