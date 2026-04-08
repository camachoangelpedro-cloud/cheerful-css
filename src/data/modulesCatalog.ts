// NODO — Master Product Catalogue v3
// Source of truth for all module definitions, prices, and SKU codes
// Aligned with NODO_COGS_v3.xlsx — April 2026
// SKU format: MOD·[WxH]·[interior_code]·[panel_code]·[color_code]
// Interior codes: 0=Abierto, D=Con puerta, DS=Con puerta y repisa
// Panel codes: B=Con panel, O=Sin panel
// Color codes: BH, RO, AR, SA, AC

export interface NodoColor {
  id: string;
  name: string;
  hex: string;
  code: string;
}

export interface NodoVariant {
  sku: string;
  interior: string;
  panel: string;
  color: string;
  price: number; // COP
}

export interface NodoProduct {
  handle: string;
  title: string;
  family: 'MOD' | 'PLT';
  widthCm: number;
  heightCm: number;
  depthCm: number;
  isSmall: boolean;      // H < 36cm — open only, no door, no shelf
  isWide: boolean;       // W = 72cm
  isOneOff: boolean;     // 72×72 — no configuration options
  filterCategory: 'pequeño' | 'grande' | 'base';
  variants: NodoVariant[];
}

export const NODO_COLORS: NodoColor[] = [
  { id: 'BH', name: 'Blanco Hueso', hex: '#F2EDE4', code: 'BH' },
  { id: 'RO', name: 'Roble Natural', hex: '#D4B896', code: 'RO' },
  { id: 'AR', name: 'Arena',         hex: '#D6C9B5', code: 'AR' },
  { id: 'SA', name: 'Salvia',        hex: '#8FAF8C', code: 'SA' },
  { id: 'AC', name: 'Acero',         hex: '#6B8E9F', code: 'AC' },
];

export const GRID_UNIT = 36; // 1 grid unit = 36cm

// ── PRODUCT CATALOGUE ──────────────────────────────────────────────────────
// Prices in COP from NODO_COGS_v3.xlsx — column U (Selling Price)
// Door and door+shelf variants only available with back panel (B)
// Small modules (H<36): open only, no door, no shelf

