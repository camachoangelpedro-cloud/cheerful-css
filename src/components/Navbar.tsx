import { Link } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useEffect, useState, useRef } from 'react';

const productCategories = [
  { name: 'Sistemas', desc: 'Configuraciones listas para instalar', href: '/catalogo?categoria=sistemas' },
  { name: 'Módulos', desc: 'Unidades individuales por dimensión', href: '/catalogo?categoria=modulos' },
  { name: 'Accesorios', desc: 'Clips decorativos y complementos', href: '/catalogo?categoria=accesorios' },
  { name: 'Próximamente', desc: 'Objetos para poblar tus estantes', href: '/catalogo?categoria=proximamente', soon: true },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { items, setIsOpen } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const openDropdown = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setDropdownOpen(true);
  };
  const closeDropdown = () => {
    dropdownTimeout.current = setTimeout(() => setDropdownOpen(false), 150);
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
        className={`transition-all duration-300 ${
          scrolled
            ? 'bg-background/95 backdrop-blur-md border-b border-border/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl tracking-[0.2em] font-extrabold transition-colors text-foreground"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            NODO
          </Link>

          {/* Centre Links — desktop */}
          <div className="hidden lg:flex items-center gap-10">
            {/* Productos with dropdown */}
            <div
              className="relative"
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdown}
            >
              <span className="font-body text-sm tracking-wide cursor-default hover:opacity-60 transition-opacity">
                Productos
              </span>

              {/* Dropdown */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-background border border-border/30 shadow-lg transition-all duration-200 ${
                  dropdownOpen
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible -translate-y-1'
                }`}
              >
                <div className="p-6">
                  {productCategories.map((cat, idx) => (
                    <div key={cat.name}>
                      <Link
                        to={cat.href}
                        className={`block py-3 group ${cat.soon ? 'opacity-50' : ''}`}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium group-hover:opacity-60 transition-opacity ${cat.soon ? 'text-muted-foreground' : 'text-foreground'}`}>
                            {cat.name}
                          </span>
                          {cat.soon && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-muted text-muted-foreground font-medium tracking-wide uppercase">
                              soon
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{cat.desc}</p>
                      </Link>
                      {idx < productCategories.length - 1 && (
                        <div className="border-b border-border/20" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Configurador pill */}
            <Link
              to="/configurador"
              className="font-body text-sm tracking-wide border border-foreground/40 px-4 py-1.5 hover:bg-foreground hover:text-background transition-all"
            >
              Configurador
            </Link>

            {/* Nosotros */}
            <Link
              to="/nosotros"
              className="font-body text-sm tracking-wide hover:opacity-60 transition-opacity"
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
            <button
              onClick={() => setIsOpen(true)}
              className="relative hover:opacity-60 transition-opacity"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-foreground text-background text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-body">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden hover:opacity-60 transition-opacity"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
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
        <div className="flex items-center justify-between px-6 h-16">
          <Link
            to="/"
            className="text-xl tracking-[0.2em] font-extrabold text-foreground"
            style={{ fontFamily: 'Syne, sans-serif' }}
            onClick={() => setMobileOpen(false)}
          >
            NODO
          </Link>
          <button onClick={() => setMobileOpen(false)} className="hover:opacity-60 transition-opacity">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col px-6 pt-8 gap-6">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Productos</p>
          {productCategories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.href}
              className={`block ${cat.soon ? 'opacity-50' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <div className="flex items-center gap-2">
                <span className={`text-lg font-medium ${cat.soon ? 'text-muted-foreground' : 'text-foreground'}`}>
                  {cat.name}
                </span>
                {cat.soon && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-muted text-muted-foreground font-medium tracking-wide uppercase">
                    soon
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{cat.desc}</p>
            </Link>
          ))}

          <div className="border-b border-border/20 my-2" />

          <Link
            to="/configurador"
            className="text-lg font-medium text-foreground"
            onClick={() => setMobileOpen(false)}
          >
            Configurador
          </Link>
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
