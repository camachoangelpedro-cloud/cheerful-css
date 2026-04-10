import { useEffect, useRef, useCallback } from 'react';
import { useConfiguratorStore, getSupportY, isModuleSupported } from '@/stores/configuratorStore';
import { NODO_PRODUCTS, NODO_COLORS, SNAP_X_CM } from '@/data/modulesCatalog';

/* ── GLB URL resolver ── */
const GITHUB_BASE =
  'https://raw.githubusercontent.com/camachoangelpedro-cloud/cheerful-css/main/public/models';

function resolveModuleGlb(
  handle: string, colorCode: string, interior: string, panel: string, apertura: string,
): string {
  let intCode = 'A';
  if (interior === 'Con repisa') intCode = 'S';
  else if (interior === 'Con puerta y repisa') intCode = 'DS';
  else if (interior === 'Con puerta') intCode = 'D';
  const panelCode = panel === 'Sin panel' ? 'O' : 'B';
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
  const tSuffix = apertura ? '-T' : '';
  return `${GITHUB_BASE}/MOD-${sizeCode}-${intCode}-${panelCode}${tSuffix}-${colorCode}.glb`;
}

/* Visual hash to detect property changes that require GLB reload */
const visualHash = (mod: { handle: string; colorCode: string; interior: string; panel: string; apertura: string }) =>
  `${mod.handle}|${mod.colorCode}|${mod.interior}|${mod.panel}|${mod.apertura}`;