export const NODO_PRODUCTS: NodoProduct[] = [
  // ── 36cm WIDE — SMALL ──────────────────────────────────────────────────
  {
    handle: 'modulo-36x18',
    title: 'Módulo 36×18',
    family: 'MOD',
    widthCm: 36, heightCm: 18, depthCm: 36,
    isSmall: true, isWide: false, isOneOff: false,
    filterCategory: 'pequeño',
    variants: [
      ...['BH','RO','AR','SA','AC'].map(c => ({ sku: `MOD·36X18·0·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 234000 })),
      ...['BH','RO','AR','SA','AC'].map(c => ({ sku: `MOD·36X18·0·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 229000 })),
    ],
  },
  {
    handle: 'modulo-36x24',
    title: 'Módulo 36×24',
    family: 'MOD',
    widthCm: 36, heightCm: 24, depthCm: 36,
    isSmall: true, isWide: false, isOneOff: false,
    filterCategory: 'pequeño',
    variants: [
      ...['BH','RO','AR','SA','AC'].map(c => ({ sku: `MOD·36X24·0·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 244000 })),
      ...['BH','RO','AR','SA','AC'].map(c => ({ sku: `MOD·36X24·0·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 236000 })),
    ],
  },
  // ── 36cm WIDE — LARGE ─────────────────────────────────────────────────
  {
    handle: 'modulo-36x36',
    title: 'Módulo 36×36',
    family: 'MOD',
    widthCm: 36, heightCm: 36, depthCm: 36,
    isSmall: false, isWide: false, isOneOff: false,
    filterCategory: 'grande',
    variants: [
      ...['BH','RO','AR','SA','AC'].map(c => ({ sku: `MOD·36X36·0·B·${c}`,  interior: 'Abierto',           panel: 'Con panel', color: c, price: 263000 })),
      ...['BH','RO','AR','SA','AC'].map(c => ({ sku: `MOD·36X36·0·O·${c}`,  interior: 'Abierto',           panel: 'Sin panel', color: c, price: 252000 })),
      ...['BH','RO','AR','SA','AC'].map(c => ({ sku: `MOD·36X36·D·B·${c}`,  interior: 'Con puerta',        panel: 'Con panel', color: c, price: 316000 })),
      ...['BH','RO','AR','SA','AC'].map(c => ({ sku: `MOD·36X36·DS·B·${c}`, interior: 'Con puerta y repisa', panel: 'Con panel', color: c, price: 326000 })),
    ],
  },
  {
    handle: 'modulo-36x72',
    title: 'Módulo 36×72',
    family: 'MOD',
    widthCm: 36, heightCm: 72, depthCm: 36,
    isSmall: false, isWide: false, isOneOff: false,
    filterCategory: 'grande',
    variants: [
      ...['BH','RO','AR','SA','AC'].map(c => ({ sku: `MOD·36X72·0·B·${c}`,  interior: 'Abierto',           panel: 'Con panel', color: c, price: 335000 })),
      ...['BH','RO','AR','SA','AC'].map(c => ({ sku: `MOD·36X72·0·O·${c}`,  interior: 'Abierto',           panel: 'Sin panel', color: c, price: 313000 })),
      ...['BH','RO','AR','SA','AC'].map(c => ({ sku: `MOD·36X72·D·B·${c}`,  interior: 'Con puerta',        panel: 'Con panel', color: c, price: 388000 })),
      ...['BH','RO','AR','SA','AC'].map(c => ({ sku: `MOD·36X72·DS·B·${c}`, interior: 'Con puerta y repisa', panel: 'Con panel', color: c, price: 398000 })),
    ],
  },
  // ── 72cm WIDE — SMALL ─────────────────────────────────────────────────
  {
    handle: 'modulo-72x18',
    title: 'Módulo 72×18',
    family: 'MOD',
    widthCm: 72, heightCm: 18, depthCm: 36,
    isSmall: true, isWide: true, isOneOff: false,
    filterCategory: 'pequeño',
    variants: [
      ...['BH','RO','AR','SA','AC'].map(c => ({ sku: `MOD·72X18·0·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 315000 })),
      ...['BH','RO','AR','SA','AC'].map(c => ({ sku: `MOD·72X18·0·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 304000 })),
    ],
  },
  {
    handle: 'modulo-72x24',
    title: 'Módulo 72×24',
    family: 'MOD',
    widthCm: 72, heightCm: 24, depthCm: 36,
    isSmall: true, isWide: true, isOneOff: false,
    filterCategory: 'pequeño',
    variants: [
      ...['BH','RO','AR','SA','AC'].map(c => ({ sku: `MOD·72X24·0·B·${c}`, interior: 'Abierto', panel: 'Con panel', color: c, price: 327000 })),
      ...['BH','RO','AR','SA','AC'].map(c => ({ sku: `MOD·72X24·0·O·${c}`, interior: 'Abierto', panel: 'Sin panel', color: c, price: 312000 })),
    ],
  },
  // ── 72cm WIDE — LARGE ─────────────────────────────────────────────────
  {
    handle: 'modulo-72x36',
    title: 'Módulo 72×36',
    family: 'MOD',
    widthCm: 72, heightCm: 36, depthCm: 36,
    isSmall: false, isWide: true, isOneOff: false,
    filterCategory: 'grande',
    variants: [
      ...['BH','RO','AR','SA','AC'].map(c => ({ sku: `MOD·72X36·0·B·${c}`,  interior: 'Abierto',           panel: 'Con panel', color: c, price: 350000 })),
      ...['BH','RO','AR','SA','AC'].map(c => ({ sku: `MOD·72X36·0·O·${c}`,  interior: 'Abierto',           panel: 'Sin panel', color: c, price: 328000 })),
      ...['BH','RO','AR','SA','AC'].map(c => ({ sku: `MOD·72X36·D·B·${c}`,  interior: 'Con puerta',        panel: 'Con panel', color: c, price: 402000 })),
      ...['BH','RO','AR','SA','AC'].map(c => ({ sku: `MOD·72X36·DS·B·${c}`, interior: 'Con puerta y repisa', panel: 'Con panel', color: c, price: 412000 })),
    ],
  },
  {
    handle: 'modulo-72x72',
    title: 'Módulo 72×72',
    family: 'MOD',
    widthCm: 72, heightCm: 72, depthCm: 36,
    isSmall: false, isWide: true, isOneOff: true,
    filterCategory: 'grande',
    variants: [
      ...['BH','RO','AR','SA','AC'].map(c => ({ sku: `MOD·72X72·DD·B·${c}`, interior: 'Con puerta y repisa', panel: 'Con panel', color: c, price: 541000 })),
    ],
  },
  // ── GROUND PLATES ──────────────────────────────────────────────────────
  {
    handle: 'base-36x36',
    title: 'Base 36×36',
    family: 'PLT',
    widthCm: 36, heightCm: 36, depthCm: 0,
    isSmall: false, isWide: false, isOneOff: false,
    filterCategory: 'base',
    variants: [
      ...['BH','RO','AR','SA','AC'].map(c => ({ sku: `PLT·1X1·${c}`, interior: '', panel: '', color: c, price: 33000 })),
    ],
  },
  {
    handle: 'base-72x36',
    title: 'Base 72×36',
    family: 'PLT',
    widthCm: 72, heightCm: 36, depthCm: 0,
    isSmall: false, isWide: true, isOneOff: false,
    filterCategory: 'base',
    variants: [
      ...['BH','RO','AR','SA','AC'].map(c => ({ sku: `PLT·2X1·${c}`, interior: '', panel: '', color: c, price: 35000 })),
    ],
  },
];

