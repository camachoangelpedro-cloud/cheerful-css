import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/FooterNodo';

export default function PoliticaPrivacidadPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      <main className="pt-[96px]">
        <div className="nodo-container py-20 lg:py-28">
          <h1
            className="text-4xl lg:text-5xl mb-8"
            style={{ fontWeight: 300, color: '#1C1C1A', letterSpacing: 0, lineHeight: 1.15 }}
          >
            Política de privacidad
          </h1>
          <p
            className="text-base leading-relaxed max-w-2xl"
            style={{ color: '#5F5E5A', letterSpacing: 0 }}
          >
            Esta política está en proceso de redacción y estará disponible próximamente.
            Para consultas, escríbenos a{' '}
            <a
              href="mailto:hola@nodo.co"
              className="underline underline-offset-2 hover:opacity-60 transition-opacity"
              style={{ color: '#1C1C1A' }}
            >
              hola@nodo.co
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
