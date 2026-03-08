import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
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
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'nodo-navbar py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="nodo-container flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="font-display text-2xl tracking-tight hover:opacity-70 transition-opacity"
        >
          NODO
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-12">
          <Link 
            to="/catalogo" 
            className="font-body text-sm tracking-wide hover:opacity-70 transition-opacity"
          >
            Catálogo
          </Link>
          <Link 
            to="/#about" 
            className="font-body text-sm tracking-wide hover:opacity-70 transition-opacity"
          >
            Estudio
          </Link>
          <button 
            onClick={() => setIsOpen(true)}
            className="font-body text-sm tracking-wide hover:opacity-70 transition-opacity flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Carrito
            {totalItems > 0 && (
              <span className="bg-foreground text-background text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center gap-4">
          <button 
            onClick={() => setIsOpen(true)}
            className="relative"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-foreground text-background text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
