import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { Footer } from '@/components/FooterNodo';
import { CartDrawer } from '@/components/CartDrawer';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { NODO_PRODUCTS, NODO_COLORS, getStartingPrice } from '@/data/modulesCatalog';
import { getRenderUrl } from '@/data/renderMap';

/* ── Product card ─────────────────────────────────────── */

interface ProductCardProps {
  handle: string;
  label: string;
}

function ProductCard({ handle, label }: ProductCardProps) {
  const [colorId, setColorId] = useState('RO');
  const product = NODO_PRODUCTS.find(p => p.handle === handle);
  if (!product) return null;
  const price = getStartingPrice(product);
  const activeColor = NODO_COLORS.find(c => c.id === colorId);

  return (
    <div className="block group">
      <Link to={`/producto/${handle}`} className="block overflow-hidden">
        <div
          className="w-full relative flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: activeColor?.hex ?? '#ECEAE7', aspectRatio: '4/5' }}
        >
          {(() => {
            const renderUrl = getRenderUrl(handle, colorId);
            return renderUrl ? (
              <img
                src={renderUrl}
                alt={label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                loading="lazy"
              />
            ) : (
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {label}
              </span>
            );
          })()}
        </div>
      </Link>

      <div className="flex items-center gap-[5px] pt-3" onClick={e => e.preventDefault()}>
        {NODO_COLORS.map(c => (
          <button
            key={c.id}
            onClick={e => { e.preventDefault(); setColorId(c.id); }}
            aria-label={c.name}
            className={`w-[14px] h-[14px] rounded-full transition-transform ${colorId === c.id ? 'ring-2 ring-offset-1 ring-foreground scale-110' : 'hover:scale-110'}`}
            style={{ backgroundColor: c.hex, border: c.id === 'BH' ? '1px solid rgba(0,0,0,0.15)' : '1px solid transparent' }}
          />
        ))}
      </div>

      <div className="pt-2.5">
        <p style={{ fontSize: '13px', fontWeight: 400, color: '#1C1C1A', letterSpacing: 0 }}>{label}</p>
        <p className="mt-1" style={{ fontSize: '13px', fontWeight: 300, color: '#9E9E9C', letterSpacing: 0 }}>
          Desde COP ${price.toLocaleString('es-CO')}
        </p>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────── */

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

        {/* BLOCK 2 — Products + editorial */}
        <section className="nodo-container py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

            {/* LEFT — 2 product cards */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 gap-5 lg:gap-6">
                <ProductCard handle="modulo-72-72" label="Módulo 72×72" />
                <ProductCard handle="modulo-36-18" label="Módulo 36×18" />
              </div>
            </div>

            {/* RIGHT — editorial dark panel */}
            <div className="lg:col-span-1 flex flex-col mt-4 lg:mt-0">
              <div
                className="flex flex-col p-8 lg:p-10"
                style={{ backgroundColor: '#1C1C1A' }}
              >
                <span
                  className="font-medium uppercase"
                  style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)' }}
                >
                  Nuestra propuesta
                </span>

                <h2
                  className="nodo-display mt-5 mb-10"
                  style={{ color: '#FFFFFF', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}
                >
                  Muebles que se adaptan a ti, no al revés.
                </h2>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  {[
                    { num: '01', label: 'Diseñado a tu medida' },
                    { num: '02', label: 'Precio claro, sin sorpresas' },
                    { num: '03', label: 'Se mueve contigo' },
                  ].map(item => (
                    <div
                      key={item.num}
                      className="flex items-center justify-between py-4"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', fontWeight: 400 }}>
                        {item.label}
                      </span>
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
                        {item.num}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-5">
                <Link
                  to="/catalogo"
                  className="inline-flex items-center gap-3 font-medium uppercase transition-all duration-300 group"
                  style={{ fontSize: '11px', letterSpacing: '0.14em', color: '#1C1C1A' }}
                >
                  Ver todos los muebles
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* EDITORIAL STRIP */}
        <div
          className="overflow-hidden py-10 lg:py-14"
          style={{ borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
        >
          <p
            className="nodo-container nodo-display"
            style={{
              fontSize: 'clamp(2rem, 5vw, 5rem)',
              color: 'rgba(28,28,26,0.1)',
              whiteSpace: 'nowrap',
            }}
          >
            Modular · Preciso · Tuyo · Hecho en Bogotá · Fabricado a tu medida
          </p>
        </div>

        {/* BLOCK 3 — Editorial quotes */}
        <section style={{ backgroundColor: '#1C1C1A' }} className="py-20 lg:py-28">
          <div className="nodo-container">

            <div className="flex items-end justify-between mb-12" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '24px' }}>
              <h2
                className="font-light"
                style={{ color: '#FFFFFF', fontSize: '1.1rem', letterSpacing: '-0.01em' }}
              >
                Lo que dicen
              </h2>
              <span
                className="font-medium uppercase"
                style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.25)' }}
              >
                Testimonios
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
              {[
                {
                  quote: '"Me mudé dos veces en un año y mi NODO se vino conmigo las dos veces."',
                  name: 'Valentina R.',
                  location: 'Chapinero, Bogotá',
                  num: '01',
                },
                {
                  quote: '"Armé exactamente lo que necesitaba y el precio nunca cambió de lo que me mostraba la página."',
                  name: 'Andrés M.',
                  location: 'Usaquén, Bogotá',
                  num: '02',
                },
                {
                  quote: '"Cuando un huésped dañó un módulo, pedí solo esa pieza. Con un mueble normal habría tocado cambiar todo."',
                  name: 'Carolina G.',
                  location: 'Superhost · Bogotá',
                  num: '03',
                },
              ].map((t, i) => (
                <div
                  key={t.num}
                  className="py-8 pr-8"
                  style={{
                    borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                    paddingLeft: i > 0 ? '32px' : '0',
                  }}
                >
                  <p
                    className="font-light leading-relaxed mb-8"
                    style={{ color: 'rgba(255,255,255,0.60)', fontSize: '0.95rem', letterSpacing: '-0.005em' }}
                  >
                    {t.quote}
                  </p>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                    <p style={{ fontSize: '12px', color: '#FFFFFF', fontWeight: 500 }}>{t.name}</p>
                    <p className="mt-0.5" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em' }}>{t.location}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-10" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.04em' }}>
              * Testimonios simulados con fines de demostración.
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
