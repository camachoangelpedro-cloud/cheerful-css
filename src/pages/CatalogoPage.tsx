import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/FooterNodo';
import { CartDrawer } from '@/components/CartDrawer';
import { fetchProducts, formatPrice, ShopifyProduct } from '@/lib/shopify';

type FilterType = 'all' | 'sistemas' | 'modulos';

export default function CatalogoPage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts(50);
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Filter products based on selection (in real implementation, use product types/tags)
  const filteredProducts = products;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      
      <main className="pt-32 pb-24">
        <div className="nodo-container">
          {/* Header */}
          <div className="mb-16">
             <motion.h1 
              className="font-display text-3xl lg:text-4xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Sistemas
            </motion.h1>
            <motion.p 
              className="font-body text-base lg:text-lg text-muted-foreground leading-relaxed max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Explora nuestros sistemas modulares y construye tu espacio soñado.
            </motion.p>
          </div>

          {/* Filters */}
          <motion.div 
            className="flex items-center gap-8 mb-12 border-b border-border/30 pb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <button
              onClick={() => setFilter('all')}
              className={`font-body text-sm tracking-wide transition-colors ${
                filter === 'all' 
                  ? 'text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('sistemas')}
              className={`font-body text-sm tracking-wide transition-colors ${
                filter === 'sistemas' 
                  ? 'text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sistemas Completos
            </button>
            <button
              onClick={() => setFilter('modulos')}
              className={`font-body text-sm tracking-wide transition-colors ${
                filter === 'modulos' 
                  ? 'text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Módulos Individuales
            </button>
          </motion.div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] bg-muted mb-4" />
                  <div className="h-4 bg-muted w-1/2 mb-2" />
                  <div className="h-4 bg-muted w-1/4" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24">
              <p className="nodo-heading-lg mb-4">No hay productos disponibles</p>
              <p className="nodo-body text-muted-foreground">
                Estamos preparando nuestra colección. Vuelve pronto.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.node.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  <Link 
                    to={`/producto/${product.node.handle}`}
                    className="block group"
                  >
                    <div className="aspect-[4/5] bg-muted/30 overflow-hidden mb-4">
                      {product.node.images.edges[0]?.node.url ? (
                        <img 
                          src={product.node.images.edges[0].node.url}
                          alt={product.node.images.edges[0].node.altText || product.node.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          Sin imagen
                        </div>
                      )}
                    </div>
                    <h3 className="font-display text-lg mb-1 group-hover:opacity-70 transition-opacity">
                      {product.node.title}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground">
                      {formatPrice(
                        product.node.priceRange.minVariantPrice.amount,
                        product.node.priceRange.minVariantPrice.currencyCode
                      )}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
