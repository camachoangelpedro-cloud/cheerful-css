import { useState } from 'react';
import { Mail, MessageSquare, Instagram, ChevronDown } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/FooterNodo';

/* ── FAQ data ─────────────────────────────────────────────── */
const FAQ = [
  {
    q: '¿Cuánto tarda mi pedido?',
    a: 'Todos los productos NODO se fabrican a pedido. El tiempo estimado de entrega es de 2 a 3 semanas desde la confirmación del pedido.',
  },
  {
    q: '¿Hacen envíos fuera de Bogotá?',
    a: 'Actualmente realizamos envíos únicamente dentro de Bogotá D.C. Estamos trabajando para expandir nuestra cobertura a otras ciudades.',
  },
  {
    q: '¿Cómo funciona el sistema NODO?',
    a: 'Cada módulo llega completamente armado desde nuestro taller. Solo tienes que conectar los módulos entre sí con los clips estructurales incluidos. No necesitas herramientas.',
  },
  {
    q: '¿Puedo devolver mi pedido?',
    a: 'Tienes derecho de retracto dentro de los cinco (5) días hábiles siguientes a la entrega, conforme a la Ley 1480 de 2011. Escríbenos a nodomodulardesign@gmail.com',
  },
  {
    q: '¿Tienen garantía?',
    a: 'Garantía legal de un (1) año. Cubre defectos de fabricación y materiales.',
  },
  {
    q: '¿Puedo ver los módulos antes de comprar?',
    a: 'Nuestro configurador 3D te permite visualizar tu sistema en tiempo real. También puedes contactarnos para coordinar una visita a nuestro taller en Bogotá.',
  },
  {
    q: '¿Los colores se ven igual que en la pantalla?',
    a: 'Los renders 3D son representaciones fieles de nuestros acabados pero pueden variar según tu pantalla. Contáctanos para recibir una muestra de material.',
  },
];

/* ── FAQ Item ─────────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/40">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className="font-body text-sm font-medium" style={{ color: '#1C1C1A' }}>{q}</span>
        <ChevronDown
          className="shrink-0 w-4 h-4 transition-transform"
          style={{ color: '#9E9E9C', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      {open && (
        <p className="font-body text-sm pb-5 leading-relaxed" style={{ color: '#5F5E5A' }}>
          {a}
        </p>
      )}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function ContactoPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    await fetch('https://formspree.io/f/PLACEHOLDER_ID', {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
    });
    setSubmitted(true);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      <main className="pt-[96px]">

        {/* ── Header ── */}
        <section className="nodo-container py-16 lg:py-24 border-b border-border/20">
          <h1
            className="text-4xl lg:text-5xl mb-4"
            style={{ fontWeight: 300, color: '#1C1C1A', letterSpacing: 0, lineHeight: 1.15 }}
          >
            Contáctanos
          </h1>
          <p className="font-body text-base max-w-xl" style={{ color: '#5F5E5A' }}>
            ¿Tienes preguntas sobre tu proyecto NODO? Escríbenos y te respondemos en menos de 24 horas.
          </p>
        </section>

        {/* ── Form + Cards ── */}
        <section className="nodo-container py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Contact form */}
            <div>
              <p className="font-body text-xs uppercase tracking-widest mb-8" style={{ color: '#9E9E9C' }}>
                Envíanos un mensaje
              </p>
              {submitted ? (
                <div
                  className="py-10 px-8 text-center"
                  style={{ backgroundColor: '#F5EDD6', borderRadius: '6px' }}
                >
                  <p className="font-display text-xl mb-2" style={{ color: '#7A5C1E' }}>¡Gracias!</p>
                  <p className="font-body text-sm" style={{ color: '#7A5C1E' }}>Tu mensaje fue enviado. Te respondemos en menos de 24 horas.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="font-body text-xs uppercase tracking-widest block mb-2" style={{ color: '#9E9E9C' }}>
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      required
                      className="w-full border border-border/50 bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-foreground/40"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs uppercase tracking-widest block mb-2" style={{ color: '#9E9E9C' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full border border-border/50 bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-foreground/40"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs uppercase tracking-widest block mb-2" style={{ color: '#9E9E9C' }}>
                      Asunto
                    </label>
                    <select
                      name="asunto"
                      className="w-full border border-border/50 bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-foreground/40 appearance-none"
                      style={{ backgroundImage: 'none' }}
                    >
                      <option>Tengo una pregunta sobre un producto</option>
                      <option>Necesito ayuda con mi pedido</option>
                      <option>Quiero un proyecto B2B / Airbnb</option>
                      <option>Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-body text-xs uppercase tracking-widest block mb-2" style={{ color: '#9E9E9C' }}>
                      Mensaje *
                    </label>
                    <textarea
                      name="mensaje"
                      required
                      rows={4}
                      className="w-full border border-border/50 bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-foreground/40 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="nodo-button w-full py-3 font-body text-sm"
                  >
                    Enviar mensaje
                  </button>
                </form>
              )}
            </div>

            {/* Contact cards */}
            <div>
              <p className="font-body text-xs uppercase tracking-widest mb-8" style={{ color: '#9E9E9C' }}>
                Contacto directo
              </p>
              <div className="space-y-4">
                <a
                  href="https://wa.me/34676822788"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-6 border border-border/40 hover:border-foreground/20 transition-colors group"
                  style={{ borderRadius: 0 }}
                >
                  <MessageSquare className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#4A7A5B' }} />
                  <div>
                    <p className="font-body text-sm font-medium mb-0.5">WhatsApp</p>
                    <p className="font-body text-sm" style={{ color: '#5F5E5A' }}>Chatea con nosotros</p>
                  </div>
                </a>
                <a
                  href="mailto:nodomodulardesign@gmail.com"
                  className="flex items-start gap-4 p-6 border border-border/40 hover:border-foreground/20 transition-colors group"
                  style={{ borderRadius: 0 }}
                >
                  <Mail className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#5F5E5A' }} />
                  <div>
                    <p className="font-body text-sm font-medium mb-0.5">Email</p>
                    <p className="font-body text-sm" style={{ color: '#5F5E5A' }}>nodomodulardesign@gmail.com</p>
                  </div>
                </a>
                <a
                  href="https://instagram.com/nodo.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-6 border border-border/40 hover:border-foreground/20 transition-colors group"
                  style={{ borderRadius: 0 }}
                >
                  <Instagram className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#5F5E5A' }} />
                  <div>
                    <p className="font-body text-sm font-medium mb-0.5">Instagram</p>
                    <p className="font-body text-sm" style={{ color: '#5F5E5A' }}>@nodo.co</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="nodo-container py-16 lg:py-20 border-t border-border/20">
          <p className="font-body text-xs uppercase tracking-widest mb-8" style={{ color: '#9E9E9C' }}>
            Preguntas frecuentes
          </p>
          <div className="max-w-2xl">
            {FAQ.map(item => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
