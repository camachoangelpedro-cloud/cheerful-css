import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/FooterNodo';
import { CartDrawer } from '@/components/CartDrawer';
import { fetchProductByHandle, ShopifyProduct } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* ── Constants ───────────────────────────────────────────── */

const NODO_COLORS = [
  { code: 'BH', name: 'Blanco Hueso', hex: '#F2EDE4' },
  { code: 'RO', name: 'Roble Natural', hex: '#D4B896' },
  { code: 'AR', name: 'Arena', hex: '#D6C9B5' },
  { code: 'SA', name: 'Salvia', hex: '#8FAF8C' },
  { code: 'AC', name: 'Acero', hex: '#6B8E9F' },
];

const COLOR_NAME_MAP: Record<string, string> = {
  BH: 'Blanco Hueso',
  RO: 'Roble Natural',
  AR: 'Arena',
  SA: 'Salvia',
  AC: 'Acero',
};

const DIMENSION_MAP: Record<string, string> = {
  'Módulo 36×18': '36 × 18 × 36 cm',
  'Módulo 36×24': '36 × 24 × 36 cm',
  'Módulo 36×36': '36 × 36 × 36 cm',
  'Módulo 36×72': '36 × 72 × 36 cm',
  'Módulo 72×18': '72 × 18 × 36 cm',
  'Módulo 72×24': '72 × 24 × 36 cm',
  'Módulo 72×36': '72 × 36 × 36 cm',
  'Módulo 72×72': '72 × 72 × 36 cm',
  'Base 36×36': '36 × 36 cm',
  'Base 72×36': '72 × 36 cm',
};

type ProductType = 'TYPE_FULL' | 'TYPE_PANEL' | 'TYPE_COLOR' | 'TYPE_ACABADO' | 'TYPE_SINGLE';

function getProductType(options: { name: string; values: string[] }[]): ProductType {
  const names = options.map(o => o.name);
  if (names.includes('Interior') && names.includes('Panel trasero')) return 'TYPE_FULL';
  if (names.includes('Panel trasero') && !names.includes('Interior')) return 'TYPE_PANEL';
  if (names.includes('Acabado')) return 'TYPE_ACABADO';
  if (names.includes('Color')) return 'TYPE_COLOR';
  return 'TYPE_SINGLE';
}

function parseDimensions(title: string): { ancho?: string; alto?: string; profundidad?: string } | null {
  const m = title.match(/(Módulo|Base)\s+(\d+)×(\d+)/);
  if (!m) return null;
  const isModule = m[1] === 'Módulo';
  return { ancho: m[2] + ' cm', alto: m[3] + ' cm', ...(isModule ? { profundidad: '36 cm' } : {}) };
}

function getBaseRecommendation(title: string) {
  if (title.includes('36×36') || title.includes('36×72'))
    return { handle: 'base-36-36', name: 'Base 36×36', price: '$33.000' };
  if (title.includes('72×36') || title.includes('72×72'))
    return { handle: 'base-72-36', name: 'Base 72×36', price: '$35.000' };
  return null;
}

type VariantNode = ShopifyProduct['node']['variants']['edges'][0]['node'];

/* ── Component ───────────────────────────────────────────── */