/* ── Component ── */
export default function IsometricCanvas() {
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const engineRef      = useRef<any>(null);
  const sceneRef       = useRef<any>(null);
  const cameraRef      = useRef<any>(null);
  const ghostRef       = useRef<any>(null);
  const ghostMatRef    = useRef<any>(null);
  const shadowGenRef   = useRef<any>(null);
  const meshMapRef     = useRef<Map<string, any>>(new Map());
  const overlayMapRef  = useRef<Map<string, any>>(new Map());
  const meshHashMapRef = useRef<Map<string, string>>(new Map());
  const dhRef          = useRef<string | null>(null);
  const updateGhostRef = useRef<((dh: string, sx: number, sy: number) => void) | null>(null);
  const placeRef       = useRef<((dh: string, sx: number, sy: number) => void) | null>(null);
  const escCleanupRef  = useRef<(() => void) | null>(null);
  const resizeCleanupRef = useRef<(() => void) | null>(null);

  const { placedModules, dragHandle, selectedId } = useConfiguratorStore();

  useEffect(() => { dhRef.current = dragHandle; }, [dragHandle]);

  /* ── Scene init (runs once) ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
      if (engineRef.current) engineRef.current.dispose();

      const engine = new B.Engine(canvas, true, { antialias: true, preserveDrawingBuffer: true });
      engineRef.current = engine;
      meshMapRef.current.clear();
      overlayMapRef.current.clear();
      meshHashMapRef.current.clear();

      const scene = new B.Scene(engine);
      sceneRef.current = scene;
      scene.clearColor = new B.Color4(0.96, 0.95, 0.93, 1);

      /* ── Camera ──
         Looking at the wall from the front-right, slightly elevated.
         Alpha = π/2: camera sits at +Z, looking toward the wall at z=0.
         Constrained to a tight arc so the room feels grounded.  */
      const camera = new B.ArcRotateCamera(
        'cam', Math.PI / 2, 1.1, 600,
        new B.Vector3(180, 90, 0), scene,
      );
      camera.lowerAlphaLimit  = Math.PI / 2 - 0.4;
      camera.upperAlphaLimit  = Math.PI / 2 + 0.4;
      camera.lowerBetaLimit   = 0.85;
      camera.upperBetaLimit   = 1.35;
      camera.lowerRadiusLimit = 200;
      camera.upperRadiusLimit = 1500;
      camera.attachControl(canvas, true);
      camera.inputs.removeByType('ArcRotateCameraMouseWheelInput');
      cameraRef.current = camera;

      /* ── Lights ── */
      const hemi = new B.HemisphericLight('hemi', new B.Vector3(0, 1, 0), scene);
      hemi.intensity   = 0.55;
      hemi.diffuse     = new B.Color3(1, 0.97, 0.94);
      hemi.groundColor = new B.Color3(0.30, 0.26, 0.22);
      hemi.specular    = new B.Color3(0, 0, 0);

      const key = new B.DirectionalLight('key', new B.Vector3(-0.4, -0.8, -0.45), scene);
      key.intensity = 1.6;
      key.diffuse   = new B.Color3(1, 0.95, 0.86);
      key.position  = new B.Vector3(500, 800, 300);

      const fill = new B.DirectionalLight('fill', new B.Vector3(0.6, -0.2, 0.7), scene);
      fill.intensity = 0.35;
      fill.diffuse   = new B.Color3(0.88, 0.88, 0.92);
      fill.specular  = new B.Color3(0, 0, 0);

      /* ── Shadow generator ── */
      const shadowGen = new B.ShadowGenerator(2048, key);
      shadowGen.useBlurExponentialShadowMap = true;
      shadowGen.blurKernel = 32;
      shadowGenRef.current = shadowGen;

      /* ── Back wall — near-white PBR (large, feels endless) ── */
      const wallMat = new B.PBRMaterial('wallMat', scene);
      wallMat.albedoColor = new B.Color3(0.97, 0.96, 0.93);
      wallMat.metallic    = 0;
      wallMat.roughness   = 0.92;
      const wallMesh = B.MeshBuilder.CreatePlane('wall', {
        width: 6000, height: 6000, sideOrientation: B.Mesh.DOUBLESIDE,
      }, scene);
      wallMesh.position       = new B.Vector3(500, 500, 0);
      wallMesh.material       = wallMat;
      wallMesh.isPickable     = true;
      wallMesh.receiveShadows = true;

      /* ── Floor — light concrete PBR ── */
      const floorMat = new B.PBRMaterial('floorMat', scene);
      floorMat.albedoColor = new B.Color3(0.82, 0.79, 0.76);
      floorMat.metallic    = 0;
      floorMat.roughness   = 0.90;
      const floorMesh = B.MeshBuilder.CreateGround('floor', { width: 5000, height: 5000 }, scene);
      floorMesh.position       = new B.Vector3(500, 0, 2500);
      floorMesh.material       = floorMat;
      floorMesh.isPickable     = false;
      floorMesh.receiveShadows = true;

      /* ── Ghost (preview box while placing) ── */
      const ghostBox = B.MeshBuilder.CreateBox('ghost', { width: 1, height: 1, depth: 1 }, scene);
      ghostBox.isVisible  = false;
      ghostBox.isPickable = false;
      const ghostMat = new B.StandardMaterial('ghostMat', scene);
      ghostMat.diffuseColor = new B.Color3(0.10, 0.17, 0.24);
      ghostMat.alpha        = 0.35;
      ghostBox.material     = ghostMat;
      ghostRef.current    = ghostBox;
      ghostMatRef.current = ghostMat;

      /* ── Ghost update (shared between Babylon pointer + HTML5 drag) ── */
      const updateGhost = (dh: string, sx: number, sy: number) => {
        const pick = scene.pick(sx, sy, (m: any) => m.name === 'wall');
        if (!pick?.hit || !pick.pickedPoint) { ghostBox.isVisible = false; return; }
        const product = NODO_PRODUCTS.find(p => p.handle === dh);
        if (!product) return;

        const xCm = Math.max(0, Math.round(pick.pickedPoint.x / SNAP_X_CM) * SNAP_X_CM);
        const st   = useConfiguratorStore.getState();
        const yCm  = getSupportY(xCm, product.widthCm, dh, st.placedModules);

        const overlaps = st.placedModules.some(m => {
          const mp = NODO_PRODUCTS.find(p => p.handle === m.handle); if (!mp) return false;
          return (xCm < m.xCm + mp.widthCm && xCm + product.widthCm > m.xCm &&
                  yCm < m.yCm + mp.heightCm && yCm + product.heightCm > m.yCm);
        });
        ghostMat.diffuseColor = overlaps
          ? new B.Color3(0.86, 0.15, 0.15)
          : new B.Color3(0.10, 0.17, 0.24);

        const d = product.depthCm || 36;
        ghostBox.scaling  = new B.Vector3(product.widthCm, product.heightCm, d);
        ghostBox.position = new B.Vector3(
          xCm + product.widthCm / 2, yCm + product.heightCm / 2, d / 2,
        );
        ghostBox.isVisible = true;
      };
      updateGhostRef.current = updateGhost;

      /* ── Place module ── */
      const placeModule = (dh: string, sx: number, sy: number) => {
        const pick = scene.pick(sx, sy, (m: any) => m.name === 'wall');
        if (!pick?.hit || !pick.pickedPoint) return;
        const product = NODO_PRODUCTS.find(p => p.handle === dh); if (!product) return;

        const xCm = Math.max(0, Math.round(pick.pickedPoint.x / SNAP_X_CM) * SNAP_X_CM);
        const st   = useConfiguratorStore.getState();
        const yCm  = getSupportY(xCm, product.widthCm, dh, st.placedModules);

        useConfiguratorStore.getState().dropModule(dh, xCm, yCm);
        useConfiguratorStore.getState().setDragHandle(null);
        ghostBox.isVisible = false;
      };
      placeRef.current = placeModule;

      /* ── Pointer events ── */
      scene.onPointerMove = () => {
        const dh = dhRef.current;
        if (!dh) { if (ghostBox.isVisible) ghostBox.isVisible = false; return; }
        updateGhost(dh, scene.pointerX, scene.pointerY);
      };

      scene.onPointerDown = (evt: any) => {
        if (evt.button !== 0) return;
        const dh = dhRef.current;
        if (dh) { placeModule(dh, scene.pointerX, scene.pointerY); return; }

        /* Select a placed module */
        const pick = scene.pick(
          scene.pointerX, scene.pointerY,
          (m: any) => m.name !== 'wall' && m.name !== 'floor' && m.name !== 'ghost' &&
                      !m.name.startsWith('overlay-'),
        );
        if (pick?.hit && pick.pickedMesh) {
          let mesh: any = pick.pickedMesh;
          let instanceId: string | null = null;
          while (mesh) {
            if (mesh.metadata?.instanceId) { instanceId = mesh.metadata.instanceId; break; }
            mesh = mesh.parent;
          }
          useConfiguratorStore.getState().selectInstance(instanceId);
        } else {
          useConfiguratorStore.getState().selectInstance(null);
        }
      };

      /* ESC to cancel drag */
      const onEsc = (e: KeyboardEvent) => {
        if (e.key !== 'Escape') return;
        useConfiguratorStore.getState().setDragHandle(null);
        ghostBox.isVisible = false;
      };
      window.addEventListener('keydown', onEsc);
      escCleanupRef.current = () => window.removeEventListener('keydown', onEsc);

      const onResize = () => engine.resize();
      window.addEventListener('resize', onResize);
      resizeCleanupRef.current = () => window.removeEventListener('resize', onResize);

      engine.runRenderLoop(() => scene.render());
    };

    init();

    return () => {
      escCleanupRef.current?.();
      resizeCleanupRef.current?.();
      updateGhostRef.current  = null;
      placeRef.current        = null;
      ghostRef.current        = null;
      ghostMatRef.current     = null;
      shadowGenRef.current    = null;
      meshMapRef.current.clear();
      overlayMapRef.current.clear();
      meshHashMapRef.current.clear();
      sceneRef.current  = null;
      cameraRef.current = null;
      if (engineRef.current) {
        engineRef.current.stopRenderLoop();
        engineRef.current.dispose();
        engineRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Sync placed modules → 3D scene ── */
  useEffect(() => {
    const scene = sceneRef.current;
    const B = (window as any).BABYLON;
    if (!scene || !B) return;

    const meshMap     = meshMapRef.current;
    const overlayMap  = overlayMapRef.current;
    const meshHashMap = meshHashMapRef.current;
    const currentIds  = new Set(placedModules.map(m => m.instanceId));

    /* Remove meshes for deleted modules */
    for (const [id, root] of meshMap) {
      if (!currentIds.has(id)) {
        try { root?.getChildMeshes?.().forEach((c: any) => c.dispose()); root?.dispose?.(); } catch (_) {}
        meshMap.delete(id);
        meshHashMap.delete(id);
      }
    }
    for (const [id, ov] of overlayMap) {
      if (!currentIds.has(id)) {
        try { ov?.dispose(); } catch (_) {}
        overlayMap.delete(id);
      }
    }

    /* Compute which modules are floating (unsupported) */
    const floatingIds = new Set(
      placedModules
        .filter(m => {
          const p = NODO_PRODUCTS.find(pp => pp.handle === m.handle);
          if (!p) return false;
          const others = placedModules.filter(mm => mm.instanceId !== m.instanceId);
          return !isModuleSupported(m.xCm, m.yCm, p.widthCm, m.handle, others);
        })
        .map(m => m.instanceId),
    );

    /* Update overlay boxes (red for floating, blue-tint for selected) */
    placedModules.forEach(mod => {
      const product    = NODO_PRODUCTS.find(p => p.handle === mod.handle);
      if (!product) return;
      const isFloating = floatingIds.has(mod.instanceId);
      const isSelected = mod.instanceId === selectedId;
      const needsOv    = isFloating || isSelected;
      const existing   = overlayMap.get(mod.instanceId);

      if (!needsOv) {
        if (existing) { try { existing.dispose(); } catch (_) {} overlayMap.delete(mod.instanceId); }
        return;
      }

      const d   = product.depthCm || 36;
      const pos = new B.Vector3(
        mod.xCm + product.widthCm / 2,
        mod.yCm + product.heightCm / 2,
        d / 2,
      );
      const col = isFloating
        ? new B.Color3(0.86, 0.15, 0.15)
        : new B.Color3(0.17, 0.37, 0.65);

      if (existing) {
        existing.position             = pos;
        existing.material.diffuseColor = col;
        return;
      }

      const ov = B.MeshBuilder.CreateBox(`overlay-${mod.instanceId}`, {
        width: product.widthCm + 1, height: product.heightCm + 1, depth: d + 1,
      }, scene);
      ov.position    = pos;
      ov.isPickable  = false;
      const ovMat    = new B.StandardMaterial(`ovmat-${mod.instanceId}`, scene);
      ovMat.diffuseColor = col;
      ovMat.alpha        = 0.22;
      ov.material    = ovMat;
      overlayMap.set(mod.instanceId, ov);
    });

    /* Add or reload module meshes */
    placedModules.forEach(async (mod) => {
      const hash = visualHash(mod);

      /* If mesh exists with same hash, nothing to do */
      if (meshMap.has(mod.instanceId) && meshHashMap.get(mod.instanceId) === hash) return;

      /* Property change → remove old mesh and reload */
      if (meshMap.has(mod.instanceId)) {
        const old = meshMap.get(mod.instanceId)!;
        try { old?.getChildMeshes?.().forEach((c: any) => c.dispose()); old?.dispose?.(); } catch (_) {}
        meshMap.delete(mod.instanceId);
      }
      meshHashMap.set(mod.instanceId, hash);

      const product = NODO_PRODUCTS.find(p => p.handle === mod.handle); if (!product) return;
      const color   = NODO_COLORS.find(c => c.id === mod.colorCode);
      const depth   = product.depthCm || 36;

      /* Placeholder colored box (PBR) shown while GLB loads */
      const hexToRgb = (hex: string) => ({
        r: parseInt(hex.slice(1, 3), 16) / 255,
        g: parseInt(hex.slice(3, 5), 16) / 255,
        b: parseInt(hex.slice(5, 7), 16) / 255,
      });
      const rgb = hexToRgb(color?.hex ?? '#cccccc');

      const ph = B.MeshBuilder.CreateBox(`ph-${mod.instanceId}`, {
        width: product.widthCm, height: product.heightCm, depth,
      }, scene);
      ph.position = new B.Vector3(
        mod.xCm + product.widthCm / 2, mod.yCm + product.heightCm / 2, depth / 2,
      );
      ph.metadata  = { instanceId: mod.instanceId };
      const phMat  = new B.PBRMaterial(`phm-${mod.instanceId}`, scene);
      phMat.albedoColor = new B.Color3(rgb.r, rgb.g, rgb.b);
      phMat.metallic    = 0;
      phMat.roughness   = 0.7;
      ph.material  = phMat;
      ph.isPickable = true;
      shadowGenRef.current?.addShadowCaster(ph, true);
      meshMap.set(mod.instanceId, ph);

      /* Attempt to load GLB */
      const glbUrl = resolveModuleGlb(mod.handle, mod.colorCode, mod.interior, mod.panel, mod.apertura);
      if (!glbUrl) return;

      try {
        const last   = glbUrl.lastIndexOf('/');
        const result = await B.SceneLoader.ImportMeshAsync(
          '', glbUrl.slice(0, last + 1), glbUrl.slice(last + 1), scene,
        );

        /* Guard: module may have been removed while GLB was loading */
        if (!meshMap.has(mod.instanceId) || scene.isDisposed) {
          result.meshes.forEach((m: any) => { try { m.dispose(); } catch (_) {} });
          return;
        }
        /* Guard: properties may have changed → stale load, discard */
        if (meshHashMap.get(mod.instanceId) !== hash) {
          result.meshes.forEach((m: any) => { try { m.dispose(); } catch (_) {} });
          return;
        }

        try { ph.dispose(); } catch (_) {}

        const root = result.meshes[0];

        /* Tag every mesh so clicks can resolve instanceId */
        result.meshes.forEach((m: any) => {
          m.isPickable = true;
          m.metadata   = { ...(m.metadata ?? {}), instanceId: mod.instanceId };
        });

        /* Rotate 180° on Y so the front of the module faces the viewer */
        root.rotation.y = Math.PI;
        result.meshes.forEach((m: any) => m.computeWorldMatrix(true));

        /* Compute world bounding box (already includes the rotation) */
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;
        result.meshes.slice(1).forEach((mesh: any) => {
          try {
            const mn = mesh.getBoundingInfo().boundingBox.minimumWorld;
            const mx = mesh.getBoundingInfo().boundingBox.maximumWorld;
            minX = Math.min(minX, mn.x); maxX = Math.max(maxX, mx.x);
            minY = Math.min(minY, mn.y); maxY = Math.max(maxY, mx.y);
          } catch (_) {}
        });

        const natW = maxX - minX;
        const natH = maxY - minY;

        if (natW > 0 && natH > 0) {
          /* Scale to match expected cm dimensions */
          const s = Math.min(product.widthCm / natW, product.heightCm / natH);
          root.scaling = new B.Vector3(s, s, s);
          root.computeWorldMatrix(true);
          result.meshes.forEach((m: any) => m.computeWorldMatrix(true));

          /* Recompute world-space minimums after scale */
          let mx2 = Infinity, my2 = Infinity, mz2 = Infinity;
          result.meshes.slice(1).forEach((mesh: any) => {
            try {
              const mn = mesh.getBoundingInfo().boundingBox.minimumWorld;
              mx2 = Math.min(mx2, mn.x);
              my2 = Math.min(my2, mn.y);
              mz2 = Math.min(mz2, mn.z);
            } catch (_) {}
          });
          /* Position so back face is at z=0, bottom at yCm, left at xCm */
          root.position = new B.Vector3(mod.xCm - mx2, mod.yCm - my2, -mz2);
        } else {
          root.position = new B.Vector3(
            mod.xCm + product.widthCm / 2, mod.yCm + product.heightCm / 2, depth / 2,
          );
        }

        /* Shadow casting */
        result.meshes.forEach((m: any) => shadowGenRef.current?.addShadowCaster(m, true));

        meshMap.set(mod.instanceId, root);
      } catch (err) {
        console.warn('GLB load failed:', mod.handle, err);
        /* Placeholder stays in place */
      }
    });
  }, [placedModules, selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Detach camera while drag-placing ── */
  useEffect(() => {
    const camera = cameraRef.current;
    const canvas = canvasRef.current;
    if (!camera || !canvas) return;
    try {
      if (dragHandle) camera.detachControl();
      else camera.attachControl(canvas, true);
    } catch (_) {}
  }, [dragHandle]);

  /* ── HTML5 drag-and-drop ── */
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dh = dhRef.current;
    const canvas = canvasRef.current;
    if (!dh || !canvas || !updateGhostRef.current) return;
    const rect = canvas.getBoundingClientRect();
    updateGhostRef.current(dh, e.clientX - rect.left, e.clientY - rect.top);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const handle = e.dataTransfer?.getData('text/plain');
    const canvas = canvasRef.current;
    if (!handle || !canvas || !placeRef.current) return;
    const rect = canvas.getBoundingClientRect();
    placeRef.current(handle, e.clientX - rect.left, e.clientY - rect.top);
    if (ghostRef.current) ghostRef.current.isVisible = false;
  }, []);

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
