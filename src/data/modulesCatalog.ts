// NODO — Master Product Catalogue v4.1
// Prices from NODO_Master_Database_v1 COGS sheet — 45% gross margin
// Interior codes: A=Abierto, S=Con repisa, D=Con puerta, DS=Con puerta y repisa
// Panel codes: B=Con panel, O=Sin panel
// Color codes: BH=Blanco Hueso, RO=Roble Natural, VA=Verde Agave, AF=Azul Fes

export interface NodoColor { id: string; name: string; hex: string; code: string; }

export interface NodoVariant { sku: string; interior: string; panel: string; color: string; price: number; }

export interface NodoProduct {
  handle: string; title: string; family: 'MOD' | 'MODH' | 'PLT' | 'CLF';
  widthCm: number; heightCm: number; depthCm: number;
  hasOptions: boolean; isOneOff: boolean;
  variants: NodoVariant[];
}

export const NODO_COLORS: NodoColor[] = [
  { id: 'BH', name: 'Blanco Hueso', hex: '#F2EDE4', code: 'BH' },
  { id: 'RO', name: 'Roble Natural', hex: '#D4B896', code: 'RO' },
  { id: 'VA', name: 'Verde Agave',   hex: '#7A9080', code: 'VA' },
  { id: 'AF', name: 'Azul Fes',      hex: '#2E3B6E', code: 'AF' },
];

const C = ['BH', 'RO', 'VA', 'AF'];

