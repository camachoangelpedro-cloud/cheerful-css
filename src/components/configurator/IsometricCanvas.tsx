import { useRef, useCallback } from 'react';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import { VISUAL_SCALE } from '@/data/modulesCatalog';
import PlacedModule from './PlacedModule';

const GRID_COLS = 8;
const GRID_ROWS = 6;

export default function IsometricCanvas() {
  const { placedModules, selectedModuleType, placeModule, selectInstance } = useConfiguratorStore();
  const canvasRef = useRef<HTMLDivElement>(null);

  // Calculate the next available Y for a given gridX column range
  const getStackY = useCallback((gridX: number, gridW: number) => {
    let maxTop = 0;
    placedModules.forEach(m => {
      const mLeft = m.gridX;
      const mRight = m.gridX + m.moduleType.gridW;
      const newLeft = gridX;
      const newRight = gridX + gridW;
      // Check horizontal overlap
      if (newLeft < mRight && newRight > mLeft) {
        const top = m.gridY + m.moduleType.gridH;
        if (top > maxTop) maxTop = top;
      }
    });
    return maxTop;
  }, [placedModules]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (!selectedModuleType || selectedModuleType.category === 'conector') return;
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    // Snap to grid column
    let gridX = Math.round(x / VISUAL_SCALE);
    // Clamp so module stays in bounds
    gridX = Math.max(0, Math.min(gridX, GRID_COLS - selectedModuleType.gridW));
    const gridY = getStackY(gridX, selectedModuleType.gridW);

    placeModule(gridX, gridY);
  }, [selectedModuleType, placeModule, getStackY]);

  const canvasW = GRID_COLS * VISUAL_SCALE;
  const canvasH = GRID_ROWS * VISUAL_SCALE;

  return (
    <div className="flex-1 flex items-center justify-center overflow-auto p-4 bg-muted/30">
      <div
        className="relative"
        style={{
          width: `${canvasW + VISUAL_SCALE}px`,
          minHeight: `${canvasH + VISUAL_SCALE * 2}px`,
          perspective: '800px',
        }}
      >
        {/* Isometric wrapper */}
        <div
          ref={canvasRef}
          className="relative cursor-crosshair"
          style={{
            width: `${canvasW}px`,
            minHeight: `${canvasH}px`,
            transformStyle: 'preserve-3d',
          }}
          onClick={handleCanvasClick}
        >
          {/* Grid lines */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={canvasW}
            height={canvasH}
            style={{ opacity: 0.15 }}
          >
            {Array.from({ length: GRID_COLS + 1 }).map((_, i) => (
              <line
                key={`v${i}`}
                x1={i * VISUAL_SCALE} y1={0}
                x2={i * VISUAL_SCALE} y2={canvasH}
                stroke="hsl(var(--foreground))"
                strokeWidth={1}
              />
            ))}
            {Array.from({ length: GRID_ROWS + 1 }).map((_, i) => (
              <line
                key={`h${i}`}
                x1={0} y1={i * VISUAL_SCALE}
                x2={canvasW} y2={i * VISUAL_SCALE}
                stroke="hsl(var(--foreground))"
                strokeWidth={1}
              />
            ))}
          </svg>

          {/* Ground plane */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{ height: '2px', background: 'hsl(var(--border))' }}
          />

          {/* Placed modules (rendered bottom-up) */}
          {placedModules.map(m => (
            <PlacedModule key={m.instanceId} module={m} />
          ))}

          {/* Hint */}
          {placedModules.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-muted-foreground text-sm font-body">
                Selecciona un módulo y haz clic aquí para colocarlo
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
