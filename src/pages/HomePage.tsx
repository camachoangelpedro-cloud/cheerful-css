import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { Footer } from '@/components/FooterNodo';
import { CartDrawer } from '@/components/CartDrawer';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { NODO_PRODUCTS, NODO_COLORS, getStartingPrice } from '@/data/modulesCatalog';

interface StarModuleProps {
  handle: string;
  label: string;
}

function StarModule({ handle, label }: StarModuleProps) {
  const [colorId, setColorId] = useState('BH');
  const product = NODO_PRODUCTS.find(p => p.handle === handle);
  if (!product) return null;
  const price = getStartingPrice(product);
  const activeColor = NODO_COLORS.find(c => c.id === colorId);

  return (
    <Link to={`/producto/${handle}`} className="block group flex-1 min-w-0">
      {/* Image placeholder */}
      <div
        className="w-full overflow-hidden relative flex items-center justify-center"
        style={{ backgroundColor: activeColor?.hex ?? '#ECEAE7', aspectRatio: '4/5' }}
      >
        <span style={{ fontSize: '11px', color: 'rgba(0,0,0,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>

      {/* Swatches — stop propagation so clicking them doesn't navigate */}
      <div
        className="flex items-center gap-[6px] pt-4"
        onClick={e => e.preventDefault()}
      >
        {NODO_COLORS.map(c => (
          <button
            key={c.id}
            onClick={e => { e.preventDefault(); setColorId(c.id); }}
            aria-label={c.name}
            aria-checked={colorId === c.id}
            className={`color-swatch w-[26px] h-[26px] ${c.id === 'BH' ? 'color-swatch--light' : ''} ${colorId === c.id ? 'selected' : ''}`}
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </div>

      {/* Label */}
      <div className="pt-2">
        <p className="text-sm font-medium" style={{ color: '#1C1C1A', letterSpacing: 0 }}>
          {label}
        </p>
        <p className="text-sm mt-0.5" style={{ color: '#5F5E5A', letterSpacing: 0 }}>
          Desde COP ${price.toLocaleString('es-CO')}
        </p>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      <main>
        <HeroSection />

        {/* Value proposition — three benefit cards */}
        <section className="nodo-container py-20 lg:py-28">
          <h2
            className="font-display text-2xl md:text-3xl mb-10 lg:mb-14"
            style={{ fontWeight: 300, color: '#1C1C1A', letterSpacing: 0, lineHeight: 1.1 }}
          >
            Muebles que se adaptan a ti.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1 */}
            <div
              className="flex flex-col gap-3 p-8"
              style={{ backgroundColor: '#F2EDE4' }}
            >
              <p className="text-base font-semibold" style={{ color: '#1C1C1A', letterSpacing: 0 }}>
                Diseña a tu medida
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#5F5E5A', letterSpacing: 0 }}>
                Elige módulos, colores y configuraciones que se ajusten exactamente a tu espacio.
                Sin catálogos genéricos — tu estantería, tus reglas.
              </p>
            </div>

            {/* Card 2 */}
            <div
              className="flex flex-col gap-3 p-8"
              style={{ backgroundColor: '#F2EDE4' }}
            >
              <p className="text-base font-semibold" style={{ color: '#1C1C1A', letterSpacing: 0 }}>
                Precio claro, sin sorpresas
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#5F5E5A', letterSpacing: 0 }}>
                Cada módulo tiene un precio fijo. Configura, suma y compra con total transparencia
                — sin cotizaciones ocultas ni costos inesperados.
              </p>
            </div>

            {/* Card 3 */}
            <div
              className="flex flex-col gap-3 p-8"
              style={{ backgroundColor: '#F2EDE4' }}
            >
              <p className="text-base font-semibold" style={{ color: '#1C1C1A', letterSpacing: 0 }}>
                Se mueve contigo
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#5F5E5A', letterSpacing: 0 }}>
                Sistema modular que se desarma y se rearma en minutos. Cambiás de apartamento,
                tu NODO va con contigo — y crece cuando lo necesitás.
              </p>
            </div>
          </div>
        </section>

        {/* Editorial section — star modules */}
        <section className="nodo-container py-20 lg:py-28">

          {/* Header */}
          <div className="mb-10 lg:mb-14 flex items-end justify-between">
            <div>
              <p className="text-xs mb-2" style={{ color: '#9E9E9C', letterSpacing: 0 }}>
                Módulos individuales
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-light" style={{ letterSpacing: 0, lineHeight: 1.1, color: '#1C1C1A' }}>
                Construye tu propio espacio
              </h2>
            </div>
            <Link
              to="/catalogo"
              className="hidden lg:block text-sm underline underline-offset-4 hover:opacity-60 transition-opacity"
              style={{ letterSpacing: 0 }}
            >
              Ver catálogo
            </Link>
          </div>

          {/* Two star modules side by side */}
          <div className="flex flex-col sm:flex-row gap-6 lg:gap-8">
            <StarModule handle="modulo-36-72" label="Módulo 36×72" />
            <StarModule handle="modulo-72-36" label="Módulo 72×36 · 2 puertas" />
          </div>

          {/* Mobile CTA */}
          <div className="mt-8 lg:hidden">
            <Link
              to="/catalogo"
              className="text-sm underline underline-offset-4"
              style={{ letterSpacing: 0 }}
            >
              Ver catálogo completo
            </Link>
          </div>

        </section>

        {/* Testimonials */}
        <section className="nodo-container py-20 lg:py-28">
          <h2
            className="text-3xl lg:text-4xl mb-10 lg:mb-14"
            style={{ fontWeight: 300, color: '#1C1C1A', letterSpacing: 0, lineHeight: 1.1 }}
          >
            Lo que dicen nuestros clientes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                quote: 'Me mudé dos veces en un año y mi NODO se vino conmigo las dos veces. Lo desarmé un domingo en la tarde y al otro día ya estaba armado en el apartamento nuevo. Ningún carpintero te da eso.',
                name: 'Valentina R.',
                location: 'Chapinero, Bogotá',
              },
              {
                quote: 'Siempre quise una estantería que no pareciera sacada de catálogo. Con el configurador armé exactamente lo que necesitaba para mi estudio y el precio nunca cambió de lo que me mostraba la página. Cero sorpresas.',
                name: 'Andrés M.',
                location: 'Usaquén, Bogotá',
              },
              {
                quote: 'Tengo tres apartamentos en Airbnb y los tres tienen NODO. Cuando un huésped dañó un módulo, pedí solo esa pieza y me llegó en una semana. Con un mueble normal habría tocado cambiar todo.',
                name: 'Carolina G.',
                location: 'Superhost · Bogotá',
              },
            ].map(t => (
              <div
                key={t.name}
                className="flex flex-col gap-5 p-8"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(0,0,0,0.07)',
                }}
              >
                {/* Quote mark */}
                <span
                  className="text-4xl leading-none select-none"
                  style={{ color: '#D4B896', fontFamily: 'Georgia, serif' }}
                  aria-hidden="true"
                >
                  "
                </span>

                {/* Quote text */}
                <p
                  className="text-sm leading-relaxed flex-1 italic"
                  style={{ color: '#5F5E5A', letterSpacing: 0 }}
                >
                  {t.quote}
                </p>

                {/* Divider */}
                <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.07)' }} />

                {/* Attribution */}
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#1C1C1A', letterSpacing: 0 }}>
                    {t.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#9E9E9C', letterSpacing: 0 }}>
                    {t.location}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <p
            className="text-center mt-8"
            style={{ fontSize: '12px', color: '#9E9E9C', letterSpacing: 0 }}
          >
            * Testimonios simulados con fines de demostración del MVP.
          </p>
        </section>

        {/* ── Newsletter ── */}
        <section style={{ backgroundColor: '#F5F2EC' }}>
          <div className="nodo-container py-16 lg:py-20 max-w-xl">
            <NewsletterSignup />
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
