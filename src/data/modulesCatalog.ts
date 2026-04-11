// NODO — Master Product Catalogue v4.0
// Source of truth for all module definitions, prices and SKU codes
// Aligned with NODO GLB naming convention — April 2026
// Interior codes: A=Abierto, S=Con repisa, D=Con puerta
// Panel codes: B=Con panel, O=Sin panel
// Color codes: BH, RO, VA, AF

export interface NodoColor { id: string; name: string; hex: string; code: string; }

export interface NodoVariant { sku: string; interior: string; panel: string; color: string; price: number; }

export interface NodoProduct {
  handle: string; title: string; family: 'MOD' | 'MODH' | 'PLT' | 'CLF';
  widthCm: number; heightCm: number; depthCm: number;
  hasOptions: boolean; isOneOff: boolean;
  variants: NodoVariant[];
}

export const NODO_COLORS: NodoColor[] = [
  { id: 'BH', name: 'Blanco Hueso',   hex: '#F2EDE4', code: 'BH' },
  { id: 'RO', name: 'Roble Natural',  hex: '#D4B896', code: 'RO' },
  { id: 'VA', name: 'Verde Agua',     hex: '#87B5A2', code: 'VA' },
  { id: 'AF', name: 'Antracita',      hex: '#4D5866', code: 'AF' },
];

const C = ['BH', 'RO', 'VA', 'AF'];

