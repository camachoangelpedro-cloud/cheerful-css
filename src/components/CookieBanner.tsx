import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const STORAGE_KEY = 'nodo-cookies-accepted';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-5 left-5 z-[9999] w-full max-w-[340px] rounded-xl p-5"
      style={{
        backgroundColor: '#1C1C1A',
        boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
      }}
    >
      {/* Close */}
      <button
        onClick={accept}
        aria-label="Cerrar"
        className="absolute top-4 right-4 hover:opacity-60 transition-opacity"
        style={{ color: 'rgba(242,237,228,0.4)' }}
      >
        <X strokeWidth={1.5} className="w-4 h-4" />
      </button>

      {/* Overline */}
      <p
        style={{
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(242,237,228,0.35)',
          marginBottom: '10px',
        }}
      >
        Cookies
      </p>

      {/* Body */}
      <p
        style={{
          fontSize: '13px',
          fontWeight: 300,
          color: 'rgba(242,237,228,0.65)',
          lineHeight: 1.65,
          paddingRight: '16px',
        }}
      >
        Usamos cookies esenciales para el funcionamiento del sitio.{' '}
        <Link
          to="/politica-privacidad"
          onClick={accept}
          className="underline underline-offset-2 hover:opacity-60 transition-opacity"
          style={{ color: 'rgba(242,237,228,0.75)' }}
        >
          Más información
        </Link>
      </p>

      {/* Actions */}
      <div className="flex gap-2.5 mt-5">
        <button
          onClick={accept}
          className="flex-1 rounded-lg py-2.5 font-body text-[13px] font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#F2EDE4', color: '#1C1C1A' }}
        >
          Aceptar
        </button>
        <Link
          to="/politica-privacidad"
          onClick={accept}
          className="flex items-center justify-center rounded-lg px-4 py-2.5 font-body text-[12px] hover:opacity-60 transition-opacity"
          style={{
            border: '1px solid rgba(242,237,228,0.15)',
            color: 'rgba(242,237,228,0.45)',
          }}
        >
          Política
        </Link>
      </div>
    </div>
  );
}
