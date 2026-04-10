import { X, Trash2 } from 'lucide-react';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import { NODO_PRODUCTS, NODO_COLORS } from '@/data/modulesCatalog';

const SINGLE_DOOR_HANDLES = ['modulo-36-36', 'modulo-36-72'];

export default function ModuleEditPanel() {
  const { selectedId, placedModules, selectInstance, updateModule, removeModule } =
    useConfiguratorStore();

  if (!selectedId) return null;

  const mod = placedModules.find(m => m.instanceId === selectedId);
  if (!mod) return null;

  const product = NODO_PRODUCTS.find(p => p.handle === mod.handle);
  if (!product) return null;

  /* Derive available options from this product's variants */
  const uniqueInteriors = [...new Set(
    product.variants.map(v => v.interior).filter(Boolean),
  )];
  const uniquePanels = [...new Set(
    product.variants.map(v => v.panel).filter(Boolean),
  )];
  const hasDoor = mod.interior === 'Con puerta' || mod.interior === 'Con puerta y repisa';
  const hasTirador = SINGLE_DOOR_HANDLES.includes(mod.handle) && hasDoor;

  /* Validate a combination has a variant */
  const isValidCombination = (interior: string, panel: string) =>
    product.variants.some(v => v.interior === interior && v.panel === panel);

  const handleInterior = (interior: string) => {
    /* Doors require Con panel */
    const needsPanel = interior.includes('puerta');
    const panel = needsPanel ? 'Con panel' : mod.panel;
    if (!isValidCombination(interior, panel)) return;
    updateModule(selectedId, { interior, panel });
  };

  const handlePanel = (panel: string) => {
    if (!isValidCombination(mod.interior, panel)) return;
    updateModule(selectedId, { panel });
  };

  const handleColor = (colorCode: string) => {
    updateModule(selectedId, { colorCode });
  };

  const handleApertura = (apertura: string) => {
    updateModule(selectedId, { apertura });
  };

  return (
    <div className="absolute top-4 left-4 z-10 bg-background border border-border shadow-sm w-56 pointer-events-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
        <span className="font-body text-[10px] uppercase tracking-[.12em] font-medium text-foreground">
          {product.title}
        </span>
        <button
          onClick={() => selectInstance(null)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3 flex flex-col gap-3">
        {/* Color */}
        <div>
          <p className="font-body text-[9px] uppercase tracking-[.10em] text-muted-foreground mb-1.5">
            Color
          </p>
          <div className="flex gap-1.5">
            {NODO_COLORS.map(c => (
              <button
                key={c.id}
                onClick={() => handleColor(c.id)}
                title={c.name}
                className="w-6 h-6 transition-transform hover:scale-110"
                style={{
                  background: c.hex,
                  border: mod.colorCode === c.id
                    ? '2px solid #1A2B3C'
                    : '1.5px solid rgba(0,0,0,0.15)',
                  outline: mod.colorCode === c.id ? '2px solid rgba(26,43,60,0.18)' : 'none',
                  outlineOffset: '1px',
                }}
              />
            ))}
          </div>
        </div>

        {/* Interior */}
        {uniqueInteriors.length > 1 && (
          <div>
            <p className="font-body text-[9px] uppercase tracking-[.10em] text-muted-foreground mb-1.5">
              Interior
            </p>
            <div className="flex flex-col gap-1">
              {uniqueInteriors.map(interior => (
                <button
                  key={interior}
                  onClick={() => handleInterior(interior)}
                  className={`text-left font-body text-[9px] px-2 py-1 border transition-colors
                    ${mod.interior === interior
                      ? 'border-[#1A2B3C] bg-[#1A2B3C]/5 text-foreground'
                      : 'border-border text-muted-foreground hover:border-foreground/40'}`}
                >
                  {interior || 'Sin interior'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Panel */}
        {uniquePanels.length > 1 && (
          <div>
            <p className="font-body text-[9px] uppercase tracking-[.10em] text-muted-foreground mb-1.5">
              Panel trasero
            </p>
            <div className="flex gap-1.5">
              {uniquePanels.map(panel => (
                <button
                  key={panel}
                  onClick={() => handlePanel(panel)}
                  disabled={!isValidCombination(mod.interior, panel)}
                  className={`flex-1 font-body text-[9px] px-2 py-1 border transition-colors disabled:opacity-30
                    ${mod.panel === panel
                      ? 'border-[#1A2B3C] bg-[#1A2B3C]/5 text-foreground'
                      : 'border-border text-muted-foreground hover:border-foreground/40'}`}
                >
                  {panel === 'Con panel' ? 'Con' : 'Sin'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Apertura */}
        {hasTirador && (
          <div>
            <p className="font-body text-[9px] uppercase tracking-[.10em] text-muted-foreground mb-1.5">
              Apertura
            </p>
            <div className="flex gap-1.5">
              {(['IZQ', 'DER'] as const).map(ap => (
                <button
                  key={ap}
                  onClick={() => handleApertura(ap)}
                  className={`flex-1 font-body text-[9px] px-2 py-1 border transition-colors
                    ${mod.apertura === ap
                      ? 'border-[#1A2B3C] bg-[#1A2B3C]/5 text-foreground'
                      : 'border-border text-muted-foreground hover:border-foreground/40'}`}
                >
                  {ap}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Delete */}
        <button
          onClick={() => { removeModule(selectedId); selectInstance(null); }}
          className="flex items-center gap-1.5 font-body text-[9px] uppercase tracking-[.10em] text-red-500 hover:text-red-700 transition-colors mt-1"
        >
          <Trash2 className="w-3 h-3" />
          Eliminar módulo
        </button>
      </div>
    </div>
  );
}
