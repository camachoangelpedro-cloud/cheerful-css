import { useState } from 'react';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import { NODO_PRODUCTS, NODO_COLORS, getStartingPrice, PX_PER_CM } from '@/data/modulesCatalog';
import { ChevronDown, ChevronRight } from 'lucide-react';

const COP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

const PREVIEW_SCALE = 0.5; // px per cm for card previews

export default function ModuleCatalog() {
  const { selectedColorCode, setDragHandle, setColorCode } = useConfiguratorStore();
  const [modOpen, setModOpen] = useState(true);
  const [pltOpen, setPltOpen] = useState(true);

  const modulos = NODO_PRODUCTS.filter(p => p.family === 'MOD');
  const placas  = NODO_PRODUCTS.filter(p => p.family === 'PLT');

  const currentColor = NODO_COLORS.find(c => c.id === selectedColorCode) ?? NODO_COLORS[0];

  const ProductCard = ({ product }: { product: typeof NODO_PRODUCTS[number] }) => {
    const previewW = Math.max(product.widthCm  * PREVIEW_SCALE, 32);
    const previewH = Math.max(product.heightCm * PREVIEW_SCALE, 8);
    return (
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', product.handle);
          e.dataTransfer.effectAllowed = 'copy';
          setDragHandle(product.handle);
        }}
        onDragEnd={() => setDragHandle(null)}
        className="flex flex-col items-center gap-1.5 p-2.5 border border-border hover:border-foreground/40 cursor-grab active:cursor-grabbing select-none transition-colors"
      >
        {/* Color swatch preview */}
        <div
          style={{
            width:  `${previewW}px`,
            height: `${previewH}px`,
            background: currentColor.hex,
            border: '1px solid rgba(0,0,0,0.10)',
          }}
        />
        <span className="font-body text-[9px] uppercase tracking-[.08em] text-foreground/80 text-center leading-tight">
          {product.title}
        </span>
        <span className="font-body text-[9px] text-muted-foreground">
          {product.widthCm}×{product.heightCm} cm
        </span>
        <span className="font-body text-[9px] font-medium text-foreground">
          desde {COP(getStartingPrice(product))}
        </span>
      </div>
    );
  };

  const SectionHeader = ({
    label, open, toggle
  }: { label: string; open: boolean; toggle: () => void }) => (
    <button
      onClick={toggle}
      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/30 transition-colors"
    >
      <span className="font-body text-[10px] uppercase tracking-[.12em] font-medium text-foreground">
        {label}
      </span>
      {open
        ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
      }
    </button>
  );

  return (
    <div className="w-64 border-l border-border bg-background flex flex-col h-full overflow-y-auto shrink-0">

      {/* Color selector */}
      <div className="p-4 border-b border-border shrink-0">
        <p className="font-body text-[10px] uppercase tracking-[.12em] text-muted-foreground mb-2.5">Color</p>
        <div className="flex gap-2 mb-1.5">
          {NODO_COLORS.map(color => (
            <button
              key={color.id}
              onClick={() => setColorCode(color.id)}
              className="w-7 h-7 transition-transform hover:scale-110"
              style={{
                background: color.hex,
                border: selectedColorCode === color.id
                  ? '2px solid #1A2B3C'
                  : '1.5px solid rgba(0,0,0,0.15)',
                outline: selectedColorCode === color.id ? '2px solid rgba(26,43,60,0.18)' : 'none',
                outlineOffset: '1px',
              }}
              title={color.name}
            />
          ))}
        </div>
        <p className="font-body text-[9px] text-muted-foreground">{currentColor.name}</p>
      </div>

      {/* Drag hint */}
      <div className="px-4 py-2 border-b border-border shrink-0">
        <p className="font-body text-[9px] text-muted-foreground/60 leading-tight">
          Arrastra un módulo al canvas para colocarlo
        </p>
      </div>

      {/* Módulos section */}
      <div className="border-b border-border">
        <SectionHeader label="Módulos" open={modOpen} toggle={() => setModOpen(v => !v)} />
        {modOpen && (
          <div className="grid grid-cols-2 gap-1.5 px-3 pb-3">
            {modulos.map(p => <ProductCard key={p.handle} product={p} />)}
          </div>
        )}
      </div>

      {/* Placas section */}
      <div>
        <SectionHeader label="Placas" open={pltOpen} toggle={() => setPltOpen(v => !v)} />
        {pltOpen && (
          <div className="grid grid-cols-2 gap-1.5 px-3 pb-3">
            {placas.map(p => <ProductCard key={p.handle} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
