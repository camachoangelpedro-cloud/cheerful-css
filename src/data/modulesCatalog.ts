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
      ...C.map(c => ({ sku: `MOD·1X05·A·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 141000 })),
      ...C.map(c => ({ sku: `MOD·1X05·A·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 135000 })),
    ],
  },

  // ── MOD 36×24 ──────────────────────────────────────────────────────────────
  {
    handle: 'modulo-36-24', title: 'Módulo 36×24', family: 'MOD',
    widthCm: 36, heightCm: 24, depthCm: 36,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MOD·1X07·A·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 149000 })),
      ...C.map(c => ({ sku: `MOD·1X07·A·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 142000 })),
    ],
  },

  // ── MOD 36×36 ──────────────────────────────────────────────────────────────
  {
    handle: 'modulo-36-36', title: 'Módulo 36×36', family: 'MOD',
    widthCm: 36, heightCm: 36, depthCm: 36,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MOD·1X1·A·B·${c}`,  interior: 'Abierto',             panel: 'Con panel', color: c, price: 166000 })),
      ...C.map(c => ({ sku: `MOD·1X1·A·O·${c}`,  interior: 'Abierto',             panel: 'Sin panel', color: c, price: 155000 })),
      ...C.map(c => ({ sku: `MOD·1X1·S·B·${c}`,  interior: 'Con repisa',          panel: 'Con panel', color: c, price: 176000 })),
      ...C.map(c => ({ sku: `MOD·1X1·S·O·${c}`,  interior: 'Con repisa',          panel: 'Sin panel', color: c, price: 165000 })),
      ...C.map(c => ({ sku: `MOD·1X1·D·B·${c}`,  interior: 'Con puerta',          panel: 'Con panel', color: c, price: 237000 })),
      ...C.map(c => ({ sku: `MOD·1X1·DS·B·${c}`, interior: 'Con puerta y repisa', panel: 'Con panel', color: c, price: 246000 })),
    ],
  },

  // ── MOD 36×72 ──────────────────────────────────────────────────────────────
  {
    handle: 'modulo-36-72', title: 'Módulo 36×72', family: 'MOD',
    widthCm: 36, heightCm: 72, depthCm: 36,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MOD·1X2·A·B·${c}`,  interior: 'Abierto',             panel: 'Con panel', color: c, price: 231000 })),
      ...C.map(c => ({ sku: `MOD·1X2·A·O·${c}`,  interior: 'Abierto',             panel: 'Sin panel', color: c, price: 209000 })),
      ...C.map(c => ({ sku: `MOD·1X2·S·B·${c}`,  interior: 'Con repisa',          panel: 'Con panel', color: c, price: 241000 })),
      ...C.map(c => ({ sku: `MOD·1X2·S·O·${c}`,  interior: 'Con repisa',          panel: 'Sin panel', color: c, price: 219000 })),
      ...C.map(c => ({ sku: `MOD·1X2·D·B·${c}`,  interior: 'Con puerta',          panel: 'Con panel', color: c, price: 321000 })),
      ...C.map(c => ({ sku: `MOD·1X2·DS·B·${c}`, interior: 'Con puerta y repisa', panel: 'Con panel', color: c, price: 331000 })),
    ],
  },

  // ── MOD 72×18 ──────────────────────────────────────────────────────────────
  {
    handle: 'modulo-72-18', title: 'Módulo 72×18', family: 'MOD',
    widthCm: 72, heightCm: 18, depthCm: 36,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MOD·2X05·A·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 208000 })),
      ...C.map(c => ({ sku: `MOD·2X05·A·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 197000 })),
    ],
  },

  // ── MOD 72×24 ──────────────────────────────────────────────────────────────
  {
    handle: 'modulo-72-24', title: 'Módulo 72×24', family: 'MOD',
    widthCm: 72, heightCm: 24, depthCm: 36,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MOD·2X07·A·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 218000 })),
      ...C.map(c => ({ sku: `MOD·2X07·A·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 203000 })),
    ],
  },

  // ── MOD 72×36 ──────────────────────────────────────────────────────────────
  {
    handle: 'modulo-72-36', title: 'Módulo 72×36', family: 'MOD',
    widthCm: 72, heightCm: 36, depthCm: 36,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MOD·2X1·A·B·${c}`,  interior: 'Abierto',             panel: 'Con panel', color: c, price: 239000 })),
      ...C.map(c => ({ sku: `MOD·2X1·A·O·${c}`,  interior: 'Abierto',             panel: 'Sin panel', color: c, price: 216000 })),
      ...C.map(c => ({ sku: `MOD·2X1·S·B·${c}`,  interior: 'Con repisa',          panel: 'Con panel', color: c, price: 248000 })),
      ...C.map(c => ({ sku: `MOD·2X1·S·O·${c}`,  interior: 'Con repisa',          panel: 'Sin panel', color: c, price: 226000 })),
      ...C.map(c => ({ sku: `MOD·2X1·D·B·${c}`,  interior: 'Con puerta',          panel: 'Con panel', color: c, price: 374000 })),
      ...C.map(c => ({ sku: `MOD·2X1·DS·B·${c}`, interior: 'Con puerta y repisa', panel: 'Con panel', color: c, price: 384000 })),
    ],
  },

  // ── MOD 72×72 — one-off ────────────────────────────────────────────────────
  {
    handle: 'modulo-72-72', title: 'Módulo 72×72', family: 'MOD',
    widthCm: 72, heightCm: 72, depthCm: 36,
    hasOptions: false, isOneOff: true,
    variants: [
      ...C.map(c => ({ sku: `MOD·2X2·DD·B·${c}`, interior: 'Con puerta', panel: 'Con panel', color: c, price: 498000 })),
    ],
  },

  // ── MODH 36×18 ─────────────────────────────────────────────────────────────
  {
    handle: 'modh-36-18', title: 'Módulo H 36×18', family: 'MODH',
    widthCm: 36, heightCm: 18, depthCm: 18,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MODH·1X05·A·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 108000 })),
      ...C.map(c => ({ sku: `MODH·1X05·A·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 103000 })),
    ],
  },

  // ── MODH 36×24 ─────────────────────────────────────────────────────────────
  {
    handle: 'modh-36-24', title: 'Módulo H 36×24', family: 'MODH',
    widthCm: 36, heightCm: 24, depthCm: 18,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MODH·1X07·A·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 113000 })),
      ...C.map(c => ({ sku: `MODH·1X07·A·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 106000 })),
    ],
  },

  // ── MODH 36×36 ─────────────────────────────────────────────────────────────
  {
    handle: 'modh-36-36', title: 'Módulo H 36×36', family: 'MODH',
    widthCm: 36, heightCm: 36, depthCm: 18,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MODH·1X1·A·B·${c}`, interior: 'Abierto',    panel: 'Con panel', color: c, price: 124000 })),
      ...C.map(c => ({ sku: `MODH·1X1·A·O·${c}`, interior: 'Abierto',    panel: 'Sin panel', color: c, price: 113000 })),
      ...C.map(c => ({ sku: `MODH·1X1·D·B·${c}`, interior: 'Con puerta', panel: 'Con panel', color: c, price: 152000 })),
    ],
  },

  // ── MODH 72×24 ─────────────────────────────────────────────────────────────
  {
    handle: 'modh-72-24', title: 'Módulo H 72×24', family: 'MODH',
    widthCm: 72, heightCm: 24, depthCm: 18,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MODH·2X07·A·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 155000 })),
      ...C.map(c => ({ sku: `MODH·2X07·A·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 140000 })),
    ],
  },

  // ── BASE 36×36 ─────────────────────────────────────────────────────────────
  {
    handle: 'base-36-36', title: 'Base 36×36', family: 'PLT',
    widthCm: 36, heightCm: 36, depthCm: 36,
    hasOptions: false, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `PLT·1X1·${c}`, interior: '', panel: '', color: c, price: 33000 })),
    ],
  },

  // ── BASE 72×36 ─────────────────────────────────────────────────────────────
  {
    handle: 'base-72-36', title: 'Base 72×36', family: 'PLT',
    widthCm: 72, heightCm: 36, depthCm: 36,
    hasOptions: false, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `PLT·2X1·${c}`, interior: '', panel: '', color: c, price: 35000 })),
    ],
  },

  // ── CLIPS DECORATIVOS ──────────────────────────────────────────────────────
  {
    handle: 'clf-std', title: 'Clips decorativos', family: 'CLF',
    widthCm: 4, heightCm: 4, depthCm: 2,
    hasOptions: false, isOneOff: false,
    variants: [
      { sku: 'CLF·STD·BS', interior: '', panel: '', color: 'BS', price: 20000 },
      { sku: 'CLF·STD·BR', interior: '', panel: '', color: 'BR', price: 25000 },
    ],
  },
];

// Structural clip price — auto-added to order: 2 clips per module when ≥ 2 modules placed
export const STRUCTURAL_CLIP_PRICE = 13000;

export const GRID_UNIT = 36;
export const PX_PER_CM = 2;
export const SNAP_X_CM = 36;
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
