import { useState } from 'react';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import { NODO_PRODUCTS, NODO_COLORS, getStartingPrice } from '@/data/modulesCatalog';
import { ChevronDown, ChevronRight, Plus, Minus } from 'lucide-react';

const COP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

const PREVIEW_SCALE = 0.5; // px per cm for card previews

export default function ModuleCatalog() {
  const { selectedColorCode, dragHandle, setDragHandle, setColorCode, clfQuantities, setClfQuantity } =
    useConfiguratorStore();
  const [modOpen,  setModOpen]  = useState(true);
  const [modhOpen, setModhOpen] = useState(true);
  const [clfOpen,  setClfOpen]  = useState(true);
  const [pltOpen,  setPltOpen]  = useState(true);

  const modulos  = NODO_PRODUCTS.filter(p => p.family === 'MOD');
  const modhs    = NODO_PRODUCTS.filter(p => p.family === 'MODH');
  const placas   = NODO_PRODUCTS.filter(p => p.family === 'PLT');
  const clips    = NODO_PRODUCTS.filter(p => p.family === 'CLF');

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
        onClick={() => setDragHandle(dragHandle === product.handle ? null : product.handle)}
        className={`flex flex-col items-center gap-1.5 p-2.5 border cursor-grab active:cursor-grabbing select-none transition-colors
          ${dragHandle === product.handle
            ? 'border-[#1C1C1A] bg-[#1C1C1A]/5'
            : 'border-border hover:border-foreground/40'}`}
      >
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

  const ClipCard = ({ product }: { product: typeof NODO_PRODUCTS[number] }) => {
    const qty = clfQuantities[product.handle] ?? 0;
    return (
      <div className="flex flex-col gap-1.5 p-2.5 border border-border">
        <span className="font-body text-[9px] uppercase tracking-[.08em] text-foreground/80 leading-tight">
          {product.title}
        </span>
        <span className="font-body text-[9px] font-medium text-foreground">
          {COP(product.variants[0]?.price ?? 0)} c/u
        </span>
        <div className="flex items-center gap-2 mt-0.5">
          <button
            onClick={() => setClfQuantity(product.handle, qty - 1)}
            disabled={qty === 0}
            className="w-5 h-5 border border-border flex items-center justify-center hover:bg-muted/50 transition-colors disabled:opacity-30"
          >
            <Minus className="w-2.5 h-2.5" />
          </button>
          <span className="font-body text-[10px] w-4 text-center">{qty}</span>
          <button
            onClick={() => setClfQuantity(product.handle, qty + 1)}
            className="w-5 h-5 border border-border flex items-center justify-center hover:bg-muted/50 transition-colors"
          >
            <Plus className="w-2.5 h-2.5" />
          </button>
        </div>
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
              className={`w-6 h-6 rounded-full transition-transform
                ${selectedColorCode === color.id
                  ? 'ring-2 ring-offset-2 ring-foreground scale-110'
                  : 'hover:scale-105'}`}
              style={{
                background: color.hex,
                border: '1.5px solid rgba(28,28,26,0.18)',
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

      {/* Full depth 36cm */}
      <div className="border-b border-border">
        <SectionHeader label="Profundidad completa 36 cm" open={modOpen} toggle={() => setModOpen(v => !v)} />
        {modOpen && (
          <div className="grid grid-cols-2 gap-1.5 px-3 pb-3">
            {modulos.map(p => <ProductCard key={p.handle} product={p} />)}
          </div>
        )}
      </div>

      {/* Half depth 18cm */}
      <div className="border-b border-border">
        <SectionHeader label="Media profundidad 18 cm" open={modhOpen} toggle={() => setModhOpen(v => !v)} />
        {modhOpen && (
          <div className="grid grid-cols-2 gap-1.5 px-3 pb-3">
            {modhs.map(p => <ProductCard key={p.handle} product={p} />)}
          </div>
        )}
      </div>

      {/* Placas */}
      <div className="border-b border-border">
        <SectionHeader label="Placas" open={pltOpen} toggle={() => setPltOpen(v => !v)} />
        {pltOpen && (
          <div className="grid grid-cols-2 gap-1.5 px-3 pb-3">
            {placas.map(p => <ProductCard key={p.handle} product={p} />)}
          </div>
        )}
      </div>

      {/* Clips */}
      <div>
        <SectionHeader label="Clips" open={clfOpen} toggle={() => setClfOpen(v => !v)} />
        {clfOpen && (
          <div className="px-3 pb-3 flex flex-col gap-1.5">
            {clips.map(p => <ClipCard key={p.handle} product={p} />)}
          </div>
        )}
      </div>

    </div>
  );
}
