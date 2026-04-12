import { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/* ── Model: loads GLB, centers it, then manually aims the camera from above-left ── */
function CardModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const { camera, invalidate } = useThree();
  const fitted = useRef(false);

  const clone = useMemo(() => {
    fitted.current = false; // reset on url change
    const c = scene.clone(true);
    c.traverse(obj => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m: any) => {
        if (m.roughness !== undefined)       m.roughness = 0.78;
        if (m.metalness !== undefined)       m.metalness = 0;
        if (m.envMapIntensity !== undefined) m.envMapIntensity = 0;
        m.needsUpdate = true;
      });
    });
    return c;
  }, [scene]);

  // Position camera once after model is in the scene
  useFrame(() => {
    if (fitted.current) return;
    fitted.current = true;

    const box = new THREE.Box3().setFromObject(clone);
    if (box.isEmpty()) return;

    const center = new THREE.Vector3();
    box.getCenter(center);
    const size = new THREE.Vector3();
    box.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z);
    const fovRad = (40 * Math.PI) / 180;
    const dist = (maxDim / 2) / Math.tan(fovRad / 2) * 1.6;

    // 40° elevation, 30° to the left, looking at front face (+Z in gltf/three)
    const elevRad = (40 * Math.PI) / 180;
    const aziRad  = (30 * Math.PI) / 180;
    camera.position.set(
      center.x - dist * Math.cos(elevRad) * Math.sin(aziRad),  // left
      center.y + dist * Math.sin(elevRad),                      // above
      center.z + dist * Math.cos(elevRad) * Math.cos(aziRad),  // front (+Z)
    );
    camera.lookAt(center);
    camera.updateProjectionMatrix();
    invalidate();
  });

  return <primitive object={clone} />;
}

/* ── Viewer ── */
interface CardViewerProps {
  glbUrl: string;
  bg?: string;
}

export function CardViewer({ glbUrl, bg = '#F2EDE4' }: CardViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {inView && glbUrl && (
        <Canvas
          frameloop="demand"
          gl={{ antialias: true, preserveDrawingBuffer: true }}
          camera={{ position: [0, 1, 5], fov: 40, up: [0, 1, 0] }}
          style={{ width: '100%', height: '100%', background: bg }}
        >
          <ambientLight intensity={0.45} color="#FFF5E8" />
          <directionalLight position={[-5, 8, 4]} intensity={1.8} color="#FFF0D6" />
          <directionalLight position={[4, -3, 6]} intensity={0.35} color="#E8E8F2" />
          <Suspense fallback={null}>
            <CardModel key={glbUrl} url={glbUrl} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}

/* ── Default GLB resolver ── */
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
