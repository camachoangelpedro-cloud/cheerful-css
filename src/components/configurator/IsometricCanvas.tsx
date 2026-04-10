import { useEffect, useRef, useCallback } from 'react';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import { NODO_PRODUCTS, NODO_COLORS, SNAP_X_CM, SNAP_Y_CM } from '@/data/modulesCatalog';
import type { Wall } from '@/stores/configuratorStore';

/* ── GLB URL resolver (same logic as ProductoPage) ── */
const GITHUB_BASE =
  'https://raw.githubusercontent.com/camachoangelpedro-cloud/cheerful-css/main/public/models';

function resolveModuleGlb(
  handle: string, colorCode: string, interior: string, panel: string
): string {
  const sinPanel = panel === 'Sin panel';
  let intCode = 'A';
  if (interior === 'Con repisa') intCode = 'S';
  if (interior === 'Con puerta' || interior === 'Con puerta y repisa') intCode = 'D';
  const panelCode = sinPanel ? 'O' : 'B';
  const SIZE_MAP: Record<string, string> = {
    'modulo-36-18': '1X05', 'modulo-36-24': '1X07', 'modulo-36-36': '1X1',
    'modulo-36-72': '1X2',  'modulo-72-18': '2X05', 'modulo-72-24': '2X07',
    'modulo-72-36': '2X1',  'modulo-72-72': '2X2',
    'base-36-36': 'PLT-1X1', 'base-72-36': 'PLT-2X1',
  };
  const sizeCode = SIZE_MAP[handle];
  if (!sizeCode) return '';
  if (handle.startsWith('base-')) return `${GITHUB_BASE}/${sizeCode}-${colorCode}.glb`;
  if (handle === 'modulo-72-72') return `${GITHUB_BASE}/MOD-2X2-DD-B-${colorCode}.glb`;
  return `${GITHUB_BASE}/MOD-${sizeCode}-${intCode}-${panelCode}-${colorCode}.glb`;
}

function hexToColor3(B: any, hex: string) {
  return new B.Color3(
    parseInt(hex.slice(1, 3), 16) / 255,
    parseInt(hex.slice(3, 5), 16) / 255,
    parseInt(hex.slice(5, 7), 16) / 255,
  );
}

function snap(v: number, grid: number, min: number, max: number) {
  return Math.max(min, Math.min(Math.round(v / grid) * grid, max));
}