// Helper: get colour object by code
export function getColor(code: string): NodoColor {
  return NODO_COLORS.find(c => c.id === code) || NODO_COLORS[0];
}

// Helper: get starting price for a product (lowest variant price)
export function getStartingPrice(product: NodoProduct): number {
  return Math.min(...product.variants.map(v => v.price));
}

// Helper: find variant by selected options
export function findVariant(
  product: NodoProduct,
  interior: string,
  panel: string,
  colorCode: string
): NodoVariant | undefined {
  return product.variants.find(v =>
    v.interior === interior &&
    v.panel === panel &&
    v.color === colorCode
  );
}

// ── BACKWARD COMPATIBILITY ───────────────────────────────────────────────
// These exports keep the configurator components working until they are
// migrated to the new NodoProduct types.

export interface ModuleType {
  id: string;
  sku: string;
  name: string;
  description: string;
  widthCm: number;
  heightCm: number;
  depthCm: number;
  gridW: number;
  gridH: number;
  category: 'modulo' | 'placa' | 'conector';
  hasShelf: boolean;
  hasDoor: boolean;
  price: number;
}

export interface ModuleColor {
  id: string;
  name: string;
  hex: string;
  hsl: string;
}

export const MODULE_COLORS: ModuleColor[] = [
  { id: 'BH', name: 'Blanco Hueso', hex: '#F2EDE4', hsl: '37 38% 92%' },
  { id: 'RO', name: 'Roble Natural', hex: '#D4B896', hsl: '33 43% 71%' },
  { id: 'AR', name: 'Arena',         hex: '#D6C9B5', hsl: '36 28% 77%' },
  { id: 'SA', name: 'Salvia',        hex: '#8FAF8C', hsl: '116 16% 62%' },
  { id: 'AC', name: 'Acero',         hex: '#6B8E9F', hsl: '199 21% 52%' },
];

export const VISUAL_SCALE = 60;

