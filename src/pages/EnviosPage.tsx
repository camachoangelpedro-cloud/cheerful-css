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

export default function EnviosPage() {
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
            Política de envíos
          </h1>
          <p className="font-body text-sm mb-12" style={{ color: '#9E9E9C' }}>
            Última actualización: abril 2026
          </p>

          <Section title="Cobertura">
            <p>
              Actualmente realizamos envíos únicamente dentro de Bogotá D.C. Estamos trabajando
              para expandir nuestra cobertura — Medellín próximamente.
            </p>
          </Section>

          <Section title="Tiempo de entrega">
            <p>
              El tiempo estimado de entrega es de 2 a 3 semanas desde la confirmación del pedido.
              Todos los módulos se fabrican a pedido en nuestro taller.
            </p>
          </Section>

          <Section title="Cómo llega tu pedido">
            <p>
              Cada módulo llega completamente armado desde nuestro taller. Solo conectas los módulos
              entre sí con los clips estructurales incluidos. No necesitas herramientas.
            </p>
          </Section>

          <Section title="Costos de envío">
            <p>
              Los costos de envío se calculan automáticamente en el checkout según el peso total
              del pedido. Utilizamos flete local especializado para garantizar la integridad de
              los módulos durante el transporte.
            </p>
          </Section>

          <Section title="Envío gratis">
            <p>
              Usa el código <strong>LANZAMIENTO</strong> al pagar para envío gratis.
              Disponible para los primeros 20 pedidos.
            </p>
          </Section>

          <Section title="Seguimiento">
            <p>
              Recibirás un email con información de seguimiento una vez que tu pedido sea despachado
              desde nuestro taller.
            </p>
          </Section>

          <Section title="Contacto">
            <p>
              ¿Tienes preguntas sobre tu envío? Escríbenos a{' '}
              <a href="mailto:nodomodulardesign@gmail.com" className="underline underline-offset-2 hover:opacity-60 transition-opacity" style={{ color: '#1C1C1A' }}>
                nodomodulardesign@gmail.com
              </a>
            </p>
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
