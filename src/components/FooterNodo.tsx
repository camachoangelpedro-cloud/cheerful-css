import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// ── Payment method badge ─────────────────────────────────────────────────────
function PaymentBadge({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center justify-center font-body text-[10px] font-medium"
      style={{
        border: '1px solid rgba(242,237,228,0.2)',
        borderRadius: 0,
        padding: '3px 7px',
        color: 'rgba(242,237,228,0.45)',
        letterSpacing: '0.04em',
        height: '24px',
      }}
    >
      {label}
    </span>
  );
}

function MastercardIcon() {
  return (
    <svg width="38" height="24" viewBox="0 0 38 24" aria-label="Mastercard" style={{ display: 'block' }}>
      <rect width="38" height="24" rx="4" fill="none" stroke="rgba(242,237,228,0.2)" strokeWidth="1" />
      <circle cx="14" cy="12" r="7" fill="rgba(242,237,228,0.22)" />
      <circle cx="24" cy="12" r="7" fill="rgba(242,237,228,0.14)" />
    </svg>
  );
}

function VisaIcon() {
  return (
    <svg width="44" height="24" viewBox="0 0 44 24" aria-label="Visa" style={{ display: 'block' }}>
      <rect width="44" height="24" rx="4" fill="none" stroke="rgba(242,237,228,0.2)" strokeWidth="1" />
      <text
        x="22" y="16"
        textAnchor="middle"
        fontFamily="'PP Neue Montreal', sans-serif"
        fontWeight="700"
        fontStyle="italic"
        fontSize="12"
        fill="rgba(242,237,228,0.45)"
        letterSpacing="1"
      >
        VISA
      </text>
    </svg>
  );
}

// ── Footer newsletter — dark-theme variant ───────────────────────────────────
function FooterNewsletter() {
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
    status === 'error'     ? 'Hubo un error. Intenta de nuevo.' : null;

  return (
    <div className="mt-8">
      <p className="font-body text-sm mb-3">Suscríbete a nuestro newsletter</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="E-mail"
          required
          disabled={status === 'loading' || status === 'success'}
          className="bg-transparent border border-background/30 px-4 py-2.5 text-sm font-body flex-1 focus:outline-none focus:border-background/60 placeholder:text-background/40 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="rounded-full border border-background/30 px-6 py-2.5 text-sm font-body hover:bg-background hover:text-foreground transition-colors disabled:opacity-40 flex items-center gap-2"
        >
          {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Suscribir'}
        </button>
      </form>
      {message && (
        <p className="font-body text-xs mt-2" style={{ color: status === 'success' ? '#86C8A0' : '#E8A0A0' }}>
          {message}
        </p>
      )}
    </div>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 lg:py-24">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12">

        {/* ── Main columns ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand + Newsletter */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-2xl tracking-[0.2em] font-extrabold" style={{ fontFamily: 'Syne, sans-serif' }}>
              NODO
            </Link>
            <p className="font-body text-sm text-background/60 mt-4 max-w-sm leading-relaxed">
              Sistemas modulares de precisión. Diseño colombiano que evoluciona contigo.
              Fabricación directa, sin intermediarios.
            </p>
            <FooterNewsletter />
          </div>

          {/* Tienda */}
          <div>
            <p className="font-body text-xs tracking-wider uppercase mb-4 text-background/60">Tienda</p>
            <ul className="space-y-3">
              <li><Link to="/catalogo" className="font-body text-sm hover:opacity-60 transition-opacity">Catálogo</Link></li>
              <li><Link to="/configurador" className="font-body text-sm hover:opacity-60 transition-opacity">Configurador</Link></li>
              <li><Link to="/nosotros" className="font-body text-sm hover:opacity-60 transition-opacity">Nosotros</Link></li>
              <li><Link to="/contacto" className="font-body text-sm hover:opacity-60 transition-opacity">Contacto</Link></li>
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <p className="font-body text-xs tracking-wider uppercase mb-4 text-background/60">Ayuda</p>
            <ul className="space-y-3">
              <li><Link to="/envios-y-devoluciones" className="font-body text-sm hover:opacity-60 transition-opacity">Envíos y devoluciones</Link></li>
              <li>
                <a href="https://wa.me/34676822788" target="_blank" rel="noopener noreferrer" className="font-body text-sm hover:opacity-60 transition-opacity">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="mailto:nodomodulardesign@gmail.com" className="font-body text-sm hover:opacity-60 transition-opacity">
                  nodomodulardesign@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="font-body text-xs tracking-wider uppercase mb-4 text-background/60">Legal</p>
            <ul className="space-y-3">
              <li><Link to="/politica-privacidad" className="font-body text-sm hover:opacity-60 transition-opacity">Política de privacidad</Link></li>
              <li><Link to="/terminos" className="font-body text-sm hover:opacity-60 transition-opacity">Términos y condiciones</Link></li>
              <li><Link to="/envios-y-devoluciones" className="font-body text-sm hover:opacity-60 transition-opacity">Envíos y devoluciones</Link></li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-background/20 mt-16 pt-8 flex flex-col gap-5">

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {[
              { to: '/politica-privacidad', label: 'Política de privacidad' },
              { to: '/terminos', label: 'Términos y condiciones' },
              { to: '/envios-y-devoluciones', label: 'Envíos y devoluciones' },
            ].map((item, i, arr) => (
              <span key={item.to} className="flex items-center gap-3">
                <Link
                  to={item.to}
                  className="font-body hover:text-background/80 transition-colors"
                  style={{ fontSize: '12px', color: 'rgba(242,237,228,0.45)' }}
                >
                  {item.label}
                </Link>
                {i < arr.length - 1 && (
                  <span style={{ fontSize: '12px', color: 'rgba(242,237,228,0.25)' }}>·</span>
                )}
              </span>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <p className="font-body text-xs text-background/40">
                © {new Date().getFullYear()} NODO. Todos los derechos reservados.
              </p>
              <div className="flex items-center gap-2">
                <VisaIcon />
                <MastercardIcon />
                <PaymentBadge label="PSE" />
                <PaymentBadge label="Nequi" />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="https://instagram.com/nodo.co"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-xs text-background/60 hover:text-background transition-colors"
              >
                @nodo.co
              </a>
              <span className="font-body text-xs text-background/40">Bogotá, Colombia</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