/* ── Component ── */
export default function IsometricCanvas() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const engineRef   = useRef<any>(null);
  const sceneRef    = useRef<any>(null);
  const cameraRef   = useRef<any>(null);
  const ghostRef    = useRef<any>(null);
  const ghostMatRef = useRef<any>(null);
  const meshMapRef  = useRef<Map<string, any>>(new Map());
  const dhRef       = useRef<string | null>(null);  // dragHandle mirror
  const wallRef     = useRef<Wall | null>(null);
  const updateGhostRef = useRef<((dh: string, w: Wall, sx: number, sy: number) => void) | null>(null);
  const placeRef       = useRef<((dh: string, w: Wall, sx: number, sy: number) => void) | null>(null);
  const escCleanupRef  = useRef<(() => void) | null>(null);
  const resizeCleanupRef = useRef<(() => void) | null>(null);

  const { wall, placedModules, dragHandle } = useConfiguratorStore();

  /* Keep refs in sync */
  useEffect(() => { dhRef.current   = dragHandle; }, [dragHandle]);
  useEffect(() => { wallRef.current = wall;       }, [wall]);

  /* ── Scene init ── */
  useEffect(() => {
    if (!canvasRef.current || !wall) return;
    const canvas = canvasRef.current;

    const init = async () => {
      const loadScript = (src: string) => new Promise<void>((res) => {
        if (document.querySelector(`script[src="${src}"]`)) { res(); return; }
        const s = document.createElement('script');
        s.src = src; s.onload = () => res();
        document.head.appendChild(s);
      });

      if (!(window as any).BABYLON) {
        await loadScript('https://cdn.babylonjs.com/babylon.js');
        await loadScript('https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js');
      }

      const B = (window as any).BABYLON;
      if (engineRef.current) { engineRef.current.dispose(); }

      const engine = new B.Engine(canvas, true, { preserveDrawingBuffer: true });
      engineRef.current = engine;
      meshMapRef.current.clear();

      const scene = new B.Scene(engine);
      sceneRef.current = scene;
      scene.clearColor = new B.Color4(0.929, 0.914, 0.886, 1);

      const W = wall.widthCm, H = wall.heightCm;

      /* Camera — front-left isometric, no wheel zoom */
      const camera = new B.ArcRotateCamera(
        'cam', Math.PI / 5, 1.15,
        Math.max(W, H) * 1.45,
        new B.Vector3(W / 2, H / 3, 0), scene,
      );
      camera.lowerRadiusLimit = Math.max(W, H) * 0.5;
      camera.upperRadiusLimit = Math.max(W, H) * 3;
      camera.lowerBetaLimit   = 0.3;
      camera.upperBetaLimit   = 1.55;
      camera.attachControl(canvas, true);
      camera.inputs.removeByType('ArcRotateCameraMouseWheelInput');
      cameraRef.current = camera;

      /* Lights — same rig as product viewer */
      const hemi = new B.HemisphericLight('hemi', new B.Vector3(0, 1, 0), scene);
      hemi.intensity = 0.35; hemi.diffuse = new B.Color3(1, 0.96, 0.90);
      hemi.groundColor = new B.Color3(0.32, 0.26, 0.20); hemi.specular = new B.Color3(0, 0, 0);

      const key = new B.DirectionalLight('key', new B.Vector3(-0.55, -0.75, -0.36), scene);
      key.intensity = 1.8; key.diffuse = new B.Color3(1, 0.94, 0.84);
      key.specular = new B.Color3(0.08, 0.07, 0.05);

      const fill = new B.DirectionalLight('fill', new B.Vector3(0.7, -0.25, 0.65), scene);
      fill.intensity = 0.4; fill.diffuse = new B.Color3(0.92, 0.88, 0.82);
      fill.specular = new B.Color3(0, 0, 0);

      /* Back wall (pickable plane for raycasting) */
      const wallMat = new B.StandardMaterial('wallMat', scene);
      wallMat.diffuseColor = new B.Color3(0.97, 0.95, 0.92);
      wallMat.specularColor = new B.Color3(0, 0, 0);
      const wallMesh = B.MeshBuilder.CreatePlane('wall', {
        width: W, height: H, sideOrientation: B.Mesh.DOUBLESIDE,
      }, scene);
      wallMesh.position = new B.Vector3(W / 2, H / 2, -1);
      wallMesh.material = wallMat;
      wallMesh.isPickable = true;

      /* Floor */
      const floorMat = new B.StandardMaterial('floorMat', scene);
      floorMat.diffuseColor = new B.Color3(0.76, 0.71, 0.63);
      floorMat.specularColor = new B.Color3(0.03, 0.03, 0.03);
      const floor = B.MeshBuilder.CreateBox('floor', { width: W + 100, height: 3, depth: 130 }, scene);
      floor.position = new B.Vector3(W / 2, -1.5, 65);
      floor.material = floorMat; floor.isPickable = false;

      /* Side walls */
      const swMat = new B.StandardMaterial('swMat', scene);
      swMat.diffuseColor = new B.Color3(0.91, 0.89, 0.86);
      swMat.specularColor = new B.Color3(0, 0, 0);
      for (const x of [-2, W + 2]) {
        const sw = B.MeshBuilder.CreateBox('sw', { width: 4, height: H + 30, depth: 130 }, scene);
        sw.position = new B.Vector3(x, H / 2, 65);
        sw.material = swMat; sw.isPickable = false;
      }

      /* Window */
      if (wall.hasWindow) {
        const winMat = new B.StandardMaterial('winMat', scene);
        winMat.diffuseColor  = new B.Color3(0.72, 0.83, 0.91);
        winMat.emissiveColor = new B.Color3(0.35, 0.50, 0.60);
        winMat.alpha = 0.55;
        const win = B.MeshBuilder.CreatePlane('win', {
          width: wall.windowWidthCm, height: wall.windowHeightCm, sideOrientation: B.Mesh.DOUBLESIDE,
        }, scene);
        win.position = new B.Vector3(
          wall.windowXCm + wall.windowWidthCm / 2,
          wall.windowYCm + wall.windowHeightCm / 2, 0,
        );
        win.material = winMat; win.isPickable = false;
      }

      /* Ghost mesh */
      const ghostBox = B.MeshBuilder.CreateBox('ghost', { width: 1, height: 1, depth: 1 }, scene);
      ghostBox.isVisible = false; ghostBox.isPickable = false;
      const ghostMat = new B.StandardMaterial('ghostMat', scene);
      ghostMat.diffuseColor = new B.Color3(0.10, 0.17, 0.24);
      ghostMat.alpha = 0.40;
      ghostBox.material = ghostMat;
      ghostRef.current    = ghostBox;
      ghostMatRef.current = ghostMat;

      /* ── Shared ghost update ── */
      const updateGhost = (dh: string, w: Wall, sx: number, sy: number) => {
        const pick = scene.pick(sx, sy, (m: any) => m.name === 'wall');
        if (!pick?.hit || !pick.pickedPoint) { ghostBox.isVisible = false; return; }
        const product = NODO_PRODUCTS.find(p => p.handle === dh);
        if (!product) return;
        const xCm = snap(pick.pickedPoint.x, SNAP_X_CM, 0, w.widthCm  - product.widthCm);
        const yCm = snap(pick.pickedPoint.y, SNAP_Y_CM, 0, w.heightCm - product.heightCm);
        const st = useConfiguratorStore.getState();
        const overlaps = st.placedModules.some(m => {
          const mp = NODO_PRODUCTS.find(p => p.handle === m.handle); if (!mp) return false;
          return xCm < m.xCm + mp.widthCm && xCm + product.widthCm > m.xCm &&
                 yCm < m.yCm + mp.heightCm && yCm + product.heightCm > m.yCm;
        });
        const winBlock = w.hasWindow &&
          xCm < w.windowXCm + w.windowWidthCm && xCm + product.widthCm > w.windowXCm &&
          yCm < w.windowYCm + w.windowHeightCm && yCm + product.heightCm > w.windowYCm;
        ghostMat.diffuseColor = (!overlaps && !winBlock)
          ? new B.Color3(0.10, 0.17, 0.24)
          : new B.Color3(0.86, 0.15, 0.15);
        const d = product.depthCm || 36;
        ghostBox.scaling  = new B.Vector3(product.widthCm, product.heightCm, d);
        ghostBox.position = new B.Vector3(xCm + product.widthCm / 2, yCm + product.heightCm / 2, d / 2);
        ghostBox.isVisible = true;
      };
      updateGhostRef.current = updateGhost;

      /* ── Shared place module ── */
      const placeModule = (dh: string, w: Wall, sx: number, sy: number) => {
        const pick = scene.pick(sx, sy, (m: any) => m.name === 'wall');
        if (!pick?.hit || !pick.pickedPoint) return;
        const product = NODO_PRODUCTS.find(p => p.handle === dh); if (!product) return;
        const xCm = snap(pick.pickedPoint.x, SNAP_X_CM, 0, w.widthCm  - product.widthCm);
        const yCm = snap(pick.pickedPoint.y, SNAP_Y_CM, 0, w.heightCm - product.heightCm);
        useConfiguratorStore.getState().dropModule(dh, xCm, yCm);
        useConfiguratorStore.getState().setDragHandle(null);
        ghostBox.isVisible = false;
      };
      placeRef.current = placeModule;

      /* Pointer events */
      scene.onPointerMove = () => {
        const dh = dhRef.current; const w = wallRef.current;
        if (!dh || !w) { if (ghostBox.isVisible) ghostBox.isVisible = false; return; }
        updateGhost(dh, w, scene.pointerX, scene.pointerY);
      };
      scene.onPointerDown = (evt: any) => {
        if (evt.button !== 0) return;
        const dh = dhRef.current; const w = wallRef.current;
        if (!dh || !w) return;
        placeModule(dh, w, scene.pointerX, scene.pointerY);
      };

      /* ESC to cancel */
      const onEsc = (e: KeyboardEvent) => {
        if (e.key !== 'Escape') return;
        useConfiguratorStore.getState().setDragHandle(null);
        ghostBox.isVisible = false;
      };
      window.addEventListener('keydown', onEsc);
      escCleanupRef.current = () => window.removeEventListener('keydown', onEsc);

      /* Resize */
      const onResize = () => engine.resize();
      window.addEventListener('resize', onResize);
      resizeCleanupRef.current = () => window.removeEventListener('resize', onResize);

      engine.runRenderLoop(() => scene.render());
    };

    init();

    return () => {
      escCleanupRef.current?.();
      resizeCleanupRef.current?.();
      updateGhostRef.current = null;
      placeRef.current = null;
      ghostRef.current = null;
      ghostMatRef.current = null;
      meshMapRef.current.clear();
      sceneRef.current  = null;
      cameraRef.current = null;
      if (engineRef.current) {
        engineRef.current.stopRenderLoop();
        engineRef.current.dispose();
        engineRef.current = null;
      }
    };
  }, [wall]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Sync placed modules → 3D scene ── */
  useEffect(() => {
    const scene = sceneRef.current;
    const B = (window as any).BABYLON;
    if (!scene || !B || !wall) return;

    const meshMap = meshMapRef.current;
    const currentIds = new Set(placedModules.map(m => m.instanceId));

    /* Remove deleted modules */
    for (const [id, root] of meshMap) {
      if (!currentIds.has(id)) {
        try { root?.getChildMeshes?.().forEach((c: any) => c.dispose()); root?.dispose?.(); } catch (_) {}
        meshMap.delete(id);
      }
    }

    /* Add new modules */
    placedModules.forEach(async (mod) => {
      if (meshMap.has(mod.instanceId)) return;
      const product = NODO_PRODUCTS.find(p => p.handle === mod.handle); if (!product) return;
      const color = NODO_COLORS.find(c => c.id === mod.colorCode);
      const depth = product.depthCm || 36;

      /* Placeholder colored box */
      const ph = B.MeshBuilder.CreateBox(`ph-${mod.instanceId}`, {
        width: product.widthCm, height: product.heightCm, depth,
      }, scene);
      ph.position = new B.Vector3(
        mod.xCm + product.widthCm / 2, mod.yCm + product.heightCm / 2, depth / 2,
      );
      const phMat = new B.StandardMaterial(`phm-${mod.instanceId}`, scene);
      phMat.diffuseColor = hexToColor3(B, color?.hex ?? '#cccccc');
      phMat.specularColor = new B.Color3(0.05, 0.05, 0.05);
      ph.material = phMat; ph.isPickable = false;
      meshMap.set(mod.instanceId, ph);

      /* Try loading the actual GLB */
      const glbUrl = resolveModuleGlb(mod.handle, mod.colorCode, mod.interior, mod.panel);
      if (!glbUrl) return;
      try {
        const last = glbUrl.lastIndexOf('/');
        const result = await B.SceneLoader.ImportMeshAsync(
          '', glbUrl.slice(0, last + 1), glbUrl.slice(last + 1), scene,
        );

        if (!meshMap.has(mod.instanceId) || scene.isDisposed) {
          result.meshes.forEach((m: any) => { try { m.dispose(); } catch (_) {} });
          return;
        }
        try { ph.dispose(); } catch (_) {}

        const root = result.meshes[0];
        result.meshes.forEach((m: any) => { m.isPickable = false; });
        result.meshes.forEach((m: any) => m.computeWorldMatrix(true));

        /* Bounding box of child meshes */
        let minX = Infinity, minY = Infinity, minZ = Infinity;
        let maxX = -Infinity, maxY = -Infinity;
        result.meshes.slice(1).forEach((mesh: any) => {
          try {
            const mn = mesh.getBoundingInfo().boundingBox.minimumWorld;
            const mx = mesh.getBoundingInfo().boundingBox.maximumWorld;
            minX = Math.min(minX, mn.x); maxX = Math.max(maxX, mx.x);
            minY = Math.min(minY, mn.y); maxY = Math.max(maxY, mx.y);
            minZ = Math.min(minZ, mn.z);
          } catch (_) {}
        });

        /* Scale to match expected cm dimensions */
        const natW = maxX - minX, natH = maxY - minY;
        if (natW > 0 && natH > 0) {
          const s = Math.min(product.widthCm / natW, product.heightCm / natH);
          root.scaling = new B.Vector3(s, s, s);
          root.computeWorldMatrix(true);
          result.meshes.forEach((m: any) => m.computeWorldMatrix(true));
          /* Recompute world-space mins after scale */
          let mx2 = Infinity, my2 = Infinity, mz2 = Infinity;
          result.meshes.slice(1).forEach((mesh: any) => {
            try {
              const mn = mesh.getBoundingInfo().boundingBox.minimumWorld;
              mx2 = Math.min(mx2, mn.x); my2 = Math.min(my2, mn.y); mz2 = Math.min(mz2, mn.z);
            } catch (_) {}
          });
          root.position = new B.Vector3(mod.xCm - mx2, mod.yCm - my2, -mz2);
        } else {
          root.position = new B.Vector3(
            mod.xCm + product.widthCm / 2, mod.yCm + product.heightCm / 2, depth / 2,
          );
        }
        meshMap.set(mod.instanceId, root);
      } catch (err) {
        console.warn('GLB load failed:', mod.handle, err);
        /* keep placeholder */
      }
    });
  }, [placedModules, wall]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Detach camera while placing ── */
  useEffect(() => {
    const camera = cameraRef.current; const canvas = canvasRef.current;
    if (!camera || !canvas) return;
    try {
      if (dragHandle) camera.detachControl();
      else camera.attachControl(canvas, true);
    } catch (_) {}
  }, [dragHandle]);

  /* ── HTML5 drag-and-drop ── */
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dh = dhRef.current; const w = wallRef.current; const canvas = canvasRef.current;
    if (!dh || !w || !canvas || !updateGhostRef.current) return;
    const rect = canvas.getBoundingClientRect();
    updateGhostRef.current(dh, w, e.clientX - rect.left, e.clientY - rect.top);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const handle = e.dataTransfer?.getData('text/plain');
    const w = wallRef.current; const canvas = canvasRef.current;
    if (!handle || !w || !canvas || !placeRef.current) return;
    const rect = canvas.getBoundingClientRect();
    placeRef.current(handle, w, e.clientX - rect.left, e.clientY - rect.top);
    if (ghostRef.current) ghostRef.current.isVisible = false;
  }, []);

  if (!wall) return null;

  return (
    <div
      className="flex-1 relative overflow-hidden"
      onDragOver={handleDragOver}
      onDragLeave={() => { if (ghostRef.current) ghostRef.current.isVisible = false; }}
      onDrop={handleDrop}
    >
      <canvas ref={canvasRef} className="w-full h-full" style={{ touchAction: 'none' }} />

      {dragHandle && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 pointer-events-none">
          <p className="font-body text-[9px] uppercase tracking-[.12em] text-foreground/70 bg-background/80 px-3 py-1.5">
            Clic en la pared para colocar · ESC para cancelar
          </p>
        </div>
      )}
    </div>
  );
}
