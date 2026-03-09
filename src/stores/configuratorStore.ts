import { create } from 'zustand';
import { MODULE_COLORS, type ModuleType } from '@/data/modulesCatalog';

export interface PlacedModule {
  instanceId: string;
  moduleType: ModuleType;
  colorId: string;
  gridX: number; // column position
  gridY: number; // vertical stack position (0 = ground)
}

interface HistoryEntry {
  modules: PlacedModule[];
}

interface ConfiguratorStore {
  placedModules: PlacedModule[];
  selectedColorId: string;
  selectedModuleType: ModuleType | null;
  selectedInstanceId: string | null;
  undoStack: HistoryEntry[];
  redoStack: HistoryEntry[];
  clipCount: number;

  // Actions
  selectModuleType: (module: ModuleType | null) => void;
  selectInstance: (instanceId: string | null) => void;
  setColor: (colorId: string) => void;
  changeInstanceColor: (instanceId: string, colorId: string) => void;
  placeModule: (gridX: number, gridY: number) => void;
  removeModule: (instanceId: string) => void;
  moveModule: (instanceId: string, gridX: number, gridY: number) => void;
  addClip: () => void;
  removeClip: () => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  getTotalPrice: () => number;
  getModuleSummary: () => { module: ModuleType; colorId: string; count: number }[];
}

let nextId = 1;
function genId() { return `mod-${nextId++}`; }

function pushHistory(state: { placedModules: PlacedModule[]; undoStack: HistoryEntry[] }) {
  return {
    undoStack: [...state.undoStack, { modules: [...state.placedModules] }].slice(-50),
    redoStack: [] as HistoryEntry[],
  };
}

export const useConfiguratorStore = create<ConfiguratorStore>()((set, get) => ({
  placedModules: [],
  selectedColorId: MODULE_COLORS[0].id,
  selectedModuleType: null,
  selectedInstanceId: null,
  undoStack: [],
  redoStack: [],
  clipCount: 0,

  selectModuleType: (module) => set({ selectedModuleType: module, selectedInstanceId: null }),
  selectInstance: (instanceId) => set({ selectedInstanceId: instanceId, selectedModuleType: null }),
  setColor: (colorId) => set({ selectedColorId: colorId }),

  changeInstanceColor: (instanceId, colorId) => {
    const state = get();
    set({
      ...pushHistory(state),
      placedModules: state.placedModules.map(m =>
        m.instanceId === instanceId ? { ...m, colorId } : m
      ),
    });
  },

  placeModule: (gridX, gridY) => {
    const state = get();
    if (!state.selectedModuleType || state.selectedModuleType.category === 'conector') return;

    const newModule: PlacedModule = {
      instanceId: genId(),
      moduleType: state.selectedModuleType,
      colorId: state.selectedColorId,
      gridX,
      gridY,
    };

    set({
      ...pushHistory(state),
      placedModules: [...state.placedModules, newModule],
    });
  },

  removeModule: (instanceId) => {
    const state = get();
    set({
      ...pushHistory(state),
      placedModules: state.placedModules.filter(m => m.instanceId !== instanceId),
      selectedInstanceId: state.selectedInstanceId === instanceId ? null : state.selectedInstanceId,
    });
  },

  moveModule: (instanceId, gridX, gridY) => {
    const state = get();
    set({
      ...pushHistory(state),
      placedModules: state.placedModules.map(m =>
        m.instanceId === instanceId ? { ...m, gridX, gridY } : m
      ),
    });
  },

  addClip: () => {
    const state = get();
    set({ clipCount: state.clipCount + 1 });
  },

  removeClip: () => {
    const state = get();
    if (state.clipCount > 0) set({ clipCount: state.clipCount - 1 });
  },

  undo: () => {
    const state = get();
    if (state.undoStack.length === 0) return;
    const prev = state.undoStack[state.undoStack.length - 1];
    set({
      placedModules: prev.modules,
      undoStack: state.undoStack.slice(0, -1),
      redoStack: [...state.redoStack, { modules: state.placedModules }],
    });
  },

  redo: () => {
    const state = get();
    if (state.redoStack.length === 0) return;
    const next = state.redoStack[state.redoStack.length - 1];
    set({
      placedModules: next.modules,
      redoStack: state.redoStack.slice(0, -1),
      undoStack: [...state.undoStack, { modules: state.placedModules }],
    });
  },

  reset: () => {
    const state = get();
    set({
      ...pushHistory(state),
      placedModules: [],
      clipCount: 0,
      selectedInstanceId: null,
      selectedModuleType: null,
    });
  },

  getTotalPrice: () => {
    const state = get();
    const modulesTotal = state.placedModules.reduce((sum, m) => sum + m.moduleType.price, 0);
    const clipsTotal = state.clipCount * 5;
    return modulesTotal + clipsTotal;
  },

  getModuleSummary: () => {
    const state = get();
    const map = new Map<string, { module: ModuleType; colorId: string; count: number }>();
    state.placedModules.forEach(m => {
      const key = `${m.moduleType.id}-${m.colorId}`;
      const existing = map.get(key);
      if (existing) {
        existing.count++;
      } else {
        map.set(key, { module: m.moduleType, colorId: m.colorId, count: 1 });
      }
    });
    return Array.from(map.values());
  },
}));
