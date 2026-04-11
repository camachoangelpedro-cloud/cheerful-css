import { Link } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useEffect, useState } from 'react';

export function Navbar() {
  const [mobileOpen, setMobileOpen]               = useState(false);
  const [dropOpen, setDropOpen]                   = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [scrolled, setScrolled]                   = useState(false);
  const { items, setIsOpen } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setDropOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">

      {/* Announcement Bar */}
      <div className="overflow-hidden py-2" style={{ backgroundColor: '#1C1C1A', color: '#F2EDE4' }}>
        <div className="animate-marquee whitespace-nowrap flex">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex shrink-0">
              <span className="mx-10 text-xs font-light" style={{ letterSpacing: 0 }}>
                Envío gratis en pedidos superiores a $500.000 COP
              </span>
              <span className="mx-10 text-xs font-light" style={{ letterSpacing: 0 }}>
                Diseño modular, fabricación colombiana
              </span>
              <span className="mx-10 text-xs font-light" style={{ letterSpacing: 0 }}>
                Ensamblaje sin herramientas
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Nav */}
      <nav
        className="h-[60px] transition-all duration-200"
        style={{
          backgroundColor: scrolled ? '#FFFFFF' : '#F2EDE4',
          boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.08)' : 'none',
        }}
      >
        <div className="flex items-center justify-between h-full px-8 lg:px-16">

          {/* Logo */}
          <Link
            to="/"
            className="text-lg font-extrabold text-foreground"
            style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '0.2em' }}
          >
            NODO
          </Link>

          {/* Centre Links */}
          <div className="hidden lg:flex items-center gap-10">
            <Link
              to="/configurador"
              className="text-sm font-normal text-foreground hover:opacity-60 transition-opacity"
              style={{ letterSpacing: 0 }}
            >
              Configurador
            </Link>
            <button
              onClick={() => setDropOpen(v => !v)}
              className="text-sm font-normal text-foreground hover:opacity-60 transition-opacity"
              style={{ letterSpacing: 0 }}
            >
              Productos
            </button>
            <Link
              to="/nosotros"
              className="text-sm font-normal text-foreground hover:opacity-60 transition-opacity"
              style={{ letterSpacing: 0 }}
            >
              Nosotros
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-5">
            <button className="hover:opacity-60 transition-opacity">
              <Search strokeWidth={1.5} className="w-5 h-5" />
            </button>
            <button className="hidden lg:block hover:opacity-60 transition-opacity">
              <User strokeWidth={1.5} className="w-5 h-5" />
            </button>
            <button
              className="lg:hidden hover:opacity-60 transition-opacity"
              onClick={() => setMobileOpen(true)}
            >
              <Menu strokeWidth={1.5} className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="relative hover:opacity-60 transition-opacity"
            >
              <ShoppingBag strokeWidth={1.5} className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-foreground text-background text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Full-width products dropdown ── */}
      {dropOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={close} />
          <div
            className="relative z-40 border-b px-8 lg:px-16 py-10 transition-colors duration-200"
            style={{
              backgroundColor: scrolled ? '#FFFFFF' : '#F2EDE4',
              borderColor: 'rgba(0,0,0,0.08)',
            }}
          >
            <div className="flex">
              <div className="shrink-0" style={{ width: '76px' }} />
              <div className="border-l pl-10 flex flex-col gap-0" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                <Link
                  to="/catalogo"
                  onClick={close}
                  className="py-2.5 text-sm font-medium text-foreground hover:opacity-60 transition-opacity"
                  style={{ letterSpacing: 0 }}
                >
                  Todos los productos
                </Link>
                <Link
                  to="/catalogo?familia=MOD"
                  onClick={close}
                  className="py-2 text-sm text-[#5F5E5A] hover:text-foreground transition-colors pl-5"
                  style={{ letterSpacing: 0 }}
                >
                  Módulos individuales
                </Link>
                <Link
                  to="/catalogo?familia=PLT"
                  onClick={close}
                  className="py-2 text-sm text-[#5F5E5A] hover:text-foreground transition-colors pl-5"
                  style={{ letterSpacing: 0 }}
                >
                  Bases
                </Link>
                <div className="h-px my-3 -ml-10 w-48" style={{ backgroundColor: 'rgba(0,0,0,0.08)' }} />
                <Link
                  to="/catalogo?familia=CLIP"
                  onClick={close}
                  className="py-2.5 text-sm font-medium text-foreground hover:opacity-60 transition-opacity"
                  style={{ letterSpacing: 0 }}
                >
                  Clips
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Mobile overlay ── */}
      <div
        className={`fixed inset-0 z-[100] transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        style={{ backgroundColor: '#F2EDE4' }}
      >
        <div className="flex items-center justify-between px-8 h-[60px]">
          <Link
            to="/"
            className="text-lg font-extrabold text-foreground"
            style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '0.2em' }}
            onClick={() => setMobileOpen(false)}
          >
            NODO
          </Link>
          <button onClick={() => setMobileOpen(false)} className="hover:opacity-60 transition-opacity">
            <X strokeWidth={1.5} className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col px-8 py-12 gap-6">
          <Link
            to="/configurador"
            className="text-lg font-medium text-foreground hover:opacity-60 transition-opacity"
            style={{ letterSpacing: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            Configurador
          </Link>
          <button
            className="text-lg font-medium text-foreground text-left hover:opacity-60 transition-opacity"
            style={{ letterSpacing: 0 }}
            onClick={() => setMobileProductsOpen(v => !v)}
          >
            Productos
          </button>
          {mobileProductsOpen && (
            <div className="flex flex-col gap-2 -mt-2 border-l pl-5" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
              <Link to="/catalogo" className="text-base text-foreground py-1" style={{ letterSpacing: 0 }} onClick={() => setMobileOpen(false)}>
                Todos los productos
              </Link>
              <Link to="/catalogo?familia=MOD" className="text-base text-[#5F5E5A] pl-4 py-1" style={{ letterSpacing: 0 }} onClick={() => setMobileOpen(false)}>
                Módulos individuales
              </Link>
              <Link to="/catalogo?familia=PLT" className="text-base text-[#5F5E5A] pl-4 py-1" style={{ letterSpacing: 0 }} onClick={() => setMobileOpen(false)}>
                Bases
              </Link>
              <div className="h-px my-1" style={{ backgroundColor: 'rgba(0,0,0,0.08)' }} />
              <Link to="/catalogo?familia=CLIP" className="text-base text-foreground py-1" style={{ letterSpacing: 0 }} onClick={() => setMobileOpen(false)}>
                Clips
              </Link>
            </div>
          )}
          <Link
            to="/nosotros"
            className="text-lg font-medium text-foreground hover:opacity-60 transition-opacity"
            style={{ letterSpacing: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            Nosotros
          </Link>
        </div>
      </div>

    </header>
  );
}
