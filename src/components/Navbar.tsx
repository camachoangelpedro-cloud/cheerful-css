import { Link } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useEffect, useState, useRef } from 'react';

export function Navbar() {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [dropOpen, setDropOpen]       = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const navRef  = useRef<HTMLElement>(null);
  const { items, setIsOpen } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  /* Close dropdown on outside click */
  useEffect(() => {
    if (!dropOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropOpen]);

  /* Lock body scroll on mobile */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const close = () => { setDropOpen(false); };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">

      {/* Announcement Bar */}
      <div className="text-background py-2 overflow-hidden bg-primary">
        <div className="animate-marquee whitespace-nowrap flex">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex shrink-0">
              <span className="mx-10 text-xs tracking-wide font-mono font-thin">
                Envío gratis en pedidos superiores a $500.000 COP
              </span>
              <span className="mx-10 text-xs tracking-wide font-mono font-thin">
                Diseño modular, fabricación Colombiana
              </span>
              <span className="mx-10 text-xs tracking-wide font-mono font-thin">
                Ensamblaje sin herramientas
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Nav */}
      <nav ref={navRef} className="h-16 bg-background border-b border-border/20">
        <div className="flex items-center justify-between h-full px-8 lg:px-16">

          {/* Logo */}
          <Link
            to="/"
            className="text-lg tracking-[0.2em] font-extrabold text-foreground"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            NODO
          </Link>

          {/* Centre Links — desktop */}
          <div className="hidden lg:flex items-center gap-10">
            <Link to="/configurador" className="text-sm tracking-wide hover:opacity-60 transition-opacity">
              Configurador
            </Link>

            {/* Productos — click dropdown */}
            <div ref={dropRef} className="relative">
              <button
                onClick={() => setDropOpen(v => !v)}
                className="text-sm tracking-wide hover:opacity-60 transition-opacity"
              >
                Productos
              </button>

              {/* Simple dropdown */}
              {dropOpen && (
                <div className="absolute left-0 top-full mt-3 w-52 bg-background border border-border/60 shadow-sm py-2 z-50">
                  <Link
                    to="/catalogo"
                    onClick={close}
                    className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted/40 transition-colors"
                  >
                    Todos los productos
                  </Link>
                  <Link
                    to="/catalogo?familia=MOD"
                    onClick={close}
                    className="block px-4 py-2 text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors pl-8"
                  >
                    Módulos individuales
                  </Link>
                  <Link
                    to="/catalogo?familia=PLT"
                    onClick={close}
                    className="block px-4 py-2 text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors pl-8"
                  >
                    Bases
                  </Link>
                  <div className="h-px bg-border/40 my-1.5 mx-4" />
                  <Link
                    to="/catalogo?familia=CLIP"
                    onClick={close}
                    className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted/40 transition-colors"
                  >
                    Clips
                  </Link>
                </div>
              )}
            </div>

            <Link to="/nosotros" className="text-sm tracking-wide hover:opacity-60 transition-opacity">
              Nosotros
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-5">
            <button className="hover:opacity-60 transition-opacity">
              <Search className="w-5 h-5" />
            </button>
            <button className="hidden lg:block hover:opacity-60 transition-opacity">
              <User className="w-5 h-5" />
            </button>
            <button
              className="lg:hidden hover:opacity-60 transition-opacity"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="relative hover:opacity-60 transition-opacity"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-foreground text-background text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[100] bg-background transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between px-8 h-16">
          <Link
            to="/"
            className="text-lg tracking-[0.2em] font-extrabold text-foreground"
            style={{ fontFamily: 'Syne, sans-serif' }}
            onClick={() => setMobileOpen(false)}
          >
            NODO
          </Link>
          <button onClick={() => setMobileOpen(false)} className="hover:opacity-60 transition-opacity">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col px-8 py-12 gap-6">
          <Link
            to="/configurador"
            className="text-lg font-medium text-foreground hover:opacity-60 transition-opacity"
            onClick={() => setMobileOpen(false)}
          >
            Configurador
          </Link>

          <button
            className="text-lg font-medium text-foreground text-left hover:opacity-60 transition-opacity"
            onClick={() => setMobileProductsOpen(v => !v)}
          >
            Productos
          </button>

          {mobileProductsOpen && (
            <div className="flex flex-col gap-2 -mt-2">
              <Link to="/catalogo" className="text-base text-foreground" onClick={() => setMobileOpen(false)}>
                Todos los productos
              </Link>
              <Link to="/catalogo?familia=MOD" className="text-base text-muted-foreground pl-5" onClick={() => setMobileOpen(false)}>
                Módulos individuales
              </Link>
              <Link to="/catalogo?familia=PLT" className="text-base text-muted-foreground pl-5" onClick={() => setMobileOpen(false)}>
                Bases
              </Link>
              <div className="h-px bg-border/40 my-1" />
              <Link to="/catalogo?familia=CLIP" className="text-base text-foreground" onClick={() => setMobileOpen(false)}>
                Clips
              </Link>
            </div>
          )}

          <Link
            to="/nosotros"
            className="text-lg font-medium text-foreground hover:opacity-60 transition-opacity"
            onClick={() => setMobileOpen(false)}
          >
            Nosotros
          </Link>
        </div>
      </div>

    </header>
  );
}
