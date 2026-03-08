import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchProducts, formatPrice, ShopifyProduct } from '@/lib/shopify';

export function FeaturedCollection() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts(6);
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-24">
        <div className="nodo-container">
          <p className="nodo-caption text-muted-foreground mb-4">Colección</p>
          <h2 className="nodo-heading-lg mb-12">Sistemas Destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-muted mb-4" />
                <div className="h-4 bg-muted w-1/2 mb-2" />
                <div className="h-4 bg-muted w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-24">
        <div className="nodo-container text-center">
          <p className="nodo-caption text-muted-foreground mb-4">Colección</p>
          <h2 className="nodo-heading-lg mb-8">Próximamente</h2>
          <p className="nodo-body text-muted-foreground max-w-md mx-auto">
            Estamos preparando nuestra colección. Pronto podrás explorar 
            todos nuestros sistemas modulares.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24">
      <div className="nodo-container">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="nodo-caption text-muted-foreground mb-4">Colección</p>
            <h2 className="nodo-heading-lg">Sistemas Destacados</h2>
          </div>
          <Link 
            to="/catalogo"
            className="hidden md:block nodo-button-outline"
          >
            Ver Todo
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.slice(0, 3).map((product, index) => (
            <motion.div
              key={product.node.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
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

        <div className="md:hidden mt-8 text-center">
          <Link to="/catalogo" className="nodo-button-outline">
            Ver Todo
          </Link>
        </div>
      </div>
    </section>
  );
}
