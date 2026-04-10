import { create } from 'zustand';
import { NODO_PRODUCTS } from '@/data/modulesCatalog';

/* ── Types ────────────────────────────────────────────────── */

export interface Wall {
  widthCm: number;
  heightCm: number;
  hasWindow: boolean;
  windowXCm: number;
  windowYCm: number;       // from floor
  windowWidthCm: number;
  windowHeightCm: number;
}

export interface PlacedModule {
  instanceId: string;
  handle: string;          // NodoProduct.handle
  xCm: number;             // from wall left edge
  yCm: number;             // from floor (y=0 = floor)
  colorCode: string;       // BH | RO | SA | AC
  interior: string;
  panel: string;
}

export interface ModuleSummaryItem {
  handle: string;
  colorCode: string;
  interior: string;
  panel: string;
  count: number;
  unitPrice: number;
}

interface ConfigStore {
  wall: Wall | null;
  step: 1 | 2;
  placedModules: PlacedModule[];
  selectedId: string | null;
  dragHandle: string | null;
  selectedColorCode: string;
  undoStack: PlacedModule[][];
  redoStack: PlacedModule[][];

  setWall: (w: Wall) => void;
  setStep: (s: 1 | 2) => void;
  setDragHandle: (h: string | null) => void;
  setColorCode: (code: string) => void;
  dropModule: (handle: string, xCm: number, yCm: number) => void;
  removeModule: (id: string) => void;
  selectInstance: (id: string | null) => void;
  updateModule: (id: string, patch: Partial<Omit<PlacedModule, 'instanceId' | 'handle'>>) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  getTotalPrice: () => number;
  getModuleSummary: () => ModuleSummaryItem[];
}

/* ── Helpers ──────────────────────────────────────────────── */

let nextId = 1;
const genId = () => `m-${nextId++}`;

const pushHistory = (mods: PlacedModule[], stack: PlacedModule[][]): PlacedModule[][] =>
  [...stack, [...mods]].slice(-50);

/* ── Store ────────────────────────────────────────────────── */

export const useConfiguratorStore = create<ConfigStore>()((set, get) => ({
  wall: null,
  step: 1,
  placedModules: [],
  selectedId: null,
  dragHandle: null,
  selectedColorCode: 'BH',
  undoStack: [],
  redoStack: [],

  setWall: (wall) => set({ wall, step: 2 }),
  setStep: (step) => set({ step }),
  setDragHandle: (h) => set({ dragHandle: h }),
  setColorCode: (code) => set({ selectedColorCode: code }),

  dropModule: (handle, xCm, yCm) => {
    const state = get();
    const product = NODO_PRODUCTS.find(p => p.handle === handle);
    if (!product || !state.wall) return;

    // Bounds check
    if (xCm + product.widthCm > state.wall.widthCm) return;
    if (yCm + product.heightCm > state.wall.heightCm) return;
    if (xCm < 0 || yCm < 0) return;

    // Module overlap check
    const overlaps = state.placedModules.some(m => {
      const mp = NODO_PRODUCTS.find(p => p.handle === m.handle);
      if (!mp) return false;
      return (
        xCm < m.xCm + mp.widthCm &&
        xCm + product.widthCm > m.xCm &&
        yCm < m.yCm + mp.heightCm &&
        yCm + product.heightCm > m.yCm
      );
    });
    if (overlaps) return;

    // Window overlap check
    if (state.wall.hasWindow) {
      const w = state.wall;
      if (
        xCm < w.windowXCm + w.windowWidthCm &&
        xCm + product.widthCm > w.windowXCm &&
        yCm < w.windowYCm + w.windowHeightCm &&
        yCm + product.heightCm > w.windowYCm
      ) return;
    }

    // Pick best variant for selected color
    const colorCode = state.selectedColorCode;
    const colorVariant = product.variants.find(v => v.color === colorCode);
    const variant = colorVariant ?? product.variants[0];
    if (!variant) return;

    const newMod: PlacedModule = {
      instanceId: genId(),
      handle,
      xCm,
      yCm,
      colorCode: variant.color,
      interior: variant.interior,
      panel: variant.panel,
    };

    set({
      undoStack: pushHistory(state.placedModules, state.undoStack),
      redoStack: [],
      placedModules: [...state.placedModules, newMod],
    });
  },

  removeModule: (id) => {
    const state = get();
    set({
      undoStack: pushHistory(state.placedModules, state.undoStack),
      redoStack: [],
      placedModules: state.placedModules.filter(m => m.instanceId !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    });
  },

  selectInstance: (id) => set({ selectedId: id }),

  updateModule: (id, patch) => {
    const state = get();
    set({
      undoStack: pushHistory(state.placedModules, state.undoStack),
      redoStack: [],
      placedModules: state.placedModules.map(m =>
        m.instanceId === id ? { ...m, ...patch } : m
      ),
    });
  },

  undo: () => {
    const state = get();
    if (!state.undoStack.length) return;
    const prev = state.undoStack[state.undoStack.length - 1];
    set({
      placedModules: prev,
      undoStack: state.undoStack.slice(0, -1),
      redoStack: [...state.redoStack, [...state.placedModules]],
    });
  },

  redo: () => {
    const state = get();
    if (!state.redoStack.length) return;
    const next = state.redoStack[state.redoStack.length - 1];
    set({
      placedModules: next,
      redoStack: state.redoStack.slice(0, -1),
      undoStack: [...state.undoStack, [...state.placedModules]],
    });
  },

  reset: () => {
    const state = get();
    set({
      undoStack: pushHistory(state.placedModules, state.undoStack),
      redoStack: [],
      placedModules: [],
      selectedId: null,
    });
  },

  getTotalPrice: () => {
    const { placedModules } = get();
    return placedModules.reduce((sum, m) => {
      const product = NODO_PRODUCTS.find(p => p.handle === m.handle);
      if (!product) return sum;
      const variant = product.variants.find(v =>
        v.interior === m.interior && v.panel === m.panel && v.color === m.colorCode
      );
      return sum + (variant?.price ?? product.variants[0]?.price ?? 0);
    }, 0);
  },

  getModuleSummary: () => {
    const { placedModules } = get();
    const map = new Map<string, ModuleSummaryItem>();
    placedModules.forEach(m => {
      const key = `${m.handle}|${m.colorCode}|${m.interior}|${m.panel}`;
      const product = NODO_PRODUCTS.find(p => p.handle === m.handle);
      if (!product) return;
      const variant = product.variants.find(v =>
        v.interior === m.interior && v.panel === m.panel && v.color === m.colorCode
      );
      const unitPrice = variant?.price ?? product.variants[0]?.price ?? 0;
      const existing = map.get(key);
      if (existing) {
        existing.count++;
      } else {
        map.set(key, { handle: m.handle, colorCode: m.colorCode, interior: m.interior, panel: m.panel, count: 1, unitPrice });
      }
    });
    return Array.from(map.values());
  },
}));
