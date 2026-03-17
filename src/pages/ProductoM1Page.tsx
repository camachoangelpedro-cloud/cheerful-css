import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/FooterNodo';
import { CartDrawer } from '@/components/CartDrawer';

export default function ProductoM1Page() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      <main className="pt-20 flex items-center justify-center min-h-[60vh]">
        <p className="font-body text-muted-foreground text-sm tracking-widest uppercase">
          Visor 3D — Próximamente
        </p>
      </main>
      <Footer />
    </div>
  );
}
