import { useConfiguratorStore, isModuleSupported } from '@/stores/configuratorStore';
import { NODO_PRODUCTS } from '@/data/modulesCatalog';
import { Undo2, Redo2, Trash2 } from 'lucide-react';

export default function ConfigToolbar() {
  const { undo, redo, reset, removeFloating, undoStack, redoStack, placedModules } =
    useConfiguratorStore();

  const floatingCount = placedModules.filter(m => {
    const p = NODO_PRODUCTS.find(pp => pp.handle === m.handle);
    if (!p) return false;
    const others = placedModules.filter(mm => mm.instanceId !== m.instanceId);
    return !isModuleSupported(m.xCm, m.yCm, p.widthCm, m.handle, others);
  }).length;

  return (
    <div className="h-11 border-t border-border bg-background flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-1">
        <button
          onClick={undo}
          disabled={undoStack.length === 0}
          title="Deshacer"
          className="w-7 h-7 flex items-center justify-center hover:bg-muted/50 transition-colors disabled:opacity-30"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={redo}
          disabled={redoStack.length === 0}
          title="Rehacer"
          className="w-7 h-7 flex items-center justify-center hover:bg-muted/50 transition-colors disabled:opacity-30"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={reset}
          disabled={placedModules.length === 0}
          title="Limpiar todo"
          className="w-7 h-7 flex items-center justify-center hover:bg-muted/50 transition-colors disabled:opacity-30"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <span className="font-body text-[10px] text-muted-foreground">
        {placedModules.length} módulo{placedModules.length !== 1 ? 's' : ''}
      </span>

      {floatingCount > 0 ? (
        <button
          onClick={removeFloating}
          className="font-body text-[10px] uppercase tracking-[.12em] text-red-500 hover:text-red-700 transition-colors"
        >
          Eliminar flotantes ({floatingCount})
        </button>
      ) : (
        <div className="w-32" />
      )}
    </div>
  );
}
