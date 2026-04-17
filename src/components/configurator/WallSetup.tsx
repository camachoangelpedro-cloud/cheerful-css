import { useState } from 'react';
import { useConfiguratorStore } from '@/stores/configuratorStore';

const WIDTH_PRESETS  = [144, 180, 216, 252, 288, 324, 360];
const HEIGHT_PRESETS = [180, 210, 240];

const PREV_MAX_W = 320;
const PREV_MAX_H = 240;

export default function WallSetup() {
  const setWall = useConfiguratorStore(s => s.setWall);

  const [widthCm,       setWidthCm]       = useState(216);
  const [heightCm,      setHeightCm]      = useState(240);
  const [hasWindow,     setHasWindow]     = useState(false);
  const [windowXCm,     setWindowXCm]     = useState(63);
  const [windowYCm,     setWindowYCm]     = useState(90);
  const [windowWidthCm, setWindowWidthCm] = useState(90);
  const [windowHeightCm,setWindowHeightCm]= useState(108);

  /* Preview scale */
  const sc = Math.min(PREV_MAX_W / widthCm, PREV_MAX_H / heightCm);
  const pW = Math.round(widthCm  * sc);
  const pH = Math.round(heightCm * sc);

  const handleConfirm = () => {
    setWall({
      widthCm,
      heightCm,
      hasWindow,
      windowXCm:      Math.max(0, Math.min(windowXCm,      widthCm  - windowWidthCm)),
      windowYCm:      Math.max(0, Math.min(windowYCm,      heightCm - windowHeightCm)),
      windowWidthCm:  Math.min(windowWidthCm,  widthCm),
      windowHeightCm: Math.min(windowHeightCm, heightCm),
    });
  };

  const PresetBtn = ({
    value, current, setter
  }: { value: number; current: number; setter: (v: number) => void }) => (
    <button
      onClick={() => setter(value)}
      className={`font-body text-[10px] px-2.5 py-1 border rounded-lg transition-colors
        ${current === value
          ? 'bg-[#1C1C1A] text-white border-[#1C1C1A]'
          : 'border-border hover:border-foreground/40'}`}
    >
      {value}
    </button>
  );

  const NumInput = ({
    value, setter, min, max, step
  }: { value: number; setter: (v: number) => void; min: number; max: number; step: number }) => (
    <input
      type="number" value={value} min={min} max={max} step={step}
      onChange={e => setter(Math.max(min, Number(e.target.value)))}
      className="font-body text-sm border border-border rounded-lg px-3 py-1.5 w-full focus:outline-none focus:border-foreground/60 bg-transparent"
    />
  );

  return (
    <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-4xl w-full items-start">

        {/* ── Live preview ──────────────────────────────── */}
        <div className="flex flex-col items-center gap-3">
          <p className="font-body text-[10px] tracking-wide text-muted-foreground">Vista previa</p>

          <svg width={pW} height={pH} className="border border-border/50 shadow-sm">
            {/* Wall */}
            <rect width={pW} height={pH} fill="#EDE9E1" />

            {/* Grid — vertical every 36 cm */}
            {Array.from({ length: Math.floor(widthCm / 36) + 1 }).map((_, i) => (
              <line key={`v${i}`}
                x1={i * 36 * sc} y1={0}
                x2={i * 36 * sc} y2={pH}
                stroke="rgba(0,0,0,0.07)" strokeWidth={0.5}
              />
            ))}
            {/* Grid — horizontal every 36 cm */}
            {Array.from({ length: Math.floor(heightCm / 36) + 1 }).map((_, i) => (
              <line key={`h${i}`}
                x1={0} y1={pH - i * 36 * sc}
                x2={pW} y2={pH - i * 36 * sc}
                stroke="rgba(0,0,0,0.07)" strokeWidth={0.5}
              />
            ))}

            {/* Window */}
            {hasWindow && (
              <rect
                x={windowXCm * sc}
                y={pH - (windowYCm + windowHeightCm) * sc}
                width={windowWidthCm  * sc}
                height={windowHeightCm * sc}
                fill="rgba(184,212,232,0.55)"
                stroke="rgba(100,160,200,0.7)"
                strokeWidth={1}
              />
            )}

            {/* Floor line */}
            <line x1={0} y1={pH - 0.5} x2={pW} y2={pH - 0.5} stroke="rgba(0,0,0,0.18)" strokeWidth={1} />

            {/* Dimension labels */}
            <text x={pW / 2} y={pH + 13} textAnchor="middle" fontSize={9}
              fill="rgba(0,0,0,0.45)" fontFamily="'PP Neue Montreal',sans-serif">
              {widthCm} cm
            </text>
            <text
              x={-6} y={pH / 2}
              textAnchor="middle" fontSize={9}
              fill="rgba(0,0,0,0.45)" fontFamily="'PP Neue Montreal',sans-serif"
              transform={`rotate(-90,-6,${pH / 2})`}
            >
              {heightCm} cm
            </text>
          </svg>
        </div>

        {/* ── Controls ──────────────────────────────────── */}
        <div className="space-y-7">
          <div>
            <h1 className="font-display font-light text-3xl mb-1">Define tu pared</h1>
            <p className="font-body text-sm text-muted-foreground">
              Establece el espacio donde irán tus módulos NODO.
            </p>
          </div>

          {/* Width */}
          <div>
            <p className="font-body text-[10px] tracking-wide text-muted-foreground mb-2">
              Ancho — {widthCm} cm
            </p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {WIDTH_PRESETS.map(p => (
                <PresetBtn key={p} value={p} current={widthCm} setter={setWidthCm} />
              ))}
            </div>
            <NumInput value={widthCm} setter={setWidthCm} min={72} max={600} step={36} />
          </div>

          {/* Height */}
          <div>
            <p className="font-body text-[10px] tracking-wide text-muted-foreground mb-2">
              Alto — {heightCm} cm
            </p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {HEIGHT_PRESETS.map(p => (
                <PresetBtn key={p} value={p} current={heightCm} setter={setHeightCm} />
              ))}
            </div>
            <NumInput value={heightCm} setter={setHeightCm} min={100} max={400} step={18} />
          </div>

          {/* Window */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer mb-3">
              <input
                type="checkbox" checked={hasWindow}
                onChange={e => setHasWindow(e.target.checked)}
                className="w-4 h-4 accent-[#1C1C1A]"
              />
              <span className="font-body text-[10px] tracking-wide font-medium">
                Añadir ventana
              </span>
            </label>

            {hasWindow && (
              <div className="pl-7 grid grid-cols-2 gap-3">
                {([
                  ['Posición X',       windowXCm,      setWindowXCm,      0, widthCm],
                  ['Ancho',            windowWidthCm,  setWindowWidthCm,  18, widthCm],
                  ['Altura desde suelo', windowYCm,    setWindowYCm,      0, heightCm],
                  ['Alto ventana',     windowHeightCm, setWindowHeightCm, 18, heightCm],
                ] as [string, number, (v: number) => void, number, number][]).map(
                  ([label, val, setter, min, max]) => (
                    <div key={label}>
                      <p className="font-body text-[9px] text-muted-foreground mb-1">{label} (cm)</p>
                      <input
                        type="number" value={val} min={min} max={max} step={1}
                        onChange={e => setter(Number(e.target.value))}
                        className="font-body text-sm border border-border rounded-lg px-2 py-1 w-full focus:outline-none focus:border-foreground/60 bg-transparent"
                      />
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleConfirm}
            disabled={widthCm < 72 || heightCm < 100}
            className="w-full rounded-lg bg-[#1C1C1A] text-white px-8 py-3.5 font-body text-sm tracking-wide font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            Empezar a diseñar →
          </button>
        </div>
      </div>
    </div>
  );
}
