import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { Footer } from '@/components/FooterNodo';
import { CartDrawer } from '@/components/CartDrawer';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { NODO_PRODUCTS, NODO_COLORS, getStartingPrice } from '@/data/modulesCatalog';

/* ── Product card for slider ──────────────────────────────── */

interface ProductCardProps {
  handle: string;
  label: string;
}

function ProductCard({ handle, label }: ProductCardProps) {
  const [colorId, setColorId] = useState('BH');
  const product = NODO_PRODUCTS.find(p => p.handle === handle);
  if (!product) return null;
  const price = getStartingPrice(product);
  const activeColor = NODO_COLORS.find(c => c.id === colorId);

  return (
    <Link
      to={`/producto/${handle}`}
      className="block group min-w-[280px] max-w-[320px] flex-shrink-0 snap-start"
    >
      <div
        className="w-full overflow-hidden relative flex items-center justify-center rounded-lg"
        style={{ backgroundColor: activeColor?.hex ?? '#ECEAE7', aspectRatio: '3/4' }}
      >
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>

      <div
        className="flex items-center gap-[6px] pt-3"
        onClick={e => e.preventDefault()}
      >
        {NODO_COLORS.map(c => (
          <button
            key={c.id}
            onClick={e => { e.preventDefault(); setColorId(c.id); }}
            aria-label={c.name}
            className={`w-5 h-5 rounded-full transition-transform ${colorId === c.id ? 'ring-2 ring-offset-1 ring-foreground scale-110' : 'hover:scale-105'}`}
            style={{ backgroundColor: c.hex, border: '1px solid rgba(0,0,0,0.10)' }}
          />
        ))}
      </div>

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

/* ── Star rating components ───────────────────────────────── */

const STAR_PATH = 'M10 1l2.47 5.01L18 6.9l-4 3.9.94 5.5L10 13.4l-4.94 2.9.94-5.5-4-3.9 5.53-.89z';

function FullStar() {
  return (
    <svg viewBox="0 0 20 20" className="w-3.5 h-3.5" aria-hidden="true">
      <path d={STAR_PATH} fill="rgba(242,237,228,0.55)" />
    </svg>
  );
}

function HalfStar({ uid }: { uid: string }) {
  return (
    <svg viewBox="0 0 20 20" className="w-3.5 h-3.5" aria-hidden="true">
      <defs>
        <clipPath id={`half-${uid}`}>
          <rect x="0" y="0" width="10" height="20" />
        </clipPath>
      </defs>
      <path d={STAR_PATH} fill="rgba(242,237,228,0.15)" />
      <path d={STAR_PATH} fill="rgba(242,237,228,0.55)" clipPath={`url(#half-${uid})`} />
    </svg>
  );
}

function EmptyStar() {
  return (
    <svg viewBox="0 0 20 20" className="w-3.5 h-3.5" aria-hidden="true">
      <path d={STAR_PATH} fill="rgba(242,237,228,0.15)" />
    </svg>
  );
}

function StarRating({ rating, uid }: { rating: number; uid: string }) {
  return (
    <div className="flex gap-1 mb-4">
      {[1, 2, 3, 4, 5].map(i => {
        if (i <= Math.floor(rating)) return <FullStar key={i} />;
        if (i === Math.ceil(rating) && rating % 1 !== 0) return <HalfStar key={i} uid={`${uid}-${i}`} />;
        return <EmptyStar key={i} />;
      })}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>NODO — Muebles modulares diseñados para ti | Bogotá</title>
        <meta name="description" content="Sistema de estantería modular personalizable. Diseña tu configuración, elige colores y recibe tus módulos armados en Bogotá. Fabricado a pedido." />
      </Helmet>
      <Navbar />
      <CartDrawer />
      <main>

        {/* BLOCK 1 — Hero */}
        <HeroSection />

        {/* BLOCK 2 — Editorial split: product slider + value prop */}
        <section className="nodo-container py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">

            {/* LEFT — Product slider */}
            <div className="lg:col-span-3 lg:pr-8">
              <div
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: 'none' }}
              >
                <ProductCard handle="modulo-36-36" label="Módulo 36×36" />
                <ProductCard handle="modulo-36-72" label="Módulo 36×72" />
                <ProductCard handle="modulo-72-36" label="Módulo 72×36" />
              </div>
            </div>

            {/* RIGHT — Dark value prop */}
            <div
              className="lg:col-span-2 rounded-lg p-8 lg:p-10 flex flex-col justify-between mt-6 lg:mt-0"
              style={{ backgroundColor: '#1C1C1A', minHeight: '500px' }}
            >
              <div>
                <p className="text-xs tracking-wider uppercase" style={{ color: 'rgba(242,237,228,0.5)' }}>
                  Nuestra propuesta
                </p>
                <h2
                  className="font-display text-2xl lg:text-3xl font-light mt-3"
                  style={{ color: '#F2EDE4', lineHeight: 1.2 }}
                >
                  Muebles que se adaptan a ti
                </h2>

                <div className="mt-8 flex flex-col gap-6">
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#F2EDE4' }}>Diseña a tu medida</p>
                    <p className="text-sm mt-1 leading-relaxed" style={{ color: 'rgba(242,237,228,0.65)' }}>
                      Elige módulos, colores y configuraciones que se ajusten exactamente a tu espacio. Sin catálogos genéricos — tu estantería, tus reglas.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#F2EDE4' }}>Precio claro, sin sorpresas</p>
                    <p className="text-sm mt-1 leading-relaxed" style={{ color: 'rgba(242,237,228,0.65)' }}>
                      Cada módulo tiene un precio fijo. Configura, suma y compra con total transparencia — sin cotizaciones ocultas ni costos inesperados.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#F2EDE4' }}>Se mueve contigo</p>
                    <p className="text-sm mt-1 leading-relaxed" style={{ color: 'rgba(242,237,228,0.65)' }}>
                      Sistema modular que se conecta y se desconecta en minutos. Te cambias de apartamento, tu NODO va contigo — y crece cuando lo necesitas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to="/catalogo"
                  className="inline-block rounded-full px-6 py-3 text-sm tracking-wide transition-all hover:bg-[#F2EDE4] hover:text-[#1C1C1A]"
                  style={{ border: '1px solid rgba(242,237,228,0.4)', color: '#F2EDE4' }}
                >
                  Ver todos los muebles
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* BLOCK 3 — Dark testimonials band */}
        <section style={{ backgroundColor: '#1C1C1A' }} className="py-20 lg:py-28">
          <div className="nodo-container">
            <h2
              className="font-display text-2xl md:text-3xl font-light mb-12"
              style={{ color: '#F2EDE4' }}
            >
              Lo que dicen nuestros clientes
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  uid: 'valentina',
                  rating: 5,
                  quote: 'Me mudé dos veces en un año y mi NODO se vino conmigo las dos veces. Lo desarmé un domingo en la tarde y al otro día ya estaba armado en el apartamento nuevo. Ningún carpintero te da eso.',
                  name: 'Valentina R.',
                  location: 'Chapinero, Bogotá',
                },
                {
                  uid: 'andres',
                  rating: 4.5,
                  quote: 'Siempre quise una estantería que no pareciera sacada de catálogo. Con el configurador armé exactamente lo que necesitaba para mi estudio y el precio nunca cambió de lo que me mostraba la página. Cero sorpresas.',
                  name: 'Andrés M.',
                  location: 'Usaquén, Bogotá',
                },
                {
                  uid: 'carolina',
                  rating: 5,
                  quote: 'Tengo tres apartamentos en Airbnb y los tres tienen NODO. Cuando un huésped dañó un módulo, pedí solo esa pieza y me llegó en una semana. Con un mueble normal habría tocado cambiar todo.',
                  name: 'Carolina G.',
                  location: 'Superhost · Bogotá',
                },
              ].map(t => (
                <div
                  key={t.uid}
                  className="flex flex-col rounded-lg p-7"
                  style={{ backgroundColor: 'rgba(242,237,228,0.06)' }}
                >
                  <StarRating rating={t.rating} uid={t.uid} />
                  <p
                    className="text-sm italic leading-relaxed flex-1 mb-5"
                    style={{ color: 'rgba(242,237,228,0.75)' }}
                  >
                    {t.quote}
                  </p>
                  <div style={{ borderTop: '1px solid rgba(242,237,228,0.10)', paddingTop: '16px' }}>
                    <p className="text-sm font-medium" style={{ color: '#F2EDE4' }}>{t.name}</p>
                    <p className="text-xs mt-1" style={{ color: 'rgba(242,237,228,0.45)' }}>{t.location}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center mt-8" style={{ fontSize: '12px', color: 'rgba(242,237,228,0.35)' }}>
              * Testimonios simulados con fines de demostración del MVP.
            </p>
          </div>
        </section>

        {/* BLOCK 4 — Newsletter */}
        <section>
          <div className="nodo-container py-16 lg:py-20 max-w-xl">
            <NewsletterSignup />
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
