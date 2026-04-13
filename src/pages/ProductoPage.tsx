
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

import { useEffect, useState, Suspense, useMemo, useRef } from 'react';
import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2, Truck, Clock, Package, MessageCircle } from 'lucide-react';
import { NODO_PRODUCTS } from '@/data/modulesCatalog';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/FooterNodo';
import { CartDrawer } from '@/components/CartDrawer';
import { fetchProductByHandle, ShopifyProduct } from '@/lib/shopify';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Center, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useCartStore } from '@/stores/cartStore';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* ── Constants ───────────────────────────────────────────── */

const NODO_COLORS = [
  { code: 'BH', name: 'Blanco Hueso',  hex: '#F2EDE4' },
  { code: 'RO', name: 'Roble Natural', hex: '#D4B896' },
  { code: 'VA', name: 'Verde Agave',   hex: '#7A9080' },
  { code: 'AF', name: 'Azul Fes',      hex: '#2E3B6E' },
];

const COLOR_NAME_MAP: Record<string, string> = {
  BH: 'Blanco Hueso',
  RO: 'Roble Natural',
  VA: 'Verde Agave',
  AF: 'Azul Fes',
};

const DIMENSION_MAP: Record<string, string> = {
  'Módulo 36×18':   '36 × 18 × 36 cm',
  'Módulo 36×24':   '36 × 24 × 36 cm',
  'Módulo 36×36':   '36 × 36 × 36 cm',
  'Módulo 36×72':   '36 × 72 × 36 cm',
  'Módulo 72×18':   '72 × 18 × 36 cm',
  'Módulo 72×24':   '72 × 24 × 36 cm',
  'Módulo 72×36':   '72 × 36 × 36 cm',
  'Módulo 72×72':   '72 × 72 × 36 cm',
  'Módulo H 36×18': '36 × 18 × 18 cm',
  'Módulo H 36×24': '36 × 24 × 18 cm',
  'Módulo H 36×36': '36 × 36 × 18 cm',
  'Módulo H 72×24': '72 × 24 × 18 cm',
  'Base 36×36':     '36 × 36 cm',
  'Base 72×36':     '72 × 36 cm',
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

const GITHUB_BASE = 'https://raw.githubusercontent.com/camachoangelpedro-cloud/cheerful-css/main/public/models';

function resolveGlbUrl(
  handle: string,
  panel: string,
  interior: string,
  apertura: string,
  cableHole: boolean,
  colorCode: string
): string {
  const panelCode = panel === 'Sin panel' ? 'O' : 'B';
  const ap        = cableHole && panelCode === 'B';
  const apSuffix  = ap ? '_AP' : '';

  /* PLT bases */
  const PLT_MAP: Record<string, string> = {
    'base-36-36': 'PLT_1X1',
    'base-72-36': 'PLT_2X1',
  };
  if (PLT_MAP[handle]) return `${GITHUB_BASE}/${PLT_MAP[handle]}_${colorCode}.glb`;

  /* 72×72 special case — double door */
  if (handle === 'modulo-72-72') {
    return `${GITHUB_BASE}/MOD_2X2_DD_B${apSuffix}_${colorCode}.glb`;
  }

  const SIZE_MAP: Record<string, string> = {
    'modulo-36-18': '1X05', 'modulo-36-24': '1X07', 'modulo-36-36': '1X1',
    'modulo-36-72': '1X2',  'modulo-72-18': '2X05', 'modulo-72-24': '2X07',
    'modulo-72-36': '2X1',
    'modulo-h-36-18': '1X05', 'modulo-h-36-24': '1X07', 'modulo-h-36-36': '1X1',
    'modulo-h-72-24': '2X07',
  };
  const sizeCode = SIZE_MAP[handle];
  if (!sizeCode) return '';

  const prefix = handle.startsWith('modulo-h-') ? 'MODH' : 'MOD';

  let intCode = 'A';
  if (interior === 'Con repisa')                                          intCode = 'S';
  else if (interior === 'Con puerta' || interior === 'Con puerta y repisa') intCode = 'D';

  const SINGLE_DOOR = ['modulo-36-36', 'modulo-36-72', 'modulo-h-36-36'];
  const hasDoor = intCode === 'D';
  const tiradorSuffix = (SINGLE_DOOR.includes(handle) && hasDoor)
    ? (apertura === 'Izquierda' ? '_IZQ' : '_DER')
    : '';

  return `${GITHUB_BASE}/${prefix}_${sizeCode}_${intCode}_${panelCode}${tiradorSuffix}${apSuffix}_${colorCode}.glb`;
}


type VariantNode = ShopifyProduct['node']['variants']['edges'][0]['node'];

/* ── NodoViewer — Three.js / R3F ─────────────────────────── */

function NodoModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const clone = useMemo(() => {
    const c = scene.clone(true);
    c.traverse(obj => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m: any) => {
        if (m.roughness !== undefined)       m.roughness = 0.78;
        if (m.metalness !== undefined)       m.metalness = 0;
        if (m.envMapIntensity !== undefined) m.envMapIntensity = 0;
        m.needsUpdate = true;
      });
    });
    return c;
  }, [scene]);

  return (
    <Center>
      <primitive object={clone} scale={0.01} />
    </Center>
  );
}

