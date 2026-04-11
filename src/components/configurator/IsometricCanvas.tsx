import { Suspense, useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, useThree, ThreeEvent } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  useConfiguratorStore,
  getSupportY,
  isModuleSupported,
  stackHeight,
  PlacedModule,
} from '@/stores/configuratorStore';
import { NODO_PRODUCTS, SNAP_X_CM } from '@/data/modulesCatalog';

/* ── GLB URL resolver ── */
const GITHUB_BASE =
  'https://raw.githubusercontent.com/camachoangelpedro-cloud/cheerful-css/main/public/models';

function resolveModuleGlb(
  handle: string, colorCode: string, interior: string, panel: string, apertura: string,
  pasacables: boolean,
): string {
  const panelCode = panel === 'Sin panel' ? 'O' : 'B';
  const ap        = pasacables && panelCode === 'B';
  const apSuffix  = ap ? '_AP' : '';

  const PLT_MAP: Record<string, string> = {
    'base-36-36': 'PLT_1X1',
    'base-72-36': 'PLT_2X1',
  };
  if (PLT_MAP[handle]) return `${GITHUB_BASE}/${PLT_MAP[handle]}_${colorCode}.glb`;
  if (handle === 'modulo-72-72') return `${GITHUB_BASE}/MOD_2X2_DD_B${apSuffix}_${colorCode}.glb`;

  const SIZE_MAP: Record<string, string> = {
    'modulo-36-18': '1X05', 'modulo-36-24': '1X07', 'modulo-36-36': '1X1',
    'modulo-36-72': '1X2',  'modulo-72-18': '2X05', 'modulo-72-24': '2X07',
    'modulo-72-36': '2X1',
    'modh-36-18': '1X05',   'modh-36-24': '1X07',   'modh-36-36': '1X1',
    'modh-72-24': '2X07',
  };
  const sizeCode = SIZE_MAP[handle];
  if (!sizeCode) return '';

  const prefix = handle.startsWith('modh-') ? 'MODH' : 'MOD';
  let intCode = 'A';
  if (interior === 'Con repisa')                                          intCode = 'S';
  else if (interior === 'Con puerta' || interior === 'Con puerta y repisa') intCode = 'D';

  const SINGLE_DOOR = ['modulo-36-36', 'modulo-36-72', 'modh-36-36'];
  const tiradorSuffix = (SINGLE_DOOR.includes(handle) && intCode === 'D' && apertura)
    ? `_${apertura}` : '';

  return `${GITHUB_BASE}/${prefix}_${sizeCode}_${intCode}_${panelCode}${tiradorSuffix}${apSuffix}_${colorCode}.glb`;
}

/* PlacedModule is imported from store */

/* ── Single placed module (loads + scales its own GLB) ── */
function PlacedModuleGlb({ mod, selected }: { mod: PlacedModule; selected: boolean }) {
  const product = NODO_PRODUCTS.find(p => p.handle === mod.handle);
  if (!product) return null;

  const url = resolveModuleGlb(
    mod.handle, mod.colorCode, mod.interior ?? 'Sin interior',
    mod.panel ?? 'Sin panel', mod.apertura ?? '', mod.pasacables ?? false,
  );
  if (!url) return null;

  return (
    <Suspense fallback={
      /* Placeholder box while GLB loads */
      <mesh position={[mod.xCm + product.widthCm / 2, mod.yCm + product.heightCm / 2, -18]}>
        <boxGeometry args={[product.widthCm * 0.96, product.heightCm * 0.96, 34]} />
        <meshStandardMaterial color="#D4C5B0" roughness={0.9} />
      </mesh>
    }>
      <ModMesh
        url={url}
        mod={mod}
        product={product}
        selected={selected}
      />
    </Suspense>
  );
}

