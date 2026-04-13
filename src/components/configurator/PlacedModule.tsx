import { NODO_COLORS, NODO_PRODUCTS, VISUAL_SCALE } from '@/data/modulesCatalog';
import type { PlacedModule as PlacedModuleType } from '@/stores/configuratorStore';
import { stackHeight, useConfiguratorStore } from '@/stores/configuratorStore';
import { X } from 'lucide-react';

interface Props {
  module: PlacedModuleType;
}

export default function PlacedModule({ module }: Props) {
  const { selectedId, selectInstance, removeModule } = useConfiguratorStore();
  const product = NODO_PRODUCTS.find(p => p.handle === module.handle);
  if (!product) return null;

  const color = NODO_COLORS.find(c => c.id === module.colorCode);
  const isSelected = selectedId === module.instanceId;

  const w = product.widthCm * VISUAL_SCALE;
  const h = product.heightCm * VISUAL_SCALE;
  const depth = VISUAL_SCALE * 0.6;

  const left = module.xCm * VISUAL_SCALE;
  const bottom = module.yCm * VISUAL_SCALE;

  const baseColor = color?.hex || '#888';

  const variant = product.variants.find(
    v => v.interior === module.interior && v.panel === module.panel && v.color === module.colorCode,
  );

  return (
    <div
      className="absolute cursor-pointer group"
      style={{
        left: `${left}px`,
        bottom: `${bottom}px`,
        width: `${w}px`,
        height: `${h}px`,
        zIndex: Math.round(module.yCm * 10) + Math.round(module.xCm),
      }}
      onClick={(e) => { e.stopPropagation(); selectInstance(module.instanceId); }}
    >
      {/* Top face */}
      <div
        className="absolute w-full"
        style={{
          height: `${depth * 0.5}px`,
          bottom: `${h}px`,
          background: baseColor,
          filter: 'brightness(1.3)',
          transform: 'skewX(-45deg)',
          transformOrigin: 'bottom left',
          borderTop: '1px solid rgba(255,255,255,0.2)',
          borderRight: '1px solid rgba(0,0,0,0.1)',
        }}
      />

      {/* Right face */}
      <div
        className="absolute"
        style={{
          width: `${depth * 0.5}px`,
          height: `${h}px`,
          left: `${w}px`,
          bottom: 0,
          background: baseColor,
          filter: 'brightness(0.7)',
          transform: 'skewY(-45deg)',
          transformOrigin: 'bottom left',
          borderRight: '1px solid rgba(0,0,0,0.2)',
        }}
      />

      {/* Front face */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: baseColor,
          border: isSelected ? '2px solid hsl(var(--foreground))' : '1px solid rgba(0,0,0,0.15)',
          boxShadow: isSelected ? '0 0 0 2px hsl(var(--background))' : 'none',
        }}
      >
        <span className="text-[10px] font-mono text-white/80 mix-blend-difference select-none">
          {variant?.sku ?? product.variants[0]?.sku ?? product.handle}
        </span>

        {/* Door indicator */}
        {module.interior.includes('puerta') && (
          <div className="absolute inset-[3px] border border-white/20 rounded-[1px]">
            <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-3 bg-white/30 rounded-full" />
          </div>
        )}

        {/* Shelf indicator */}
        {module.interior.includes('repisa') && (
          <div
            className="absolute left-[3px] right-[3px]"
            style={{ top: '45%', height: '2px', background: 'rgba(255,255,255,0.25)' }}
          />
        )}
      </div>

      {/* Delete button on selection */}
      {isSelected && (
        <button
          onClick={(e) => { e.stopPropagation(); removeModule(module.instanceId); }}
          className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center z-50 hover:scale-110 transition-transform"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
