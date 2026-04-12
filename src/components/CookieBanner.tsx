import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background"
      style={{ boxShadow: '0 -2px 12px rgba(0,0,0,0.06)' }}
    >
      <div className="nodo-container py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <p className="font-body text-[13px]" style={{ color: '#5F5E5A' }}>
          Usamos cookies esenciales para el funcionamiento del sitio. Al continuar navegando, aceptas su uso.{' '}
          <Link
            to="/politica-privacidad"
            className="underline underline-offset-2 hover:opacity-60 transition-opacity"
            style={{ color: '#1C1C1A' }}
          >
            Más información
          </Link>
        </p>
        <button
          onClick={accept}
          className="shrink-0 border border-foreground/20 px-5 py-1.5 font-body text-[13px] hover:bg-foreground hover:text-background transition-colors"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
