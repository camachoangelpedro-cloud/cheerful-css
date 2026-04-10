import { useConfiguratorStore } from '@/stores/configuratorStore';
import { Undo2, Redo2, Trash2 } from 'lucide-react';

export default function ConfigToolbar() {
  const { undo, redo, reset, setStep, undoStack, redoStack, placedModules } = useConfiguratorStore();

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

      <button
        onClick={() => setStep(1)}
        className="font-body text-[10px] uppercase tracking-[.12em] text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Editar pared
      </button>
    </div>
  );
}
