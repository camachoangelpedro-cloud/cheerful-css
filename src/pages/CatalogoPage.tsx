import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/FooterNodo';
import { CartDrawer } from '@/components/CartDrawer';
import { NODO_PRODUCTS, NODO_COLORS, getStartingPrice } from '@/data/modulesCatalog';

const COP = (n: number) => 'COP $' + n.toLocaleString('es-CO');

/* Exclude CLF clips from the public catalogue */
const CATALOGUE_PRODUCTS = NODO_PRODUCTS.filter(p => p.family !== 'CLF');

function ProductCard({ product }: { product: typeof NODO_PRODUCTS[number] }) {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const startingPrice = getStartingPrice(product);

  return (
    <Link to={`/producto/${product.handle}`} className="block group">

      {/* Image area */}
      <div className="aspect-square overflow-hidden relative" style={{ backgroundColor: '#EFEFED' }}>
        {/* Placeholder content */}
        <div className="absolute inset-0 flex items-center justify-center p-[8%]">
          <span className="text-xs" style={{ color: '#9E9E9C' }}>{product.title}</span>
        </div>
        {/* Wishlist — hover only */}
        <button
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={e => e.preventDefault()}
          aria-label="Guardar"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#1C1C1A" strokeWidth="1.5" className="w-[18px] h-[18px]">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Swatches */}
      <div className="flex items-center gap-[6px] pt-[10px] px-3">
        {NODO_COLORS.map(color => (
          <button
            key={color.id}
            onMouseEnter={() => setHoveredColor(color.name)}
            onMouseLeave={() => setHoveredColor(null)}
            onClick={e => e.preventDefault()}
            aria-label={color.name}
            className={`color-swatch w-6 h-6 ${color.id === 'BH' ? 'color-swatch--light' : ''}`}
            style={{ backgroundColor: color.hex }}
          />
        ))}
      </div>

      {/* Text info */}
      <div className="px-3 pt-1 pb-3">
        <p
          className="text-sm font-normal leading-snug transition-colors duration-200"
          style={{ color: '#1C1C1A', letterSpacing: 0 }}
        >
          {hoveredColor ?? product.title}
        </p>
        <p
          className="text-sm font-medium mt-0.5"
          style={{ color: '#1C1C1A', letterSpacing: 0 }}
        >
          Desde {COP(startingPrice)}
        </p>
      </div>

    </Link>
  );
}

export default function CatalogoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      <main className="pt-[96px]">

        {/* Breadcrumb */}
        <div className="nodo-container pt-6">
          <p style={{ fontSize: '10px', color: '#9E9E9C', letterSpacing: 0 }}>
            Todos los productos
          </p>
        </div>

        {/* Category header — H1 left, description right */}
        <div className="nodo-container pt-5 pb-10 flex items-start justify-between gap-12">
          <h1
            className="text-4xl font-medium shrink-0"
            style={{ letterSpacing: 0, lineHeight: 1.1 }}
          >
            Catálogo
          </h1>
          <p
            className="text-sm leading-relaxed max-w-[500px]"
            style={{ color: '#5F5E5A', letterSpacing: 0 }}
          >
            Sistema modular NODO — cada módulo se conecta sin herramientas.
            Configura tu espacio libremente y crece cuando quieras.
          </p>
        </div>

        <div className="nodo-container">

          {/* Filter + sort */}
          <div className="flex items-center justify-end gap-6 mb-10">
            <button
              className="flex items-center gap-1.5 text-sm transition-colors duration-200"
              style={{ color: '#5F5E5A', letterSpacing: 0 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#1C1C1A')}
              onMouseLeave={e => (e.currentTarget.style.color = '#5F5E5A')}
            >
              <SlidersHorizontal strokeWidth={1.5} size={15} />
              Filtrar
            </button>
            <button
              className="flex items-center gap-1.5 text-sm transition-colors duration-200"
              style={{ color: '#5F5E5A', letterSpacing: 0 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#1C1C1A')}
              onMouseLeave={e => (e.currentTarget.style.color = '#5F5E5A')}
            >
              <ArrowUpDown strokeWidth={1.5} size={15} />
              Ordenar
            </button>
          </div>

          {/* Product grid — 4 cols desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-24">
            {CATALOGUE_PRODUCTS.map(product => (
              <ProductCard key={product.handle} product={product} />
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
