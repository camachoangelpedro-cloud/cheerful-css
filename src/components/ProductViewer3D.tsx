import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Center } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

interface ModuleConfig {
  hasShelf: boolean;
  hasDoor: boolean;
}

const MODEL_MAP: Record<string, string> = {
  'standard': '/models/m1-1.glb',
  'shelf': '/models/m1-1f.glb',
  'door': '/models/m1-1p.glb',
  'both': '/models/m1-1fp.glb',
};

function getConfigKey(config: ModuleConfig): string {
  if (config.hasDoor && config.hasShelf) return 'both';
  if (config.hasDoor) return 'door';
  if (config.hasShelf) return 'shelf';
  return 'standard';
}

const NODO_COLORS = [
  { id: 'off-white', name: 'Off White', hex: '#F0EDE8' },
  { id: 'terracotta', name: 'Terracotta', hex: '#7E4F4A' },
  { id: 'sage', name: 'Sage', hex: '#9BA69B' },
  { id: 'navy', name: 'Navy', hex: '#2A3A52' },
];

function ModuleModel({ config, colorHex }: { config: ModuleConfig; colorHex: string }) {
  const key = getConfigKey(config);
  const modelPath = MODEL_MAP[key];
  const { scene } = useGLTF(modelPath);
  
  const clonedScene = React.useMemo(() => {
    const cloned = scene.clone(true);
    
    // Scale model to fit nicely in scene (Rhino models are in mm, hundreds of units)
    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 2.5;
    const scaleFactor = targetSize / maxDim;
    cloned.scale.setScalar(scaleFactor);
    
    // Only tint HPL material — leave MDF texture untouched
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        
        mesh.material = materials.map((origMat) => {
          const mat = (origMat as THREE.MeshStandardMaterial).clone();
          const matName = (mat.name || '').toLowerCase();
          
          // Only apply color tint to HPL laminate surfaces
          if (matName.includes('hpl')) {
            mat.color.set(colorHex);
          }
          // Preserve all original PBR properties (roughness, metalness, envMapIntensity, maps)
          
          mat.needsUpdate = true;
          return mat;
        });
        
        // Unwrap single-element array
        if (Array.isArray(mesh.material) && mesh.material.length === 1) {
          mesh.material = mesh.material[0];
        }
        
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    
    return cloned;
  }, [scene, colorHex]);

  return (
    <Center>
      <primitive object={clonedScene} />
    </Center>
  );
}

// Preload all models
Object.values(MODEL_MAP).forEach((path) => useGLTF.preload(path));

const CONFIG_OPTIONS = [
  { id: 'standard', label: 'Estándar', description: 'Sin puerta ni repisa', config: { hasShelf: false, hasDoor: false }, sku: 'M1:1' },
  { id: 'shelf', label: 'Con Repisa', description: 'Repisa interior, sin puerta', config: { hasShelf: true, hasDoor: false }, sku: 'M1:1F' },
  { id: 'door', label: 'Con Puerta', description: 'Puerta frontal, sin repisa', config: { hasShelf: false, hasDoor: true }, sku: 'M1:1P' },
  { id: 'both', label: 'Puerta + Repisa', description: 'Puerta frontal y repisa interior', config: { hasShelf: true, hasDoor: true }, sku: 'M1:1FP' },
];

const PRICE_MAP: Record<string, number> = {
  standard: 65,
  shelf: 75,
  door: 85,
  both: 95,
};

export default function ProductViewer3D() {
  const [selected, setSelected] = useState('standard');
  const [selectedColor, setSelectedColor] = useState(NODO_COLORS[0]);
  const currentOption = CONFIG_OPTIONS.find((o) => o.id === selected)!;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[80vh]">
      {/* 3D Canvas */}
      <div className="relative bg-muted/20 min-h-[500px] lg:min-h-[80vh]">
        <Canvas
          camera={{ position: [4, 3, 5], fov: 35 }}
          gl={{ 
            antialias: true, 
            alpha: true, 
            toneMapping: THREE.ACESFilmicToneMapping, 
            toneMappingExposure: 0.85,
          }}
          style={{ background: 'transparent' }}
          shadows
          dpr={[1, 2]}
        >
          {/* Key light — front-right, slightly above (like studio softbox) */}
          <directionalLight 
            position={[4, 5, 6]} 
            intensity={0.9} 
            castShadow 
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0001}
            color="#ffffff"
          />
          {/* Fill light — opposite side, lower angle */}
          <directionalLight position={[-6, 2, 2]} intensity={0.35} color="#f0f0f5" />
          {/* Back light — behind and above for edge definition */}
          <directionalLight position={[0, 6, -5]} intensity={0.25} color="#ffffff" />
          
          <Suspense fallback={null}>
            <ModuleModel config={currentOption.config} colorHex={selectedColor.hex} />
            <ContactShadows
              position={[0, -1.2, 0]}
              opacity={0.3}
              scale={10}
              blur={3}
              far={4}
              resolution={512}
            />
            <Environment preset="studio" background={false} environmentIntensity={0.4} />
          </Suspense>
          
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={3}
            maxDistance={12}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.1}
            autoRotate
            autoRotateSpeed={0.4}
          />
        </Canvas>

        {/* Drag hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-muted-foreground/60">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
          <span className="font-body text-xs tracking-wider uppercase">Arrastra para rotar</span>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col justify-center px-8 lg:px-16 py-12 lg:py-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Módulo 36 × 36 × 36 cm
          </p>
          
          <h1 className="font-display text-4xl lg:text-5xl font-light tracking-tight text-foreground mb-2">
            M1:1
          </h1>

          <AnimatePresence mode="wait">
            <motion.p
              key={selected}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="font-body text-sm text-muted-foreground mb-1"
            >
              {currentOption.description}
            </motion.p>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p
              key={selected + '-price'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="font-display text-2xl text-foreground mb-10"
            >
              €{PRICE_MAP[selected]}
            </motion.p>
          </AnimatePresence>

          {/* Configuration */}
          <div className="mb-10">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
              Configuración
            </p>
            <div className="grid grid-cols-2 gap-3">
              {CONFIG_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelected(option.id)}
                  className={`group relative px-4 py-4 text-left border transition-all duration-300 ${
                    selected === option.id
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border hover:border-foreground/40'
                  }`}
                >
                  <span className={`block font-body text-sm font-medium ${
                    selected === option.id ? 'text-background' : 'text-foreground'
                  }`}>
                    {option.label}
                  </span>
                  <span className={`block font-body text-xs mt-1 ${
                    selected === option.id ? 'text-background/70' : 'text-muted-foreground'
                  }`}>
                    {option.sku} — €{PRICE_MAP[option.id]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Color selector - now functional */}
          <div className="mb-10">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Color
            </p>
            <p className="font-body text-sm text-foreground mb-4">{selectedColor.name}</p>
            <div className="flex gap-3">
              {NODO_COLORS.map((color) => (
                <button
                  key={color.id}
                  title={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full transition-all duration-200 ${
                    selectedColor.id === color.id 
                      ? 'scale-110 ring-2 ring-foreground ring-offset-2 ring-offset-background' 
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.hex, border: '1px solid rgba(0,0,0,0.15)' }}
                />
              ))}
            </div>
          </div>

          {/* Add to cart */}
          <button className="w-full py-4 bg-foreground text-background font-body text-sm tracking-[0.15em] uppercase hover:opacity-90 transition-opacity">
            Agregar al Carrito
          </button>

          <p className="font-body text-xs text-muted-foreground mt-4 text-center">
            Envío flat-pack · Ensamblaje sin herramientas
          </p>
        </motion.div>
      </div>
    </div>
  );
}