export const MODULE_CATALOG: ModuleType[] = [
  { id: 'm1-05', sku: 'M1:05', name: 'M1:05', description: 'Módulo básico', widthCm: 36, heightCm: 18, depthCm: 36, gridW: 1, gridH: 0.5, category: 'modulo', hasShelf: false, hasDoor: false, price: 234000 },
  { id: 'm1-07', sku: 'M1:07', name: 'M1:07', description: 'Módulo básico', widthCm: 36, heightCm: 24, depthCm: 36, gridW: 1, gridH: 0.667, category: 'modulo', hasShelf: false, hasDoor: false, price: 244000 },
  { id: 'm1-1', sku: 'M1:1', name: 'M1:1', description: 'Módulo básico', widthCm: 36, heightCm: 36, depthCm: 36, gridW: 1, gridH: 1, category: 'modulo', hasShelf: false, hasDoor: false, price: 252000 },
  { id: 'm1-1f', sku: 'M1:1F', name: 'M1:1F', description: 'Con repisa', widthCm: 36, heightCm: 36, depthCm: 36, gridW: 1, gridH: 1, category: 'modulo', hasShelf: true, hasDoor: false, price: 263000 },
  { id: 'm1-1p', sku: 'M1:1P', name: 'M1:1P', description: 'Con puerta', widthCm: 36, heightCm: 36, depthCm: 36, gridW: 1, gridH: 1, category: 'modulo', hasShelf: false, hasDoor: true, price: 316000 },
  { id: 'm1-1fp', sku: 'M1:1FP', name: 'M1:1FP', description: 'Con puerta y repisa', widthCm: 36, heightCm: 36, depthCm: 36, gridW: 1, gridH: 1, category: 'modulo', hasShelf: true, hasDoor: true, price: 326000 },
  { id: 'm1-2', sku: 'M1:2', name: 'M1:2', description: 'Con puerta y repisa', widthCm: 36, heightCm: 72, depthCm: 36, gridW: 1, gridH: 2, category: 'modulo', hasShelf: true, hasDoor: true, price: 398000 },
  { id: 'm2-05', sku: 'M2:05', name: 'M2:05', description: 'Doble ancho', widthCm: 72, heightCm: 18, depthCm: 36, gridW: 2, gridH: 0.5, category: 'modulo', hasShelf: false, hasDoor: false, price: 304000 },
  { id: 'm2-07', sku: 'M2:07', name: 'M2:07', description: 'Doble ancho', widthCm: 72, heightCm: 24, depthCm: 36, gridW: 2, gridH: 0.667, category: 'modulo', hasShelf: false, hasDoor: false, price: 312000 },
  { id: 'm2-1p', sku: 'M2:1P', name: 'M2:1P', description: 'Doble ancho con puerta', widthCm: 72, heightCm: 36, depthCm: 36, gridW: 2, gridH: 1, category: 'modulo', hasShelf: false, hasDoor: true, price: 402000 },
  { id: 'm2-2p', sku: 'M2:2P', name: 'M2:2P', description: 'Doble ancho, 2 puertas', widthCm: 72, heightCm: 72, depthCm: 36, gridW: 2, gridH: 2, category: 'modulo', hasShelf: false, hasDoor: true, price: 541000 },
  { id: 'p1-1', sku: 'P1:1', name: 'P1:1', description: 'Placa base', widthCm: 36, heightCm: 36, depthCm: 36, gridW: 1, gridH: 1, category: 'placa', hasShelf: false, hasDoor: false, price: 33000 },
  { id: 'p2-1', sku: 'P2:1', name: 'P2:1', description: 'Placa base doble', widthCm: 72, heightCm: 36, depthCm: 36, gridW: 2, gridH: 1, category: 'placa', hasShelf: false, hasDoor: false, price: 35000 },
  { id: 'clip', sku: 'CLIP', name: 'CLIP', description: 'Conector', widthCm: 4, heightCm: 4, depthCm: 4, gridW: 0, gridH: 0, category: 'conector', hasShelf: false, hasDoor: false, price: 5000 },
];
  product: NodoProduct,
  interior: string,
  panel: string,
  colorCode: string
): NodoVariant | undefined {
  return product.variants.find(v =>
    v.interior === interior &&
    v.panel === panel &&
    v.color === colorCode
  );
}
