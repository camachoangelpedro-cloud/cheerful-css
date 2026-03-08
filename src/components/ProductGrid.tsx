import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchProducts, formatPrice, ShopifyProduct } from '@/lib/shopify';

export function ProductGrid() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts(12);
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
      <section className="py-16 lg:py-24 px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-muted/30 mb-3" />
              <div className="h-4 bg-muted/30 w-2/3 mb-2" />
              <div className="h-4 bg-muted/30 w-1/3" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-16 lg:py-24 px-6 lg:px-12 text-center">
        <p className="font-body text-muted-foreground">
          No hay productos disponibles. ¡Pronto agregaremos nuestra colección!
        </p>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 px-6 lg:px-12">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.node.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link 
                to={`/producto/${product.node.handle}`}
                className="block group"
              >
                {/* Image Container with hover effect */}
                <div className="relative aspect-[3/4] bg-muted/20 overflow-hidden mb-3">
                  {product.node.images.edges[0]?.node.url ? (
                    <>
                      <img 
                        src={product.node.images.edges[0].node.url}
                        alt={product.node.images.edges[0].node.altText || product.node.title}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                      />
                      {product.node.images.edges[1]?.node.url && (
                        <img 
                          src={product.node.images.edges[1].node.url}
                          alt={product.node.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        />
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground font-body text-sm">
                      Sin imagen
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <h3 className="font-body text-sm mb-1 group-hover:opacity-70 transition-opacity">
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
      </div>
    </section>
  );
}
