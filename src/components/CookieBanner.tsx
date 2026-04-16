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
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[9998] bg-black/30" />

      {/* Popup */}
      <div
        className="fixed z-[9999] w-full max-w-[400px] p-6 rounded-lg"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#1C1C1A',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        <div className="flex flex-col items-center text-center gap-4">
          <span className="text-2xl">🍪</span>
          <p className="font-body text-[13px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Usamos cookies esenciales para el funcionamiento del sitio.{' '}
            <Link
              to="/politica-privacidad"
              className="underline underline-offset-2 hover:opacity-60 transition-opacity"
              style={{ color: '#FFFFFF' }}
            >
              Más información
            </Link>
          </p>
          <button
            onClick={accept}
            className="rounded-full px-8 py-2.5 font-body text-[13px] font-medium hover:opacity-85 transition-opacity"
            style={{ backgroundColor: '#F2EDE4', color: '#1C1C1A' }}
          >
            Aceptar
          </button>
        </div>
      </div>
    </>
  );
}
