import { ReactNode } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import { NODO_PRODUCTS, NODO_COLORS } from '@/data/modulesCatalog';

/* Single-door handles — the ones that have a tirador (handle) direction */
const SINGLE_DOOR_HANDLES = ['modulo-36-36', 'modulo-36-72', 'modulo-h-36-36'];
/* Handles that have AP (pasacables) GLB variants */
const PASACABLES_HANDLES  = ['modulo-36-36', 'modulo-36-72', 'modulo-72-36', 'modulo-72-72', 'modulo-h-36-36', 'modulo-h-72-24'];

/* SVG icons — matching redesigned PDP icons */
const PanelConSvg = () => (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
    <rect x="3" y="3" width="34" height="34" rx="2.5" />
    <rect x="9" y="9" width="22" height="22" rx="1.5" fill="currentColor" fillOpacity=".1" strokeWidth="1" />
  </svg>
);
const PanelSinSvg = () => (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
    <rect x="3" y="3" width="34" height="34" rx="2.5" />
    <line x1="12" y1="12" x2="28" y2="28" strokeWidth="1" opacity=".25" />
    <line x1="28" y1="12" x2="12" y2="28" strokeWidth="1" opacity=".25" />
  </svg>
);
const InteriorAbiertoSvg = () => (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
    <rect x="3" y="3" width="34" height="34" rx="2.5" />
  </svg>
);
const InteriorRepisaSvg = () => (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
    <rect x="3" y="3" width="34" height="34" rx="2.5" />
    <line x1="8" y1="20" x2="32" y2="20" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const InteriorPuertaSvg = ({ isSingle, handleLeft }: { isSingle: boolean; handleLeft: boolean }) => {
  const hx = handleLeft ? 13 : 27;
  return isSingle ? (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
      <rect x="3" y="3" width="34" height="34" rx="2.5" />
      <rect x="7" y="7" width="26" height="26" rx="1" fill="currentColor" fillOpacity=".08" strokeWidth="1" />
      <line x1={hx} y1="16" x2={hx} y2="24" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
      <rect x="3" y="3" width="34" height="34" rx="2.5" />
      <rect x="7" y="7" width="11.5" height="26" rx="1" fill="currentColor" fillOpacity=".08" strokeWidth="1" />
      <rect x="21.5" y="7" width="11.5" height="26" rx="1" fill="currentColor" fillOpacity=".08" strokeWidth="1" />
      <line x1="20" y1="7" x2="20" y2="33" strokeWidth="1" opacity=".2" />
      <line x1="15" y1="16" x2="15" y2="24" strokeWidth="2" strokeLinecap="round" />
      <line x1="25" y1="16" x2="25" y2="24" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};
const InteriorPuertaRepisaSvg = ({ isSingle, handleLeft }: { isSingle: boolean; handleLeft: boolean }) => {
  const hx = handleLeft ? 13 : 27;
  return isSingle ? (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
      <rect x="3" y="3" width="34" height="34" rx="2.5" />
      <rect x="7" y="7" width="26" height="26" rx="1" fill="currentColor" fillOpacity=".08" strokeWidth="1" />
      <line x1="8" y1="20" x2="32" y2="20" strokeWidth="1.5" strokeLinecap="round" opacity=".5" />
      <line x1={hx} y1="10" x2={hx} y2="17" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
      <rect x="3" y="3" width="34" height="34" rx="2.5" />
      <rect x="7" y="7" width="11.5" height="26" rx="1" fill="currentColor" fillOpacity=".08" strokeWidth="1" />
      <rect x="21.5" y="7" width="11.5" height="26" rx="1" fill="currentColor" fillOpacity=".08" strokeWidth="1" />
      <line x1="20" y1="7" x2="20" y2="33" strokeWidth="1" opacity=".2" />
      <line x1="8" y1="20" x2="32" y2="20" strokeWidth="1.5" strokeLinecap="round" opacity=".5" />
      <line x1="15" y1="10" x2="15" y2="17" strokeWidth="2" strokeLinecap="round" />
      <line x1="25" y1="10" x2="25" y2="17" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};
const PasacablesOnSvg = () => (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
    <rect x="3" y="3" width="34" height="34" rx="2.5" />
    <circle cx="20" cy="27" r="3.5" strokeWidth="1.5" />
    <line x1="20" y1="8" x2="20" y2="23" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
  </svg>
);
const PasacablesOffSvg = () => (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
    <rect x="3" y="3" width="34" height="34" rx="2.5" />
    <line x1="12" y1="12" x2="28" y2="28" strokeWidth="1" opacity=".25" />
    <line x1="28" y1="12" x2="12" y2="28" strokeWidth="1" opacity=".25" />
  </svg>
);

interface OptionBtnProps {
  active: boolean;
  locked?: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}
function OptionBtn({ active, locked, icon, label, onClick }: OptionBtnProps) {
  return (
    <button
      onClick={locked ? undefined : onClick}
      className={`configurator-option-btn flex flex-col items-center gap-2 p-3 min-w-[72px] flex-1 max-w-[90px] border cursor-pointer transition-all duration-150
        ${active  ? 'border-[#1C1C1A] bg-[#F2EDE4]' : 'border-border hover:border-foreground/40'}
        ${locked  ? 'opacity-30 pointer-events-none' : ''}`}
    >
      <div className="w-10 h-10 shrink-0 text-foreground">{icon}</div>
      <span style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.3, marginTop: '3px', color: active ? '#1C1C1A' : '#9E9E9C' }}>{label}</span>
    </button>
  );
}

export default function ModuleEditPanel() {
  const { selectedId, placedModules, selectInstance, updateModule, removeModule } =
    useConfiguratorStore();

  if (!selectedId) return null;
  const mod = placedModules.find(m => m.instanceId === selectedId);
  if (!mod) return null;
  const product = NODO_PRODUCTS.find(p => p.handle === mod.handle);
  if (!product) return null;

  /* Derived state */
  const hasPanelOption    = product.variants.some(v => v.panel === 'Sin panel');
  const doorLocked        = mod.panel === 'Sin panel';
  const uniqueInteriors   = [...new Set(product.variants.map(v => v.interior).filter(Boolean))];
  const isSingleDoor      = SINGLE_DOOR_HANDLES.includes(mod.handle);
  const hasDoor           = mod.interior === 'Con puerta' || mod.interior === 'Con puerta y repisa';
  const showTirador       = isSingleDoor && hasDoor && !doorLocked;
  const handleLeft        = mod.apertura === 'IZQ';
  const showPasacables    = PASACABLES_HANDLES.includes(mod.handle) && mod.panel === 'Con panel';

  /* Handlers */
  const handlePanel = (panel: string) => {
    if (panel === 'Sin panel') {
      /* Lock interior to Abierto when removing panel — mirrors product page */
      updateModule(selectedId, { panel, interior: 'Abierto', apertura: '' });
    } else {
      updateModule(selectedId, { panel });
    }
  };

  const handleInterior = (interior: string) => {
    const needsPanel = interior.includes('puerta');
    /* Doors require Con panel */
    const panel = needsPanel ? 'Con panel' : mod.panel;
    /* Reset apertura if moving away from single-door */
    const apertura = isSingleDoor && (interior === 'Con puerta' || interior === 'Con puerta y repisa')
      ? (mod.apertura || 'DER')
      : '';
    updateModule(selectedId, { interior, panel, apertura });
  };

  const handleApertura   = (apertura: string)   => updateModule(selectedId, { apertura });
  const handleColor      = (colorCode: string)  => updateModule(selectedId, { colorCode });
  const handlePasacables = (val: boolean)       => updateModule(selectedId, { pasacables: val });

  return (
    <div className="absolute top-4 left-4 z-10 bg-background border border-border shadow-sm rounded-lg w-52 pointer-events-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="font-body text-[9px] tracking-wide font-medium">
          {product.title}
        </span>
        <button onClick={() => selectInstance(null)} className="text-muted-foreground hover:text-foreground">
          <X className="w-3 h-3" />
        </button>
      </div>

      <div className="p-3 flex flex-col gap-3">

        {/* Color */}
        <div>
          <p className="font-body text-[8px] tracking-wide text-muted-foreground mb-1.5">Color</p>
          <div className="flex gap-1.5">
            {NODO_COLORS.map(c => (
              <button
                key={c.id}
                onClick={() => handleColor(c.id)}
                title={c.name}
                className={`w-5 h-5 rounded-full transition-transform
                  ${mod.colorCode === c.id
                    ? 'ring-2 ring-offset-2 ring-foreground scale-110'
                    : 'hover:scale-105'}`}
                style={{
                  background: c.hex,
                  border: '1.5px solid rgba(28,28,26,0.18)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Step 1 — Panel trasero (same as product page step 1) */}
        {hasPanelOption && (
          <div>
            <p className="font-body text-[8px] tracking-wide text-muted-foreground mb-1.5">
              1 · Panel trasero
            </p>
            <div className="flex gap-1.5">
              <OptionBtn
                active={mod.panel === 'Con panel'}
                icon={<PanelConSvg />}
                label="Con panel"
                onClick={() => handlePanel('Con panel')}
              />
              <OptionBtn
                active={mod.panel === 'Sin panel'}
                icon={<PanelSinSvg />}
                label="Sin panel"
                onClick={() => handlePanel('Sin panel')}
              />
            </div>
          </div>
        )}

        {/* Step 2 — Interior (only for products with multiple interiors) */}
        {uniqueInteriors.length > 1 && (
          <div>
            <p className="font-body text-[8px] tracking-wide text-muted-foreground mb-1.5">
              2 · Interior
            </p>
            <div className="flex gap-1 flex-wrap">
              {uniqueInteriors.includes('Abierto') && (
                <OptionBtn
                  active={mod.interior === 'Abierto'}
                  icon={<InteriorAbiertoSvg />}
                  label="Abierto"
                  onClick={() => handleInterior('Abierto')}
                />
              )}
              {uniqueInteriors.includes('Con repisa') && (
                <OptionBtn
                  active={mod.interior === 'Con repisa'}
                  icon={<InteriorRepisaSvg />}
                  label="Repisa"
                  onClick={() => handleInterior('Con repisa')}
                />
              )}
              {uniqueInteriors.includes('Con puerta') && (
                <OptionBtn
                  active={mod.interior === 'Con puerta'}
                  locked={doorLocked}
                  icon={<InteriorPuertaSvg isSingle={isSingleDoor} handleLeft={handleLeft} />}
                  label="Puerta"
                  onClick={() => handleInterior('Con puerta')}
                />
              )}
              {uniqueInteriors.includes('Con puerta y repisa') && (
                <OptionBtn
                  active={mod.interior === 'Con puerta y repisa'}
                  locked={doorLocked}
                  icon={<InteriorPuertaRepisaSvg isSingle={isSingleDoor} handleLeft={handleLeft} />}
                  label="Puerta+rep."
                  onClick={() => handleInterior('Con puerta y repisa')}
                />
              )}
            </div>
          </div>
        )}

        {/* Tirador — sub-step, only for single-door handles with door interior */}
        {showTirador && (
          <div>
            <p className="font-body text-[8px] tracking-wide text-muted-foreground mb-1.5">
              Tirador
            </p>
            <div className="flex gap-1.5">
              {(['DER', 'IZQ'] as const).map(ap => (
                <button
                  key={ap}
                  onClick={() => handleApertura(ap)}
                  className={`flex-1 font-body text-[8px] tracking-wide px-2 py-1.5 border rounded-lg transition-colors
                    ${mod.apertura === ap
                      ? 'border-[#1C1C1A] bg-[#1C1C1A] text-white'
                      : 'border-border text-foreground hover:border-foreground/60'}`}
                >
                  {ap === 'DER' ? 'Derecha' : 'Izquierda'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pasacables */}
        {showPasacables && (
          <div>
            <p className="font-body text-[8px] tracking-wide text-muted-foreground mb-1.5">
              Pasacables
            </p>
            <div className="flex gap-1.5">
              <OptionBtn
                active={!mod.pasacables}
                icon={<PasacablesOffSvg />}
                label="Sin orificio"
                onClick={() => handlePasacables(false)}
              />
              <OptionBtn
                active={mod.pasacables}
                icon={<PasacablesOnSvg />}
                label="Con orificio"
                onClick={() => handlePasacables(true)}
              />
            </div>
          </div>
        )}

        {/* Delete */}
        <button
          onClick={() => { removeModule(selectedId); selectInstance(null); }}
          className="flex items-center gap-1.5 font-body text-[8px] tracking-wide text-red-500 hover:text-red-700 transition-colors pt-1 border-t border-border"
        >
          <Trash2 className="w-3 h-3" />
          Eliminar módulo
        </button>

      </div>
    </div>
  );
}
