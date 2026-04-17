import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/FooterNodo';

export default function CheckoutComingSoonPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('https://formspree.io/f/maqaopry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Próximamente — NODO</title>
      </Helmet>
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">

          <p className="nodo-overline mb-6">Checkout</p>

          <h1
            className="nodo-display mb-5"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: '#1C1C1A', lineHeight: 1 }}
          >
            ¡Muy pronto podrás completar tu compra!
          </h1>

          <p className="font-body text-sm mb-10" style={{ color: '#5F5E5A', fontWeight: 300, lineHeight: 1.7 }}>
            Déjanos tu email y te avisamos cuando estemos listos para procesar pedidos.
          </p>

          {status === 'success' ? (
            <div
              className="rounded-lg px-6 py-5 text-center"
              style={{ backgroundColor: '#F2EDE4' }}
            >
              <p className="font-body text-sm font-medium" style={{ color: '#1C1C1A' }}>
                ¡Gracias! Te avisaremos pronto. 🎉
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Tu nombre (opcional)"
                disabled={status === 'loading'}
                className="w-full border border-border/60 rounded-lg bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-foreground/40 placeholder:text-muted-foreground disabled:opacity-50"
              />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                disabled={status === 'loading'}
                className="w-full border border-border/60 rounded-lg bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-foreground/40 placeholder:text-muted-foreground disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full rounded-lg bg-[#1C1C1A] text-white px-6 py-3.5 font-body text-sm font-medium tracking-wide hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Avisarme'}
              </button>
              {status === 'error' && (
                <p className="font-body text-xs text-center" style={{ color: '#A04040' }}>
                  Hubo un error. Intenta de nuevo.
                </p>
              )}
            </form>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
