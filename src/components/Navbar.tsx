import { Link } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useEffect, useState, useRef } from 'react';

const megaColumns = [
  {
    name: 'Sistemas',
    desc: 'Configuraciones completas listas para instalar',
    href: '/catalogo?categoria=sistemas',
    tag: 'Lo más popular',
    muted: false,
  },
  {
    name: 'Módulos',
    desc: 'Unidades individuales por dimensión, combinables infinitamente',
    href: '/catalogo?categoria=modulos',
    tag: '21 referencias',
    muted: false,
  },
  {
    name: 'Accesorios',
    desc: 'Clips decorativos, láminas base y complementos del sistema',
    href: '/catalogo?categoria=accesorios',
    tag: 'Brass · Acero · Negro',
    muted: false,
  },
  {
    name: 'Objetos',
    heading: 'Objetos',
    desc: 'Objetos de decoración para poblar tus estantes. En desarrollo.',
    href: '/catalogo?categoria=proximamente',
    tag: 'Próximamente',
    muted: true,
    badge: true,
  },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const { items, setIsOpen } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);


  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const openMega = () => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 120);
  };

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
      <nav
        ref={navRef}
        className="h-16 bg-background border-b border-border/20"
      >
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
            {/* Configurador pill CTA */}
            <Link
              to="/configurador"
              className="text-sm tracking-wide hover:opacity-60 transition-opacity"
            >
              Configurador
            </Link>

            {/* Productos with mega menu */}
            <div
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
            >
              <span className="text-sm tracking-wide cursor-default hover:opacity-60 transition-opacity">
                Productos
              </span>
            </div>

            {/* Nosotros */}
            <Link
              to="/nosotros"
              className="text-sm tracking-wide hover:opacity-60 transition-opacity"
            >
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

            {/* Mobile hamburger */}
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

      {/* Mega Menu */}
      <div
        onMouseEnter={openMega}
        onMouseLeave={closeMega}
        className={`fixed left-0 right-0 z-40 bg-background border-t border-border/40 border-b border-border/40 transition-all duration-200 ease-out ${
          megaOpen
            ? 'opacity-100 visible translate-y-0'
            : 'opacity-0 invisible -translate-y-2 pointer-events-none'
        }`}
        style={{ top: navRef.current ? navRef.current.getBoundingClientRect().bottom + 'px' : 'auto' }}
      >
        <div className="px-16 py-10">
          <div className="grid grid-cols-4 gap-8">
            {megaColumns.map((col) => (
              <Link
                key={col.name}
                to={col.href}
                className="group block"
                onClick={() => setMegaOpen(false)}
              >
                <h3 className={`font-semibold text-base mb-2 group-hover:opacity-70 transition-opacity ${col.muted ? 'text-muted-foreground' : 'text-foreground'}`}>
                  {col.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  {col.desc}
                </p>
                <div className="border-b border-border/20" />
                {col.badge ? (
                  <span className="inline-block mt-3 bg-foreground/5 text-muted-foreground text-[10px] px-2 py-0.5">
                    {col.tag}
                  </span>
                ) : (
                  <span className="block mt-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                    {col.tag}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Bottom row */}
          <div className="border-t border-border/20 pt-6 mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">¿No sabes por dónde empezar?</span>
              <Link
                to="/configurador"
                className="text-sm font-medium text-foreground"
                onClick={() => setMegaOpen(false)}
              >
                → Empieza por el Configurador
              </Link>
            </div>
            <span className="text-xs text-muted-foreground text-right">
              Fabricado en Bogotá, Colombia. Entrega en 14 días.
            </span>
          </div>
        </div>
      </div>

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
          {/* Configurador pill */}
          <Link
            to="/configurador"
            className="text-lg font-medium text-foreground hover:opacity-60 transition-opacity"
            onClick={() => setMobileOpen(false)}
          >
            Configurador
          </Link>

          {/* Productos expandable */}
          <button
            className="text-lg font-medium text-foreground hover:opacity-60 transition-opacity"
            onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
          >
            Productos
          </button>

          {mobileProductsOpen && (
            <div className="flex flex-col gap-4 pl-4">
              {megaColumns.map((col) => (
                <Link
                  key={col.name}
                  to={col.href}
                  className="block"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className={`text-base font-medium ${col.muted ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {col.name}
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">{col.desc}</p>
                </Link>
              ))}
            </div>
          )}

          {/* Nosotros */}
          <Link
            to="/nosotros"
            className="text-lg font-medium text-foreground"
            onClick={() => setMobileOpen(false)}
          >
            Nosotros
          </Link>
        </div>
      </div>
    </header>
  );
}
