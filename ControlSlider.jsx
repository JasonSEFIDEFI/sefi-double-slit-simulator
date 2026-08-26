import React from "react";

export default function ControlSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  accent,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-slate-300">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: accent }}
      />
      <span className="text-[11px] text-slate-500">{value}</span>
    </div>
  );
}
