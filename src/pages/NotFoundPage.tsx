import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/FooterNodo';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Página no encontrada | NODO</title>
        <meta name="description" content="Lo sentimos, la página que buscas no existe." />
      </Helmet>
      <Navbar />
      <CartDrawer />
      <main className="pt-[96px] flex items-center justify-center min-h-[70vh]">
        <div className="text-center px-6">
          <p
            className="text-8xl lg:text-9xl font-light mb-4"
            style={{ color: '#E8E4DC', lineHeight: 1 }}
          >
            404
          </p>
          <h1
            className="text-2xl lg:text-3xl mb-4"
            style={{ fontWeight: 300, color: '#1C1C1A', letterSpacing: 0 }}
          >
            Página no encontrada
          </h1>
          <p
            className="font-body text-sm mb-10 max-w-sm mx-auto leading-relaxed"
            style={{ color: '#5F5E5A' }}
          >
            Lo sentimos, la página que buscas no existe o fue movida.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-7 py-3 font-body text-sm font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#1C1C1A', color: '#FFFFFF', borderRadius: '9999px' }}
          >
            Volver al inicio
          </Link>
          <p className="font-body text-xs mt-8" style={{ color: '#9E9E9C' }}>
            ¿Necesitas ayuda? Escríbenos a{' '}
            <a
              href="mailto:nodomodulardesign@gmail.com"
              className="underline underline-offset-2 hover:opacity-60 transition-opacity"
              style={{ color: '#5F5E5A' }}
            >
              nodomodulardesign@gmail.com
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
