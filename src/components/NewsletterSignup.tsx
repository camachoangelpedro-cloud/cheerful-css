import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface NewsletterSignupProps {
  compact?: boolean;
}

export function NewsletterSignup({ compact = false }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'duplicate' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('https://formspree.io/f/xjgjblrv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const message =
    status === 'success'   ? '¡Gracias! Te mantendremos informado.' :
    status === 'duplicate' ? 'Este email ya está registrado.' :
    status === 'error'     ? 'Hubo un error. Intenta de nuevo.' :
    null;

  return (
    <div>
      {!compact && (
        <>
          <p className="font-display text-2xl lg:text-3xl mb-3" style={{ letterSpacing: 0 }}>
            Sé el primero en conocer nuestras novedades
          </p>
          <p className="font-body text-sm mb-6" style={{ color: '#5F5E5A' }}>
            Recibe inspiración, lanzamientos y ofertas exclusivas directamente en tu correo.
          </p>
        </>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
          disabled={status === 'loading' || status === 'success'}
          className="flex-1 border border-border/60 bg-background px-4 py-2.5 font-body text-sm focus:outline-none focus:border-foreground/40 placeholder:text-muted-foreground disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="rounded-full border border-foreground/20 bg-foreground text-background px-5 py-2.5 font-body text-sm hover:opacity-85 transition-opacity disabled:opacity-40 flex items-center gap-2 whitespace-nowrap"
        >
          {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Suscribirse'}
        </button>
      </form>

      {message && (
        <p
          className="font-body text-sm mt-3"
          style={{ color: status === 'success' ? '#4A7A5B' : '#A04040' }}
        >
          {message}
        </p>
      )}

      {!compact && status === 'idle' && (
        <p className="font-body text-xs mt-3" style={{ color: '#9E9E9C' }}>
          Sin spam. Puedes darte de baja en cualquier momento.
        </p>
      )}
    </div>
  );
}
