import { Suspense, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';
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

function ModuleModel({ config }: { config: ModuleConfig }) {
  const key = getConfigKey(config);
  const modelPath = MODEL_MAP[key];
  const { scene } = useGLTF(modelPath);
  const clonedScene = useMemo(() => {
    const cloned = scene.clone(true);
    
    // Compute bounding box and normalize
    const box = new THREE.Box3().setFromObject(cloned);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.2 / maxDim;
    
    cloned.scale.setScalar(scale);
    cloned.position.set(
      -center.x * scale,
      -center.y * scale,
      -center.z * scale
    );
    
    return cloned;
  }, [scene]);

  return <primitive object={clonedScene} />;
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
  const currentOption = CONFIG_OPTIONS.find((o) => o.id === selected)!;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[80vh]">
      {/* 3D Canvas */}
      <div className="relative bg-muted/20 min-h-[500px] lg:min-h-[80vh]">
        <Canvas
          camera={{ position: [3, 2, 3], fov: 40 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
          <directionalLight position={[-3, 4, -2]} intensity={0.4} />
          
          <Suspense fallback={null}>
            <ModuleModel config={currentOption.config} />
            <ContactShadows
              position={[0, -1.1, 0]}
              opacity={0.3}
              scale={6}
              blur={2.5}
              far={4}
            />
            <Environment preset="apartment" />
          </Suspense>
          
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={2}
            maxDistance={6}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.1}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>

        {/* Drag hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-muted-foreground/60">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
            <path d="M8 12h8M12 8v8"/>
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

          {/* Color selector placeholder */}
          <div className="mb-10">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
              Color
            </p>
            <div className="flex gap-3">
              {[
                { name: 'Adobe Clay', hex: '#B17A5D' },
                { name: 'Oxide Red', hex: '#A4343A' },
                { name: 'Midnight Blue', hex: '#233746' },
                { name: 'Pine Green', hex: '#2F4538' },
                { name: 'Roman Ochre', hex: '#C9943C' },
              ].map((color) => (
                <button
                  key={color.name}
                  title={color.name}
                  className="w-8 h-8 rounded-full border border-border/50 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color.hex }}
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
