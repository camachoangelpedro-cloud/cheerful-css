import { Link } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useEffect, useState } from 'react';

export function Navbar() {
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [dropOpen, setDropOpen]             = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const { items, setIsOpen } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  /* Lock body scroll on mobile */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const close = () => setDropOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">

      {/* Announcement Bar */}
      <div className="text-background py-2 overflow-hidden bg-primary">
        <div className="animate-marquee whitespace-nowrap flex">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex shrink-0">
              <span className="mx-10 text-xs tracking-wide font-light">
                Envío gratis en pedidos superiores a $500.000 COP
              </span>
              <span className="mx-10 text-xs tracking-wide font-light">
                Diseño modular, fabricación Colombiana
              </span>
              <span className="mx-10 text-xs tracking-wide font-light">
                Ensamblaje sin herramientas
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Nav */}
      <nav className="h-16 bg-background border-b border-border/20">
        <div className="flex items-center justify-between h-full px-8 lg:px-16">

          {/* Logo */}
          <Link
            to="/"
            className="text-lg tracking-[0.2em] font-extrabold text-foreground"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            NODO
          </Link>

          {/* Centre Links */}
          <div className="hidden lg:flex items-center gap-10">
            <Link to="/configurador" className="text-sm tracking-wide hover:opacity-60 transition-opacity">
              Configurador
            </Link>
            <button
              onClick={() => setDropOpen(v => !v)}
              className="text-sm tracking-wide hover:opacity-60 transition-opacity"
            >
              Productos
            </button>
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

      {/* ── Full-width products dropdown ── */}
      {dropOpen && (
        <>
          {/* Backdrop — closes on click outside the panel */}
          <div className="fixed inset-0 z-30" onClick={close} />

          {/* Panel — sits over the backdrop */}
          <div className="relative z-40 bg-background border-b border-border/30 px-8 lg:px-16 py-10">
            <div className="flex">
              {/*
                Spacer matching the NODO logo width so the vertical line
                aligns with the right edge of the logo above.
                text-lg extrabold "NODO" with tracking-[0.2em] ≈ 76px
              */}
              <div className="shrink-0" style={{ width: '76px' }} />

              {/* Vertical line + items */}
              <div className="border-l border-border/50 pl-10 flex flex-col gap-0">

                <Link
                  to="/catalogo"
                  onClick={close}
                  className="py-2.5 text-sm font-medium text-foreground hover:opacity-60 transition-opacity"
                >
                  Todos los productos
                </Link>

                <Link
                  to="/catalogo?familia=SIS"
                  onClick={close}
                  className="py-2 text-sm text-muted-foreground hover:text-foreground transition-colors pl-6"
                >
                  Sistemas pre-configurados
                </Link>
                <Link
                  to="/catalogo?familia=MOD"
                  onClick={close}
                  className="py-2 text-sm text-muted-foreground hover:text-foreground transition-colors pl-6"
                >
                  Módulos individuales
                </Link>
                <Link
                  to="/catalogo?familia=PLT"
                  onClick={close}
                  className="py-2 text-sm text-muted-foreground hover:text-foreground transition-colors pl-6"
                >
                  Bases
                </Link>

                <div className="h-px bg-border/40 my-3 -ml-10 w-48" />

                <Link
                  to="/catalogo?familia=CLIP"
                  onClick={close}
                  className="py-2.5 text-sm font-medium text-foreground hover:opacity-60 transition-opacity"
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
            <div className="flex flex-col gap-2 -mt-2 border-l border-border/50 pl-5">
              <Link to="/catalogo" className="text-base text-foreground py-1" onClick={() => setMobileOpen(false)}>
                Todos los productos
              </Link>
              <Link to="/catalogo?familia=SIS" className="text-base text-muted-foreground pl-4 py-1" onClick={() => setMobileOpen(false)}>
                Sistemas pre-configurados
              </Link>
              <Link to="/catalogo?familia=MOD" className="text-base text-muted-foreground pl-4 py-1" onClick={() => setMobileOpen(false)}>
                Módulos individuales
              </Link>
              <Link to="/catalogo?familia=PLT" className="text-base text-muted-foreground pl-4 py-1" onClick={() => setMobileOpen(false)}>
                Bases
              </Link>
              <div className="h-px bg-border/40 my-1" />
              <Link to="/catalogo?familia=CLIP" className="text-base text-foreground py-1" onClick={() => setMobileOpen(false)}>
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
