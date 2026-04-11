import { useEffect, useRef, useCallback } from 'react';
import { useConfiguratorStore, getSupportY, isModuleSupported, stackHeight } from '@/stores/configuratorStore';
import { NODO_PRODUCTS, NODO_COLORS, SNAP_X_CM } from '@/data/modulesCatalog';

/* ── GLB URL resolver — mirrors ProductoPage.resolveGlbUrl exactly ── */
const GITHUB_BASE =
  'https://raw.githubusercontent.com/camachoangelpedro-cloud/cheerful-css/main/public/models';

function resolveModuleGlb(
  handle: string, colorCode: string, interior: string, panel: string, apertura: string,
  pasacables: boolean,
): string {
  const panelCode = panel === 'Sin panel' ? 'O' : 'B';
  const ap        = pasacables && panelCode === 'B';
  const apSuffix  = ap ? '_AP' : '';

  /* PLT bases */
  const PLT_MAP: Record<string, string> = {
    'base-36-36': 'PLT_1X1',
    'base-72-36': 'PLT_2X1',
  };
  if (PLT_MAP[handle]) return `${GITHUB_BASE}/${PLT_MAP[handle]}_${colorCode}.glb`;

  /* 72×72 special case — double door */
  if (handle === 'modulo-72-72') {
    return `${GITHUB_BASE}/MOD_2X2_DD_B${apSuffix}_${colorCode}.glb`;
  }

  const SIZE_MAP: Record<string, string> = {
    'modulo-36-18': '1X05', 'modulo-36-24': '1X07', 'modulo-36-36': '1X1',
    'modulo-36-72': '1X2',  'modulo-72-18': '2X05', 'modulo-72-24': '2X07',
    'modulo-72-36': '2X1',
    'modh-36-18':  '1X05',  'modh-36-24':  '1X07',  'modh-36-36':  '1X1',
    'modh-72-24':  '2X07',
  };
  const sizeCode = SIZE_MAP[handle];
  if (!sizeCode) return '';

  const prefix = handle.startsWith('modh-') ? 'MODH' : 'MOD';

  let intCode = 'A';
  if (interior === 'Con repisa')                                        intCode = 'S';
  else if (interior === 'Con puerta' || interior === 'Con puerta y repisa') intCode = 'D';

  const SINGLE_DOOR = ['modulo-36-36', 'modulo-36-72', 'modh-36-36'];
  const hasDoor = intCode === 'D';
  const tiradorSuffix = (SINGLE_DOOR.includes(handle) && hasDoor && apertura)
    ? `_${apertura}` : '';

  return `${GITHUB_BASE}/${prefix}_${sizeCode}_${intCode}_${panelCode}${tiradorSuffix}${apSuffix}_${colorCode}.glb`;
}

/* Visual hash to detect property changes that require GLB reload */
const visualHash = (mod: { handle: string; colorCode: string; interior: string; panel: string; apertura: string; pasacables: boolean }) =>
  `${mod.handle}|${mod.colorCode}|${mod.interior}|${mod.panel}|${mod.apertura}|${mod.pasacables}`;

