import { useEffect, useRef } from 'react';

/* Global cap — browsers allow ~16 WebGL contexts; we stay well under */
const ACTIVE_ENGINES: any[] = [];
const MAX_ENGINES = 8;

function evictOldest() {
  if (ACTIVE_ENGINES.length >= MAX_ENGINES) {
    const old = ACTIVE_ENGINES.shift();
    try { old?.stopRenderLoop(); old?.dispose(); } catch (_) {}
  }
}

interface CardViewerProps {
  glbUrl: string;
  bg?: string;
}

/**
 * Lightweight Babylon viewer for product cards.
 * - Lazy-initialises via IntersectionObserver (only when visible)
 * - No shadows, minimal lights → fast
 * - Render-on-demand: stops after 3 s idle
 * - Participates in a global engine pool to respect WebGL context limits
 */
export function CardViewer({ glbUrl, bg = '#F2EDE4' }: CardViewerProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const engineRef  = useRef<any>(null);
  const sceneRef   = useRef<any>(null);
  const idleRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initedRef  = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !glbUrl) return;

    let disposed = false;

    const startRendering = () => {
      const engine = engineRef.current;
      const scene  = sceneRef.current;
      if (!engine || !scene) return;
      if (idleRef.current) clearTimeout(idleRef.current);
      engine.runRenderLoop(() => scene.render());
      idleRef.current = setTimeout(() => engine.stopRenderLoop(), 3000);
    };

    const init = async () => {
      if (initedRef.current || disposed) return;
      initedRef.current = true;

      const loadScript = (src: string) => new Promise<void>((res) => {
        if (document.querySelector(`script[src="${src}"]`)) { res(); return; }
        const s = document.createElement('script'); s.src = src; s.onload = () => res();
        document.head.appendChild(s);
      });

      if (!(window as any).BABYLON) {
        await loadScript('https://cdn.babylonjs.com/babylon.js');
        await loadScript('https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js');
      }
      if (disposed) return;

      evictOldest();

      const B = (window as any).BABYLON;
      const engine = new B.Engine(canvas, true, { preserveDrawingBuffer: true });
      engine.setHardwareScalingLevel(1 / window.devicePixelRatio);
      engineRef.current = engine;
      ACTIVE_ENGINES.push(engine);

      const scene = new B.Scene(engine);
      scene.clearColor = new B.Color4(
        parseInt(bg.slice(1, 3), 16) / 255,
        parseInt(bg.slice(3, 5), 16) / 255,
        parseInt(bg.slice(5, 7), 16) / 255, 1,
      );
      sceneRef.current = scene;

      /* Fixed camera — axonometric front-left corner view, consistent across all modules */
      const camera = new B.ArcRotateCamera('cam', -Math.PI * 0.75, 0.9, 10, B.Vector3.Zero(), scene);

      /* Simple two-light rig — no shadow generator */
      const hemi = new B.HemisphericLight('hemi', new B.Vector3(0, 1, 0), scene);
      hemi.intensity   = 0.45;
      hemi.diffuse     = new B.Color3(1, 0.97, 0.93);
      hemi.groundColor = new B.Color3(0.30, 0.25, 0.20);
      hemi.specular    = new B.Color3(0, 0, 0);

      const key = new B.DirectionalLight('key', new B.Vector3(-0.55, -0.75, -0.36), scene);
      key.intensity = 1.9;
      key.diffuse   = new B.Color3(1, 0.94, 0.85);
      key.specular  = new B.Color3(0, 0, 0);

      try {
        const result = await B.SceneLoader.ImportMeshAsync('', glbUrl, '', scene, null, '.glb');
        if (disposed) {
          result.meshes.forEach((m: any) => { try { m.dispose(); } catch (_) {} });
          return;
        }

        result.meshes.forEach((mesh: any) => {
          if (mesh.material) {
            if (mesh.material.roughness !== undefined)            mesh.material.roughness = 0.78;
            if (mesh.material.metallic  !== undefined)            mesh.material.metallic  = 0;
            if (mesh.material.environmentIntensity !== undefined) mesh.material.environmentIntensity = 0;
          }
        });

        const bounds  = scene.getWorldExtends();
        const size    = bounds.max.subtract(bounds.min);
        const center  = bounds.min.add(size.scale(0.5));
        const maxDim  = Math.max(size.x, size.y, size.z);
        const dist    = maxDim * 7;

        camera.target = center;
        camera.radius = maxDim * 3.8;
        camera.lowerRadiusLimit = camera.radius;
        camera.upperRadiusLimit = camera.radius;

        key.position = new B.Vector3(
          center.x + 0.55 * dist,
          center.y + 0.75 * dist,
          center.z + 0.36 * dist,
        );
      } catch (e) { console.warn('CardViewer GLB failed:', glbUrl, e); }

      startRendering();
    };

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { observer.disconnect(); init(); } },
      { threshold: 0.1 },
    );
    observer.observe(canvas);

    return () => {
      disposed = true;
      observer.disconnect();
      if (idleRef.current) clearTimeout(idleRef.current);
      if (engineRef.current) {
        const idx = ACTIVE_ENGINES.indexOf(engineRef.current);
        if (idx !== -1) ACTIVE_ENGINES.splice(idx, 1);
        try { engineRef.current.stopRenderLoop(); engineRef.current.dispose(); } catch (_) {}
        engineRef.current = null;
      }
    };
  }, [glbUrl, bg]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}

/* ── Default GLB resolver for the first/default configuration ── */
const GITHUB_BASE =
  'https://raw.githubusercontent.com/camachoangelpedro-cloud/cheerful-css/main/public/models';

export function defaultGlb(handle: string, colorCode = 'BH'): string {
  const PLT_MAP: Record<string, string> = {
    'base-36-36': 'PLT_1X1',
    'base-72-36': 'PLT_2X1',
  };
  if (PLT_MAP[handle]) return `${GITHUB_BASE}/${PLT_MAP[handle]}_${colorCode}.glb`;
  if (handle === 'modulo-72-72') return `${GITHUB_BASE}/MOD_2X2_DD_B_${colorCode}.glb`;

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
  return `${GITHUB_BASE}/${prefix}_${sizeCode}_A_B_${colorCode}.glb`;
}
