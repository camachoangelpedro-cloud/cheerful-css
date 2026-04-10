import { create } from 'zustand';
import { NODO_PRODUCTS } from '@/data/modulesCatalog';

/* ── Types ────────────────────────────────────────────────── */

export interface PlacedModule {
  instanceId: string;
  handle: string;
  xCm: number;
  yCm: number;
  colorCode: string;
  interior: string;
  panel: string;
  apertura: string;   // 'IZQ' | 'DER' | '' (for non-door modules)
}

export interface ModuleSummaryItem {
  handle: string;
  colorCode: string;
  interior: string;
  panel: string;
  count: number;
  unitPrice: number;
}

/* PLT plates are visually tall (36cm) but physically only 18mm thick for stacking */
const PLT_STACK_HEIGHT = 1.8;
function stackHeight(mp: { family: string; heightCm: number }): number {
  return mp.family === 'PLT' ? PLT_STACK_HEIGHT : mp.heightCm;
}

/* ── Support check (exported for use in canvas) ─────────── */

export function isModuleSupported(
  xCm: number, yCm: number, widthCm: number, handle: string,
  others: PlacedModule[],
): boolean {
  const product = NODO_PRODUCTS.find(p => p.handle === handle);
  if (!product) return false;
  if (product.family === 'PLT') return yCm === 0;     // PLT only on floor
  if (yCm === 0) return true;                          // anything on floor
  return others.some(m => {                            // on top of another module
    const mp = NODO_PRODUCTS.find(p => p.handle === m.handle);
    if (!mp) return false;
    return (
      m.yCm + stackHeight(mp) === yCm &&
      xCm < m.xCm + mp.widthCm &&
      xCm + widthCm > m.xCm
    );
  });
}

/* ── Highest valid Y for a new module at given X ─────── */
export function getSupportY(
  xCm: number, widthCm: number, handle: string,
  others: PlacedModule[],
): number {
  const product = NODO_PRODUCTS.find(p => p.handle === handle);
  if (!product) return 0;
  if (product.family === 'PLT') return 0;
  let highest = 0;
  others.forEach(m => {
    const mp = NODO_PRODUCTS.find(p => p.handle === m.handle);
    if (!mp) return;
    if (xCm < m.xCm + mp.widthCm && xCm + widthCm > m.xCm) {
      highest = Math.max(highest, m.yCm + stackHeight(mp));
    }
  });
  return highest;
}

interface ConfigStore {
  placedModules: PlacedModule[];
  selectedId: string | null;
  dragHandle: string | null;
  selectedColorCode: string;
  undoStack: PlacedModule[][];
  redoStack: PlacedModule[][];

  setDragHandle: (h: string | null) => void;
  setColorCode: (code: string) => void;
  dropModule: (handle: string, xCm: number, yCm: number) => void;
  removeModule: (id: string) => void;
  selectInstance: (id: string | null) => void;
  updateModule: (id: string, patch: Partial<Omit<PlacedModule, 'instanceId' | 'handle'>>) => void;
  removeFloating: () => void;
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
  placedModules: [],
  selectedId: null,
  dragHandle: null,
  selectedColorCode: 'BH',
  undoStack: [],
  redoStack: [],

  setDragHandle: (h) => set({ dragHandle: h }),
  setColorCode:  (code) => set({ selectedColorCode: code }),

  dropModule: (handle, xCm, yCm) => {
    const state = get();
    const product = NODO_PRODUCTS.find(p => p.handle === handle);
    if (!product) return;

    if (xCm < 0 || yCm < 0) return;

    // Overlap check (uses stackHeight so PLT's visual height doesn't block stacking)
    const overlaps = state.placedModules.some(m => {
      const mp = NODO_PRODUCTS.find(p => p.handle === m.handle);
      if (!mp) return false;
      return (
        xCm < m.xCm + mp.widthCm && xCm + product.widthCm > m.xCm &&
        yCm < m.yCm + stackHeight(mp) && yCm + stackHeight(product) > m.yCm
      );
    });
    if (overlaps) return;

    // Support check
    if (!isModuleSupported(xCm, yCm, product.widthCm, handle, state.placedModules)) return;

    const colorCode = state.selectedColorCode;
    const colorVariant = product.variants.find(v => v.color === colorCode);
    const variant = colorVariant ?? product.variants[0];
    if (!variant) return;

    const singleDoorHandles = ['modulo-36-36', 'modulo-36-72'];
    const hasDoor = product.variants.some(v => v.interior.includes('puerta'));
    const hasTirador = singleDoorHandles.includes(handle) && hasDoor;

    const newMod: PlacedModule = {
      instanceId: genId(),
      handle,
      xCm,
      yCm,
      colorCode: variant.color,
      interior: variant.interior,
      panel: variant.panel,
      apertura: hasTirador ? 'DER' : '',
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
        m.instanceId === id ? { ...m, ...patch } : m,
      ),
    });
  },

  removeFloating: () => {
    const state = get();
    const supported = state.placedModules.filter(m => {
      const p = NODO_PRODUCTS.find(pp => pp.handle === m.handle);
      if (!p) return false;
      const others = state.placedModules.filter(mm => mm.instanceId !== m.instanceId);
      return isModuleSupported(m.xCm, m.yCm, p.widthCm, m.handle, others);
    });
    set({
      undoStack: pushHistory(state.placedModules, state.undoStack),
      redoStack: [],
      placedModules: supported,
      selectedId: null,
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
      selectedId: null,
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
        v.interior === m.interior && v.panel === m.panel && v.color === m.colorCode,
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
        v.interior === m.interior && v.panel === m.panel && v.color === m.colorCode,
      );
      const unitPrice = variant?.price ?? product.variants[0]?.price ?? 0;
      const existing = map.get(key);
      if (existing) existing.count++;
      else map.set(key, { handle: m.handle, colorCode: m.colorCode, interior: m.interior, panel: m.panel, count: 1, unitPrice });
    });
    return Array.from(map.values());
  },
}));
