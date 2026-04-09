// NODO — Master Product Catalogue v3.1
// Source of truth for all module definitions, prices and SKU codes
// Aligned with NODO_COGS_v3.xlsx — April 2026
// Rule: shelf compatible with or without back panel. Door ONLY with back panel.
// SKU format: MOD·[WxH]·[interior_code]·[panel_code]·[color_code]
// Interior codes: 0=Abierto, S=Con repisa, D=Con puerta, DS=Con puerta y repisa
// Panel codes: B=Con panel, O=Sin panel
// Color codes: BH, RO, AR, SA, AC

export interface NodoColor { id: string; name: string; hex: string; code: string; }

export interface NodoVariant { sku: string; interior: string; panel: string; color: string; price: number; }

export interface NodoProduct {
  handle: string; title: string; family: 'MOD' | 'PLT';
  widthCm: number; heightCm: number; depthCm: number;
  hasOptions: boolean; isOneOff: boolean;
  variants: NodoVariant[];
}

export const NODO_COLORS: NodoColor[] = [
  { id: 'BH', name: 'Blanco Hueso', hex: '#F2EDE4', code: 'BH' },
  { id: 'RO', name: 'Roble Natural', hex: '#D4B896', code: 'RO' },
  { id: 'AR', name: 'Arena',         hex: '#D6C9B5', code: 'AR' },
  { id: 'SA', name: 'Salvia',        hex: '#8FAF8C', code: 'SA' },
  { id: 'AC', name: 'Acero',         hex: '#6B8E9F', code: 'AC' },
];

const C = ['BH','RO','AR','SA','AC'];