export const NODO_PRODUCTS: NodoProduct[] = [

  // ── MOD 36×18 ──────────────────────────────────────────────────────────────
  {
    handle: 'modulo-36-18', title: 'Módulo 36×18', family: 'MOD',
    widthCm: 36, heightCm: 18, depthCm: 36,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MOD·1X05·A·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 159000 })),
      ...C.map(c => ({ sku: `MOD·1X05·A·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 153000 })),
    ],
  },

  // ── MOD 36×24 ──────────────────────────────────────────────────────────────
  {
    handle: 'modulo-36-24', title: 'Módulo 36×24', family: 'MOD',
    widthCm: 36, heightCm: 24, depthCm: 36,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MOD·1X07·A·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 168000 })),
      ...C.map(c => ({ sku: `MOD·1X07·A·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 160000 })),
    ],
  },

  // ── MOD 36×36 ──────────────────────────────────────────────────────────────
  {
    handle: 'modulo-36-36', title: 'Módulo 36×36', family: 'MOD',
    widthCm: 36, heightCm: 36, depthCm: 36,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MOD·1X1·A·B·${c}`,  interior: 'Abierto',             panel: 'Con panel', color: c, price: 186000 })),
      ...C.map(c => ({ sku: `MOD·1X1·A·O·${c}`,  interior: 'Abierto',             panel: 'Sin panel', color: c, price: 174000 })),
      ...C.map(c => ({ sku: `MOD·1X1·S·B·${c}`,  interior: 'Con repisa',          panel: 'Con panel', color: c, price: 205000 })),
      ...C.map(c => ({ sku: `MOD·1X1·S·O·${c}`,  interior: 'Con repisa',          panel: 'Sin panel', color: c, price: 196000 })),
      ...C.map(c => ({ sku: `MOD·1X1·D·B·${c}`,  interior: 'Con puerta',          panel: 'Con panel', color: c, price: 216000 })),
      ...C.map(c => ({ sku: `MOD·1X1·DS·B·${c}`, interior: 'Con puerta y repisa', panel: 'Con panel', color: c, price: 236000 })),
    ],
  },

  // ── MOD 36×72 ──────────────────────────────────────────────────────────────
  {
    handle: 'modulo-36-72', title: 'Módulo 36×72', family: 'MOD',
    widthCm: 36, heightCm: 72, depthCm: 36,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MOD·1X2·A·B·${c}`,  interior: 'Abierto',             panel: 'Con panel', color: c, price: 249000 })),
      ...C.map(c => ({ sku: `MOD·1X2·A·O·${c}`,  interior: 'Abierto',             panel: 'Sin panel', color: c, price: 227000 })),
      ...C.map(c => ({ sku: `MOD·1X2·S·B·${c}`,  interior: 'Con repisa',          panel: 'Con panel', color: c, price: 269000 })),
      ...C.map(c => ({ sku: `MOD·1X2·S·O·${c}`,  interior: 'Con repisa',          panel: 'Sin panel', color: c, price: 248000 })),
      ...C.map(c => ({ sku: `MOD·1X2·D·B·${c}`,  interior: 'Con puerta',          panel: 'Con panel', color: c, price: 279000 })),
      ...C.map(c => ({ sku: `MOD·1X2·DS·B·${c}`, interior: 'Con puerta y repisa', panel: 'Con panel', color: c, price: 297000 })),
    ],
  },

  // ── MOD 72×18 ──────────────────────────────────────────────────────────────
  {
    handle: 'modulo-72-18', title: 'Módulo 72×18', family: 'MOD',
    widthCm: 72, heightCm: 18, depthCm: 36,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MOD·2X05·A·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 222000 })),
      ...C.map(c => ({ sku: `MOD·2X05·A·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 211000 })),
    ],
  },

  // ── MOD 72×24 ──────────────────────────────────────────────────────────────
  {
    handle: 'modulo-72-24', title: 'Módulo 72×24', family: 'MOD',
    widthCm: 72, heightCm: 24, depthCm: 36,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MOD·2X07·A·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 233000 })),
      ...C.map(c => ({ sku: `MOD·2X07·A·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 218000 })),
    ],
  },

  // ── MOD 72×36 ──────────────────────────────────────────────────────────────
  {
    handle: 'modulo-72-36', title: 'Módulo 72×36', family: 'MOD',
    widthCm: 72, heightCm: 36, depthCm: 36,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MOD·2X1·A·B·${c}`,  interior: 'Abierto',             panel: 'Con panel', color: c, price: 254000 })),
      ...C.map(c => ({ sku: `MOD·2X1·A·O·${c}`,  interior: 'Abierto',             panel: 'Sin panel', color: c, price: 233000 })),
      ...C.map(c => ({ sku: `MOD·2X1·S·B·${c}`,  interior: 'Con repisa',          panel: 'Con panel', color: c, price: 293000 })),
      ...C.map(c => ({ sku: `MOD·2X1·S·O·${c}`,  interior: 'Con repisa',          panel: 'Sin panel', color: c, price: 272000 })),
      ...C.map(c => ({ sku: `MOD·2X1·D·B·${c}`,  interior: 'Con puerta',          panel: 'Con panel', color: c, price: 309000 })),
      ...C.map(c => ({ sku: `MOD·2X1·DS·B·${c}`, interior: 'Con puerta y repisa', panel: 'Con panel', color: c, price: 336000 })),
    ],
  },

  // ── MOD 72×72 — one-off ────────────────────────────────────────────────────
  {
    handle: 'modulo-72-72', title: 'Módulo 72×72', family: 'MOD',
    widthCm: 72, heightCm: 72, depthCm: 36,
    hasOptions: false, isOneOff: true,
    variants: [
      ...C.map(c => ({ sku: `MOD·2X2·DD·B·${c}`, interior: 'Con puerta', panel: 'Con panel', color: c, price: 415000 })),
    ],
  },

  // ── MODH 36×18 ─────────────────────────────────────────────────────────────
  {
    handle: 'modulo-h-36-18', title: 'Módulo H 36×18', family: 'MODH',
    widthCm: 36, heightCm: 18, depthCm: 18,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MODH·1X05·A·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 124000 })),
      ...C.map(c => ({ sku: `MODH·1X05·A·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 119000 })),
    ],
  },

  // ── MODH 36×24 ─────────────────────────────────────────────────────────────
  {
    handle: 'modulo-h-36-24', title: 'Módulo H 36×24', family: 'MODH',
    widthCm: 36, heightCm: 24, depthCm: 18,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MODH·1X07·A·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 130000 })),
      ...C.map(c => ({ sku: `MODH·1X07·A·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 123000 })),
    ],
  },

  // ── MODH 36×36 ─────────────────────────────────────────────────────────────
  {
    handle: 'modulo-h-36-36', title: 'Módulo H 36×36', family: 'MODH',
    widthCm: 36, heightCm: 36, depthCm: 18,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MODH·1X1·A·B·${c}`, interior: 'Abierto',    panel: 'Con panel', color: c, price: 141000 })),
      ...C.map(c => ({ sku: `MODH·1X1·A·O·${c}`, interior: 'Abierto',    panel: 'Sin panel', color: c, price: 130000 })),
      ...C.map(c => ({ sku: `MODH·1X1·D·B·${c}`, interior: 'Con puerta', panel: 'Con panel', color: c, price: 172000 })),
    ],
  },

  // ── MODH 72×24 ─────────────────────────────────────────────────────────────
  {
    handle: 'modulo-h-72-24', title: 'Módulo H 72×24', family: 'MODH',
    widthCm: 72, heightCm: 24, depthCm: 18,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MODH·2X07·A·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 174000 })),
      ...C.map(c => ({ sku: `MODH·2X07·A·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 160000 })),
    ],
  },

  // ── BASE 36×36 ─────────────────────────────────────────────────────────────
  {
    handle: 'base-36-36', title: 'Base 36×36', family: 'PLT',
    widthCm: 36, heightCm: 36, depthCm: 36,
    hasOptions: false, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `PLT·1X1·${c}`, interior: '', panel: '', color: c, price: 87000 })),
    ],
  },

  // ── BASE 72×36 ─────────────────────────────────────────────────────────────
  {
    handle: 'base-72-36', title: 'Base 72×36', family: 'PLT',
    widthCm: 72, heightCm: 36, depthCm: 36,
    hasOptions: false, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `PLT·2X1·${c}`, interior: '', panel: '', color: c, price: 110000 })),
    ],
  },

  // ── CLIPS DECORATIVOS ──────────────────────────────────────────────────────
  {
    handle: 'clf-std', title: 'Clips decorativos', family: 'CLF',
    widthCm: 4, heightCm: 4, depthCm: 2,
    hasOptions: false, isOneOff: false,
    variants: [
      { sku: 'CLF·STD·BS', interior: '', panel: '', color: 'BS', price: 22000 },
      { sku: 'CLF·STD·BR', interior: '', panel: '', color: 'BR', price: 29000 },
    ],
  },
];

// Structural clip price — auto-added to order: 2 clips per module when ≥ 2 modules placed
export const STRUCTURAL_CLIP_PRICE = 15000;

export const GRID_UNIT = 36;
export const PX_PER_CM = 2;
export const SNAP_X_CM = 4;
export const SNAP_Y_CM = 18;

export function getStartingPrice(p: NodoProduct): number { return Math.min(...p.variants.map(v => v.price)); }

export function getColor(code: string) { return NODO_COLORS.find(c => c.id === code) || NODO_COLORS[0]; }

export function findVariant(p: NodoProduct, interior: string, panel: string, color: string) {
  return p.variants.find(v => v.interior === interior && v.panel === panel && v.color === color);
}

// Backward compatibility exports
export type ModuleType = any;
export type ModuleColor = NodoColor;
export const MODULE_COLORS = NODO_COLORS;
export const MODULE_CATALOG: any[] = [];
export const VISUAL_SCALE = 60;
