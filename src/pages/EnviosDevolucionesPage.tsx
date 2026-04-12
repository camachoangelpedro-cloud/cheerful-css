import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/FooterNodo';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="font-body text-base font-semibold mb-3" style={{ color: '#1C1C1A' }}>{title}</h2>
      <div className="font-body text-sm leading-relaxed space-y-2" style={{ color: '#5F5E5A' }}>
        {children}
      </div>
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <h2
      className="text-2xl lg:text-3xl mb-8 mt-14 first:mt-0"
      style={{ fontWeight: 300, color: '#1C1C1A', letterSpacing: 0, lineHeight: 1.15 }}
    >
      {title}
    </h2>
  );
}

export default function EnviosDevolucionesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Envíos y devoluciones | NODO</title>
        <meta name="description" content="Información sobre envíos en Bogotá, tiempos de entrega, política de devoluciones y garantía legal de un año. NODO Modular Design." />
      </Helmet>
      <Navbar />
      <CartDrawer />
      <main className="pt-[96px]">
        <div className="nodo-container py-20 lg:py-28 max-w-3xl">
          <h1
            className="text-4xl lg:text-5xl mb-3"
            style={{ fontWeight: 300, color: '#1C1C1A', letterSpacing: 0, lineHeight: 1.15 }}
          >
            Envíos y devoluciones
          </h1>
          <p className="font-body text-sm mb-12" style={{ color: '#9E9E9C' }}>
            Última actualización: abril 2026
          </p>

          {/* ── Envíos ── */}
          <SectionHeading title="Envíos" />

          <Section title="Cobertura">
            <p>
              Actualmente realizamos envíos únicamente dentro de Bogotá D.C. Estamos trabajando
              para expandir nuestra cobertura a Medellín y otras ciudades.
            </p>
          </Section>

          <Section title="Tiempo de entrega">
            <p>
              Los productos NODO se fabrican a pedido. El tiempo estimado de entrega es de
              2 a 3 semanas desde la confirmación del pedido.
            </p>
          </Section>

          <Section title="Cómo llega tu pedido">
            <p>
              Cada módulo llega completamente armado desde nuestro taller en Bogotá. Solo tienes
              que conectar los módulos entre sí con los clips estructurales incluidos.
              No necesitas herramientas.
            </p>
          </Section>

          <Section title="Costos de envío">
            <p>
              El costo de envío se calcula automáticamente en el checkout según el peso total
              del pedido.
            </p>
          </Section>

          <Section title="Envío gratis">
            <p>
              Usa el código <strong>LANZAMIENTO</strong> al momento del pago. Disponible para
              los primeros 20 pedidos.
            </p>
          </Section>

          <Section title="Seguimiento">
            <p>
              Recibirás un email con la información de seguimiento una vez despachado tu pedido.
            </p>
          </Section>

          {/* ── Devoluciones y garantía ── */}
          <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.07)', margin: '48px 0' }} />

          <SectionHeading title="Devoluciones y garantía" />

          <Section title="Derecho de retracto">
            <p>
              Conforme a la Ley 1480 de 2011, tienes cinco (5) días hábiles después de la entrega
              para ejercer el retracto. El producto debe estar en su estado original.
            </p>
          </Section>

          <Section title="Devolución del dinero">
            <p>
              Máximo quince (15) días calendario desde la solicitud, conforme a la Ley 2439 de 2024.
            </p>
          </Section>

          <Section title="Garantía legal">
            <p>
              Todos los productos NODO cuentan con garantía de un (1) año desde la entrega.
              Cubre defectos de fabricación y materiales. No cubre:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Uso inadecuado o fuerza mayor.</li>
              <li>Modificaciones realizadas por el cliente.</li>
              <li>Desgaste natural por uso prolongado.</li>
            </ul>
          </Section>

          <Section title="Módulos de reemplazo">
            <p>
              Si un módulo presenta un defecto cubierto por la garantía, solo devuelves ese módulo —
              no el sistema completo. Te enviamos un reemplazo sin costo.
            </p>
          </Section>

          <Section title="Contacto">
            <p>
              Para solicitudes de devolución o garantía, escríbenos a{' '}
              <a
                href="mailto:nodomodulardesign@gmail.com"
                className="underline underline-offset-2 hover:opacity-60 transition-opacity"
                style={{ color: '#1C1C1A' }}
              >
                nodomodulardesign@gmail.com
              </a>{' '}
              con tu número de pedido. Te respondemos en menos de 24 horas.
            </p>
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
