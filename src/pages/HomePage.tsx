import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { Footer } from '@/components/FooterNodo';
import { CartDrawer } from '@/components/CartDrawer';
import { CardViewer } from '@/components/CardViewer';
import { NODO_PRODUCTS, NODO_COLORS, getStartingPrice } from '@/data/modulesCatalog';

const GITHUB_BASE =
  'https://raw.githubusercontent.com/camachoangelpedro-cloud/cheerful-css/main/public/models';

function starGlb(handle: string, colorCode: string): string {
  if (handle === 'modulo-36-72') return `${GITHUB_BASE}/MOD_1X2_A_B_${colorCode}.glb`;
  if (handle === 'modulo-72-36') return `${GITHUB_BASE}/MOD_2X1_D_B_${colorCode}.glb`;
  return '';
}

interface StarModuleProps {
  handle: string;
  label: string;
}

function StarModule({ handle, label }: StarModuleProps) {
  const [colorCode, setColorCode] = useState('BH');
  const product = NODO_PRODUCTS.find(p => p.handle === handle);
  if (!product) return null;
  const price = getStartingPrice(product);
  const glbUrl = starGlb(handle, colorCode);

  return (
    <Link to={`/producto/${handle}`} className="block group flex-1 min-w-0">
      {/* 3D viewer */}
      <div
        className="w-full overflow-hidden relative"
        style={{ backgroundColor: '#ECEAE7', borderRadius: '6px', aspectRatio: '4/5' }}
      >
        <CardViewer glbUrl={glbUrl} bg="#ECEAE7" />
      </div>

      {/* Swatches — stop propagation so clicking them doesn't navigate */}
      <div
        className="flex items-center gap-[6px] pt-4"
        onClick={e => e.preventDefault()}
      >
        {NODO_COLORS.map(c => (
          <button
            key={c.id}
            onClick={e => { e.preventDefault(); setColorCode(c.id); }}
            aria-label={c.name}
            aria-checked={colorCode === c.id}
            className={`color-swatch w-[26px] h-[26px] ${c.id === 'BH' ? 'color-swatch--light' : ''} ${colorCode === c.id ? 'selected' : ''}`}
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </div>

      {/* Label */}
      <div className="pt-2">
        <p className="text-sm font-medium" style={{ color: '#1C1C1A', letterSpacing: 0 }}>
          {label}
        </p>
        <p className="text-sm mt-0.5" style={{ color: '#5F5E5A', letterSpacing: 0 }}>
          Desde COP ${price.toLocaleString('es-CO')}
        </p>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      <main>
        <HeroSection />

        {/* Editorial section — star modules */}
        <section className="nodo-container py-20 lg:py-28">

          {/* Header */}
          <div className="mb-10 lg:mb-14 flex items-end justify-between">
            <div>
              <p className="text-xs mb-2" style={{ color: '#9E9E9C', letterSpacing: 0 }}>
                Módulos individuales
              </p>
              <h2 className="text-3xl lg:text-4xl font-medium" style={{ letterSpacing: 0, lineHeight: 1.1 }}>
                Construye tu propio espacio
              </h2>
            </div>
            <Link
              to="/catalogo"
              className="hidden lg:block text-sm underline underline-offset-4 hover:opacity-60 transition-opacity"
              style={{ letterSpacing: 0 }}
            >
              Ver catálogo
            </Link>
          </div>

          {/* Two star modules side by side */}
          <div className="flex flex-col sm:flex-row gap-6 lg:gap-8">
            <StarModule handle="modulo-36-72" label="Módulo 36×72" />
            <StarModule handle="modulo-72-36" label="Módulo 72×36 · 2 puertas" />
          </div>

          {/* Mobile CTA */}
          <div className="mt-8 lg:hidden">
            <Link
              to="/catalogo"
              className="text-sm underline underline-offset-4"
              style={{ letterSpacing: 0 }}
            >
              Ver catálogo completo
            </Link>
          </div>

        </section>
      </main>
      <Footer />
    </div>
  );
}
