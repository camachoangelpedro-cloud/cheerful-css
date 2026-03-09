export interface ModuleType {
  id: string;
  sku: string;
  name: string;
  description: string;
  widthCm: number;
  heightCm: number;
  depthCm: number;
  gridW: number; // width in grid units (1 unit = 36cm)
  gridH: number; // height in grid units (1 unit = 36cm)
  category: 'modulo' | 'placa' | 'conector';
  hasShelf: boolean;
  hasDoor: boolean;
  price: number; // EUR
}

export interface ModuleColor {
  id: string;
  name: string;
  hex: string;
  hsl: string;
}

export const MODULE_COLORS: ModuleColor[] = [
  { id: 'adobe-clay', name: 'Adobe Clay', hex: '#B17A5D', hsl: '20 32% 53%' },
  { id: 'oxide-red', name: 'Oxide Red', hex: '#A4343A', hsl: '357 52% 42%' },
  { id: 'midnight-blue', name: 'Midnight Blue', hex: '#233746', hsl: '204 33% 21%' },
  { id: 'pine-green', name: 'Pine Green', hex: '#2F4538', hsl: '150 20% 23%' },
  { id: 'roman-ochre', name: 'Roman Ochre', hex: '#C9943C', hsl: '38 54% 51%' },
];

export const GRID_UNIT = 36; // 1 grid unit = 36cm

export const MODULE_CATALOG: ModuleType[] = [
  // M1 series (36cm wide)
  { id: 'm1-05', sku: 'M1:05', name: 'M1:05', description: 'Módulo básico', widthCm: 36, heightCm: 18, depthCm: 36, gridW: 1, gridH: 0.5, category: 'modulo', hasShelf: false, hasDoor: false, price: 45 },
  { id: 'm1-07', sku: 'M1:07', name: 'M1:07', description: 'Módulo básico', widthCm: 36, heightCm: 24, depthCm: 36, gridW: 1, gridH: 0.667, category: 'modulo', hasShelf: false, hasDoor: false, price: 55 },
  { id: 'm1-1', sku: 'M1:1', name: 'M1:1', description: 'Módulo básico', widthCm: 36, heightCm: 36, depthCm: 36, gridW: 1, gridH: 1, category: 'modulo', hasShelf: false, hasDoor: false, price: 65 },
  { id: 'm1-1f', sku: 'M1:1F', name: 'M1:1F', description: 'Con repisa', widthCm: 36, heightCm: 36, depthCm: 36, gridW: 1, gridH: 1, category: 'modulo', hasShelf: true, hasDoor: false, price: 75 },
  { id: 'm1-1p', sku: 'M1:1P', name: 'M1:1P', description: 'Con puerta', widthCm: 36, heightCm: 36, depthCm: 36, gridW: 1, gridH: 1, category: 'modulo', hasShelf: false, hasDoor: true, price: 85 },
  { id: 'm1-1fp', sku: 'M1:1FP', name: 'M1:1FP', description: 'Con puerta y repisa', widthCm: 36, heightCm: 36, depthCm: 36, gridW: 1, gridH: 1, category: 'modulo', hasShelf: true, hasDoor: true, price: 95 },
  { id: 'm1-2', sku: 'M1:2', name: 'M1:2', description: 'Con puerta y repisa', widthCm: 36, heightCm: 72, depthCm: 36, gridW: 1, gridH: 2, category: 'modulo', hasShelf: true, hasDoor: true, price: 120 },
  // M2 series (72cm wide)
  { id: 'm2-05', sku: 'M2:05', name: 'M2:05', description: 'Doble ancho', widthCm: 72, heightCm: 18, depthCm: 36, gridW: 2, gridH: 0.5, category: 'modulo', hasShelf: false, hasDoor: false, price: 75 },
  { id: 'm2-07', sku: 'M2:07', name: 'M2:07', description: 'Doble ancho', widthCm: 72, heightCm: 24, depthCm: 36, gridW: 2, gridH: 0.667, category: 'modulo', hasShelf: false, hasDoor: false, price: 85 },
  { id: 'm2-1p', sku: 'M2:1P', name: 'M2:1P', description: 'Doble ancho con puerta', widthCm: 72, heightCm: 36, depthCm: 36, gridW: 2, gridH: 1, category: 'modulo', hasShelf: false, hasDoor: true, price: 110 },
  { id: 'm2-2p', sku: 'M2:2P', name: 'M2:2P', description: 'Doble ancho, 2 puertas', widthCm: 72, heightCm: 72, depthCm: 36, gridW: 2, gridH: 2, category: 'modulo', hasShelf: false, hasDoor: true, price: 160 },
  // Placas
  { id: 'p1-1', sku: 'P1:1', name: 'P1:1', description: 'Placa base', widthCm: 36, heightCm: 36, depthCm: 36, gridW: 1, gridH: 1, category: 'placa', hasShelf: false, hasDoor: false, price: 30 },
  { id: 'p2-1', sku: 'P2:1', name: 'P2:1', description: 'Placa base doble', widthCm: 72, heightCm: 36, depthCm: 36, gridW: 2, gridH: 1, category: 'placa', hasShelf: false, hasDoor: false, price: 50 },
  // Conector
  { id: 'clip', sku: 'CLIP', name: 'CLIP', description: 'Conector', widthCm: 4, heightCm: 4, depthCm: 4, gridW: 0, gridH: 0, category: 'conector', hasShelf: false, hasDoor: false, price: 5 },
];

export const VISUAL_SCALE = 60; // pixels per grid unit for isometric rendering
