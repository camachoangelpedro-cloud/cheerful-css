// NODO — Catalogue product data (display layer)
// Single source of truth for catalogue grid, filters, and sort.
// Slugs match Shopify product handles used by the PDP.

export type ProductCategory =
  | 'modulo-profundidad-completa'
  | 'modulo-media-profundidad'
  | 'base'
  | 'clip';

export interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  categoryLabel: string;
  dimensions: string;
  colors: string[];
  price: number;
  image: string;
  description: string;
}

// ── Color name → hex (for swatch rendering) ──────────────────────────────────
export const COLOR_HEX: Record<string, string> = {
  'Blanco Hueso':    '#F2EDE4',
  'Roble Natural':   '#D4B896',
  'Verde Agave':     '#7A9080',
  'Azul Fes':        '#2E3B6E',
  'Negro':           '#1C1C1A',
  'Latón':           '#C5A55A',
  'Acero cepillado': '#9B9B9B',
};

// ── Shared color set for modules and bases ───────────────────────────────────
const MODULE_COLORS = ['Blanco Hueso', 'Roble Natural', 'Verde Agave', 'Azul Fes'];

export const CATALOG_PRODUCTS: CatalogProduct[] = [

  // ── Módulos · Profundidad completa 36 cm ────────────────────────────────────
  {
    id: 'mod-36-36',
    name: 'Módulo 36 × 36',
    slug: 'modulo-36-36',
    category: 'modulo-profundidad-completa',
    categoryLabel: 'Módulos · Profundidad completa 36 cm',
    dimensions: '36 × 36 × 36 cm',
    colors: MODULE_COLORS,
    price: 234000,
    image: '/placeholder.svg',
    description: 'Módulo cuadrado de profundidad completa. Ideal como unidad base o remate de composición.',
  },
  {
    id: 'mod-36-72',
    name: 'Módulo 36 × 72',
    slug: 'modulo-36-72',
    category: 'modulo-profundidad-completa',
    categoryLabel: 'Módulos · Profundidad completa 36 cm',
    dimensions: '36 × 72 × 36 cm',
    colors: MODULE_COLORS,
    price: 340000,
    image: '/placeholder.svg',
    description: 'Módulo alto de una columna. Versátil como estantería abierta o con puerta lateral.',
  },
  {
    id: 'mod-72-36',
    name: 'Módulo 72 × 36',
    slug: 'modulo-72-36',
    category: 'modulo-profundidad-completa',
    categoryLabel: 'Módulos · Profundidad completa 36 cm',
    dimensions: '72 × 36 × 36 cm',
    colors: MODULE_COLORS,
    price: 340000,
    image: '/placeholder.svg',
    description: 'Módulo ancho de baja altura. Perfecto como aparador, cómoda o base de composición.',
  },
  {
    id: 'mod-72-72',
    name: 'Módulo 72 × 72',
    slug: 'modulo-72-72',
    category: 'modulo-profundidad-completa',
    categoryLabel: 'Módulos · Profundidad completa 36 cm',
    dimensions: '72 × 72 × 36 cm',
    colors: MODULE_COLORS,
    price: 450000,
    image: '/placeholder.svg',
    description: 'El módulo más grande del sistema. Doble puerta, máxima capacidad de almacenamiento.',
  },

  // ── Módulos · Media profundidad 18 cm ───────────────────────────────────────
  {
    id: 'modulo-h-36-36',
    name: 'Módulo 36 × 36 MP',
    slug: 'modulo-h-36-36',
    category: 'modulo-media-profundidad',
    categoryLabel: 'Módulos · Media profundidad 18 cm',
    dimensions: '36 × 36 × 18 cm',
    colors: MODULE_COLORS,
    price: 185000,
    image: '/placeholder.svg',
    description: 'Módulo cuadrado de media profundidad. Ideal para espacios reducidos o como toque ligero en una composición.',
  },
  {
    id: 'modh-36-72',
    name: 'Módulo 36 × 72 MP',
    slug: 'modh-36-72',
    category: 'modulo-media-profundidad',
    categoryLabel: 'Módulos · Media profundidad 18 cm',
    dimensions: '36 × 72 × 18 cm',
    colors: MODULE_COLORS,
    price: 270000,
    image: '/placeholder.svg',
    description: 'Módulo alto de media profundidad. Perfecto para pasillos o para libros y objetos esbeltos.',
  },
  {
    id: 'modh-72-36',
    name: 'Módulo 72 × 36 MP',
    slug: 'modh-72-36',
    category: 'modulo-media-profundidad',
    categoryLabel: 'Módulos · Media profundidad 18 cm',
    dimensions: '72 × 36 × 18 cm',
    colors: MODULE_COLORS,
    price: 270000,
    image: '/placeholder.svg',
    description: 'Módulo ancho de baja altura y media profundidad. Funciona como repisa flotante o zócalo visual.',
  },
  {
    id: 'modh-72-72',
    name: 'Módulo 72 × 72 MP',
    slug: 'modh-72-72',
    category: 'modulo-media-profundidad',
    categoryLabel: 'Módulos · Media profundidad 18 cm',
    dimensions: '72 × 72 × 18 cm',
    colors: MODULE_COLORS,
    price: 360000,
    image: '/placeholder.svg',
    description: 'El módulo de media profundidad más grande. Gran superficie de exhibición con perfil delgado.',
  },

  // ── Bases ────────────────────────────────────────────────────────────────────
  {
    id: 'base-36-36',
    name: 'Base 36 × 36',
    slug: 'base-36-36',
    category: 'base',
    categoryLabel: 'Bases',
    dimensions: '36 × 36 × 8 cm',
    colors: MODULE_COLORS,
    price: 95000,
    image: '/placeholder.svg',
    description: 'Base cuadrada para elevar módulos del suelo. Mejora la circulación de aire y facilita la limpieza.',
  },
  {
    id: 'base-72-36',
    name: 'Base 72 × 36',
    slug: 'base-72-36',
    category: 'base',
    categoryLabel: 'Bases',
    dimensions: '72 × 36 × 8 cm',
    colors: MODULE_COLORS,
    price: 130000,
    image: '/placeholder.svg',
    description: 'Base ancha para módulos dobles. Da altura y definición al conjunto sin añadir volumen visual.',
  },

  // ── Clips ────────────────────────────────────────────────────────────────────
  {
    id: 'clip-estructural',
    name: 'Clip estructural',
    slug: 'clips-decorativos',
    category: 'clip',
    categoryLabel: 'Clips',
    dimensions: '—',
    colors: ['Negro'],
    price: 7000,
    image: '/placeholder.svg',
    description: 'Conector invisible que une módulos entre sí. Incluido en cada pedido; se vende por separado como repuesto.',
  },
  {
    id: 'clip-decorativo-laton',
    name: 'Clip decorativo Latón',
    slug: 'clips-decorativos',
    category: 'clip',
    categoryLabel: 'Clips',
    dimensions: '—',
    colors: ['Latón'],
    price: 25000,
    image: '/placeholder.svg',
    description: 'Clip visible en acabado latón cepillado. Añade un detalle cálido y artesanal a la unión entre módulos.',
  },
  {
    id: 'clip-decorativo-acero',
    name: 'Clip decorativo Acero',
    slug: 'clips-decorativos',
    category: 'clip',
    categoryLabel: 'Clips',
    dimensions: '—',
    colors: ['Acero cepillado'],
    price: 25000,
    image: '/placeholder.svg',
    description: 'Clip visible en acero inoxidable cepillado. Acabado industrial y preciso, integrado al lenguaje del sistema.',
  },
];
