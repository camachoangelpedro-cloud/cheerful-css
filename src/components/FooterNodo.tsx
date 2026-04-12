import { Link } from 'react-router-dom';

// ── Payment method badge ─────────────────────────────────────────────────────
function PaymentBadge({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center justify-center font-body text-[10px] font-medium"
      style={{
        border: '1px solid rgba(242,237,228,0.2)',
        borderRadius: '4px',
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

// ── Mastercard SVG (two overlapping circles, muted) ──────────────────────────
function MastercardIcon() {
  return (
    <svg
      width="38"
      height="24"
      viewBox="0 0 38 24"
      aria-label="Mastercard"
      style={{ display: 'block' }}
    >
      <rect width="38" height="24" rx="4" fill="none" stroke="rgba(242,237,228,0.2)" strokeWidth="1" />
      <circle cx="14" cy="12" r="7" fill="rgba(242,237,228,0.22)" />
      <circle cx="24" cy="12" r="7" fill="rgba(242,237,228,0.14)" />
    </svg>
  );
}

// ── Visa SVG (italic VISA text in a badge) ───────────────────────────────────
function VisaIcon() {
  return (
    <svg
      width="44"
      height="24"
      viewBox="0 0 44 24"
      aria-label="Visa"
      style={{ display: 'block' }}
    >
      <rect width="44" height="24" rx="4" fill="none" stroke="rgba(242,237,228,0.2)" strokeWidth="1" />
      <text
        x="22"
        y="16"
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

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 lg:py-24">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12">

        {/* ── Main columns ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="text-2xl tracking-[0.2em] font-extrabold" style={{ fontFamily: 'Syne, sans-serif' }}>
              NODO
            </Link>
            <p className="font-body text-sm text-background/60 mt-4 max-w-sm leading-relaxed">
              Sistemas modulares de precisión. Diseño colombiano que evoluciona contigo.
              Fabricación directa, sin intermediarios.
            </p>

            {/* Newsletter */}
            <div className="mt-8">
              <p className="font-body text-sm mb-3">Suscríbete a nuestro newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="E-mail"
                  className="bg-transparent border border-background/30 px-4 py-2.5 text-sm font-body flex-1 focus:outline-none focus:border-background/60 placeholder:text-background/40"
                />
                <button className="border border-background/30 px-6 py-2.5 text-sm font-body hover:bg-background hover:text-foreground transition-colors">
                  Suscribir
                </button>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="font-body text-xs tracking-wider uppercase mb-4 text-background/60">
              Tienda
            </p>
            <ul className="space-y-3">
              <li>
                <Link to="/catalogo" className="font-body text-sm hover:opacity-60 transition-opacity">
                  Shop all
                </Link>
              </li>
              <li>
                <Link to="/catalogo?type=sistemas" className="font-body text-sm hover:opacity-60 transition-opacity">
                  Sistemas
                </Link>
              </li>
              <li>
                <Link to="/catalogo?type=modulos" className="font-body text-sm hover:opacity-60 transition-opacity">
                  Módulos
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="font-body text-xs tracking-wider uppercase mb-4 text-background/60">
              Información
            </p>
            <ul className="space-y-3">
              <li>
                <Link to="/nosotros" className="font-body text-sm hover:opacity-60 transition-opacity">
                  Nosotros
                </Link>
              </li>
              <li>
                <a href="mailto:hola@nodo.co" className="font-body text-sm hover:opacity-60 transition-opacity">
                  Contacto
                </a>
              </li>
              <li>
                <Link to="/envios-devoluciones" className="font-body text-sm hover:opacity-60 transition-opacity">
                  Envíos
                </Link>
              </li>
              <li>
                <Link to="/envios-devoluciones" className="font-body text-sm hover:opacity-60 transition-opacity">
                  Devoluciones
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-background/20 mt-16 pt-8 flex flex-col gap-5">

          {/* Legal links row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Link
              to="/politica-privacidad"
              className="font-body hover:text-background/80 transition-colors"
              style={{ fontSize: '12px', color: 'rgba(242,237,228,0.45)', letterSpacing: 0 }}
            >
              Política de privacidad
            </Link>
            <span style={{ fontSize: '12px', color: 'rgba(242,237,228,0.25)' }}>·</span>
            <Link
              to="/terminos"
              className="font-body hover:text-background/80 transition-colors"
              style={{ fontSize: '12px', color: 'rgba(242,237,228,0.45)', letterSpacing: 0 }}
            >
              Términos y condiciones
            </Link>
            <span style={{ fontSize: '12px', color: 'rgba(242,237,228,0.25)' }}>·</span>
            <Link
              to="/envios-devoluciones"
              className="font-body hover:text-background/80 transition-colors"
              style={{ fontSize: '12px', color: 'rgba(242,237,228,0.45)', letterSpacing: 0 }}
            >
              Política de envíos y devoluciones
            </Link>
          </div>

          {/* Copyright + payment icons + social */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">

            {/* Left: copyright + payment icons */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <p className="font-body text-xs text-background/40">
                © {new Date().getFullYear()} NODO. All rights reserved.
              </p>
              {/* Payment badges */}
              <div className="flex items-center gap-2">
                <VisaIcon />
                <MastercardIcon />
                <PaymentBadge label="PSE" />
                <PaymentBadge label="Nequi" />
              </div>
            </div>

            {/* Right: social + location */}
            <div className="flex items-center gap-6">
              <a
                href="https://instagram.com/nodo.co"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-xs text-background/60 hover:text-background transition-colors"
              >
                Instagram
              </a>
              <span className="font-body text-xs text-background/40">
                Bogotá, Colombia
              </span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