function NodoViewer({ glbUrl, backgroundColor, moduleWidth, moduleHeight }: { glbUrl: string; backgroundColor: string; moduleWidth: number; moduleHeight: number }) {
  const bg = backgroundColor || '#EDE9E1';
  const maxDim = Math.max(moduleWidth, moduleHeight);
  const scale = maxDim <= 36 ? 1 : maxDim <= 54 ? 1.3 : 1.6;
  const cameraPosition: [number, number, number] = [-8 * scale, 6 * scale, 8 * scale];

  return (
    <Canvas
      frameloop="demand"
      gl={{ antialias: true, preserveDrawingBuffer: true }}
      camera={{ position: cameraPosition, fov: 30, near: 0.1, far: 100, up: [0, 1, 0] }}
      style={{ width: '100%', height: '100%', background: bg }}
    >
      {/* Warm three-point light rig matching original */}
      <ambientLight intensity={0.30} color="#F5EEE6" />
      <directionalLight position={[-5.5, 7.5,  3.6]} intensity={1.9} color="#FFF0D6" />
      <directionalLight position={[ 7.0, -2.5,  6.5]} intensity={0.42} color="#EBEAE2" />
      <directionalLight position={[ 2.0, -6.0,  7.8]} intensity={0.28} color="#D1DCFF" />

      <Suspense fallback={null}>
        {glbUrl && <NodoModel key={glbUrl} url={glbUrl} />}
      </Suspense>

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={true}
        minDistance={6 * scale}
        maxDistance={15 * scale}
        minPolarAngle={0.3}
        maxPolarAngle={1.5}
        rotateSpeed={0.5}
        zoomSpeed={0.5}
      />
    </Canvas>
  );
}

/* ── Component ───────────────────────────────────────────── */

