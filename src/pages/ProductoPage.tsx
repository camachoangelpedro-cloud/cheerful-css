
import { useEffect, useState, useRef } from 'react';
import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { NODO_PRODUCTS } from '@/data/modulesCatalog';
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

/* ── NodoViewer ──────────────────────────────────────────── */

function NodoViewer({ glbUrl, backgroundColor }: { glbUrl: string; backgroundColor: string }) {
  const canvasRef       = useRef<HTMLCanvasElement>(null);
  const engineRef       = useRef<any>(null);
  const sceneRef        = useRef<any>(null);
  const cameraRef       = useRef<any>(null);
  const keyLightRef     = useRef<any>(null);
  const shadowGenRef    = useRef<any>(null);
  const loadedMeshes    = useRef<any[]>([]);
  const camState        = useRef<{ alpha: number; beta: number } | null>(null);
  const idleTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const renderActiveRef = useRef(false);
  const glbUrlRef       = useRef('');

  /* Start/restart the render loop; auto-stops after 2 s of no interaction */
  const startRendering = () => {
    const engine = engineRef.current; const scene = sceneRef.current;
    if (!engine || !scene) return;
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (!renderActiveRef.current) {
      renderActiveRef.current = true;
      engine.runRenderLoop(() => scene.render());
    }
    idleTimerRef.current = setTimeout(() => {
      engine.stopRenderLoop();
      renderActiveRef.current = false;
    }, 2000);
  };

  /* ── Scene init — runs once ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const loadScript = (src: string) => new Promise<void>((res) => {
      if (document.querySelector(`script[src="${src}"]`)) { res(); return; }
      const s = document.createElement('script'); s.src = src; s.onload = () => res();
      document.head.appendChild(s);
    });

    const init = async () => {
      if (!(window as any).BABYLON) {
        await loadScript('https://cdn.babylonjs.com/babylon.js');
        await loadScript('https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js');
      }

      const B = (window as any).BABYLON;
      const engine = new B.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
      engine.setHardwareScalingLevel(1 / window.devicePixelRatio);
      engineRef.current = engine;

      const scene = new B.Scene(engine);
      scene.clearColor = new B.Color4(0.929, 0.914, 0.886, 1);
      scene.ambientColor = new B.Color3(0, 0, 0);
      sceneRef.current = scene;

      const camera = new B.ArcRotateCamera('cam', Math.PI / 3, 1.35, 10, B.Vector3.Zero(), scene);
      camera.attachControl(canvas, true);
      camera.inputs.removeByType('ArcRotateCameraMouseWheelInput');
      cameraRef.current = camera;

      const hemi = new B.HemisphericLight('hemi', new B.Vector3(0, 1, 0), scene);
      hemi.intensity = 0.30; hemi.diffuse = new B.Color3(1.0, 0.96, 0.90);
      hemi.groundColor = new B.Color3(0.32, 0.26, 0.20); hemi.specular = new B.Color3(0, 0, 0);

      const key = new B.DirectionalLight('key', new B.Vector3(-0.55, -0.75, -0.36), scene);
      key.intensity = 1.9; key.diffuse = new B.Color3(1.0, 0.94, 0.84);
      key.specular = new B.Color3(0.10, 0.09, 0.07);
      keyLightRef.current = key;

      const fill = new B.DirectionalLight('fill', new B.Vector3(0.7, -0.25, 0.65), scene);
      fill.intensity = 0.42; fill.diffuse = new B.Color3(0.92, 0.88, 0.82);
      fill.specular = new B.Color3(0, 0, 0);

      const rim = new B.DirectionalLight('rim', new B.Vector3(0.2, -0.6, 0.78), scene);
      rim.intensity = 0.28; rim.diffuse = new B.Color3(0.82, 0.87, 1.0);
      rim.specular = new B.Color3(0, 0, 0);

      /* PCF shadows — 1024 is plenty for a single product viewer */
      const shadows = new B.ShadowGenerator(1024, key);
      shadows.usePercentageCloserFiltering = true;
      shadows.filteringQuality = B.ShadowGenerator.QUALITY_MEDIUM;
      shadows.bias = 0.0005;
      shadowGenRef.current = shadows;

      /* Resume rendering on any user interaction */
      canvas.addEventListener('pointermove', startRendering, { passive: true });
      canvas.addEventListener('pointerdown', startRendering, { passive: true });
      const onResize = () => { engine.resize(); startRendering(); };
      window.addEventListener('resize', onResize);

      // Cleanup stored for unmount
      (engine as any)._nodoCleanup = () => window.removeEventListener('resize', onResize);
    };

    init();

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (cameraRef.current) {
        camState.current = { alpha: cameraRef.current.alpha, beta: cameraRef.current.beta };
        cameraRef.current = null;
      }
      (engineRef.current as any)?._nodoCleanup?.();
      engineRef.current?.dispose();
      engineRef.current = null;
      sceneRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── GLB swap — runs on every URL change ── */
  useEffect(() => {
    if (!glbUrl) return;
    glbUrlRef.current = glbUrl;

    const swap = async () => {
      const B = (window as any).BABYLON;
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      const key = keyLightRef.current;
      const shadows = shadowGenRef.current;
      if (!B || !scene || !camera) return;

      /* Dispose previous meshes */
      loadedMeshes.current.forEach(m => { try { m.dispose(); } catch (_) {} });
      loadedMeshes.current = [];

      /* Update background */
      const hex = backgroundColor || '#EDE9E1';
      scene.clearColor = new B.Color4(
        parseInt(hex.slice(1,3), 16) / 255,
        parseInt(hex.slice(3,5), 16) / 255,
        parseInt(hex.slice(5,7), 16) / 255, 1,
      );

      try {
        const result = await B.SceneLoader.ImportMeshAsync('', glbUrl, '', scene, null, '.glb');
        /* Stale check — another swap started before this one finished */
        if (glbUrlRef.current !== glbUrl) {
          result.meshes.forEach((m: any) => { try { m.dispose(); } catch (_) {} });
          return;
        }

        loadedMeshes.current = result.meshes;

        result.meshes.forEach((mesh: any) => {
          if (mesh.getTotalVertices() > 0) {
            shadows?.addShadowCaster(mesh, true);
            mesh.receiveShadows = true;
            if (mesh.material) {
              if (mesh.material.roughness !== undefined)            mesh.material.roughness = 0.78;
              if (mesh.material.metallic  !== undefined)            mesh.material.metallic  = 0.0;
              if (mesh.material.environmentIntensity !== undefined) mesh.material.environmentIntensity = 0;
            }
          }
        });

        const bounds = scene.getWorldExtends();
        const size   = bounds.max.subtract(bounds.min);
        const center = bounds.min.add(size.scale(0.5));
        const maxDim = Math.max(size.x, size.y, size.z);

        const lightDist = maxDim * 7;
        if (key) key.position = new B.Vector3(
          center.x + 0.55 * lightDist,
          center.y + 0.75 * lightDist,
          center.z + 0.36 * lightDist,
        );

        camera.target = center;
        camera.radius = maxDim * 3.8;
        camera.alpha  = camState.current ? camState.current.alpha : Math.PI / 3;
        camera.beta   = camState.current ? camState.current.beta  : 1.35;
        camera.lowerRadiusLimit = camera.radius;
        camera.upperRadiusLimit = camera.radius;
        camera.lowerBetaLimit   = 0.35;
        camera.upperBetaLimit   = 1.48;
      } catch (e) { console.error('Babylon load error', e); }

      startRendering();
    };

    swap();
  }, [glbUrl, backgroundColor]); // eslint-disable-line react-hooks/exhaustive-deps

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
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
  const [selectedMedia, setSelectedMedia] = useState<'3d' | number>('3d');

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
      quantity: 1,
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

  /* Colour-tinted viewer background */
  const VIEWER_BG: Record<string, string> = {
    BH: '#F2EDE4', RO: '#F5EDE0', VA: '#EFF3F0', AF: '#EDF0F5',
  };
  const viewerBg = VIEWER_BG[selectedColor.code] ?? '#F2EDE4';

  return (
    <div className="min-h-screen bg-background">
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
              className="font-body text-[9px] uppercase tracking-[.14em] px-5 py-2 bg-[#1A2B3C] text-[#F2EDE4] hover:opacity-85 disabled:opacity-40 transition-opacity"
            >
              {addedToCart ? 'Añadido ✓' : 'Añadir'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Breadcrumb ── */}
      <div ref={heroRef} className="nodo-container pt-28 pb-0">
        <Link
          to="/catalogo"
          className="inline-flex items-center gap-1.5 font-body text-[10px] uppercase tracking-[.12em] text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-3 h-3" />
          Catálogo
        </Link>
      </div>

      {/* ── Main product grid ── */}
      <div className="nodo-container">
        <div className="grid grid-cols-1 lg:grid-cols-[62fr_38fr] gap-x-16 gap-y-10 pt-10 pb-20 items-start">

          {/* ── LEFT: gallery ── */}
          <div className="flex flex-col gap-1">

            {/* Main display + thumbnail strip */}
            <div className="flex gap-1">

              {/* Thumbnail strip */}
              <div className="flex flex-col gap-1 w-[72px] shrink-0">
                {/* 3D viewer thumbnail */}
                <button
                  onClick={() => setSelectedMedia('3d')}
                  className={`aspect-square w-full overflow-hidden relative transition-all flex flex-col items-center justify-center gap-1 ${
                    selectedMedia === '3d'
                      ? 'ring-2 ring-[#1C1C1A] ring-offset-1'
                      : 'ring-1 ring-border hover:ring-foreground/30'
                  }`}
                  style={{ backgroundColor: viewerBg, transition: 'background-color 300ms ease' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-foreground/40">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  <span className="font-body text-[7px] uppercase tracking-[.08em] text-foreground/40">3D</span>
                </button>

                {/* Shopify image thumbnails */}
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedMedia(i)}
                    className={`aspect-square w-full overflow-hidden transition-all ${
                      selectedMedia === i
                        ? 'ring-2 ring-[#1A2B3C] ring-offset-1'
                        : 'ring-1 ring-border hover:ring-foreground/30'
                    }`}
                  >
                    <img src={img.node.url} alt={img.node.altText ?? ''} className="w-full h-full object-cover" />
                  </button>
                ))}

                {/* Placeholder thumbnails */}
                {[0, 1].map(i => (
                  <div key={i} className="aspect-square w-full bg-muted/10 ring-1 ring-border flex items-center justify-center">
                    <span className="font-body text-[6px] uppercase tracking-[.08em] text-muted-foreground/30 text-center leading-tight px-1">próx.</span>
                  </div>
                ))}
              </div>

              {/* Main display */}
              <div className="flex-1 overflow-hidden relative" style={{ backgroundColor: viewerBg, aspectRatio: '1/1', maxHeight: '70vh', transition: 'background-color 300ms ease' }}>
                {selectedMedia === '3d' ? (
                  glbUrl ? (
                    <NodoViewer glbUrl={glbUrl} backgroundColor={viewerBg} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                      <span className="font-display font-semibold text-xl text-foreground/20">{product.title}</span>
                    </div>
                  )
                ) : typeof selectedMedia === 'number' && images[selectedMedia] ? (
                  <img
                    src={images[selectedMedia].node.url}
                    alt={images[selectedMedia].node.altText ?? product.title}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
            </div>

            {/* Bottom row: two placeholders */}
            <div className="grid grid-cols-2 gap-1">
              {[0, 1].map(i => (
                <div key={i} className="aspect-square bg-muted/10 flex items-center justify-center max-h-[35vh]">
                  <span className="font-body text-[8px] uppercase tracking-[.12em] text-muted-foreground/35">Próximamente</span>
                </div>
              ))}
            </div>

          </div>

          {/* ── RIGHT: sticky product info ── */}
          <div className="lg:sticky lg:top-8">

            {/* Breadcrumb */}
            <p className="mb-4" style={{ fontSize: '10px', color: '#9E9E9C', letterSpacing: 0 }}>
              Catálogo / {product.title}
            </p>

            {/* Title */}
            <h1
              className="font-medium"
              style={{ fontSize: '28px', letterSpacing: 0, lineHeight: 1.1, color: '#1C1C1A' }}
            >
              {product.title}
            </h1>
            {dims && (
              <p className="mt-1.5" style={{ fontSize: '12px', color: '#5F5E5A', letterSpacing: 0 }}>
                {dims}
              </p>
            )}

            {/* Price */}
            <p className="mt-5 font-medium" style={{ fontSize: '18px', color: '#1C1C1A', letterSpacing: 0 }}>
              {priceDisplay}
            </p>

            {/* Divider */}
            <div className="mt-8 mb-8" style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.08)' }} />

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
                      aria-checked={selectedColor.code === c.code}
                      className={`color-swatch w-7 h-7 ${c.code === 'BH' ? 'color-swatch--light' : ''} ${selectedColor.code === c.code ? 'selected' : ''}`}
                      style={{ backgroundColor: c.hex }}
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
                          ${selectedApertura === a ? 'bg-[#1A2B3C] text-[#F2EDE4] border-[#1A2B3C]' : 'border-border text-foreground hover:border-foreground/60'}`}
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

            {/* ── CTA ── */}
            <div className="pt-2">
              <button
                onClick={handleAddToCart}
                disabled={cartLoading || addedToCart || !selectedVariant || !selectedVariant.availableForSale}
                className="w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                style={{
                  height: '52px',
                  borderRadius: '28px',
                  backgroundColor: addedToCart ? '#3A3A38' : '#1C1C1A',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: 500,
                  letterSpacing: 0,
                  border: 'none',
                }}
                onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#3A3A38'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = addedToCart ? '#3A3A38' : '#1C1C1A'; }}
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

              {/* Delivery note */}
              <div className="flex items-center gap-1.5 mt-3 justify-center">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 shrink-0" style={{ color: '#3A7D44' }}>
                  <circle cx="8" cy="8" r="6.5" /><line x1="8" y1="7" x2="8" y2="11" /><circle cx="8" cy="5.5" r="0.5" fill="currentColor" />
                </svg>
                <span style={{ fontSize: '12px', color: '#3A7D44', letterSpacing: 0 }}>
                  En stock — entrega en 8–12 días hábiles
                </span>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-5">
                {[
                  'Envío gratis',
                  'Garantía 2 años',
                  'Producido en Colombia',
                  'Empaque sin plástico',
                ].map(badge => (
                  <div key={badge} className="flex items-center gap-1.5">
                    <span style={{ fontSize: '12px', color: '#5F5E5A' }}>✓</span>
                    <span style={{ fontSize: '12px', color: '#5F5E5A', letterSpacing: 0 }}>{badge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── ACCORDION ── */}
            <div className="mt-10 nodo-accordion">
              <Accordion type="single" collapsible>
                <AccordionItem value="description">
                  <AccordionTrigger className="text-sm font-normal hover:no-underline [&>svg]:hidden" style={{ letterSpacing: 0 }}>
                    Descripción del producto
                  </AccordionTrigger>
                  <AccordionContent className="text-sm pb-5 leading-relaxed" style={{ color: '#5F5E5A', letterSpacing: 0 }}>
                    {product.description || 'Sistema modular NODO. Melamina 18mm Tablemac Duratex. Ensamblado en taller en Bogotá.'}
                  </AccordionContent>
                </AccordionItem>

                {parsedDims && (
                  <AccordionItem value="dimensions">
                    <AccordionTrigger className="text-sm font-normal hover:no-underline [&>svg]:hidden" style={{ letterSpacing: 0 }}>
                      Dimensiones
                    </AccordionTrigger>
                    <AccordionContent className="text-sm pb-5" style={{ color: '#5F5E5A', letterSpacing: 0 }}>
                      <div className="space-y-2.5">
                        <div className="flex justify-between">
                          <span>Ancho</span><span className="font-medium text-foreground">{parsedDims.ancho}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Alto</span><span className="font-medium text-foreground">{parsedDims.alto}</span>
                        </div>
                        {parsedDims.profundidad && (
                          <div className="flex justify-between">
                            <span>Profundidad</span><span className="font-medium text-foreground">{parsedDims.profundidad}</span>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                <AccordionItem value="materials">
                  <AccordionTrigger className="text-sm font-normal hover:no-underline [&>svg]:hidden" style={{ letterSpacing: 0 }}>
                    Materiales
                  </AccordionTrigger>
                  <AccordionContent className="text-sm pb-5 leading-relaxed" style={{ color: '#5F5E5A', letterSpacing: 0 }}>
                    Melamina 18mm Tablemac Duratex. Canto ABS 0.5mm. Panel trasero HDF 6mm remetido 25mm desde cara posterior. Acabado HPL matte. Ensamblado en taller en Bogotá.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="shipping">
                  <AccordionTrigger className="text-sm font-normal hover:no-underline [&>svg]:hidden" style={{ letterSpacing: 0 }}>
                    Envío y entrega
                  </AccordionTrigger>
                  <AccordionContent className="text-sm pb-5 leading-relaxed" style={{ color: '#5F5E5A', letterSpacing: 0 }}>
                    Envío gratis en Bogotá en pedidos superiores a $500.000 COP. Entrega en 8–12 días hábiles. Los módulos llegan ensamblados de taller, listos para usar.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

        </div>
      </div>

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
                  to={`/productos/${p.handle}`}
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