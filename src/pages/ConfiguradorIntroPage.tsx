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

        {/* SECTION 1 — Hero */}
        <div className="text-center pt-32 md:pt-40 pb-4">
          <h1 className="font-display font-light text-4xl md:text-5xl">
            Diseña tu sistema de almacenamiento
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto mt-4">
            Crea una configuración única en minutos. Así funciona:
          </p>
        </div>

        {/* SECTION 2 — Three steps */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-16">

          <div>
            <p className="text-5xl font-light text-muted-foreground/30">01</p>
            <h3 className="font-body font-medium text-lg mt-2">Empieza por la base</h3>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Arrastra una base al canvas. Es el punto de apoyo de tu sistema — define dónde empieza tu mueble.
            </p>
          </div>

          <div>
            <p className="text-5xl font-light text-muted-foreground/30">02</p>
            <h3 className="font-body font-medium text-lg mt-2">Apila tus muebles</h3>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Elige muebles del menú derecho y colócalos encima de la base o de otros muebles. Recomendamos colocar los muebles de profundidad completa abajo y los de media profundidad arriba — así tu sistema queda más estable y visualmente equilibrado. Puedes elegir el color, si tiene fondo, repisa o puerta.
            </p>
          </div>

          <div>
            <p className="text-5xl font-light text-muted-foreground/30">03</p>
            <h3 className="font-body font-medium text-lg mt-2">Conecta y compra</h3>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Cuando tu diseño esté listo, revisa el resumen con el precio total y añádelo al carrito. Cada mueble llega armado — solo los conectas con los clips incluidos.
            </p>
          </div>

        </div>

        {/* SECTION 3 — Tip */}
        <div className="max-w-2xl mx-auto mt-12 bg-muted rounded-lg p-6 text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Orden recomendado de abajo hacia arriba: <strong className="text-foreground font-medium">Base → Muebles profundidad completa → Muebles media profundidad</strong>. Los clips se añaden automáticamente.
          </p>
        </div>

        {/* SECTION 4 — CTA */}
        <div className="text-center mt-12 mb-8">
          <Link
            to="/configurador/editor"
            className="rounded-full bg-foreground text-background px-10 py-4 text-base tracking-wide inline-block hover:opacity-90 transition-opacity"
          >
            Abrir el configurador
          </Link>
          <p className="text-xs text-muted-foreground mt-4">
            Disponible en escritorio. En móvil puedes comprar muebles individuales desde{' '}
            <Link to="/catalogo" className="underline underline-offset-2 hover:opacity-60 transition-opacity">
              nuestro catálogo
            </Link>
            .
          </p>
        </div>

        {/* SECTION 5 — Extra info */}
        <div className="max-w-xl mx-auto text-center mt-8 mb-20">
          <p className="text-xs text-muted-foreground">
            Tu configuración es completamente libre. No hay reglas fijas — experimenta con diferentes combinaciones hasta que encuentres la que mejor se adapte a tu espacio.
          </p>
        </div>

      </main>

      <Footer />
    </>
  );
}