export default function ProductoPage() {
  const { handle } = useParams<{ handle: string }>();

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
  const [qty, setQty] = useState(1);

  const [stickyBarVisible, setStickyBarVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const { addItem, isLoading: cartLoading } = useCartStore();

  /* Sticky bar observer */
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setStickyBarVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Fetch product */
  useEffect(() => {
    async function loadProduct() {
      if (!handle) return;
      try {
        const data = await fetchProductByHandle(handle);
        setProduct(data);
        if (typeof window.gtag === 'function' && data) {
          window.gtag('event', 'view_item', {
            currency: 'COP',
            value: parseFloat(data.priceRange?.minVariantPrice?.amount || '0'),
            items: [{
              item_id: data.handle,
              item_name: data.title,
              price: parseFloat(data.priceRange?.minVariantPrice?.amount || '0'),
              currency: 'COP',
            }]
          });
        }
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
    /* Tirador is NOT a Shopify variant — it's a cart line-item property */
    if (names.includes('Panel trasero')) built.push({ name: 'Panel trasero', value: selectedPanel });
    if (names.includes('Color')) built.push({ name: 'Color', value: COLOR_NAME_MAP[selectedColor.code] });
    if (names.includes('Acabado')) built.push({ name: 'Acabado', value: selectedAcabado });
    if (names.includes('Title')) built.push({ name: 'Title', value: 'Default Title' });

    const found = product.variants.edges.find(v =>
      built.every(b => v.node.selectedOptions.find(o => o.name === b.name && o.value === b.value))
    );
    setSelectedVariant(found?.node ?? null);
  }, [product, selectedColor, selectedPanel, selectedInterior, selectedAcabado, selectedApertura]);

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
    const hasDoor = selectedInterior === 'Con puerta' || selectedInterior === 'Con puerta y repisa';
    const isSingleDoor = hasSingleDoor && hasDoor;
    const extraOptions = isSingleDoor
      ? [...(selectedVariant.selectedOptions || []), { name: 'Tirador', value: selectedApertura }]
      : selectedVariant.selectedOptions || [];
    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: qty,
      selectedOptions: extraOptions,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  /* ── Loading ──────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar /><CartDrawer />
        <div className="pt-36 flex items-center justify-center min-h-[60vh]">
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
        <main className="pt-36 pb-24">
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
  const doorLocked = selectedPanel === 'Sin panel';
  const hasSingleDoor = product.title.includes('36×36') || product.title.includes('36×72');
  const is72x72 = product.title === 'Módulo 72×72';

  const glbUrl = product && handle
    ? resolveGlbUrl(
        handle,
        selectedPanel,
        selectedInterior,
        selectedApertura,
        cableHole,
        selectedColor.code
      )
    : '';

  const priceDisplay = selectedVariant
    ? 'COP $' + Number(selectedVariant.price.amount).toLocaleString('es-CO')
    : '—';

  /* helpers */
  const StepHeader = ({ num, label, suffix }: { num?: string; label: string; suffix?: string }) => (
    <div className="flex items-center gap-2 mb-3">
      {num && (
        <span className="w-5 h-5 rounded-full border border-border flex items-center justify-center text-[10px] text-muted-foreground">
          {num}
        </span>
      )}
      <span className="font-body text-[10px] uppercase tracking-[.12em] text-muted-foreground font-medium">{label}</span>
      {suffix && (
        <>
          <span className="font-body text-[10px] text-muted-foreground/50">—</span>
          <span className="font-body text-[10px] text-foreground font-medium">{suffix}</span>
        </>
      )}
    </div>
  );

  const OptionCard = ({ active, locked, svg, label, onClick }: { active: boolean; locked?: boolean; svg: React.ReactNode; label: string; onClick: () => void }) => (
    <div
      onClick={locked ? undefined : onClick}
      className={`flex flex-col items-center gap-2 p-3 min-w-[72px] flex-1 max-w-[90px] border cursor-pointer rounded-none transition-all duration-150
        ${active ? 'border-[#1C1C1A] bg-[#F2EDE4]' : 'border-border hover:border-foreground/40'}
        ${locked ? 'opacity-30 pointer-events-none' : ''}`}
    >
      <div className="w-10 h-10 shrink-0 text-foreground">{svg}</div>
      <span className={`font-body text-[10px] text-center leading-tight mt-1 ${active ? 'text-[#1C1C1A]' : 'text-muted-foreground'}`}>{label}</span>
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
  const handleCx = selectedApertura === 'Izquierda' ? 13 : 27;
  const interiorPuertaSvg = hasSingleDoor ? (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10">
      <rect x="3" y="3" width="34" height="34" rx="1" />
      <rect x="7" y="7" width="26" height="26" fill="currentColor" fillOpacity=".08" strokeWidth="1.5" />
      <circle cx={handleCx} cy="20" r="2.5" fill="currentColor" />
    </svg>
  ) : (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10">
      <rect x="3" y="3" width="34" height="34" rx="1" />
      <rect x="7" y="7" width="12" height="26" fill="currentColor" fillOpacity=".08" strokeWidth="1.5" />
      <rect x="21" y="7" width="12" height="26" fill="currentColor" fillOpacity=".08" strokeWidth="1.5" />
      <circle cx="16.5" cy="20" r="2" fill="currentColor" />
      <circle cx="23.5" cy="20" r="2" fill="currentColor" />
    </svg>
  );
  const interiorPuertaRepisaSvg = hasSingleDoor ? (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10">
      <rect x="3" y="3" width="34" height="34" rx="1" />
      <rect x="7" y="7" width="26" height="26" fill="currentColor" fillOpacity=".08" strokeWidth="1.5" />
      <line x1="7" y1="20" x2="33" y2="20" strokeWidth="2" strokeLinecap="square" />
      <circle cx={handleCx} cy="13" r="2.5" fill="currentColor" />
    </svg>
  ) : (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10">
      <rect x="3" y="3" width="34" height="34" rx="1" />
      <rect x="7" y="7" width="12" height="26" fill="currentColor" fillOpacity=".08" strokeWidth="1.5" />
      <rect x="21" y="7" width="12" height="26" fill="currentColor" fillOpacity=".08" strokeWidth="1.5" />
      <line x1="7" y1="20" x2="33" y2="20" strokeWidth="2" strokeLinecap="square" />
      <circle cx="16.5" cy="14" r="2" fill="currentColor" />
      <circle cx="23.5" cy="14" r="2" fill="currentColor" />
    </svg>
  );
  const cableSvg = (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10">
      <rect x="3" y="3" width="34" height="34" rx="1" />
      <rect x="7" y="7" width="26" height="26" fill="currentColor" fillOpacity=".06" strokeWidth="1" />
      <circle cx="20" cy="30" r="4" fill="none" strokeWidth="2" strokeDasharray="3 2" />
    </svg>
  );

  const relatedProducts = NODO_PRODUCTS.filter(p => p.handle !== handle).slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${product?.title || 'Producto'} | NODO`}</title>
        <meta name="description" content={product?.description?.slice(0, 155) || 'Módulo de estantería modular NODO. Configura color, interior y panel. Fabricado a pedido en Bogotá.'} />
      </Helmet>
      <Navbar />
      <CartDrawer />

      {/* ── Sticky product bar (appears on scroll) ── */}
      <div
        className={`fixed inset-x-0 top-0 z-50 bg-background/96 backdrop-blur-sm border-b border-border transition-transform duration-300 ${
          stickyBarVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="nodo-container h-14 flex items-center justify-between gap-6">
          <span className="font-body text-sm font-medium truncate">{product.title}</span>
          <div className="flex items-center gap-5 shrink-0">
            <span className="font-body text-sm font-medium hidden sm:block">{priceDisplay}</span>
            <button
              onClick={handleAddToCart}
              disabled={cartLoading || addedToCart || !selectedVariant || !selectedVariant.availableForSale}
              className="font-body text-[9px] uppercase tracking-[.14em] px-5 py-2 rounded-full bg-[#1C1C1A] text-[#F2EDE4] hover:opacity-85 disabled:opacity-40 transition-opacity"
            >
              {addedToCart ? 'Añadido ✓' : 'Añadir'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Breadcrumb ── */}
      <div ref={heroRef} className="nodo-container pt-28 pb-0">
        <nav className="flex items-center gap-1.5 flex-wrap">
          <Link
            to="/"
            className="hover:underline underline-offset-2 transition-colors"
            style={{ fontSize: '13px', color: '#9E9E9C', letterSpacing: 0 }}
          >
            Inicio
          </Link>
          <span style={{ fontSize: '13px', color: '#9E9E9C' }}>›</span>
          <Link
            to="/catalogo"
            className="hover:underline underline-offset-2 transition-colors"
            style={{ fontSize: '13px', color: '#9E9E9C', letterSpacing: 0 }}
          >
            Catálogo
          </Link>
          <span style={{ fontSize: '13px', color: '#9E9E9C' }}>›</span>
          <span style={{ fontSize: '13px', color: '#1C1C1A', letterSpacing: 0 }}>
            {product.title}
          </span>
        </nav>
      </div>

      {/* ── Main product grid ── */}
      <div className="nodo-container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-x-16 gap-y-10 pt-10 pb-20 items-start">

          {/* ── LEFT: gallery ── */}
          <div>

            {/* Main display */}
            <div className="w-full overflow-hidden relative" style={{ backgroundColor: '#EDE9E1', aspectRatio: '1/1', maxHeight: '70vh' }}>
              {glbUrl ? (
                <NodoViewer glbUrl={glbUrl} backgroundColor="#EDE9E1" moduleWidth={nodoProduct?.widthCm || 36} moduleHeight={nodoProduct?.heightCm || 36} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                  <span className="font-display font-semibold text-xl text-foreground/20">{product.title}</span>
                </div>
              )}
            </div>

          </div>

          {/* ── RIGHT: sticky product info ── */}
          <div className="lg:sticky lg:top-8">

            {/* Title block — compact, name + dims + price read as one unit */}
            <h1 className="font-display font-light text-3xl md:text-4xl leading-snug">{product.title}</h1>
            {dims && <p className="font-body text-xs text-muted-foreground tracking-[.06em] mt-1.5">{dims}</p>}
            <p className="font-body text-xl font-medium mt-5">{priceDisplay}</p>

            {/* Stock indicator */}
            {selectedVariant && (
              <p className="font-body mt-2.5" style={{ fontSize: '13px', color: selectedVariant.availableForSale ? '#4A7A5B' : '#A04040' }}>
                {selectedVariant.availableForSale
                  ? <><span style={{ fontSize: '10px' }}>●</span> Disponible · Fabricado a tu medida</>
                  : 'Sin stock'}
              </p>
            )}

            {/* Divider — visual break between identity and configuration */}
            <div className="h-px bg-border mt-8 mb-8" />

            {/* ── CONFIGURATOR STEPS ────────────────────── */}

            {/* COLOUR */}
            {!is72x72 && (
              <div className="mb-8">
                <StepHeader label="Color" suffix={selectedColor.name} />
                <div className="flex gap-2.5 mt-3 items-center">
                  {NODO_COLORS.map(c => (
                    <button
                      key={c.code}
                      onClick={() => setSelectedColor(c)}
                      className={`w-7 h-7 rounded-full cursor-pointer transition-all duration-150
                        ${selectedColor.code === c.code ? 'ring-2 ring-offset-2 ring-foreground scale-110' : 'hover:scale-105'}`}
                      style={{ backgroundColor: c.hex, border: '1.5px solid rgba(28,28,26,0.18)' }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Step 1 — Panel trasero */}
            {(pType === 'TYPE_FULL' || pType === 'TYPE_PANEL') && (
              <div className="mb-8">
                <StepHeader num="1" label="Panel trasero" />
                <div className="flex gap-2 flex-wrap mt-3">
                  <OptionCard active={selectedPanel === 'Con panel'} svg={panelConSvg} label="Con panel" onClick={() => setSelectedPanel('Con panel')} />
                  <OptionCard active={selectedPanel === 'Sin panel'} svg={panelSinSvg} label="Sin panel" onClick={() => setSelectedPanel('Sin panel')} />
                </div>
              </div>
            )}

            {/* Step 2 — Interior */}
            {pType === 'TYPE_FULL' && (
              <div className="mb-8">
                <StepHeader num="2" label="Interior" />
                <div className="flex gap-2 flex-wrap mt-3">
                  <OptionCard active={selectedInterior === 'Abierto'} svg={interiorAbiertoSvg} label="Abierto" onClick={() => setSelectedInterior('Abierto')} />
                  <OptionCard active={selectedInterior === 'Con repisa'} svg={interiorRepisaSvg} label="Con repisa" onClick={() => setSelectedInterior('Con repisa')} />
                  <OptionCard active={selectedInterior === 'Con puerta'} locked={doorLocked} svg={interiorPuertaSvg} label="Con puerta" onClick={() => setSelectedInterior('Con puerta')} />
                  <OptionCard active={selectedInterior === 'Con puerta y repisa'} locked={doorLocked} svg={interiorPuertaRepisaSvg} label="Puerta+repisa" onClick={() => setSelectedInterior('Con puerta y repisa')} />
                </div>

                {/* Tirador */}
                {hasSingleDoor && (selectedInterior === 'Con puerta' || selectedInterior === 'Con puerta y repisa') && (
                  <div className="flex items-center gap-3 mt-5">
                    <span className="font-body text-[10px] uppercase tracking-[.12em] text-muted-foreground w-14 shrink-0">Tirador</span>
                    {['Derecha', 'Izquierda'].map(a => (
                      <button
                        key={a}
                        onClick={() => setSelectedApertura(a)}
                        className={`font-body text-[10px] tracking-[.12em] uppercase px-4 py-2 border rounded-none cursor-pointer transition-colors
                          ${selectedApertura === a ? 'bg-[#1C1C1A] text-[#F2EDE4] border-[#1C1C1A]' : 'border-border text-foreground hover:border-foreground/60'}`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 3 — Extras */}
            {pType === 'TYPE_FULL' && selectedPanel === 'Con panel' && (
              <div className="mb-8">
                <StepHeader num="3" label="Extras" />
                <div className="flex gap-2 flex-wrap mt-3">
                  <OptionCard active={cableHole} svg={cableSvg} label="Agujero cables" onClick={() => setCableHole(!cableHole)} />
                </div>
                {cableHole && (
                  <p className="font-body text-[10px] text-muted-foreground italic mt-2">Sin coste adicional</p>
                )}
              </div>
            )}

            {/* TYPE_ACABADO */}
            {pType === 'TYPE_ACABADO' && (
              <div className="mb-8">
                <StepHeader label="Acabado" />
                <div className="flex gap-2 mt-3">
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
              </div>
            )}

            {/* TYPE_72x72 */}
            {is72x72 && (
              <>
                <div className="mb-8">
                  <StepHeader label="Color" suffix={selectedColor.name} />
                  <div className="flex gap-2.5 mt-3 items-center">
                    {NODO_COLORS.map(c => (
                      <button
                        key={c.code}
                        onClick={() => setSelectedColor(c)}
                        className={`w-7 h-7 rounded-full cursor-pointer transition-all duration-150
                          ${selectedColor.code === c.code ? 'ring-2 ring-offset-2 ring-foreground scale-110' : 'hover:scale-105'}`}
                        style={{ backgroundColor: c.hex, border: '1.5px solid rgba(28,28,26,0.18)' }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
                <div className="h-px bg-border mb-8" />
                <div className="mb-8">
                  <StepHeader num="1" label="Interior" />
                  <div className="flex gap-2 flex-wrap mt-3">
                    <OptionCard
                      active={true}
                      svg={
                        <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10">
                          <rect x="3" y="3" width="34" height="34" rx="1" />
                          <rect x="7" y="7" width="12" height="26" fill="currentColor" fillOpacity=".08" strokeWidth="1.5" />
                          <rect x="21" y="7" width="12" height="26" fill="currentColor" fillOpacity=".08" strokeWidth="1.5" />
                          <line x1="7" y1="20" x2="33" y2="20" strokeWidth="2" strokeLinecap="square" />
                          <circle cx="16.5" cy="14" r="2" fill="currentColor" />
                          <circle cx="23.5" cy="14" r="2" fill="currentColor" />
                        </svg>
                      }
                      label="2 puertas + repisa"
                      onClick={() => {}}
                    />
                  </div>
                </div>
                <div className="mb-8">
                  <StepHeader num="2" label="Extras" />
                  <div className="flex gap-2 flex-wrap mt-3">
                    <OptionCard
                      active={cableHole}
                      svg={
                        <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10">
                          <rect x="3" y="3" width="34" height="34" rx="1" />
                          <rect x="7" y="7" width="26" height="26" fill="currentColor" fillOpacity=".06" strokeWidth="1" />
                          <circle cx="20" cy="30" r="4" fill="none" strokeWidth="2" strokeDasharray="3 2" />
                        </svg>
                      }
                      label="Agujero cables"
                      onClick={() => setCableHole(!cableHole)}
                    />
                  </div>
                  {cableHole && (
                    <p className="font-body text-[10px] text-muted-foreground italic mt-2">Sin coste adicional</p>
                  )}
                </div>
              </>
            )}

            {/* ── CTA block ── */}
            <div className="pt-2">
              {/* Quantity selector + add-to-cart */}
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-border rounded-none h-[46px] shrink-0">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-10 h-full flex items-center justify-center text-foreground hover:bg-muted transition-colors font-body text-base"
                    aria-label="Reducir cantidad"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-body text-sm font-medium select-none">{qty}</span>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    className="w-10 h-full flex items-center justify-center text-foreground hover:bg-muted transition-colors font-body text-base"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>

                {/* Add to cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={cartLoading || addedToCart || !selectedVariant || !selectedVariant.availableForSale}
                  className="flex-1 rounded-full py-[14px] bg-[#1C1C1A] text-[#F2EDE4] font-body text-[10px] tracking-[.14em] uppercase font-medium hover:opacity-85 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
              </div>

              {/* Shipping info block */}
              <div className="mt-4 rounded-none bg-muted/50 px-4 py-3.5 space-y-2">
                <div className="flex items-center gap-2.5 text-muted-foreground" style={{ fontSize: '13px' }}>
                  <Truck className="w-3.5 h-3.5 shrink-0" />
                  <span>Envío gratis con código LANZAMIENTO</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground" style={{ fontSize: '13px' }}>
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>Entrega en Bogotá D.C. en 2 a 3 semanas</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground" style={{ fontSize: '13px' }}>
                  <Package className="w-3.5 h-3.5 shrink-0" />
                  <span>Cada módulo llega armado — solo conéctalos con los clips incluidos</span>
                </div>
              </div>
            </div>

            {/* ── ACCORDION ── */}
            <div className="mt-12 border-t border-border">
              <Accordion type="single" collapsible>
                <AccordionItem value="description">
                  <AccordionTrigger className="font-body text-xs uppercase tracking-[.10em] font-medium py-5 hover:no-underline">Descripción</AccordionTrigger>
                  <AccordionContent className="font-body text-sm text-muted-foreground pb-6 leading-relaxed">
                    {product.description || 'Sistema modular NODO. Melamina 18mm Tablemac Duratex. Ensamblado en taller en Bogotá.'}
                  </AccordionContent>
                </AccordionItem>

                {parsedDims && (
                  <AccordionItem value="dimensions">
                    <AccordionTrigger className="font-body text-xs uppercase tracking-[.10em] font-medium py-5 hover:no-underline">Dimensiones</AccordionTrigger>
                    <AccordionContent className="font-body text-sm text-muted-foreground pb-6">
                      <div className="w-full space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ancho</span>
                          <span className="font-medium">{parsedDims.ancho}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Alto</span>
                          <span className="font-medium">{parsedDims.alto}</span>
                        </div>
                        {parsedDims.profundidad && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Profundidad</span>
                            <span className="font-medium">{parsedDims.profundidad}</span>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                <AccordionItem value="materials">
                  <AccordionTrigger className="font-body text-xs uppercase tracking-[.10em] font-medium py-5 hover:no-underline">Materiales</AccordionTrigger>
                  <AccordionContent className="font-body text-sm text-muted-foreground pb-6 leading-relaxed">
                    Melamina de alta calidad de 18 mm con acabado mate. Canto ABS de 0.5 mm. Panel trasero en HDF de 6 mm, remetido 25 mm desde la cara posterior. Ensamblado en taller en Bogotá.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="shipping">
                  <AccordionTrigger className="font-body text-xs uppercase tracking-[.10em] font-medium py-5 hover:no-underline">Envío y entrega</AccordionTrigger>
                  <AccordionContent className="font-body text-sm text-muted-foreground pb-6 leading-relaxed">
                    Todos los productos NODO se fabrican a pedido en nuestro taller en Bogotá. El tiempo estimado de entrega es de 2 a 3 semanas desde la confirmación del pedido. Actualmente realizamos envíos únicamente dentro de Bogotá D.C. Cada módulo llega completamente armado — solo tienes que conectar los módulos entre sí con los clips estructurales incluidos.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="warranty">
                  <AccordionTrigger className="font-body text-xs uppercase tracking-[.10em] font-medium py-5 hover:no-underline">Garantía y devoluciones</AccordionTrigger>
                  <AccordionContent className="font-body text-sm text-muted-foreground pb-6 leading-relaxed">
                    <p>Todos los productos NODO cuentan con garantía legal de un (1) año a partir de la fecha de entrega, conforme a la Ley 1480 de 2011 (Estatuto del Consumidor). La garantía cubre defectos de fabricación y materiales. No cubre daños por uso inadecuado, modificaciones realizadas por el cliente, o desgaste natural.</p>
                    <p className="mt-3">Tienes derecho a ejercer el retracto dentro de los cinco (5) días hábiles siguientes a la entrega del producto. La devolución del dinero se realizará en un plazo máximo de quince (15) días calendario conforme a la Ley 2439 de 2024. Para solicitudes, escríbenos a nodomodulardesign@gmail.com</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

        </div>
      </div>

      {/* ── Reviews placeholder ── */}
      <section className="border-t border-border">
        <div className="nodo-container py-16">
          <h3 className="font-body text-[9px] uppercase tracking-[.16em] text-muted-foreground mb-6">Reseñas</h3>
          <div className="bg-muted/40 rounded-none px-6 py-10 flex flex-col items-center text-center gap-3">
            <MessageCircle className="w-6 h-6 text-muted-foreground/40" />
            <p className="font-body text-muted-foreground" style={{ fontSize: '14px' }}>
              Las reseñas de clientes estarán disponibles próximamente.
            </p>
            <p className="font-body text-muted-foreground/60" style={{ fontSize: '14px' }}>
              ¿Ya tienes un producto NODO? Escríbenos a{' '}
              <a href="mailto:nodomodulardesign@gmail.com" className="underline underline-offset-2 hover:text-foreground transition-colors">nodomodulardesign@gmail.com</a>{' '}
              para compartir tu experiencia.
            </p>
          </div>
        </div>
      </section>

      {/* ── Bought Together ── */}
      <section className="border-t border-border">
        <div className="nodo-container py-16">
          <p className="font-body text-[9px] uppercase tracking-[.16em] text-muted-foreground mb-8">
            Completa tu configuración
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
            {relatedProducts.map(p => {
              const minPrice = Math.min(...p.variants.map(v => v.price));
              return (
                <Link
                  key={p.handle}
                  to={`/producto/${p.handle}`}
                  className="flex-shrink-0 w-48 snap-start group"
                >
                  <div
                    className="aspect-square mb-3 overflow-hidden flex items-center justify-center"
                    style={{ backgroundColor: '#EDE9E1' }}
                  >
                    <span className="font-body text-[8px] uppercase tracking-[.10em] text-muted-foreground/40">{p.title}</span>
                  </div>
                  <p className="font-body text-xs font-medium group-hover:underline leading-snug">{p.title}</p>
                  <p className="font-body text-[10px] text-muted-foreground mt-0.5">
                    Desde COP ${minPrice.toLocaleString('es-CO')}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}