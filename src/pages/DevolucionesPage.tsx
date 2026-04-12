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

export default function DevolucionesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      <main className="pt-[96px]">
        <div className="nodo-container py-20 lg:py-28 max-w-3xl">
          <h1
            className="text-4xl lg:text-5xl mb-3"
            style={{ fontWeight: 300, color: '#1C1C1A', letterSpacing: 0, lineHeight: 1.15 }}
          >
            Política de devoluciones y garantía
          </h1>
          <p className="font-body text-sm mb-12" style={{ color: '#9E9E9C' }}>
            Última actualización: abril 2026
          </p>

          <Section title="Derecho de retracto">
            <p>
              Conforme a la Ley 1480 de 2011, tienes cinco (5) días hábiles después de recibir tu
              pedido para ejercer el derecho de retracto. El producto debe estar en estado original,
              sin uso y en su empaque.
            </p>
          </Section>

          <Section title="Devolución del dinero">
            <p>
              Una vez aprobada la devolución, el reembolso se realizará en un máximo de quince (15)
              días calendario desde la solicitud, conforme a la Ley 2439 de 2024.
            </p>
          </Section>

          <Section title="Garantía legal">
            <p>
              Todos los productos NODO tienen garantía legal de un (1) año desde la fecha de entrega.
              La garantía cubre defectos de fabricación y materiales. No cubre:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Uso inadecuado o fuerza mayor.</li>
              <li>Modificaciones realizadas por el usuario.</li>
              <li>Desgaste natural por uso prolongado.</li>
            </ul>
          </Section>

          <Section title="Módulos de reemplazo">
            <p>
              Si un módulo presenta un defecto cubierto por la garantía, solo devuelves ese módulo —
              no el sistema completo. Te enviamos un módulo de reemplazo sin costo adicional.
            </p>
          </Section>

          <Section title="Cómo solicitar una devolución">
            <p>
              Escríbenos a{' '}
              <a href="mailto:nodomodulardesign@gmail.com" className="underline underline-offset-2 hover:opacity-60 transition-opacity" style={{ color: '#1C1C1A' }}>
                nodomodulardesign@gmail.com
              </a>{' '}
              con tu número de pedido y una descripción del problema. Te respondemos en menos de 24 horas.
            </p>
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
