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

export default function TerminosPage() {
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
            Términos y condiciones
          </h1>
          <p className="font-body text-sm mb-12" style={{ color: '#9E9E9C' }}>
            Última actualización: abril 2026
          </p>

          <p className="font-body text-sm leading-relaxed mb-10" style={{ color: '#5F5E5A' }}>
            Al acceder y utilizar nodo.co, aceptas estos términos.
          </p>

          <Section title="Información general">
            <p>
              Este sitio es operado por NODO Modular Design. Los productos se fabrican a pedido
              en nuestro taller en Bogotá, Colombia.
            </p>
          </Section>

          <Section title="Precios">
            <p>
              Todos los precios están en pesos colombianos (COP) e incluyen IVA. Pueden cambiar
              antes de la confirmación del pedido. Una vez confirmado, el precio no cambia.
            </p>
          </Section>

          <Section title="Pedidos">
            <p>
              Al realizar un pedido, haces una oferta de compra. NODO puede aceptar o rechazar
              cualquier pedido. Recibirás confirmación por email.
            </p>
          </Section>

          <Section title="Fabricación y entrega">
            <p>
              El tiempo de entrega es de 2 a 3 semanas desde la confirmación. Realizamos envíos
              únicamente en Bogotá D.C. Cada módulo llega completamente armado desde nuestro taller.
            </p>
          </Section>

          <Section title="Propiedad intelectual">
            <p>
              Todo el contenido del sitio — diseños, textos, imágenes, modelos 3D — es propiedad
              exclusiva de NODO Modular Design.
            </p>
          </Section>

          <Section title="Ley aplicable">
            <p>
              Estos términos se rigen por las leyes de la República de Colombia. Cualquier disputa
              se someterá a la jurisdicción de los tribunales de Bogotá D.C.
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
