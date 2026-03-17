import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';

import { CollectionCarousel } from '@/components/CollectionCarousel';
import { ProductGrid } from '@/components/ProductGrid';
import { Footer } from '@/components/FooterNodo';
import { CartDrawer } from '@/components/CartDrawer';

const sistemasImages = [
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80',
  'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
  'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80',
];

const modulosImages = [
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80',
  'https://images.unsplash.com/photo-1551298370-9d3d53f6f0c8?w=800&q=80',
  'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800&q=80',
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      <main>
        <HeroSection />
        
        
        
        <CollectionCarousel 
          title="Sistemas Completos"
          description="Descubre nuestros sistemas modulares completos: configuraciones probadas que combinan múltiples módulos para crear soluciones de almacenamiento perfectas para tu espacio."
          images={sistemasImages}
          link="/catalogo"
        />
        
        <CollectionCarousel 
          title="Módulos Individuales"
          description="Construye tu propia configuración. Cada módulo sigue nuestra grilla de 36cm, permitiendo combinaciones infinitas que se adaptan a tu espacio."
          images={modulosImages}
          link="/catalogo"
        />
        
        <ProductGrid />
      </main>
      <Footer />
    </div>
  );
}
