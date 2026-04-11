import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { CollectionCarousel } from '@/components/CollectionCarousel';
import { ProductGrid } from '@/components/ProductGrid';
import { Footer } from '@/components/FooterNodo';
import { CartDrawer } from '@/components/CartDrawer';
import { CardViewer, defaultGlb } from '@/components/CardViewer';
import { NODO_PRODUCTS, getStartingPrice } from '@/data/modulesCatalog';

const sistemasImages = [
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80',
  'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
  'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80',
];

const MOD_PRODUCTS = NODO_PRODUCTS.filter(p => p.family === 'MOD' || p.family === 'MODH');

function ModulosCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -scrollRef.current.clientWidth * 0.8 : scrollRef.current.clientWidth * 0.8,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-16 lg:py-24 relative">
      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-6 lg:px-12"
      >
        {MOD_PRODUCTS.map(product => (
          <Link
            key={product.handle}
            to={`/producto/${product.handle}`}
            className="relative flex-none w-[75vw] lg:w-[40vw] aspect-[4/5] snap-start overflow-hidden group"
            style={{ backgroundColor: '#F2EDE4', borderRadius: '6px' }}
          >
            <CardViewer glbUrl={defaultGlb(product.handle)} bg="#F2EDE4" />
            {/* Bottom label */}
            <div
              className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between"
              style={{ background: 'linear-gradient(to top, rgba(242,237,228,0.85) 0%, transparent 100%)' }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: '#1C1C1A', letterSpacing: 0 }}>
                  {product.title}
                </p>
                <p className="text-sm" style={{ color: '#5F5E5A', letterSpacing: 0 }}>
                  Desde COP ${getStartingPrice(product).toLocaleString('es-CO')}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-background/90 rounded-full flex items-center justify-center hover:bg-background transition-colors"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}
      >
        <ChevronLeft strokeWidth={1.5} className="w-4 h-4" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-background/90 rounded-full flex items-center justify-center hover:bg-background transition-colors"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}
      >
        <ChevronRight strokeWidth={1.5} className="w-4 h-4" />
      </button>

      {/* Label below */}
      <div className="mt-8 px-6 lg:px-12">
        <Link to="/catalogo" className="group">
          <h3 className="text-2xl lg:text-3xl font-medium mb-2 group-hover:opacity-70 transition-opacity" style={{ letterSpacing: 0 }}>
            Módulos Individuales
          </h3>
          <p className="text-sm text-[#5F5E5A] max-w-xl mb-4" style={{ letterSpacing: 0 }}>
            Construye tu propia configuración. Cada módulo sigue nuestra grilla de 36 cm, permitiendo combinaciones infinitas.
          </p>
          <span className="text-sm underline underline-offset-4" style={{ letterSpacing: 0 }}>
            Ver todos
          </span>
        </Link>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      <main>
        <HeroSection />

        <CollectionCarousel
          title="Sistemas Completos"
          description="Descubre nuestros sistemas modulares completos: configuraciones probadas que combinan múltiples módulos."
          images={sistemasImages}
          link="/catalogo"
        />

        <ModulosCarousel />

        <ProductGrid />
      </main>
      <Footer />
    </div>
  );
}
