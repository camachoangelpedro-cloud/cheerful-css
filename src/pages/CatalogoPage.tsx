import { Link } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/FooterNodo';
import { CartDrawer } from '@/components/CartDrawer';
import { NODO_PRODUCTS, NODO_COLORS, getStartingPrice } from '@/data/modulesCatalog';

function ProductCard({ product }: { product: typeof NODO_PRODUCTS[number] }) {
  const startingPrice = getStartingPrice(product);

  return (
    <Link to={`/producto/${product.handle}`} className="block group">
      {/* Image */}
      <div className="aspect-[4/5] bg-muted/30 overflow-hidden rounded-none">
        <div className="w-full h-full flex items-center justify-center text-muted-foreground transition-transform duration-500 ease-in-out group-hover:scale-[1.03]">
          <span className="font-body text-xs uppercase tracking-widest">{product.title}</span>
        </div>
      </div>

      {/* Info */}
      <div className="pt-3 px-4 pb-4">
        <h3 className="font-display font-normal text-sm tracking-wide group-hover:underline underline-offset-4 decoration-1">
          {product.title}
        </h3>
        <p className="font-body text-xs text-muted-foreground mt-0.5">
          {product.widthCm} × {product.heightCm} × {product.depthCm} cm
        </p>
        <p className="font-body text-xs text-muted-foreground mt-0.5">
          Desde COP ${startingPrice.toLocaleString('es-CO')}
        </p>
        <div className="flex items-center gap-1.5 mt-2">
          {NODO_COLORS.map((color) => (
            <div
              key={color.id}
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>
    </Link>
  );
}

export default function CatalogoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      <main className="pt-32 pb-24">
        <div className="nodo-container">
          {/* Header */}
          <div className="pt-12 pb-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-display font-semibold text-3xl">Catálogo</h1>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  Sistema modular NODO — configura tu espacio
                </p>
              </div>
              <button
                onClick={() => toast('Filtros próximamente')}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Filtros"
              >
                <SlidersHorizontal size={18} />
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {NODO_PRODUCTS.map((product) => (
              <ProductCard key={product.handle} product={product} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
