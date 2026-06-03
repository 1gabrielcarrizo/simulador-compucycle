function RangeSlider({ label, value, onChange, min, max, step = 1, unit, disabled }) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-baseline mb-2">
        <label className="text-sm text-slate-400">{label}</label>
        <span className="text-sm font-semibold text-accent">
          {typeof value === 'number' ? value.toFixed(step < 1 ? 1 : 0) : value}
          {unit && <span className="text-slate-500 font-normal ml-1">{unit}</span>}
        </span>
      </div>
      <div className="relative h-6 flex items-center">
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-slate-700" />
        <div
          className="absolute left-0 h-1.5 rounded-full bg-accent"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="slider-track relative z-10 bg-transparent"
          style={{
            background: `linear-gradient(to right, #10b981 0%, #10b981 ${pct}%, transparent ${pct}%)`,
          }}
        />
      </div>
    </div>
  );
}

export default RangeSlider;