/* ── Component ── */
export default function IsometricCanvas() {
  const canvasRef        = useRef<HTMLCanvasElement>(null);
  const engineRef        = useRef<any>(null);
  const sceneRef         = useRef<any>(null);
  const cameraRef        = useRef<any>(null);
  const ghostRef         = useRef<any>(null);
  const ghostMatRef      = useRef<any>(null);
  const shadowGenRef     = useRef<any>(null);
  const meshMapRef       = useRef<Map<string, any>>(new Map());
  const overlayMapRef    = useRef<Map<string, any>>(new Map());
  const meshHashMapRef   = useRef<Map<string, string>>(new Map());
  /* offset = mesh.position - (mod.xCm, mod.yCm); used for drag */
  const meshOffsetMapRef = useRef<Map<string, { dx: number; dy: number }>>(new Map());

  /* Drag-to-move state */
  const isDraggingPlacedRef = useRef(false);
  const draggingIdRef       = useRef<string | null>(null);
  const dragPreviewRef      = useRef<{ xCm: number; yCm: number } | null>(null);

  const dhRef              = useRef<string | null>(null);
  const updateGhostRef     = useRef<((dh: string, sx: number, sy: number) => void) | null>(null);
  const placeRef           = useRef<((dh: string, sx: number, sy: number) => void) | null>(null);
  const escCleanupRef      = useRef<(() => void) | null>(null);
  const resizeCleanupRef   = useRef<(() => void) | null>(null);
  const dragCleanupRef     = useRef<(() => void) | null>(null);
  const idleTimerRef       = useRef<ReturnType<typeof setTimeout> | null>(null);
  const renderActiveRef    = useRef(false);

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

      const engine = new B.Engine(canvas, true, {
        antialias: true,
        preserveDrawingBuffer: true,
        stencil: true,
      });
      /* High-DPI sharpness */
      engine.setHardwareScalingLevel(1 / window.devicePixelRatio);
      engineRef.current = engine;
      meshMapRef.current.clear();
      overlayMapRef.current.clear();
      meshHashMapRef.current.clear();
      meshOffsetMapRef.current.clear();

      const scene = new B.Scene(engine);
      sceneRef.current = scene;
      scene.clearColor = new B.Color4(0.965, 0.961, 0.957, 1); // background between wall & floor

      /* ── Camera
         GLB fronts face -Z. Camera must be on the -Z side to see module fronts.
         alpha = -π/3 places camera at (+X, -Z) relative to target — front-left view.
         Wall is at z=0 (module backs). Camera is at z ≈ -425 (module fronts face it). */
      const camera = new B.ArcRotateCamera(
        'cam', -Math.PI / 3, 1.38, 500,
        new B.Vector3(180, 72, 0), scene,
      );
      camera.lowerAlphaLimit  = -Math.PI / 2 - 0.1; // can swing slightly left
      camera.upperAlphaLimit  = -Math.PI / 4;        // can rotate right to see full front
      camera.lowerBetaLimit   = 1.1;
      camera.upperBetaLimit   = 1.52;
      camera.lowerRadiusLimit = 300;
      camera.upperRadiusLimit = 900;
      camera.wheelPrecision   = 10;   // controlled scroll zoom
      camera.attachControl(canvas, true);
      cameraRef.current = camera;

      /* ── Lights ── */
      const hemi = new B.HemisphericLight('hemi', new B.Vector3(0, 1, 0), scene);
      hemi.intensity   = 0.55;
      hemi.diffuse     = new B.Color3(1, 0.97, 0.94);
      hemi.groundColor = new B.Color3(0.30, 0.26, 0.22);
      hemi.specular    = new B.Color3(0, 0, 0);

      const key = new B.DirectionalLight('key', new B.Vector3(-0.4, -0.8, 0.45), scene);
      key.intensity = 1.6;
      key.diffuse   = new B.Color3(1, 0.95, 0.86);
      key.position  = new B.Vector3(500, 800, -300);

      const fill = new B.DirectionalLight('fill', new B.Vector3(0.6, -0.2, -0.7), scene);
      fill.intensity = 0.35;
      fill.diffuse   = new B.Color3(0.88, 0.88, 0.92);
      fill.specular  = new B.Color3(0, 0, 0);

      /* ── Shadow generator — PCF 1024 (good quality, much cheaper than blur) ── */
      const shadowGen = new B.ShadowGenerator(1024, key);
      shadowGen.usePercentageCloserFiltering = true;
      shadowGen.filteringQuality = B.ShadowGenerator.QUALITY_MEDIUM;
      shadowGen.bias = 0.001;
      shadowGenRef.current = shadowGen;

      /* ── Back wall — near-pure-white PBR (very light, distinct from Blanco Hueso) ── */
      const wallMat = new B.PBRMaterial('wallMat', scene);
      wallMat.albedoColor = new B.Color3(0.984, 0.980, 0.976); // #FBFAF9 — architectural white
      wallMat.metallic    = 0;
      wallMat.roughness   = 0.94;
      const wallMesh = B.MeshBuilder.CreatePlane('wall', {
        width: 8000, height: 8000, sideOrientation: B.Mesh.DOUBLESIDE,
      }, scene);
      wallMesh.position       = new B.Vector3(500, 500, 0);
      wallMesh.material       = wallMat;
      wallMesh.isPickable     = true;
      wallMesh.receiveShadows = true;

      /* ── Floor — warm light concrete (noticeably different from wall) ── */
      const floorMat = new B.PBRMaterial('floorMat', scene);
      floorMat.albedoColor = new B.Color3(0.878, 0.863, 0.847); // #E0DBBE-ish — warm light stone
      floorMat.metallic    = 0;
      floorMat.roughness   = 0.92;
      const floorMesh = B.MeshBuilder.CreateGround('floor', { width: 6000, height: 6000 }, scene);
      floorMesh.position       = new B.Vector3(500, 0, -3000);
      floorMesh.material       = floorMat;
      floorMesh.isPickable     = false;
      floorMesh.receiveShadows = true;

      /* ── Ghost preview box ── */
      const ghostBox = B.MeshBuilder.CreateBox('ghost', { width: 1, height: 1, depth: 1 }, scene);
      ghostBox.isVisible  = false;
      ghostBox.isPickable = false;
      const ghostMat = new B.StandardMaterial('ghostMat', scene);
      ghostMat.diffuseColor = new B.Color3(0.10, 0.17, 0.24);
      ghostMat.alpha        = 0.35;
      ghostBox.material     = ghostMat;
      ghostRef.current    = ghostBox;
      ghostMatRef.current = ghostMat;

      /* ── Ghost update ── */
      const updateGhost = (dh: string, sx: number, sy: number) => {
        const pick = scene.pick(sx, sy, (m: any) => m.name === 'wall');
        if (!pick?.hit || !pick.pickedPoint) { ghostBox.isVisible = false; return; }
        const product = NODO_PRODUCTS.find(p => p.handle === dh);
        if (!product) return;
        const xCm = Math.max(0, Math.round(pick.pickedPoint.x / SNAP_X_CM) * SNAP_X_CM);
        const st  = useConfiguratorStore.getState();
        const yCm = getSupportY(xCm, product.widthCm, dh, st.placedModules);
        const overlaps = st.placedModules.some(m => {
          const mp = NODO_PRODUCTS.find(p => p.handle === m.handle); if (!mp) return false;
          return xCm < m.xCm + mp.widthCm && xCm + product.widthCm > m.xCm &&
                 yCm < m.yCm + stackHeight(mp) && yCm + stackHeight(product) > m.yCm;
        });
        ghostMat.diffuseColor = overlaps
          ? new B.Color3(0.86, 0.15, 0.15)
          : new B.Color3(0.10, 0.17, 0.24);
        const d = product.depthCm || 36;
        ghostBox.scaling  = new B.Vector3(product.widthCm, product.heightCm, d);
        ghostBox.position = new B.Vector3(xCm + product.widthCm / 2, yCm + product.heightCm / 2, -d / 2);
        ghostBox.isVisible = true;
      };
      updateGhostRef.current = updateGhost;

      /* ── Place new module ── */
      const placeModule = (dh: string, sx: number, sy: number) => {
        const pick = scene.pick(sx, sy, (m: any) => m.name === 'wall');
        if (!pick?.hit || !pick.pickedPoint) return;
        const product = NODO_PRODUCTS.find(p => p.handle === dh); if (!product) return;
        const xCm = Math.max(0, Math.round(pick.pickedPoint.x / SNAP_X_CM) * SNAP_X_CM);
        const st  = useConfiguratorStore.getState();
        const yCm = getSupportY(xCm, product.widthCm, dh, st.placedModules);
        useConfiguratorStore.getState().dropModule(dh, xCm, yCm);
        useConfiguratorStore.getState().setDragHandle(null);
        ghostBox.isVisible = false;
      };
      placeRef.current = placeModule;

      /* ── Pointer events ── */
      scene.onPointerMove = () => {
        const dh = dhRef.current;
        if (dh) { updateGhost(dh, scene.pointerX, scene.pointerY); return; }
        if (ghostBox.isVisible) ghostBox.isVisible = false;

        /* Drag placed module */
        if (isDraggingPlacedRef.current && draggingIdRef.current) {
          const id      = draggingIdRef.current;
          const pick    = scene.pick(scene.pointerX, scene.pointerY, (m: any) => m.name === 'wall');
          if (!pick?.hit || !pick.pickedPoint) return;
          const st      = useConfiguratorStore.getState();
          const mod     = st.placedModules.find(m => m.instanceId === id);
          if (!mod) return;
          const product = NODO_PRODUCTS.find(p => p.handle === mod.handle);
          if (!product) return;
          const xCm   = Math.max(0, Math.round(pick.pickedPoint.x / SNAP_X_CM) * SNAP_X_CM);
          const others = st.placedModules.filter(m => m.instanceId !== id);
          const yCm   = getSupportY(xCm, product.widthCm, mod.handle, others);
          dragPreviewRef.current = { xCm, yCm };

          const mesh   = meshMapRef.current.get(id);
          const offset = meshOffsetMapRef.current.get(id);
          if (mesh && offset) {
            mesh.position.x = xCm + offset.dx;
            mesh.position.y = yCm + offset.dy;
          }
          const ov = overlayMapRef.current.get(id);
          if (ov) {
            const d = product.depthCm || 36;
            ov.position.x = xCm + product.widthCm / 2;
            ov.position.y = yCm + product.heightCm / 2;
            ov.position.z = -d / 2;
          }
        }
      };

      scene.onPointerDown = (evt: any) => {
        if (evt.button !== 0) return;
        const dh = dhRef.current;

        /* Place new module from catalog */
        if (dh) { placeModule(dh, scene.pointerX, scene.pointerY); return; }

        /* Pick a placed module */
        const pick = scene.pick(
          scene.pointerX, scene.pointerY,
          (m: any) => m.name !== 'wall' && m.name !== 'floor' &&
                      m.name !== 'ghost' && !m.name.startsWith('overlay-'),
        );
        if (pick?.hit && pick.pickedMesh) {
          let mesh: any = pick.pickedMesh;
          let instanceId: string | null = null;
          while (mesh) {
            if (mesh.metadata?.instanceId) { instanceId = mesh.metadata.instanceId; break; }
            mesh = mesh.parent;
          }
          if (instanceId) {
            useConfiguratorStore.getState().selectInstance(instanceId);
            /* Start drag-to-move */
            isDraggingPlacedRef.current = true;
            draggingIdRef.current       = instanceId;
            dragPreviewRef.current      = null;
            const cam = cameraRef.current;
            if (cam) cam.detachControl();
            return;
          }
        }
        /* Click on empty space — deselect */
        useConfiguratorStore.getState().selectInstance(null);
      };

      /* ── Shared drag-commit/revert logic ────────────────────────────────
         Called from both scene.onPointerUp (commit=true, released on canvas)
         and the window 'pointerup' safety net (commit=false, released on an
         overlay such as the edit panel).  The window listener fires AFTER the
         scene listener for canvas releases, so the isDraggingPlacedRef guard
         prevents any double-handling. */
      const commitOrRevertDrag = (commit: boolean) => {
        if (!isDraggingPlacedRef.current) return;
        const id  = draggingIdRef.current;
        const pos = dragPreviewRef.current;
        isDraggingPlacedRef.current = false;
        draggingIdRef.current       = null;
        dragPreviewRef.current      = null;

        const st  = useConfiguratorStore.getState();
        const mod = id ? st.placedModules.find(m => m.instanceId === id) : null;

        if (commit && id && pos && mod) {
          const product = NODO_PRODUCTS.find(p => p.handle === mod.handle);
          if (product) {
            const others   = st.placedModules.filter(m => m.instanceId !== id);
            const overlaps = others.some(m => {
              const mp = NODO_PRODUCTS.find(p => p.handle === m.handle); if (!mp) return false;
              return pos.xCm < m.xCm + mp.widthCm && pos.xCm + product.widthCm > m.xCm &&
                     pos.yCm < m.yCm + stackHeight(mp) && pos.yCm + stackHeight(product) > m.yCm;
            });
            const supported = isModuleSupported(pos.xCm, pos.yCm, product.widthCm, mod.handle, others);
            if (!overlaps && supported) {
              st.updateModule(id, { xCm: pos.xCm, yCm: pos.yCm });
              const cam2 = cameraRef.current; const cvs2 = canvasRef.current;
              if (cam2 && cvs2 && !dhRef.current) cam2.attachControl(cvs2, true);
              return;
            }
          }
        }

        /* Revert mesh + overlay to the stored position */
        if (id && mod) {
          const product = NODO_PRODUCTS.find(p => p.handle === mod.handle);
          const mesh    = meshMapRef.current.get(id);
          const offset  = meshOffsetMapRef.current.get(id);
          if (mesh && offset) {
            mesh.position.x = mod.xCm + offset.dx;
            mesh.position.y = mod.yCm + offset.dy;
          }
          const ov = overlayMapRef.current.get(id);
          if (ov && product) {
            const d = product.depthCm || 36;
            ov.position.x = mod.xCm + product.widthCm / 2;
            ov.position.y = mod.yCm + product.heightCm / 2;
            ov.position.z = -d / 2;
          }
        }

        const cam = cameraRef.current; const cvs = canvasRef.current;
        if (cam && cvs && !dhRef.current) cam.attachControl(cvs, true);
      };

      scene.onPointerUp = () => commitOrRevertDrag(true);

      /* Safety net: pointer released outside canvas (edit panel, toolbar, etc.) */
      const onWindowPointerUp = () => commitOrRevertDrag(false);
      window.addEventListener('pointerup', onWindowPointerUp);
      dragCleanupRef.current = () => window.removeEventListener('pointerup', onWindowPointerUp);

      /* ESC — cancel drag/place */
      const onEsc = (e: KeyboardEvent) => {
        if (e.key !== 'Escape') return;
        useConfiguratorStore.getState().setDragHandle(null);
        ghostBox.isVisible = false;
      };
      window.addEventListener('keydown', onEsc);
      escCleanupRef.current = () => window.removeEventListener('keydown', onEsc);

      /* ── Render on demand — stop after 3 s idle, restart on interaction ── */
      const startRendering = () => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        if (!renderActiveRef.current) {
          renderActiveRef.current = true;
          engine.runRenderLoop(() => scene.render());
        }
        idleTimerRef.current = setTimeout(() => {
          engine.stopRenderLoop();
          renderActiveRef.current = false;
        }, 3000);
      };
      canvas.addEventListener('pointermove', startRendering, { passive: true });
      canvas.addEventListener('pointerdown', startRendering, { passive: true });
      /* Start immediately so the scene renders on load */
      startRendering();

      const onResize = () => { engine.resize(); startRendering(); };
      window.addEventListener('resize', onResize);
      resizeCleanupRef.current = () => window.removeEventListener('resize', onResize);
    };

    init();

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      escCleanupRef.current?.();
      resizeCleanupRef.current?.();
      dragCleanupRef.current?.();
      updateGhostRef.current  = null;
      placeRef.current        = null;
      ghostRef.current        = null;
      ghostMatRef.current     = null;
      shadowGenRef.current    = null;
      meshMapRef.current.clear();
      overlayMapRef.current.clear();
      meshHashMapRef.current.clear();
      meshOffsetMapRef.current.clear();
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

    const meshMap      = meshMapRef.current;
    const overlayMap   = overlayMapRef.current;
    const meshHashMap  = meshHashMapRef.current;
    const meshOffsetMap = meshOffsetMapRef.current;
    const currentIds   = new Set(placedModules.map(m => m.instanceId));

    /* Remove meshes for deleted modules */
    for (const [id, root] of meshMap) {
      if (!currentIds.has(id)) {
        try { root?.getChildMeshes?.().forEach((c: any) => c.dispose()); root?.dispose?.(); } catch (_) {}
        meshMap.delete(id);
        meshHashMap.delete(id);
        meshOffsetMap.delete(id);
      }
    }
    for (const [id, ov] of overlayMap) {
      if (!currentIds.has(id)) {
        try { ov?.dispose(); } catch (_) {}
        overlayMap.delete(id);
      }
    }

    /* Floating modules */
    const floatingIds = new Set(
      placedModules
        .filter(m => {
          const p = NODO_PRODUCTS.find(pp => pp.handle === m.handle);
          if (!p) return false;
          return !isModuleSupported(m.xCm, m.yCm, p.widthCm, m.handle,
            placedModules.filter(mm => mm.instanceId !== m.instanceId));
        })
        .map(m => m.instanceId),
    );

    /* Update overlay boxes */
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
      const pos = new B.Vector3(mod.xCm + product.widthCm / 2, mod.yCm + product.heightCm / 2, -d / 2);
      const col = isFloating ? new B.Color3(0.86, 0.15, 0.15) : new B.Color3(0.17, 0.37, 0.65);

      if (existing) { existing.position = pos; existing.material.diffuseColor = col; return; }

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

      if (meshMap.has(mod.instanceId) && meshHashMap.get(mod.instanceId) === hash) return;

      /* Property changed → remove old mesh */
      if (meshMap.has(mod.instanceId)) {
        const old = meshMap.get(mod.instanceId)!;
        try { old?.getChildMeshes?.().forEach((c: any) => c.dispose()); old?.dispose?.(); } catch (_) {}
        meshMap.delete(mod.instanceId);
        meshOffsetMap.delete(mod.instanceId);
      }
      meshHashMap.set(mod.instanceId, hash);

      const product = NODO_PRODUCTS.find(p => p.handle === mod.handle); if (!product) return;
      const color   = NODO_COLORS.find(c => c.id === mod.colorCode);
      const depth   = product.depthCm || 36;

      const hexToRgb = (hex: string) => ({
        r: parseInt(hex.slice(1, 3), 16) / 255,
        g: parseInt(hex.slice(3, 5), 16) / 255,
        b: parseInt(hex.slice(5, 7), 16) / 255,
      });
      const rgb = hexToRgb(color?.hex ?? '#cccccc');

      /* Placeholder PBR box */
      const ph    = B.MeshBuilder.CreateBox(`ph-${mod.instanceId}`, {
        width: product.widthCm, height: product.heightCm, depth,
      }, scene);
      ph.position = new B.Vector3(
        mod.xCm + product.widthCm / 2, mod.yCm + product.heightCm / 2, -depth / 2,
      );
      ph.metadata   = { instanceId: mod.instanceId };
      const phMat   = new B.PBRMaterial(`phm-${mod.instanceId}`, scene);
      phMat.albedoColor = new B.Color3(rgb.r, rgb.g, rgb.b);
      phMat.metallic    = 0;
      phMat.roughness   = 0.7;
      ph.material   = phMat;
      ph.isPickable = true;
      shadowGenRef.current?.addShadowCaster(ph, true);

      /* Offset for box: center of module */
      meshOffsetMap.set(mod.instanceId, {
        dx: product.widthCm / 2,
        dy: product.heightCm / 2,
      });
      meshMap.set(mod.instanceId, ph);

      /* Load GLB (no rotation — GLBs are already front-facing, same as ProductoPage) */
      const glbUrl = resolveModuleGlb(mod.handle, mod.colorCode, mod.interior, mod.panel, mod.apertura, mod.pasacables);
      if (!glbUrl) return;

      try {
        const last   = glbUrl.lastIndexOf('/');
        const result = await B.SceneLoader.ImportMeshAsync(
          '', glbUrl.slice(0, last + 1), glbUrl.slice(last + 1), scene,
        );

        if (!meshMap.has(mod.instanceId) || scene.isDisposed) {
          result.meshes.forEach((m: any) => { try { m.dispose(); } catch (_) {} });
          return;
        }
        if (meshHashMap.get(mod.instanceId) !== hash) {
          result.meshes.forEach((m: any) => { try { m.dispose(); } catch (_) {} });
          return;
        }
        try { ph.dispose(); } catch (_) {}

        const root = result.meshes[0];
        result.meshes.forEach((m: any) => {
          m.isPickable = true;
          m.metadata   = { ...(m.metadata ?? {}), instanceId: mod.instanceId };
          if (m.material) {
            if (m.material.roughness !== undefined) m.material.roughness = 0.78;
            if (m.material.metallic  !== undefined) m.material.metallic  = 0;
            if (m.material.environmentIntensity !== undefined)
              m.material.environmentIntensity = 0;
          }
        });

        result.meshes.forEach((m: any) => m.computeWorldMatrix(true));

        /* Bounding box → scale to cm → position so bottom-left-back = (xCm, yCm, 0) */
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

        const natW = maxX - minX, natH = maxY - minY;
        if (natW > 0 && natH > 0) {
          const s = Math.min(product.widthCm / natW, product.heightCm / natH);
          root.scaling = new B.Vector3(s, s, s);
          root.computeWorldMatrix(true);
          result.meshes.forEach((m: any) => m.computeWorldMatrix(true));

          let mx2 = Infinity, my2 = Infinity, mzMax = -Infinity;
          result.meshes.slice(1).forEach((mesh: any) => {
            try {
              const mn = mesh.getBoundingInfo().boundingBox.minimumWorld;
              const mx = mesh.getBoundingInfo().boundingBox.maximumWorld;
              mx2   = Math.min(mx2, mn.x);
              my2   = Math.min(my2, mn.y);
              mzMax = Math.max(mzMax, mx.z);
            } catch (_) {}
          });
          /* Place module so back panel (maxZ) sits at z=0 (wall), front faces camera at -z */
          root.position = new B.Vector3(mod.xCm - mx2, mod.yCm - my2, -mzMax);

          /* Store offset for drag repositioning */
          meshOffsetMap.set(mod.instanceId, {
            dx: root.position.x - mod.xCm,
            dy: root.position.y - mod.yCm,
          });
        } else {
          root.position = new B.Vector3(
            mod.xCm + product.widthCm / 2, mod.yCm + product.heightCm / 2, -depth / 2,
          );
          meshOffsetMap.set(mod.instanceId, {
            dx: product.widthCm / 2,
            dy: product.heightCm / 2,
          });
        }

        result.meshes.forEach((m: any) => shadowGenRef.current?.addShadowCaster(m, true));
        meshMap.set(mod.instanceId, root);
      } catch (err) {
        console.warn('GLB load failed:', mod.handle, err);
      }
    });
    /* Wake the render loop whenever modules change */
    if (engineRef.current && sceneRef.current) {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (!renderActiveRef.current) {
        renderActiveRef.current = true;
        engineRef.current.runRenderLoop(() => sceneRef.current?.render());
      }
      idleTimerRef.current = setTimeout(() => {
        engineRef.current?.stopRenderLoop();
        renderActiveRef.current = false;
      }, 3000);
    }
  }, [placedModules, selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Detach camera during catalog drag ── */
  useEffect(() => {
    const camera = cameraRef.current; const canvas = canvasRef.current;
    if (!camera || !canvas) return;
    try {
      if (dragHandle) camera.detachControl();
      else if (!isDraggingPlacedRef.current) camera.attachControl(canvas, true);
    } catch (_) {}
  }, [dragHandle]);

  /* ── HTML5 drag-and-drop from catalog ── */
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dh = dhRef.current; const canvas = canvasRef.current;
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
