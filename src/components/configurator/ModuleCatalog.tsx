import { MODULE_CATALOG, MODULE_COLORS, VISUAL_SCALE } from '@/data/modulesCatalog';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import { cn } from '@/lib/utils';

export default function ModuleCatalog() {
  const { selectedModuleType, selectedColorId, selectModuleType, setColor, clipCount, addClip, removeClip } = useConfiguratorStore();

  const modulos = MODULE_CATALOG.filter(m => m.category === 'modulo');
  const placas = MODULE_CATALOG.filter(m => m.category === 'placa');
  const clip = MODULE_CATALOG.find(m => m.category === 'conector');

  const currentColor = MODULE_COLORS.find(c => c.id === selectedColorId);

  return (
    <div className="w-72 lg:w-80 border-l border-border bg-background flex flex-col h-full overflow-y-auto">
      {/* Color selector */}
      <div className="p-4 border-b border-border">
        <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Color</h3>
        <div className="flex gap-2">
          {MODULE_COLORS.map(color => (
            <button
              key={color.id}
              onClick={() => setColor(color.id)}
              className={cn(
                'w-8 h-8 rounded-full border-2 transition-all hover:scale-110',
                selectedColorId === color.id ? 'border-foreground scale-110' : 'border-transparent'
              )}
              style={{ background: color.hex }}
              title={color.name}
            />
          ))}
        </div>
        {currentColor && (
          <p className="text-xs text-muted-foreground mt-2 font-mono">{currentColor.name}</p>
        )}
      </div>

      {/* Modules */}
      <div className="p-4 border-b border-border">
        <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Módulos</h3>
        <div className="grid grid-cols-2 gap-2">
          {modulos.map(mod => {
            const isSelected = selectedModuleType?.id === mod.id;
            const previewW = mod.gridW * 28;
            const previewH = mod.gridH * 28;
            return (
              <button
                key={mod.id}
                onClick={() => selectModuleType(isSelected ? null : mod)}
                className={cn(
                  'flex flex-col items-center gap-1 p-2 rounded border transition-all',
                  isSelected
                    ? 'border-foreground bg-accent'
                    : 'border-border hover:border-muted-foreground'
                )}
              >
                {/* Mini preview */}
                <div
                  className="rounded-[1px] flex items-center justify-center"
                  style={{
                    width: `${previewW}px`,
                    height: `${previewH}px`,
                    background: currentColor?.hex || '#888',
                    minHeight: '16px',
                  }}
                >
                  {mod.hasDoor && <div className="w-[60%] h-[80%] border border-white/30 rounded-[1px]" />}
                </div>
                <span className="text-[10px] font-mono text-foreground">{mod.sku}</span>
                <span className="text-[10px] text-muted-foreground">{mod.widthCm}×{mod.heightCm}cm</span>
                <span className="text-[10px] font-medium">{mod.price}€</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Placas */}
      <div className="p-4 border-b border-border">
        <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Placas Base</h3>
        <div className="grid grid-cols-2 gap-2">
          {placas.map(mod => {
            const isSelected = selectedModuleType?.id === mod.id;
            const previewW = mod.gridW * 28;
            return (
              <button
                key={mod.id}
                onClick={() => selectModuleType(isSelected ? null : mod)}
                className={cn(
                  'flex flex-col items-center gap-1 p-2 rounded border transition-all',
                  isSelected
                    ? 'border-foreground bg-accent'
                    : 'border-border hover:border-muted-foreground'
                )}
              >
                <div
                  className="rounded-[1px]"
                  style={{
                    width: `${previewW}px`,
                    height: '6px',
                    background: currentColor?.hex || '#888',
                  }}
                />
                <span className="text-[10px] font-mono text-foreground">{mod.sku}</span>
                <span className="text-[10px] text-muted-foreground">{mod.widthCm}×{mod.heightCm}cm</span>
                <span className="text-[10px] font-medium">{mod.price}€</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clips */}
      {clip && (
        <div className="p-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Conectores</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={removeClip}
              className="w-7 h-7 rounded border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors"
              disabled={clipCount === 0}
            >
              −
            </button>
            <span className="font-mono text-sm min-w-[3ch] text-center">{clipCount}</span>
            <button
              onClick={addClip}
              className="w-7 h-7 rounded border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors"
            >
              +
            </button>
            <span className="text-xs text-muted-foreground ml-auto">{clip.price}€/u</span>
          </div>
        </div>
      )}
    </div>
  );
}
