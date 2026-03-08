import { Link } from 'react-router-dom';
import { ShoppingBag, Search, User } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useEffect, useState } from 'react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { items, setIsOpen } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Announcement Bar - Kismas style scrolling */}
      <div className="text-background py-2 overflow-hidden bg-primary">
        <div className="animate-marquee whitespace-nowrap flex">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex shrink-0">
              <span className="mx-10 text-xs tracking-wide font-mono font-thin">
                Envío gratis en pedidos superiores a $500.000 COP
              </span>
              <span className="mx-10 text-xs tracking-wide font-mono font-thin">
                Diseño modular. Fabricación Colombiana
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
        scrolled ?
        'bg-background/95 backdrop-blur-md border-b border-border/20' :
        'bg-transparent'}`
        }>
        
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
          {/* Logo - Left */}
          <Link
            to="/"
            className={`font-display text-xl tracking-[0.2em] font-semibold transition-colors ${
            scrolled ? 'text-foreground' : 'text-foreground'}`
            }>
            
            NODO
          </Link>

          {/* Center Links */}
          <div className="hidden lg:flex items-center gap-10">
            <Link
              to="/catalogo"
              className="font-body text-sm tracking-wide hover:opacity-60 transition-opacity">
              
              Shop all
            </Link>
            <div className="relative group">
              <button className="font-body text-sm tracking-wide hover:opacity-60 transition-opacity flex items-center gap-1">
                Products
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <Link
              to="/#manifesto"
              className="font-body text-sm tracking-wide hover:opacity-60 transition-opacity">
              
              About
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
              className="relative hover:opacity-60 transition-opacity">
              
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 &&
              <span className="absolute -top-1.5 -right-1.5 bg-foreground text-background text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-body">
                  {totalItems}
                </span>
              }
            </button>
          </div>
        </div>
      </nav>
    </header>);

}