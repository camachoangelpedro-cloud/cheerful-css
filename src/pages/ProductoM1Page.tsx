import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/FooterNodo';
import { CartDrawer } from '@/components/CartDrawer';
import ProductViewer3D from '@/components/ProductViewer3D';

export default function ProductoM1Page() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      <main className="pt-20">
        <ProductViewer3D />
      </main>
      <Footer />
    </div>
  );
}
