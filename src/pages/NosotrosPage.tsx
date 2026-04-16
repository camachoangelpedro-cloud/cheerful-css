import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/FooterNodo';

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Nosotros — Quiénes somos | NODO</title>
        <meta name="description" content="NODO nace de la convicción de que el diseño de calidad no debería exigirte elegir entre lo genérico y lo caro. Muebles modulares hechos en Colombia." />
      </Helmet>
      <Navbar />
      <CartDrawer />

      <main className="pt-[96px]">

        {/* ── SECTION 1 — Hero ─────────────────────────────────────────────── */}
        <section style={{ backgroundColor: '#F5F5F5' }} className="py-20 lg:py-28">
          <div className="nodo-container">
            <h1
              className="text-4xl lg:text-5xl max-w-2xl"
              style={{ fontWeight: 300, color: '#1C1C1A', letterSpacing: 0, lineHeight: 1.15 }}
            >
              Muebles modulares diseñados para la vida real.
            </h1>
            <p
              className="text-base mt-6 max-w-xl leading-relaxed"
              style={{ color: '#5F5E5A', letterSpacing: 0 }}
            >
              NODO nace de una convicción simple: que el diseño de calidad no debería exigirte elegir
              entre lo genérico y lo caro, entre lo impersonal y lo impredecible.
            </p>
          </div>
        </section>

        {/* ── SECTION 2 — El problema ──────────────────────────────────────── */}
        <section className="nodo-container py-20 lg:py-28">
          <h2
            className="text-3xl lg:text-4xl mb-8"
            style={{ fontWeight: 300, color: '#1C1C1A', letterSpacing: 0, lineHeight: 1.1 }}
          >
            El problema que resolvemos
          </h2>
          <p
            className="text-base leading-relaxed max-w-2xl"
            style={{ color: '#5F5E5A', letterSpacing: 0 }}
          >
            En Colombia, amueblar un espacio con intención de diseño significa elegir entre dos extremos.
            Por un lado, las grandes superficies ofrecen muebles accesibles pero genéricos — los mismos
            estantes en todos los apartamentos. Por el otro, los talleres artesanales ofrecen personalización,
            pero con precios opacos, tiempos inciertos y un proceso completamente análogo. Para el profesional
            urbano que arrienda, que se muda, que quiere un espacio que refleje quién es — ninguna de las
            dos opciones funciona.
          </p>
        </section>

        {/* ── SECTION 3 — La solución ──────────────────────────────────────── */}
        <section
          className="nodo-container py-20 lg:py-28 border-t"
          style={{ borderColor: 'rgba(0,0,0,0.06)' }}
        >
          <h2
            className="text-3xl lg:text-4xl mb-10 lg:mb-14"
            style={{ fontWeight: 300, color: '#1C1C1A', letterSpacing: 0, lineHeight: 1.1 }}
          >
            NODO es la tercera opción.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: '⬡',
                title: 'Diseño modular',
                body: 'Un sistema de módulos estandarizados en una grilla de 36 cm que se combinan en miles de configuraciones. Tú diseñas, nosotros fabricamos.',
              },
              {
                icon: '◎',
                title: 'Transparencia total',
                body: 'Cada módulo tiene un precio fijo. Configuras tu sistema, ves el precio en tiempo real y compras sin cotizaciones ocultas ni sorpresas.',
              },
              {
                icon: '⟳',
                title: 'Hecho para moverse',
                body: 'Se desarma y se rearma en minutos. Cuando cambias de apartamento, tu NODO se muda contigo — y crece cuando lo necesitas.',
              },
            ].map(card => (
              <div
                key={card.title}
                className="flex flex-col gap-4 p-8"
                style={{ backgroundColor: '#F5F5F5', borderRadius: '8px' }}
              >
                <span className="text-2xl" style={{ color: '#1C1C1A' }}>{card.icon}</span>
                <p className="text-base font-semibold" style={{ color: '#1C1C1A', letterSpacing: 0 }}>
                  {card.title}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#5F5E5A', letterSpacing: 0 }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 4 — Cómo funciona ────────────────────────────────────── */}
        <section
          className="nodo-container py-20 lg:py-28 border-t"
          style={{ borderColor: 'rgba(0,0,0,0.06)' }}
        >
          <h2
            className="text-3xl lg:text-4xl mb-10 lg:mb-14"
            style={{ fontWeight: 300, color: '#1C1C1A', letterSpacing: 0, lineHeight: 1.1 }}
          >
            Cómo funciona
          </h2>

          <div className="flex flex-col">
            {[
              {
                num: '01',
                title: 'Configura',
                body: 'Elige tus módulos, dimensiones y acabados en nuestro configurador digital.',
              },
              {
                num: '02',
                title: 'Confirma',
                body: 'Revisa tu diseño, verifica el precio final y realiza tu pedido.',
              },
              {
                num: '03',
                title: 'Fabricamos',
                body: 'Tu sistema se fabrica a medida en nuestro taller en Bogotá en 2 a 3 semanas.',
              },
              {
                num: '04',
                title: 'Entregamos',
                body: 'Recibe tu NODO con entrega a domicilio incluida en tu espacio.',
              },
            ].map((step, i, arr) => (
              <div
                key={step.num}
                className="flex gap-8 py-8"
                style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}
              >
                <span
                  className="text-xs font-medium shrink-0 pt-0.5"
                  style={{ color: '#9E9E9C', letterSpacing: '0.08em', minWidth: '28px' }}
                >
                  {step.num}
                </span>
                <div>
                  <p className="text-base font-semibold mb-1" style={{ color: '#1C1C1A', letterSpacing: 0 }}>
                    {step.title}
                  </p>
                  <p className="text-sm leading-relaxed max-w-lg" style={{ color: '#5F5E5A', letterSpacing: 0 }}>
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 5 — El fundador ──────────────────────────────────────── */}
        <section
          className="nodo-container py-20 lg:py-28 border-t"
          style={{ borderColor: 'rgba(0,0,0,0.06)' }}
        >
          <h2
            className="text-3xl lg:text-4xl mb-10"
            style={{ fontWeight: 300, color: '#1C1C1A', letterSpacing: 0, lineHeight: 1.1 }}
          >
            Quién está detrás
          </h2>
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Photo placeholder */}
            <div
              className="shrink-0 flex items-center justify-center text-center"
              style={{
                width: '200px',
                height: '200px',
                backgroundColor: '#E8E4DC',
                borderRadius: '6px',
                color: '#9E9E9C',
                fontSize: '12px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Foto del fundador
            </div>
            <p
              className="text-base leading-relaxed max-w-xl"
              style={{ color: '#5F5E5A', letterSpacing: 0 }}
            >
              NODO fue creado por un diseñador colombiano con formación en diseño espacial y de producto,
              convencido de que las condiciones que permitieron a marcas como Tylko escalar en Europa ya
              existen en el mercado colombiano. Este proyecto es su tesis de grado en el BBA de IE University
              — y el primer paso de una empresa real.
            </p>
          </div>
        </section>

        {/* ── SECTION 6 — CTA final ────────────────────────────────────────── */}
        <section className="py-20 lg:py-28" style={{ backgroundColor: '#1C1C1A' }}>
          <div className="nodo-container flex flex-col items-center text-center gap-6">
            <h2
              className="text-3xl lg:text-4xl"
              style={{ fontWeight: 300, color: '#FFFFFF', letterSpacing: 0, lineHeight: 1.1 }}
            >
              Diseña tu primer NODO
            </h2>
            <Link
              to="/configurador"
              className="inline-flex items-center px-7 py-3 text-sm font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: '#F2EDE4', color: '#1C1C1A', borderRadius: '999px', letterSpacing: 0 }}
            >
              Ir al configurador
            </Link>
            <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.45)', letterSpacing: 0 }}>
              Sin compromiso. Configura y explora.
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