export const NODO_PRODUCTS: NodoProduct[] = [
  // ── 36×18 ──────────────────────────────────────────────────────────────────
  {
    handle: 'modulo-36-18', title: 'Módulo 36×18', family: 'MOD',
    widthCm: 36, heightCm: 18, depthCm: 36,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MOD·36X18·0·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 234000 })),
      ...C.map(c => ({ sku: `MOD·36X18·0·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 229000 })),
    ],
  },
  // ── 36×24 ──────────────────────────────────────────────────────────────────
  {
    handle: 'modulo-36-24', title: 'Módulo 36×24', family: 'MOD',
    widthCm: 36, heightCm: 24, depthCm: 36,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MOD·36X24·0·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 244000 })),
      ...C.map(c => ({ sku: `MOD·36X24·0·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 236000 })),
    ],
  },
  // ── 36×36 ──────────────────────────────────────────────────────────────────
  {
    handle: 'modulo-36-36', title: 'Módulo 36×36', family: 'MOD',
    widthCm: 36, heightCm: 36, depthCm: 36,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MOD·36X36·0·B·${c}`,  interior: 'Abierto',             panel: 'Con panel', color: c, price: 263000 })),
      ...C.map(c => ({ sku: `MOD·36X36·0·O·${c}`,  interior: 'Abierto',             panel: 'Sin panel', color: c, price: 252000 })),
      ...C.map(c => ({ sku: `MOD·36X36·S·B·${c}`,  interior: 'Con repisa',          panel: 'Con panel', color: c, price: 273000 })),
      ...C.map(c => ({ sku: `MOD·36X36·S·O·${c}`,  interior: 'Con repisa',          panel: 'Sin panel', color: c, price: 262000 })),
      ...C.map(c => ({ sku: `MOD·36X36·D·B·${c}`,  interior: 'Con puerta',          panel: 'Con panel', color: c, price: 316000 })),
      ...C.map(c => ({ sku: `MOD·36X36·DS·B·${c}`, interior: 'Con puerta y repisa', panel: 'Con panel', color: c, price: 326000 })),
    ],
  },
  // ── 36×72 ──────────────────────────────────────────────────────────────────
  {
    handle: 'modulo-36-72', title: 'Módulo 36×72', family: 'MOD',
    widthCm: 36, heightCm: 72, depthCm: 36,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MOD·36X72·0·B·${c}`,  interior: 'Abierto',             panel: 'Con panel', color: c, price: 335000 })),
      ...C.map(c => ({ sku: `MOD·36X72·0·O·${c}`,  interior: 'Abierto',             panel: 'Sin panel', color: c, price: 313000 })),
      ...C.map(c => ({ sku: `MOD·36X72·S·B·${c}`,  interior: 'Con repisa',          panel: 'Con panel', color: c, price: 345000 })),
      ...C.map(c => ({ sku: `MOD·36X72·S·O·${c}`,  interior: 'Con repisa',          panel: 'Sin panel', color: c, price: 323000 })),
      ...C.map(c => ({ sku: `MOD·36X72·D·B·${c}`,  interior: 'Con puerta',          panel: 'Con panel', color: c, price: 388000 })),
      ...C.map(c => ({ sku: `MOD·36X72·DS·B·${c}`, interior: 'Con puerta y repisa', panel: 'Con panel', color: c, price: 398000 })),
    ],
  },
  // ── 72×18 ──────────────────────────────────────────────────────────────────
  {
    handle: 'modulo-72-18', title: 'Módulo 72×18', family: 'MOD',
    widthCm: 72, heightCm: 18, depthCm: 36,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MOD·72X18·0·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 315000 })),
      ...C.map(c => ({ sku: `MOD·72X18·0·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 304000 })),
    ],
  },
  // ── 72×24 ──────────────────────────────────────────────────────────────────
  {
    handle: 'modulo-72-24', title: 'Módulo 72×24', family: 'MOD',
    widthCm: 72, heightCm: 24, depthCm: 36,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MOD·72X24·0·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 327000 })),
      ...C.map(c => ({ sku: `MOD·72X24·0·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 312000 })),
    ],
  },
  // ── 72×36 ──────────────────────────────────────────────────────────────────
  {
    handle: 'modulo-72-36', title: 'Módulo 72×36', family: 'MOD',
    widthCm: 72, heightCm: 36, depthCm: 36,
    hasOptions: true, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `MOD·72X36·0·B·${c}`,  interior: 'Abierto',             panel: 'Con panel', color: c, price: 350000 })),
      ...C.map(c => ({ sku: `MOD·72X36·0·O·${c}`,  interior: 'Abierto',             panel: 'Sin panel', color: c, price: 328000 })),
      ...C.map(c => ({ sku: `MOD·72X36·S·B·${c}`,  interior: 'Con repisa',          panel: 'Con panel', color: c, price: 360000 })),
      ...C.map(c => ({ sku: `MOD·72X36·S·O·${c}`,  interior: 'Con repisa',          panel: 'Sin panel', color: c, price: 337000 })),
      ...C.map(c => ({ sku: `MOD·72X36·D·B·${c}`,  interior: 'Con puerta',          panel: 'Con panel', color: c, price: 402000 })),
      ...C.map(c => ({ sku: `MOD·72X36·DS·B·${c}`, interior: 'Con puerta y repisa', panel: 'Con panel', color: c, price: 412000 })),
    ],
  },
  // ── 72×72 — one-off ────────────────────────────────────────────────────────
  {
    handle: 'modulo-72-72', title: 'Módulo 72×72', family: 'MOD',
    widthCm: 72, heightCm: 72, depthCm: 36,
    hasOptions: false, isOneOff: true,
    variants: [
      ...C.map(c => ({ sku: `MOD·72X72·DD·B·${c}`, interior: 'Con puerta y repisa', panel: 'Con panel', color: c, price: 541000 })),
    ],
  },
  // ── BASE 36×36 ─────────────────────────────────────────────────────────────
  {
    handle: 'base-36-36', title: 'Base 36×36', family: 'PLT',
    widthCm: 36, heightCm: 36, depthCm: 0,
    hasOptions: false, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `PLT·1X1·${c}`, interior: '', panel: '', color: c, price: 33000 })),
    ],
  },
  // ── BASE 72×36 ─────────────────────────────────────────────────────────────
  {
    handle: 'base-72-36', title: 'Base 72×36', family: 'PLT',
    widthCm: 72, heightCm: 36, depthCm: 0,
    hasOptions: false, isOneOff: false,
    variants: [
      ...C.map(c => ({ sku: `PLT·2X1·${c}`, interior: '', panel: '', color: c, price: 35000 })),
    ],
  },
];

export const GRID_UNIT = 36;

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