export default function ProductoPage() {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ShopifyProduct['node'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(NODO_COLORS[0]);
  const [selectedPanel, setSelectedPanel] = useState('Con panel');
  const [selectedInterior, setSelectedInterior] = useState('Abierto');
  const [selectedAcabado, setSelectedAcabado] = useState('Acero Cepillado');
  const [cableHole, setCableHole] = useState(false);
  const [selectedApertura, setSelectedApertura] = useState('Derecha');
  const [selectedVariant, setSelectedVariant] = useState<VariantNode | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const { addItem, isLoading: cartLoading } = useCartStore();

  /* Fetch product */
  useEffect(() => {
    async function loadProduct() {
      if (!handle) return;
      try {
        const data = await fetchProductByHandle(handle);
        setProduct(data);
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [handle]);

  /* Variant matching */
  useEffect(() => {
    if (!product) return;
    const options = product.options;
    const names = options.map(o => o.name);

    const built: { name: string; value: string }[] = [];
    if (names.includes('Interior')) built.push({ name: 'Interior', value: selectedInterior });
    if (names.includes('Panel trasero')) built.push({ name: 'Panel trasero', value: selectedPanel });
    if (names.includes('Color')) built.push({ name: 'Color', value: COLOR_NAME_MAP[selectedColor.code] });
    if (names.includes('Acabado')) built.push({ name: 'Acabado', value: selectedAcabado });
    if (names.includes('Title')) built.push({ name: 'Title', value: 'Default Title' });

    const found = product.variants.edges.find(v =>
      built.every(b => v.node.selectedOptions.find(o => o.name === b.name && o.value === b.value))
    );
    setSelectedVariant(found?.node ?? null);
  }, [product, selectedColor, selectedPanel, selectedInterior, selectedAcabado]);

  /* Panel logic */
  useEffect(() => {
    if (selectedPanel === 'Sin panel') {
      setSelectedInterior('Abierto');
      setCableHole(false);
    }
  }, [selectedPanel]);

  /* Add to cart */
  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return;
    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  /* ── Loading ──────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar /><CartDrawer />
        <div className="pt-32 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  /* ── Not found ────────────────────────────────────────── */
  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar /><CartDrawer />
        <main className="pt-32 pb-24">
          <div className="nodo-container text-center">
            <h1 className="nodo-heading-lg mb-4">Producto no encontrado</h1>
            <Link to="/catalogo" className="nodo-button-outline">Volver al catálogo</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const pType = getProductType(product.options);
  const dims = DIMENSION_MAP[product.title] || '';
  const parsedDims = parseDimensions(product.title);
  const images = product.images.edges;
  const showDoorWarning = pType === 'TYPE_FULL' && (selectedInterior === 'Con puerta' || selectedInterior === 'Con puerta y repisa');
  const baseRec = showDoorWarning ? getBaseRecommendation(product.title) : null;
  const doorLocked = selectedPanel === 'Sin panel';

  const priceDisplay = selectedVariant
    ? 'COP $' + Number(selectedVariant.price.amount).toLocaleString('es-CO')
    : '—';

  /* helpers */
  const StepHeader = ({ num, label }: { num?: string; label: string }) => (
    <div className="flex items-center gap-2 mb-3">
      {num && (
        <span className="w-5 h-5 rounded-full border border-border flex items-center justify-center text-[10px] text-muted-foreground">
          {num}
        </span>
      )}
      <span className="font-body text-[10px] uppercase tracking-[.12em] text-muted-foreground font-medium">{label}</span>
    </div>
  );

  const OptionCard = ({ active, locked, svg, label, onClick }: { active: boolean; locked?: boolean; svg: React.ReactNode; label: string; onClick: () => void }) => (
    <div
      onClick={locked ? undefined : onClick}
      className={`flex flex-col items-center gap-2 p-3 min-w-[72px] flex-1 max-w-[90px] border cursor-pointer rounded-none transition-all duration-150
        ${active ? 'border-[#1A2B3C] bg-[#F2EDE4]' : 'border-border hover:border-foreground/40'}
        ${locked ? 'opacity-30 pointer-events-none' : ''}`}
    >
      <div className="w-10 h-10 shrink-0 text-foreground">{svg}</div>
      <span className={`font-body text-[10px] text-center leading-tight mt-1 ${active ? 'text-[#1A2B3C]' : 'text-muted-foreground'}`}>{label}</span>
    </div>
  );

  /* SVGs */
  const panelConSvg = (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10">
      <rect x="3" y="3" width="34" height="34" rx="1" />
      <rect x="8" y="8" width="24" height="24" fill="currentColor" fillOpacity=".1" strokeWidth="1.5" />
    </svg>
  );
  const panelSinSvg = (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10">
      <rect x="3" y="3" width="34" height="34" rx="1" />
      <path d="M10 10L30 30M30 10L10 30" strokeWidth="1.5" opacity=".35" strokeDasharray="3 2" />
    </svg>
  );
  const interiorAbiertoSvg = (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10">
      <rect x="3" y="3" width="34" height="34" rx="1" />
    </svg>
  );
  const interiorRepisaSvg = (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10">
      <rect x="3" y="3" width="34" height="34" rx="1" />
      <line x1="7" y1="20" x2="33" y2="20" strokeWidth="3" strokeLinecap="square" />
    </svg>
  );
  const interiorPuertaSvg = (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10">
      <rect x="3" y="3" width="34" height="34" rx="1" />
      <rect x="7" y="7" width="26" height="26" fill="currentColor" fillOpacity=".08" strokeWidth="1.5" />
      <circle cx="27" cy="20" r="2.5" fill="currentColor" />
    </svg>
  );
  const interiorPuertaRepisaSvg = (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10">
      <rect x="3" y="3" width="34" height="34" rx="1" />
      <rect x="7" y="7" width="26" height="26" fill="currentColor" fillOpacity=".08" strokeWidth="1.5" />
      <line x1="7" y1="20" x2="33" y2="20" strokeWidth="2" strokeLinecap="square" />
      <circle cx="27" cy="13" r="2.5" fill="currentColor" />
    </svg>
  );
  const cableSvg = (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10">
      <rect x="3" y="3" width="34" height="34" rx="1" />
      <rect x="7" y="7" width="26" height="26" fill="currentColor" fillOpacity=".06" strokeWidth="1" />
      <circle cx="20" cy="30" r="4" fill="none" strokeWidth="2" strokeDasharray="3 2" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      {/* Back link */}
      <div className="nodo-container py-6">
        <Link to="/catalogo" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4" />
          ← Volver al catálogo
        </Link>
      </div>

      {/* Product grid */}
      <div className="nodo-container">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-16 pt-24 pb-32">

          {/* ── LEFT COLUMN ─────────────────────────────── */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            {/* Image area */}
            <div
              className="aspect-[4/5] w-full overflow-hidden relative transition-colors duration-500"
              style={{ backgroundColor: selectedColor.hex }}
            >
              {images.length > 0 ? (
                <img
                  src={images[0].node.url}
                  alt={images[0].node.altText || product.title}
                  className="w-full h-full object-cover relative z-10"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
                  <span className="font-display font-semibold text-2xl text-foreground/25">{product.title}</span>
                </div>
              )}
            </div>

            {/* Colour dots */}
            <div className="flex gap-2 mt-4 items-center">
              {NODO_COLORS.map(c => (
                <button
                  key={c.code}
                  onClick={() => setSelectedColor(c)}
                  className={`w-7 h-7 rounded-full cursor-pointer border-2 border-transparent transition-all duration-150
                    ${selectedColor.code === c.code ? 'ring-2 ring-offset-2 ring-foreground scale-110' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
            <p className="font-body text-xs text-muted-foreground mt-2">{selectedColor.name}</p>
          </div>

          {/* ── RIGHT COLUMN ────────────────────────────── */}
          <div>
            <h1 className="font-display font-semibold text-2xl leading-tight mb-1">{product.title}</h1>
            {dims && <p className="font-body text-sm text-muted-foreground mb-6">{dims}</p>}
            <p className="font-body text-2xl font-medium mb-6">{priceDisplay}</p>
            <div className="border-t border-border mb-6" />

            {/* ── CONFIGURATOR STEPS ────────────────────── */}

            {/* Step 1 — Panel trasero (TYPE_FULL & TYPE_PANEL) */}
            {(pType === 'TYPE_FULL' || pType === 'TYPE_PANEL') && (
              <>
                <StepHeader num="1" label="Panel trasero" />
                <div className="flex gap-2 flex-wrap mb-6">
                  <OptionCard active={selectedPanel === 'Con panel'} svg={panelConSvg} label="Con panel" onClick={() => setSelectedPanel('Con panel')} />
                  <OptionCard active={selectedPanel === 'Sin panel'} svg={panelSinSvg} label="Sin panel" onClick={() => setSelectedPanel('Sin panel')} />
                </div>
              </>
            )}

            {/* Step 2 — Interior (TYPE_FULL only) */}
            {pType === 'TYPE_FULL' && (
              <>
                <StepHeader num="2" label="Interior" />
                <div className="flex gap-2 flex-wrap mb-6">
                  <OptionCard active={selectedInterior === 'Abierto'} svg={interiorAbiertoSvg} label="Abierto" onClick={() => setSelectedInterior('Abierto')} />
                  <OptionCard active={selectedInterior === 'Con repisa'} svg={interiorRepisaSvg} label="Con repisa" onClick={() => setSelectedInterior('Con repisa')} />
                  <OptionCard active={selectedInterior === 'Con puerta'} locked={doorLocked} svg={interiorPuertaSvg} label="Con puerta" onClick={() => setSelectedInterior('Con puerta')} />
                  <OptionCard active={selectedInterior === 'Con puerta y repisa'} locked={doorLocked} svg={interiorPuertaRepisaSvg} label="Puerta+repisa" onClick={() => setSelectedInterior('Con puerta y repisa')} />
                </div>

                {/* Apertura sub-selector */}
                {(selectedInterior === 'Con puerta' || selectedInterior === 'Con puerta y repisa') && (
                  <>
                    <div className="flex items-center gap-3 mt-0 mb-2">
                      <span className="font-body text-[10px] uppercase tracking-[.1em] text-muted-foreground min-w-[56px]">Apertura</span>
                      {['Derecha', 'Izquierda'].map(a => (
                        <button
                          key={a}
                          onClick={() => setSelectedApertura(a)}
                          className={`font-body text-[10px] px-3 py-1.5 border rounded-none cursor-pointer transition-colors
                            ${selectedApertura === a ? 'bg-[#1A2B3C] text-[#F2EDE4] border-[#1A2B3C]' : 'border-border text-foreground hover:border-foreground/60'}`}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                    <p className="font-body text-[10px] text-muted-foreground italic mb-6">La apertura se comunica al taller — sin coste adicional</p>
                  </>
                )}
              </>
            )}

            {/* Step 3 — Extras (TYPE_FULL + Con panel) */}
            {pType === 'TYPE_FULL' && selectedPanel === 'Con panel' && (
              <>
                <StepHeader num="3" label="Extras" />
                <div className="flex gap-2 flex-wrap mb-6">
                  <OptionCard active={cableHole} svg={cableSvg} label="Apertura cables" onClick={() => setCableHole(!cableHole)} />
                </div>
                {cableHole && (
                  <p className="font-body text-[10px] text-muted-foreground italic mt-1 -mt-4 mb-6">Sin coste adicional</p>
                )}
              </>
            )}

            {/* TYPE_ACABADO — Clip Decorativo */}
            {pType === 'TYPE_ACABADO' && (
              <>
                <StepHeader label="Acabado" />
                <div className="flex gap-2 mb-6">
                  {['Acero Cepillado', 'Latón'].map(a => (
                    <button
                      key={a}
                      onClick={() => setSelectedAcabado(a)}
                      className={`font-body text-sm border px-4 py-2 rounded-none transition-colors
                        ${selectedAcabado === a ? 'bg-foreground text-background border-foreground' : 'border-border hover:border-foreground'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Door warning */}
            {showDoorWarning && (
              <div className="bg-[#FAEEDA] border border-[#EF9F27]/60 p-3 mb-5 rounded-none flex gap-2 items-start">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5">
                  <path d="M7 1.5L12.5 11.5H1.5L7 1.5Z" stroke="#854F0B" strokeWidth="1.5" />
                  <line x1="7" y1="5.5" x2="7" y2="8.5" stroke="#854F0B" strokeWidth="1.5" />
                  <circle cx="7" cy="10" r=".75" fill="#854F0B" />
                </svg>
                <span className="font-body text-[11px] text-[#412402] leading-relaxed">
                  Si este módulo va en el piso, necesita una base para que la puerta abra correctamente.
                </span>
              </div>
            )}

            {/* Add to cart button */}
            <button
              onClick={handleAddToCart}
              disabled={cartLoading || addedToCart || !selectedVariant || !selectedVariant.availableForSale}
              className="w-full rounded-none py-4 bg-[#1A2B3C] text-[#F2EDE4] font-body text-[10px] tracking-[.18em] uppercase font-medium hover:opacity-85 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {cartLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : addedToCart ? (
                'Añadido ✓'
              ) : !selectedVariant ? (
                'Combinación no disponible'
              ) : !selectedVariant.availableForSale ? (
                'Sin stock'
              ) : (
                'Añadir al carrito'
              )}
            </button>

            <p className="font-body text-[10px] text-muted-foreground text-center mt-3">
              Entrega en Bogotá  ·  Ensamblado en taller  ·  Plug-and-play
            </p>

            {/* Base recommendation */}
            {baseRec && (
              <>
                <div className="border-t border-border mt-6" />
                <div className="border border-border p-3 mt-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted/30 flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <rect x="2" y="13" width="24" height="5" fill="rgba(28,28,26,.1)" stroke="rgba(28,28,26,.3)" strokeWidth="1.2" />
                      <line x1="5" y1="18" x2="5" y2="24" stroke="rgba(28,28,26,.3)" strokeWidth="1.8" strokeLinecap="round" />
                      <line x1="23" y1="18" x2="23" y2="24" stroke="rgba(28,28,26,.3)" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-body text-sm font-medium">{baseRec.name}</p>
                    <p className="font-body text-[11px] text-muted-foreground mt-0.5">Recomendada con puerta · COP {baseRec.price}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/producto/${baseRec.handle}`)}
                    className="border border-[#1A2B3C] text-[#1A2B3C] bg-transparent font-body text-[10px] tracking-widest uppercase px-3 py-2 rounded-none hover:bg-[#1A2B3C] hover:text-[#F2EDE4] transition-colors"
                  >
                    + Añadir
                  </button>
                </div>
              </>
            )}

            {/* ── ACCORDION ─────────────────────────────── */}
            <div className="mt-10 border-t border-border pt-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="description">
                  <AccordionTrigger className="font-body text-sm font-medium py-4 hover:no-underline">Descripción</AccordionTrigger>
                  <AccordionContent className="font-body text-sm text-muted-foreground pb-4 leading-relaxed">
                    {product.description || 'Sistema modular NODO. Melamina 18mm Tablemac Duratex. Ensamblado en taller en Bogotá.'}
                  </AccordionContent>
                </AccordionItem>

                {parsedDims && (
                  <AccordionItem value="dimensions">
                    <AccordionTrigger className="font-body text-sm font-medium py-4 hover:no-underline">Dimensiones</AccordionTrigger>
                    <AccordionContent className="font-body text-sm text-muted-foreground pb-4 leading-relaxed">
                      <div className="w-full">
                        <div className="border-b border-border/30 py-1.5 flex justify-between">
                          <span className="text-muted-foreground text-sm">Ancho</span>
                          <span className="font-medium text-sm">{parsedDims.ancho}</span>
                        </div>
                        <div className="border-b border-border/30 py-1.5 flex justify-between">
                          <span className="text-muted-foreground text-sm">Alto</span>
                          <span className="font-medium text-sm">{parsedDims.alto}</span>
                        </div>
                        {parsedDims.profundidad && (
                          <div className="border-b border-border/30 py-1.5 flex justify-between">
                            <span className="text-muted-foreground text-sm">Profundidad</span>
                            <span className="font-medium text-sm">{parsedDims.profundidad}</span>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                <AccordionItem value="materials">
                  <AccordionTrigger className="font-body text-sm font-medium py-4 hover:no-underline">Materiales</AccordionTrigger>
                  <AccordionContent className="font-body text-sm text-muted-foreground pb-4 leading-relaxed">
                    Melamina 18mm Tablemac Duratex. Canto ABS 0.5mm. Panel trasero HDF 6mm remetido 25mm desde cara posterior. Acabado HPL matte. Ensamblado en taller en Bogotá.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}