function ModMesh({
  url, mod, product, selected,
}: {
  url: string;
  mod: PlacedModule;
  product: typeof NODO_PRODUCTS[number];
  selected: boolean;
}) {
  const { scene } = useGLTF(url);

  /* Scale + position based on natural GLB bounds vs product cm dimensions */
  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const s = size.x > 0 && size.y > 0
      ? Math.min(product.widthCm / size.x, product.heightCm / size.y)
      : 1;

    return {
      scale: s,
      offset: new THREE.Vector3(
        -center.x * s,
        -center.y * s,
        -(box.max.z) * s,
      ),
    };
  }, [scene, product.widthCm, product.heightCm]);

  const clone = useMemo(() => {
    const c = scene.clone(true);
    c.traverse(obj => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m: any) => {
        if (m.roughness !== undefined) m.roughness = 0.78;
        if (m.metalness !== undefined) m.metalness = 0;
        if (m.envMapIntensity !== undefined) m.envMapIntensity = 0;
        m.needsUpdate = true;
      });
    });
    return c;
  }, [scene]);

  const groupRef = useRef<THREE.Group>(null);

  const handleSelect = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    useConfiguratorStore.getState().selectInstance(mod.instanceId);
  }, [mod.instanceId]);

  return (
    <group
      ref={groupRef}
      position={[mod.xCm + product.widthCm / 2, mod.yCm + product.heightCm / 2, 0]}
      onClick={handleSelect}
    >
      <group scale={scale} position={[offset.x, offset.y, offset.z]}>
        <primitive object={clone} receiveShadow castShadow />
      </group>

      {/* Selection outline box */}
      {selected && (
        <mesh>
          <boxGeometry args={[product.widthCm + 2, product.heightCm + 2, 38]} />
          <meshBasicMaterial color="#1C6EBF" transparent opacity={0.18} wireframe={false} />
        </mesh>
      )}
    </group>
  );
}

/* ── Ghost preview box ── */
function GhostBox({ handle, xCm, yCm }: { handle: string; xCm: number; yCm: number }) {
  const product = NODO_PRODUCTS.find(p => p.handle === handle);
  if (!product) return null;
  return (
    <mesh position={[xCm + product.widthCm / 2, yCm + product.heightCm / 2, -18]}>
      <boxGeometry args={[product.widthCm, product.heightCm, 36]} />
      <meshStandardMaterial color="#1A2B3C" transparent opacity={0.30} />
    </mesh>
  );
}

