import { Link } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useEffect, useState } from 'react';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50">

      {/* Announcement Bar */}
      <div className="py-2 flex items-center justify-center" style={{ backgroundColor: '#1C1C1A', color: '#F2EDE4' }}>
        <span className="text-xs font-light" style={{ letterSpacing: 0 }}>
          Diseño Modular · Plug &amp; Play · Ensamblaje sin Herramientas · Hecho en Colombia
        </span>
      </div>

      {/* Main Nav */}
      <nav
        className="h-[60px] transition-all duration-200"
        style={{
          backgroundColor: scrolled ? '#FFFFFF' : '#FAFAF8',
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
            <Link
              to="/catalogo"
              className="text-sm font-normal text-foreground hover:opacity-60 transition-opacity"
              style={{ letterSpacing: 0 }}
            >
              Módulos
            </Link>
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

      {/* ── Mobile overlay ── */}
      <div
        className={`fixed inset-0 z-[100] transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        style={{ backgroundColor: '#FAFAF8' }}
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
          <Link
            to="/catalogo"
            className="text-lg font-medium text-foreground hover:opacity-60 transition-opacity"
            style={{ letterSpacing: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            Módulos
          </Link>
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
