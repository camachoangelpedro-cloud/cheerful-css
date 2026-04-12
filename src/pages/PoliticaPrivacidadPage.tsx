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

export default function PoliticaPrivacidadPage() {
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
            Política de privacidad
          </h1>
          <p className="font-body text-sm mb-12" style={{ color: '#9E9E9C' }}>
            Última actualización: abril 2026
          </p>

          <p className="font-body text-sm leading-relaxed mb-10" style={{ color: '#5F5E5A' }}>
            NODO Modular Design ("NODO", "nosotros") se compromete a proteger la privacidad de los datos
            personales de sus usuarios, en cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013.
          </p>

          <Section title="Datos que recopilamos">
            <p>
              Al realizar una compra o contactarnos, recopilamos nombre, correo electrónico, dirección de
              envío, teléfono y datos de la transacción. No almacenamos datos de tarjetas de crédito —
              el procesamiento de pagos es gestionado por Shopify Payments.
            </p>
          </Section>

          <Section title="Uso de los datos">
            <p>Utilizamos tus datos para:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Procesar y entregar tu pedido.</li>
              <li>Comunicarnos sobre el estado de tu orden.</li>
              <li>Enviar información sobre productos o promociones (solo si autorizas).</li>
              <li>Mejorar nuestro servicio.</li>
            </ul>
          </Section>

          <Section title="Compartición">
            <p>
              No vendemos ni compartimos tus datos con terceros, excepto para completar tu pedido
              (por ejemplo, compartir tu dirección con nuestro operador de logística).
            </p>
          </Section>

          <Section title="Tus derechos">
            <p>
              Conforme a la Ley 1581 de 2012, tienes derecho a conocer, actualizar, rectificar y
              suprimir tus datos personales. Escríbenos a{' '}
              <a href="mailto:nodomodulardesign@gmail.com" className="underline underline-offset-2 hover:opacity-60 transition-opacity" style={{ color: '#1C1C1A' }}>
                nodomodulardesign@gmail.com
              </a>
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              Utilizamos cookies esenciales y analíticas. Puedes gestionar tus preferencias en cualquier momento.
            </p>
          </Section>

          <Section title="Contacto">
            <p>
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
