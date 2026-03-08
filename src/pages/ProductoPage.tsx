import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/FooterNodo';
import { CartDrawer } from '@/components/CartDrawer';
import { fetchProductByHandle, formatPrice, ShopifyProduct } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ProductoPage() {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct['node'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ShopifyProduct['node']['variants']['edges'][0]['node'] | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const { addItem, isLoading: cartLoading } = useCartStore();

  useEffect(() => {
    async function loadProduct() {
      if (!handle) return;
      try {
        const data = await fetchProductByHandle(handle);
        setProduct(data);
        if (data?.variants.edges[0]) {
          setSelectedVariant(data.variants.edges[0].node);
        }
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [handle]);

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return;
    
    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <CartDrawer />
        <div className="pt-32 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <CartDrawer />
        <main className="pt-32 pb-24">
          <div className="nodo-container text-center">
            <h1 className="nodo-heading-lg mb-4">Producto no encontrado</h1>
            <Link to="/catalogo" className="nodo-button-outline">
              Volver al catálogo
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = product.images.edges;
  const hasVariants = product.variants.edges.length > 1;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      
      <main className="pt-24">
        {/* Breadcrumb */}
        <div className="nodo-container py-6">
          <Link 
            to="/catalogo" 
            className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver al catálogo
          </Link>
        </div>

        {/* Product Layout */}
        <div className="nodo-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left: Images (Sticky) */}
            <div className="lg:sticky lg:top-32 lg:self-start">
              <motion.div 
                className="aspect-square bg-muted/30 overflow-hidden mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {images[selectedImage]?.node.url ? (
                  <img 
                    src={images[selectedImage].node.url}
                    alt={images[selectedImage].node.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Sin imagen
                  </div>
                )}
              </motion.div>
              
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 flex-shrink-0 overflow-hidden border-2 transition-colors ${
                        selectedImage === idx 
                          ? 'border-foreground' 
                          : 'border-transparent hover:border-border'
                      }`}
                    >
                      <img 
                        src={img.node.url}
                        alt={img.node.altText || `${product.title} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Info (Scrolls) */}
            <div className="pb-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h1 className="nodo-heading-lg mb-4">{product.title}</h1>
                
                <p className="font-display text-2xl mb-8">
                  {formatPrice(
                    selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount,
                    selectedVariant?.price.currencyCode || product.priceRange.minVariantPrice.currencyCode
                  )}
                </p>

                {/* Description */}
                <div className="nodo-body text-muted-foreground mb-8 whitespace-pre-line">
                  {product.description || 'Sistema modular de precisión. Melamina Ecofort de alta densidad con cantos PUR. Ensamblaje sin herramientas.'}
                </div>

                {/* Variant Selector */}
                {hasVariants && (
                  <div className="mb-8">
                    {product.options.map((option) => (
                      <div key={option.name} className="mb-4">
                        <p className="font-body text-sm mb-3">{option.name}</p>
                        <div className="flex flex-wrap gap-2">
                          {option.values.map((value) => {
                            const variant = product.variants.edges.find(v => 
                              v.node.selectedOptions.some(o => o.name === option.name && o.value === value)
                            )?.node;
                            const isSelected = selectedVariant?.selectedOptions.some(
                              o => o.name === option.name && o.value === value
                            );
                            
                            return (
                              <button
                                key={value}
                                onClick={() => variant && setSelectedVariant(variant)}
                                disabled={!variant?.availableForSale}
                                className={`px-4 py-2 text-sm border transition-colors ${
                                  isSelected 
                                    ? 'border-foreground bg-foreground text-background' 
                                    : 'border-border hover:border-foreground'
                                } ${!variant?.availableForSale ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                {value}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={cartLoading || !selectedVariant?.availableForSale}
                  className="w-full nodo-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {cartLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Agregar al Carrito'
                  )}
                </button>

                {!selectedVariant?.availableForSale && (
                  <p className="font-body text-sm text-muted-foreground mt-2 text-center">
                    Agotado temporalmente
                  </p>
                )}

                {/* Product Details Accordion */}
                <div className="mt-12 border-t border-border/30">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="dimensions" className="border-border/30">
                      <AccordionTrigger className="font-body text-sm py-4 hover:no-underline">
                        Dimensiones
                      </AccordionTrigger>
                      <AccordionContent className="font-body text-sm text-muted-foreground pb-4">
                        Basado en nuestra grilla modular de 36cm. Consulta la ficha técnica 
                        para medidas específicas de cada módulo.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="materials" className="border-border/30">
                      <AccordionTrigger className="font-body text-sm py-4 hover:no-underline">
                        Materiales
                      </AccordionTrigger>
                      <AccordionContent className="font-body text-sm text-muted-foreground pb-4">
                        Melamina Ecofort de alta densidad con cantos PUR. 
                        Herrajes de acero inoxidable. Acabado mate anti-huella.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="shipping" className="border-border/30">
                      <AccordionTrigger className="font-body text-sm py-4 hover:no-underline">
                        Envío Flat-Pack
                      </AccordionTrigger>
                      <AccordionContent className="font-body text-sm text-muted-foreground pb-4">
                        Enviamos directamente desde nuestra fábrica en Bogotá. 
                        Empaque plano optimizado. Ensamblaje sin herramientas en menos de 30 minutos.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
