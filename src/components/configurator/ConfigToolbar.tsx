import { useConfiguratorStore } from '@/stores/configuratorStore';
import { Undo2, Redo2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ConfigToolbar() {
  const { undo, redo, reset, undoStack, redoStack, placedModules, clipCount } = useConfiguratorStore();

  return (
    <div className="h-12 border-t border-border bg-background flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={undo}
          disabled={undoStack.length === 0}
          title="Deshacer"
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={redo}
          disabled={redoStack.length === 0}
          title="Rehacer"
        >
          <Redo2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={reset}
          disabled={placedModules.length === 0 && clipCount === 0}
          title="Limpiar todo"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <div className="text-xs font-mono text-muted-foreground">
        {placedModules.length} módulo{placedModules.length !== 1 ? 's' : ''}
        {clipCount > 0 && ` · ${clipCount} clip${clipCount !== 1 ? 's' : ''}`}
      </div>
    </div>
  );
}
