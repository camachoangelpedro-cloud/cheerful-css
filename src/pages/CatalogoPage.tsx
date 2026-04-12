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
  const [selectedColor, setSelectedColor] = useState('BH');
  const [hoveredColor, setHoveredColor]   = useState<string | null>(null);
  const startingPrice = getStartingPrice(product);
  const activeColor   = NODO_COLORS.find(c => c.id === selectedColor);

  return (
    <Link to={`/producto/${product.handle}`} className="block group">

      {/* Image placeholder */}
      <div
        className="w-full overflow-hidden relative flex items-center justify-center"
        style={{ backgroundColor: activeColor?.hex ?? '#F2EDE4', borderRadius: '8px', aspectRatio: '4/5' }}
      >
        <span style={{ fontSize: '11px', color: 'rgba(0,0,0,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {product.title}
        </span>
      </div>

      {/* Swatches — click to change color + viewer */}
      <div
        className="flex items-center gap-[6px] pt-3 px-1"
        onClick={e => e.preventDefault()}
      >
        {NODO_COLORS.map(color => (
          <button
            key={color.id}
            onMouseEnter={() => setHoveredColor(color.name)}
            onMouseLeave={() => setHoveredColor(null)}
            onClick={e => { e.preventDefault(); setSelectedColor(color.id); }}
            aria-label={color.name}
            className={`color-swatch w-5 h-5 ${color.id === 'BH' ? 'color-swatch--light' : ''} ${color.id === selectedColor ? 'selected' : ''}`}
            style={{ backgroundColor: color.hex }}
          />
        ))}
        {hoveredColor && (
          <span className="ml-1 text-[11px]" style={{ color: '#9E9E9C', letterSpacing: 0 }}>
            {hoveredColor}
          </span>
        )}
      </div>

      {/* Text info */}
      <div className="px-1 pt-2 pb-1">
        <p
          className="leading-tight"
          style={{ fontSize: '13px', fontWeight: 300, color: '#1C1C1A', letterSpacing: 0 }}
        >
          {product.title}
        </p>
        <p
          className="mt-0.5"
          style={{ fontSize: '12px', fontWeight: 400, color: '#9E9E9C', letterSpacing: 0 }}
        >
          Desde {COP(startingPrice)}
        </p>
        {hoveredColor && (
          <p style={{ fontSize: '11px', color: '#9E9E9C', letterSpacing: 0, marginTop: '2px' }}>
            {hoveredColor}
          </p>
        )}
      </div>

      {/* Personalizar CTA */}
      <div
        className="mx-1 mt-2 mb-1 flex items-center justify-center transition-opacity duration-200 group-hover:opacity-90"
        style={{
          backgroundColor: '#1C1C1A',
          color: '#FFFFFF',
          borderRadius: '999px',
          padding: '9px 16px',
          fontSize: '11px',
          fontWeight: 400,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        Personalizar
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
            Todos los módulos
          </p>
        </div>

        {/* Category header */}
        <div className="nodo-container pt-5 pb-10 flex items-start justify-between gap-12">
          <h1
            className="text-4xl shrink-0"
            style={{ fontWeight: 300, letterSpacing: 0, lineHeight: 1.1 }}
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

          {/* Product grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pb-24">
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