export const NODO_PRODUCTS: NodoProduct[] = [

  // ── MOD 36×18 ──────────────────────────────────────────────────────────────
  {
    handle: 'modulo-36-18', title: 'Módulo 36×18', family: 'MOD',
    widthCm: 36, heightCm: 18, depthCm: 36,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MOD·36X18·A·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 234000 })),
      ...C.map(c => ({ sku: `MOD·36X18·A·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 229000 })),
    ],
  },

  // ── MOD 36×24 ──────────────────────────────────────────────────────────────
  {
    handle: 'modulo-36-24', title: 'Módulo 36×24', family: 'MOD',
    widthCm: 36, heightCm: 24, depthCm: 36,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MOD·36X24·A·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 244000 })),
      ...C.map(c => ({ sku: `MOD·36X24·A·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 236000 })),
    ],
  },

  // ── MOD 36×36 ──────────────────────────────────────────────────────────────
  {
    handle: 'modulo-36-36', title: 'Módulo 36×36', family: 'MOD',
    widthCm: 36, heightCm: 36, depthCm: 36,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MOD·36X36·A·B·${c}`, interior: 'Abierto',    panel: 'Con panel', color: c, price: 263000 })),
      ...C.map(c => ({ sku: `MOD·36X36·A·O·${c}`, interior: 'Abierto',    panel: 'Sin panel', color: c, price: 252000 })),
      ...C.map(c => ({ sku: `MOD·36X36·S·B·${c}`, interior: 'Con repisa', panel: 'Con panel', color: c, price: 273000 })),
      ...C.map(c => ({ sku: `MOD·36X36·S·O·${c}`, interior: 'Con repisa', panel: 'Sin panel', color: c, price: 262000 })),
      ...C.map(c => ({ sku: `MOD·36X36·D·B·${c}`, interior: 'Con puerta', panel: 'Con panel', color: c, price: 316000 })),
    ],
  },

  // ── MOD 36×72 ──────────────────────────────────────────────────────────────
  {
    handle: 'modulo-36-72', title: 'Módulo 36×72', family: 'MOD',
    widthCm: 36, heightCm: 72, depthCm: 36,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MOD·36X72·A·B·${c}`, interior: 'Abierto',    panel: 'Con panel', color: c, price: 335000 })),
      ...C.map(c => ({ sku: `MOD·36X72·A·O·${c}`, interior: 'Abierto',    panel: 'Sin panel', color: c, price: 313000 })),
      ...C.map(c => ({ sku: `MOD·36X72·S·B·${c}`, interior: 'Con repisa', panel: 'Con panel', color: c, price: 345000 })),
      ...C.map(c => ({ sku: `MOD·36X72·S·O·${c}`, interior: 'Con repisa', panel: 'Sin panel', color: c, price: 323000 })),
      ...C.map(c => ({ sku: `MOD·36X72·D·B·${c}`, interior: 'Con puerta', panel: 'Con panel', color: c, price: 388000 })),
    ],
  },

  // ── MOD 72×18 ──────────────────────────────────────────────────────────────
  {
    handle: 'modulo-72-18', title: 'Módulo 72×18', family: 'MOD',
    widthCm: 72, heightCm: 18, depthCm: 36,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MOD·72X18·A·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 315000 })),
      ...C.map(c => ({ sku: `MOD·72X18·A·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 304000 })),
    ],
  },

  // ── MOD 72×24 ──────────────────────────────────────────────────────────────
  {
    handle: 'modulo-72-24', title: 'Módulo 72×24', family: 'MOD',
    widthCm: 72, heightCm: 24, depthCm: 36,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MOD·72X24·A·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 327000 })),
      ...C.map(c => ({ sku: `MOD·72X24·A·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 312000 })),
    ],
  },

  // ── MOD 72×36 ──────────────────────────────────────────────────────────────
  {
    handle: 'modulo-72-36', title: 'Módulo 72×36', family: 'MOD',
    widthCm: 72, heightCm: 36, depthCm: 36,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MOD·72X36·A·B·${c}`, interior: 'Abierto',    panel: 'Con panel', color: c, price: 350000 })),
      ...C.map(c => ({ sku: `MOD·72X36·A·O·${c}`, interior: 'Abierto',    panel: 'Sin panel', color: c, price: 328000 })),
      ...C.map(c => ({ sku: `MOD·72X36·S·B·${c}`, interior: 'Con repisa', panel: 'Con panel', color: c, price: 360000 })),
      ...C.map(c => ({ sku: `MOD·72X36·S·O·${c}`, interior: 'Con repisa', panel: 'Sin panel', color: c, price: 337000 })),
      ...C.map(c => ({ sku: `MOD·72X36·D·B·${c}`, interior: 'Con puerta', panel: 'Con panel', color: c, price: 402000 })),
    ],
  },

  // ── MOD 72×72 ──────────────────────────────────────────────────────────────
  {
    handle: 'modulo-72-72', title: 'Módulo 72×72', family: 'MOD',
    widthCm: 72, heightCm: 72, depthCm: 36,
    hasOptions: false, isOneOff: true,
    variants: [
      ...C.map(c => ({ sku: `MOD·72X72·DD·B·${c}`, interior: 'Con puerta', panel: 'Con panel', color: c, price: 541000 })),
    ],
  },

  // ── MODH 36×18 ─────────────────────────────────────────────────────────────
  {
    handle: 'modh-36-18', title: 'Módulo H 36×18', family: 'MODH',
    widthCm: 36, heightCm: 18, depthCm: 18,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MODH·36X18·A·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 189000 })),
      ...C.map(c => ({ sku: `MODH·36X18·A·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 183000 })),
    ],
  },

  // ── MODH 36×24 ─────────────────────────────────────────────────────────────
  {
    handle: 'modh-36-24', title: 'Módulo H 36×24', family: 'MODH',
    widthCm: 36, heightCm: 24, depthCm: 18,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MODH·36X24·A·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 199000 })),
      ...C.map(c => ({ sku: `MODH·36X24·A·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 191000 })),
    ],
  },

  // ── MODH 36×36 ─────────────────────────────────────────────────────────────
  {
    handle: 'modh-36-36', title: 'Módulo H 36×36', family: 'MODH',
    widthCm: 36, heightCm: 36, depthCm: 18,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MODH·36X36·A·B·${c}`, interior: 'Abierto',    panel: 'Con panel', color: c, price: 218000 })),
      ...C.map(c => ({ sku: `MODH·36X36·A·O·${c}`, interior: 'Abierto',    panel: 'Sin panel', color: c, price: 209000 })),
      ...C.map(c => ({ sku: `MODH·36X36·D·B·${c}`, interior: 'Con puerta', panel: 'Con panel', color: c, price: 265000 })),
    ],
  },

  // ── MODH 72×24 ─────────────────────────────────────────────────────────────
  {
    handle: 'modh-72-24', title: 'Módulo H 72×24', family: 'MODH',
    widthCm: 72, heightCm: 24, depthCm: 18,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MODH·72X24·A·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 258000 })),
      ...C.map(c => ({ sku: `MODH·72X24·A·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 248000 })),
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

  // ── CLIPS ──────────────────────────────────────────────────────────────────
  {
    handle: 'clf-std', title: 'Clips de fijación', family: 'CLF',
    widthCm: 4, heightCm: 4, depthCm: 2,
    hasOptions: false, isOneOff: false,
    variants: [
      { sku: 'CLF·STD·BR', interior: '', panel: '', color: 'BR', price: 48000 },
      { sku: 'CLF·STD·BS', interior: '', panel: '', color: 'BS', price: 48000 },
    ],
  },
];

export const GRID_UNIT = 36;
export const PX_PER_CM = 2;   // 1 cm = 2px on canvas  (36cm = 72px, 72cm = 144px)
export const SNAP_X_CM = 36;  // horizontal snap unit
export const SNAP_Y_CM = 18;  // vertical snap unit (GCD of 18,24,36,72)

export function getStartingPrice(p: NodoProduct): number { return Math.min(...p.variants.map(v => v.price)); }

export function getColor(code: string) { return NODO_COLORS.find(c => c.id === code) || NODO_COLORS[0]; }

export function findVariant(p: NodoProduct, interior: string, panel: string, color: string) {
  return p.variants.find(v => v.interior === interior && v.panel === panel && v.color === color);
}

// Backward compatibility exports for configurator
export type ModuleType = any;
export type ModuleColor = NodoColor;
export const MODULE_COLORS = NODO_COLORS;
export const MODULE_CATALOG: any[] = [];
export const VISUAL_SCALE = 60;