/* ── Scene (needs access to useThree for pointer raycasting) ── */
function Scene() {
  const { dragHandle, placedModules, selectedId } = useConfiguratorStore();
  const { camera, gl } = useThree();
  const wallRef = useRef<THREE.Mesh>(null);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const [ghostPos, setGhostPos] = useState({ xCm: 0, yCm: 0 });

  /* ── Convert canvas pointer position to world x,y via wall raycast ── */
  const wallHit = useCallback((clientX: number, clientY: number): THREE.Vector3 | null => {
    const canvas = gl.domElement;
    const rect = canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(ndc, camera);
    const hits: THREE.Intersection[] = [];
    if (wallRef.current) raycaster.intersectObject(wallRef.current, false, hits);
    return hits[0]?.point ?? null;
  }, [camera, gl, raycaster]);

  /* ── Pointer move on canvas ── */
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragHandle) return;
    const pt = wallHit(e.clientX, e.clientY);
    if (!pt) return;
    const xCm = Math.max(0, Math.round(pt.x / SNAP_X_CM) * SNAP_X_CM);
    const product = NODO_PRODUCTS.find(p => p.handle === dragHandle);
    if (!product) return;
    const yCm = getSupportY(xCm, product.widthCm, dragHandle, placedModules);
    setGhostPos({ xCm, yCm });
  }, [dragHandle, placedModules, wallHit]);

  /* ── Click to place module ── */
  const handleWallClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!dragHandle) {
      useConfiguratorStore.getState().selectInstance(null);
      return;
    }
    const pt = e.point;
    const xCm = Math.max(0, Math.round(pt.x / SNAP_X_CM) * SNAP_X_CM);
    const product = NODO_PRODUCTS.find(p => p.handle === dragHandle);
    if (!product) return;
    const yCm = getSupportY(xCm, product.widthCm, dragHandle, placedModules);
    // Overlap check
    const overlaps = placedModules.some(m => {
      const mp = NODO_PRODUCTS.find(p => p.handle === m.handle);
      if (!mp) return false;
      return xCm < m.xCm + mp.widthCm && xCm + product.widthCm > m.xCm &&
             yCm < m.yCm + stackHeight(mp) && yCm + stackHeight(product) > m.yCm;
    });
    if (!overlaps) {
      useConfiguratorStore.getState().dropModule(dragHandle, xCm, yCm);
    }
  }, [dragHandle, placedModules]);

  /* ── Attach pointer move listener to canvas so ghost works during drag ── */
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('pointermove', handlePointerMove as any);
    return () => canvas.removeEventListener('pointermove', handlePointerMove as any);
  }, [gl, handlePointerMove]);

  /* ── Escape to cancel placement ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') useConfiguratorStore.getState().setDragHandle(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {/* ── Lights ── */}
      <ambientLight intensity={0.55} color="#FFF7F0" />
      <directionalLight
        position={[500, 800, -300]}
        intensity={1.6}
        color="#FFF2DB"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-200, 200, -300]} intensity={0.35} color="#E0E0EE" />

      {/* ── Back wall — visual + invisible picking surface ── */}
      <mesh position={[400, 400, 0]} receiveShadow>
        <planeGeometry args={[6000, 6000]} />
        <meshStandardMaterial color="#FBFAF9" roughness={0.94} />
      </mesh>
      {/* Invisible picking plane (same position, z offset forward so it's hit first) */}
      <mesh
        ref={wallRef}
        position={[400, 400, 0.5]}
        onClick={handleWallClick}
        visible={false}
      >
        <planeGeometry args={[6000, 6000]} />
        <meshBasicMaterial />
      </mesh>

      {/* ── Floor ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[400, 0, -1500]} receiveShadow>
        <planeGeometry args={[6000, 4000]} />
        <meshStandardMaterial color="#E0DCCE" roughness={0.92} />
      </mesh>

      {/* ── Placed modules ── */}
      {placedModules.map(mod => (
        <PlacedModuleGlb
          key={mod.instanceId}
          mod={mod}
          selected={mod.instanceId === selectedId}
        />
      ))}

      {/* ── Ghost preview ── */}
      {dragHandle && <GhostBox handle={dragHandle} xCm={ghostPos.xCm} yCm={ghostPos.yCm} />}
    </>
  );
}

/* ── Camera setup matches previous Babylon view ──
   alpha=-60°, beta=79°, radius=500, target=[180,72,0]
   Three.js position: [~425, ~167, ~-425] looking at [180,72,0] */
const CAM_POS: [number, number, number] = [425, 167, -425];
const CAM_TARGET = new THREE.Vector3(180, 72, 0);

export default function IsometricCanvas() {
  const { dragHandle } = useConfiguratorStore();

  return (
    <div className="flex-1 relative" style={{ cursor: dragHandle ? 'crosshair' : 'default' }}>
      <Canvas
        shadows
        gl={{ antialias: true }}
        camera={{ position: CAM_POS, fov: 46, up: [0, 1, 0] }}
        style={{ width: '100%', height: '100%' }}
      >
        <Scene />
        <OrbitControls
          makeDefault
          target={CAM_TARGET}
          minAzimuthAngle={-Math.PI / 2}
          maxAzimuthAngle={-Math.PI / 6}
          minPolarAngle={1.0}
          maxPolarAngle={1.52}
          minDistance={250}
          maxDistance={1000}
          zoomSpeed={0.6}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>
    </div>
  );
}
