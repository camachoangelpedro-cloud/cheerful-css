import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { Footer } from '@/components/FooterNodo';
import { CartDrawer } from '@/components/CartDrawer';
import { NODO_PRODUCTS, NODO_COLORS, getStartingPrice } from '@/data/modulesCatalog';

interface StarModuleProps {
  handle: string;
  label: string;
}

function StarModule({ handle, label }: StarModuleProps) {
  const [colorId, setColorId] = useState('BH');
  const product = NODO_PRODUCTS.find(p => p.handle === handle);
  if (!product) return null;
  const price = getStartingPrice(product);
  const activeColor = NODO_COLORS.find(c => c.id === colorId);

  return (
    <Link to={`/producto/${handle}`} className="block group flex-1 min-w-0">
      {/* Image placeholder */}
      <div
        className="w-full overflow-hidden relative flex items-center justify-center"
        style={{ backgroundColor: activeColor?.hex ?? '#ECEAE7', borderRadius: '6px', aspectRatio: '4/5' }}
      >
        <span style={{ fontSize: '11px', color: 'rgba(0,0,0,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>

      {/* Swatches — stop propagation so clicking them doesn't navigate */}
      <div
        className="flex items-center gap-[6px] pt-4"
        onClick={e => e.preventDefault()}
      >
        {NODO_COLORS.map(c => (
          <button
            key={c.id}
            onClick={e => { e.preventDefault(); setColorId(c.id); }}
            aria-label={c.name}
            aria-checked={colorId === c.id}
            className={`color-swatch w-[26px] h-[26px] ${c.id === 'BH' ? 'color-swatch--light' : ''} ${colorId === c.id ? 'selected' : ''}`}
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
