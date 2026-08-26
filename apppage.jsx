import React, { useState, useCallback, useMemo } from "react";
import { Waves, CircleDot, Zap, Activity } from "lucide-react";
import DoubleSlitSimulator from "./DoubleSlitSimulator";
import ControlSlider from "./ControlSlider";

const DEFAULTS = {
  amplitude: 50,
  wavelength: 80,
  slitSeparation: 120,
  slitWidth: 20,
  electronInfluence: 70,
  collapseThreshold: 60,
};

export default function Home() {
  const [params, setParams] = useState(DEFAULTS);
  const [tension, setTension] = useState(0);
  const [collapseCount, setCollapseCount] = useState(0);
  const [lastCollapse, setLastCollapse] = useState(null);

  const set = useCallback(
    (key) => (v) => setParams((p) => ({ ...p, [key]: v })),
    []
  );

  const reset = useCallback(() => {
    setParams(DEFAULTS);
    setCollapseCount(0);
    setLastCollapse(null);
  }, []);

  const onTension = useCallback((t) => setTension(t), []);
  const onCollapse = useCallback((info) => {
    setCollapseCount((c) => c + 1);
    setLastCollapse({ ...info, time: Date.now() });
  }, []);

  const tensionPct = Math.round(tension * 100);
  const thresholdPct = params.collapseThreshold;
  const ratio = useMemo(
    () => (thresholdPct === 0 ? 0 : tensionPct / thresholdPct),
    [tensionPct, thresholdPct]
  );
  const nearCollapse = ratio > 0.8;

  return (
    <div className="min-h-screen bg-[#05070f] text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight flex items-center gap-2">
            <Waves className="w-5 h-5 text-sky-400" />
            SEFI Double-Slit Waveform & Observed Electron
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            SEFI/DEFI Geometry — interference field, slit geometry, and localized electron observation.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Collapses</span>
            <span className="font-mono font-semibold text-amber-300">
              {collapseCount}
            </span>
          </div>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition text-slate-200"
          >
            Reset
          </button>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 grid lg:grid-cols-[1fr_320px] gap-0">
        {/* Canvas area */}
        <div className="p-4 lg:p-6 flex flex-col gap-4 min-h-0">
          <div className="flex-1 min-h-[360px] lg:min-h-0 rounded-2xl overflow-hidden border border-white/10 bg-[#05070f] relative">
            <DoubleSlitSimulator
              params={params}
              onTension={onTension}
              onCollapse={onCollapse}
            />
            <div className="absolute bottom-3 left-4 text-[11px] text-slate-500 pointer-events-none">
              Drag the electron to observe the field at different positions.
            </div>
          </div>

          {/* Tension meter */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-sky-400" />
                Geometric Tension (Observation)
              </span>
              <span
                className={`text-xs font-mono tabular-nums ${
                  nearCollapse ? "text-red-400" : "text-slate-300"
                }`}
              >
                {tensionPct}% / threshold {thresholdPct}%
              </span>
            </div>
            <div className="relative h-2.5 rounded-full bg-slate-800/80 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-100"
                style={{
                  width: `${Math.min(100, tensionPct)}%`,
                  background: `linear-gradient(90deg, hsl(200 85% 55%), hsl(${lerp(
                    200,
                    0,
                    Math.min(1, ratio)
                  )} 90% 55%))`,
                }}
              />
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white/70"
                style={{ left: `${thresholdPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
              <span>
                {lastCollapse
                  ? `Last collapse at ${Math.round(
                      lastCollapse.tension * 100
                    )}% tension`
                  : "No collapse yet"}
              </span>
              <span
                className={nearCollapse ? "text-red-400 animate-pulse" : ""}
              >
                {nearCollapse ? "near collapse" : "stable"}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <aside className="border-t lg:border-t-0 lg:border-l border-white/5 bg-white/[0.02] p-5 space-y-5 overflow-y-auto">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5" /> Waveform (SEFI Field)
            </h2>
            <div className="space-y-4">
              <ControlSlider
                label="Amplitude"
                value={params.amplitude}
                min={10}
                max={120}
                onChange={set("amplitude")}
                accent="#38bdf8"
              />
              <ControlSlider
                label="Wavelength"
                value={params.wavelength}
                min={40}
                max={200}
                onChange={set("wavelength")}
                accent="#38bdf8"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <CircleDot className="w-3.5 h-3.5" /> Slit Geometry
            </h2>
            <div className="space-y-4">
              <ControlSlider
                label="Slit Separation"
                value={params.slitSeparation}
                min={60}
                max={220}
                onChange={set("slitSeparation")}
                accent="#f59e0b"
              />
              <ControlSlider
                label="Slit Width"
                value={params.slitWidth}
                min={10}
                max={60}
                onChange={set("slitWidth")}
                accent="#f59e0b"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <CircleDot className="w-3.5 h-3.5" /> Observed Electron (DEFI)
            </h2>
            <div className="space-y-4">
              <ControlSlider
                label="Electron Influence"
                value={params.electronInfluence}
                min={0}
                max={150}
                onChange={set("electronInfluence")}
                accent="#f97316"
              />
              <ControlSlider
                label="Collapse Threshold"
                value={params.collapseThreshold}
                min={10}
                max={95}
                onChange={set("collapseThreshold")}
                accent="#ef4444"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              SEFI / DEFI — Double Slit
            </h3>
            <p className="text-[11px] leading-relaxed text-slate-400">
              The SEFI field is rendered as an interference pattern generated by two slits.
              The observed electron is a localized DEFI entity that samples and distorts the field
              at its position. As the electron approaches regions of high curvature, geometric
              tension rises; once tension exceeds the collapse threshold, the field snaps into a
              new stable configuration, giving a geometric interpretation of observation in the
              double‑slit context.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}
