import { Link } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X, ChevronRight, Loader2 } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useEffect, useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { NODO_PRODUCTS } from '@/data/modulesCatalog';

// ── Searchable items ──────────────────────────────────────────────────────────
const STATIC_PAGES = [
  { title: 'Módulos',      subtitle: 'Catálogo completo',  href: '/catalogo' },
  { title: 'Configurador', subtitle: 'Diseña tu sistema',  href: '/configurador' },
  { title: 'Nosotros',     subtitle: 'Sobre NODO',         href: '/nosotros' },
  { title: 'Clips',        subtitle: 'Accesorios NODO',    href: '/catalogo' },
];

const SEARCHABLE = [
  ...STATIC_PAGES,
  ...NODO_PRODUCTS
    .filter(p => p.family !== 'CLF')
    .map(p => ({
      title:    p.title,
      subtitle: `${p.widthCm}×${p.heightCm} cm`,
      href:     `/producto/${p.handle}`,
    })),
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);

  // Search
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auth
  const [authOpen, setAuthOpen]       = useState(false);
  const [authTab, setAuthTab]         = useState<'login' | 'register'>('login');
  const [authLoading, setAuthLoading] = useState(false);

  const { items, setIsOpen } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Body overflow lock
  useEffect(() => {
    const locked = mobileOpen || searchOpen || authOpen;
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen, searchOpen, authOpen]);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Search auto-focus + clear on close
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
    }
  }, [searchOpen]);

  // Escape key handler
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (searchOpen) setSearchOpen(false);
        if (authOpen)   setAuthOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen, authOpen]);

  // Filtered search results
  const results = searchQuery.trim().length > 0
    ? SEARCHABLE.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Auth submit — UI only
  const handleAuthSubmit = useCallback(() => {
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setAuthOpen(false);
      toast('Funcionalidad próximamente disponible');
    }, 1500);
  }, []);

  const closeSearch = () => setSearchOpen(false);
  const closeAuth   = () => { if (!authLoading) setAuthOpen(false); };

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
            <button
              onClick={() => setSearchOpen(true)}
              className="hover:opacity-60 transition-opacity"
              aria-label="Buscar"
            >
              <Search strokeWidth={1.5} className="w-5 h-5" />
            </button>
            <button
              onClick={() => { setAuthTab('login'); setAuthOpen(true); }}
              className="hidden lg:block hover:opacity-60 transition-opacity"
              aria-label="Mi cuenta"
            >
              <User strokeWidth={1.5} className="w-5 h-5" />
            </button>
            <button
              className="lg:hidden hover:opacity-60 transition-opacity"
              onClick={() => setMobileOpen(true)}
              aria-label="Menú"
            >
              <Menu strokeWidth={1.5} className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="relative hover:opacity-60 transition-opacity"
              aria-label="Carrito"
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

      {/* ── Search overlay ── */}
      <div
        className={`fixed inset-0 z-[200] flex flex-col transition-opacity duration-200 ${
          searchOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(250, 250, 248, 0.96)' }}
      >
        {/* Top bar with close */}
        <div className="flex justify-end px-8 pt-6 shrink-0">
          <button
            onClick={closeSearch}
            className="hover:opacity-60 transition-opacity"
            aria-label="Cerrar búsqueda"
          >
            <X strokeWidth={1.5} className="w-5 h-5" />
          </button>
        </div>

        {/* Input */}
        <div className="flex justify-center px-6 pt-10 pb-6 shrink-0">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="¿Qué estás buscando?"
            className="w-full max-w-xl text-xl lg:text-2xl text-center bg-transparent border-0 border-b-2 outline-none pb-3 placeholder:text-[#9E9E9C]"
            style={{
              borderColor: '#1C1C1A',
              color: '#1C1C1A',
              letterSpacing: 0,
              fontFamily: "'PP Neue Montreal', sans-serif",
            }}
          />
        </div>

        {/* Results / default list */}
        <div className="flex justify-center px-6 overflow-y-auto">
          <div className="w-full max-w-xl">
            {/* Empty query — show default pages */}
            {searchQuery.trim().length === 0 && (
              <>
                <p className="text-xs mb-3" style={{ color: '#9E9E9C', letterSpacing: 0 }}>
                  Páginas
                </p>
                <ul className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.07)' }}>
                  {STATIC_PAGES.map((item, i) => (
                    <li key={i}>
                      <Link
                        to={item.href}
                        onClick={closeSearch}
                        className="flex items-center justify-between py-3.5 hover:opacity-60 transition-opacity"
                      >
                        <div>
                          <p className="text-sm font-medium" style={{ color: '#1C1C1A', letterSpacing: 0 }}>
                            {item.title}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: '#9E9E9C', letterSpacing: 0 }}>
                            {item.subtitle}
                          </p>
                        </div>
                        <ChevronRight strokeWidth={1.5} className="w-4 h-4 shrink-0" style={{ color: '#9E9E9C' }} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Active query — no results */}
            {searchQuery.trim().length > 0 && results.length === 0 && (
              <p className="text-sm mt-4" style={{ color: '#9E9E9C', letterSpacing: 0 }}>
                No encontramos resultados para tu búsqueda.
              </p>
            )}

            {/* Active query — results */}
            {results.length > 0 && (
              <ul className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.07)' }}>
                {results.map((item, i) => (
                  <li key={i}>
                    <Link
                      to={item.href}
                      onClick={closeSearch}
                      className="flex items-center justify-between py-3.5 hover:opacity-60 transition-opacity"
                    >
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#1C1C1A', letterSpacing: 0 }}>
                          {item.title}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: '#9E9E9C', letterSpacing: 0 }}>
                          {item.subtitle}
                        </p>
                      </div>
                      <ChevronRight strokeWidth={1.5} className="w-4 h-4 shrink-0" style={{ color: '#9E9E9C' }} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* ── Auth modal ── */}
      {authOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center px-4"
          style={{ backgroundColor: 'rgba(28, 28, 26, 0.5)', backdropFilter: 'blur(4px)' }}
          onClick={closeAuth}
        >
          <div
            className="w-full max-w-sm relative"
            style={{ backgroundColor: '#FAFAF8', borderRadius: '6px', padding: '40px 32px 36px' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={closeAuth}
              className="absolute top-4 right-4 hover:opacity-60 transition-opacity"
              aria-label="Cerrar"
            >
              <X strokeWidth={1.5} className="w-4 h-4" />
            </button>

            {/* Tabs */}
            <div className="flex gap-6 mb-8 border-b" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
              {(['login', 'register'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setAuthTab(tab)}
                  className="pb-3 text-sm transition-colors"
                  style={{
                    color:        authTab === tab ? '#1C1C1A' : '#9E9E9C',
                    fontWeight:   authTab === tab ? 600 : 400,
                    borderBottom: authTab === tab ? '2px solid #1C1C1A' : '2px solid transparent',
                    letterSpacing: 0,
                    marginBottom: '-1px',
                  }}
                >
                  {tab === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
                </button>
              ))}
            </div>

            {/* Login form */}
            {authTab === 'login' && (
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full border px-3 py-2.5 text-sm outline-none focus:border-[#1C1C1A] transition-colors bg-transparent"
                  style={{ borderColor: 'rgba(0,0,0,0.15)', color: '#1C1C1A', borderRadius: '4px', letterSpacing: 0 }}
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  className="w-full border px-3 py-2.5 text-sm outline-none focus:border-[#1C1C1A] transition-colors bg-transparent"
                  style={{ borderColor: 'rgba(0,0,0,0.15)', color: '#1C1C1A', borderRadius: '4px', letterSpacing: 0 }}
                />
                <button
                  onClick={handleAuthSubmit}
                  disabled={authLoading}
                  className="w-full flex items-center justify-center gap-2 mt-1 py-2.5 text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-70"
                  style={{ backgroundColor: '#1C1C1A', color: '#F2EDE4', borderRadius: '999px', letterSpacing: 0 }}
                >
                  {authLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Iniciar sesión
                </button>
                <div className="flex flex-col items-center gap-2 mt-2">
                  <button
                    onClick={() => setAuthTab('register')}
                    className="text-xs hover:opacity-60 transition-opacity"
                    style={{ color: '#1C1C1A', letterSpacing: 0 }}
                  >
                    ¿No tienes cuenta? <span className="underline underline-offset-2">Crear cuenta</span>
                  </button>
                  <button
                    className="text-xs hover:opacity-60 transition-opacity"
                    style={{ color: '#9E9E9C', letterSpacing: 0 }}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </div>
            )}

            {/* Register form */}
            {authTab === 'register' && (
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Tu nombre"
                  className="w-full border px-3 py-2.5 text-sm outline-none focus:border-[#1C1C1A] transition-colors bg-transparent"
                  style={{ borderColor: 'rgba(0,0,0,0.15)', color: '#1C1C1A', borderRadius: '4px', letterSpacing: 0 }}
                />
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full border px-3 py-2.5 text-sm outline-none focus:border-[#1C1C1A] transition-colors bg-transparent"
                  style={{ borderColor: 'rgba(0,0,0,0.15)', color: '#1C1C1A', borderRadius: '4px', letterSpacing: 0 }}
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  className="w-full border px-3 py-2.5 text-sm outline-none focus:border-[#1C1C1A] transition-colors bg-transparent"
                  style={{ borderColor: 'rgba(0,0,0,0.15)', color: '#1C1C1A', borderRadius: '4px', letterSpacing: 0 }}
                />
                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  className="w-full border px-3 py-2.5 text-sm outline-none focus:border-[#1C1C1A] transition-colors bg-transparent"
                  style={{ borderColor: 'rgba(0,0,0,0.15)', color: '#1C1C1A', borderRadius: '4px', letterSpacing: 0 }}
                />
                <label className="flex items-start gap-2 cursor-pointer py-1">
                  <input type="checkbox" className="mt-0.5 accent-[#1C1C1A]" />
                  <span className="text-xs leading-relaxed" style={{ color: '#5F5E5A', letterSpacing: 0 }}>
                    Acepto los términos y condiciones
                  </span>
                </label>
                <button
                  onClick={handleAuthSubmit}
                  disabled={authLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-70"
                  style={{ backgroundColor: '#1C1C1A', color: '#F2EDE4', borderRadius: '999px', letterSpacing: 0 }}
                >
                  {authLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Crear cuenta
                </button>
                <div className="flex justify-center mt-2">
                  <button
                    onClick={() => setAuthTab('login')}
                    className="text-xs hover:opacity-60 transition-opacity"
                    style={{ color: '#1C1C1A', letterSpacing: 0 }}
                  >
                    ¿Ya tienes cuenta? <span className="underline underline-offset-2">Iniciar sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </header>
  );
}
