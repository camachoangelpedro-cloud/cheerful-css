import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/FooterNodo';

export default function ConfiguradorIntroPage() {
  return (
    <>
      <Helmet>
        <title>Cómo funciona el configurador — NODO</title>
        <meta name="description" content="Diseña tu sistema de almacenamiento modular en minutos. Así funciona el configurador 3D de NODO." />
      </Helmet>

      <Navbar />

      <main className="px-6 md:px-12">

        {/* SECTION 1 — Hero + CTA (all above fold) */}
        <div className="text-center pt-28 md:pt-36 pb-4">
          <p className="nodo-overline mb-6">Configurador 3D</p>
          <h1>
            <span
              className="block nodo-display"
              style={{ fontSize: 'clamp(3rem, 7vw, 7.5rem)', color: '#1C1C1A' }}
            >
              Diseña tu
            </span>
            <span
              className="block"
              style={{
                fontSize: 'clamp(1.1rem, 2.5vw, 2.2rem)',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#1C1C1A',
                marginTop: '4px',
              }}
            >
              Sistema de almacenamiento
            </span>
          </h1>

          <p className="text-sm text-muted-foreground max-w-md mx-auto mt-6 mb-10" style={{ fontWeight: 300 }}>
            Crea una configuración única en minutos. Sin herramientas, sin compromiso.
          </p>

          {/* CTA — visible without scrolling */}
          <Link
            to="/configurador/editor"
            className="inline-flex items-center gap-3 bg-foreground text-background px-10 py-4 font-medium uppercase hover:opacity-90 transition-opacity group rounded-lg"
            style={{ fontSize: '11px', letterSpacing: '0.18em' }}
          >
            Abrir el configurador
            <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </Link>

          <p className="text-xs text-muted-foreground mt-5" style={{ fontWeight: 300 }}>
            Disponible en escritorio. En móvil puedes explorar desde{' '}
            <Link to="/catalogo" className="underline underline-offset-2 hover:opacity-60 transition-opacity">
              nuestro catálogo
            </Link>.
          </p>
        </div>

        {/* Divider */}
        <div className="max-w-4xl mx-auto mt-16 mb-2" style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.07)' }} />

        {/* SECTION 2 — Three steps (scroll to learn) */}
        <div className="max-w-4xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">

          {[
            {
              num: '01',
              title: 'Empieza por la base',
              body: 'Arrastra una base al canvas. Es el punto de apoyo de tu sistema — define dónde empieza tu mueble.',
            },
            {
              num: '02',
              title: 'Apila tus muebles',
              body: 'Elige muebles del menú derecho y colócalos encima de la base o de otros muebles. Profundidad completa abajo, media profundidad arriba.',
            },
            {
              num: '03',
              title: 'Conecta y compra',
              body: 'Cuando tu diseño esté listo, revisa el resumen con el precio total y añádelo al carrito. Cada mueble llega armado.',
            },
          ].map(step => (
            <div
              key={step.num}
              className="rounded-lg p-8 lg:p-10 flex flex-col"
              style={{ backgroundColor: '#1C1C1A' }}
            >
              <p
                className="nodo-display"
                style={{ fontSize: '5rem', color: 'rgba(255,255,255,0.07)', lineHeight: 1, marginBottom: '16px' }}
              >
                {step.num}
              </p>
              <h3
                className="uppercase"
                style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', color: '#FFFFFF', marginBottom: '12px' }}
              >
                {step.title}
              </h3>
              <p style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>
                {step.body}
              </p>
            </div>
          ))}

        </div>

        {/* SECTION 3 — Tip */}
        <div className="max-w-2xl mx-auto mt-8 p-6 text-center rounded-lg" style={{ backgroundColor: '#F5F5F3' }}>
          <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontWeight: 300 }}>
            Orden recomendado de abajo hacia arriba:{' '}
            <strong className="text-foreground" style={{ fontWeight: 600 }}>Base → Profundidad completa → Media profundidad</strong>.
            Los clips se añaden automáticamente.
          </p>
        </div>

        {/* SECTION 4 — Extra info */}
        <div className="max-w-xl mx-auto text-center mt-8 mb-20">
          <p className="text-xs text-muted-foreground" style={{ fontWeight: 300 }}>
            Tu configuración es completamente libre. No hay reglas fijas — experimenta con diferentes combinaciones hasta que encuentres la que mejor se adapte a tu espacio.
          </p>
        </div>

      </main>

      <Footer />
    </>
  );
}
