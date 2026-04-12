import { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/FooterNodo';
import { CartDrawer } from '@/components/CartDrawer';
import { CATALOG_PRODUCTS, COLOR_HEX, type ProductCategory } from '@/data/products';

// ── Price formatter — "$ 234.000" ────────────────────────────────────────────
const COP = (n: number) =>
  '$ ' + n.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

// ── Category filter options ───────────────────────────────────────────────────
const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: 'modulo-profundidad-completa', label: 'Módulos · Profundidad completa' },
  { value: 'modulo-media-profundidad',    label: 'Módulos · Media profundidad' },
  { value: 'base',                        label: 'Bases' },
  { value: 'clip',                        label: 'Clips' },
];

const COLOR_OPTIONS = ['Blanco Hueso', 'Roble Natural', 'Verde Agave', 'Azul Fes'];

type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'name-az';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'relevance',  label: 'Relevancia' },
  { value: 'price-asc',  label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'name-az',    label: 'Nombre: A - Z' },
];

// ── Product card ─────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: typeof CATALOG_PRODUCTS[number] }) {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  return (
    <Link to={`/producto/${product.slug}`} className="block group">

      {/* Image placeholder with active colour tint */}
      <div
        className="w-full overflow-hidden relative flex items-center justify-center"
        style={{
          backgroundColor: hoveredColor ? COLOR_HEX[hoveredColor] ?? '#F2EDE4' : '#F2EDE4',
          borderRadius: '8px',
          aspectRatio: '4/5',
          transition: 'background-color 0.2s ease',
        }}
      >
        <span style={{ fontSize: '11px', color: 'rgba(0,0,0,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {product.name}
        </span>
      </div>

      {/* Colour swatches */}
      {product.colors.length > 0 && (
        <div
          className="flex items-center gap-[6px] pt-3 px-1"
          onClick={e => e.preventDefault()}
        >
          {product.colors.map(colorName => (
            <button
              key={colorName}
              onMouseEnter={() => setHoveredColor(colorName)}
              onMouseLeave={() => setHoveredColor(null)}
              aria-label={colorName}
              className="w-5 h-5 rounded-full shrink-0 border transition-all"
              style={{
                backgroundColor: COLOR_HEX[colorName] ?? '#ccc',
                borderColor: colorName === 'Blanco Hueso' ? 'rgba(0,0,0,0.12)' : 'transparent',
                outline: hoveredColor === colorName ? '2px solid #1C1C1A' : '2px solid transparent',
                outlineOffset: '2px',
              }}
            />
          ))}
          {hoveredColor && (
            <span className="ml-1 text-[11px]" style={{ color: '#9E9E9C', letterSpacing: 0 }}>
              {hoveredColor}
            </span>
          )}
        </div>
      )}

      {/* Text info */}
      <div className="px-1 pt-2 pb-1">
        <p
          className="leading-tight"
          style={{ fontSize: '13px', fontWeight: 300, color: '#1C1C1A', letterSpacing: 0 }}
        >
          {product.name}
        </p>
        {product.dimensions !== '—' && (
          <p className="mt-0.5" style={{ fontSize: '11px', color: '#9E9E9C', letterSpacing: 0 }}>
            {product.dimensions}
          </p>
        )}
        <p className="mt-1" style={{ fontSize: '12px', fontWeight: 400, color: '#5F5E5A', letterSpacing: 0 }}>
          {COP(product.price)}
        </p>
      </div>

      {/* Personalizar CTA */}
      <div
        className="mx-1 mt-2 mb-1 flex items-center justify-center transition-opacity duration-200 group-hover:opacity-90"
        style={{
          backgroundColor: '#1C1C1A',
          color: '#FFFFFF',
          borderRadius: '999px',
          padding: '9px 16px',
          fontSize: '11px',
          fontWeight: 400,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        Personalizar
      </div>
    </Link>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CatalogoPage() {
  const [activeCategories, setActiveCategories] = useState<Set<ProductCategory>>(new Set());
  const [activeColors, setActiveColors]         = useState<Set<string>>(new Set());
  const [sortBy, setSortBy]                     = useState<SortKey>('relevance');
  const [filterOpen, setFilterOpen]             = useState(false);
  const [sortOpen, setSortOpen]                 = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef   = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
      if (sortRef.current   && !sortRef.current.contains(e.target as Node))   setSortOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const hasActiveFilters = activeCategories.size > 0 || activeColors.size > 0;

  const toggleCategory = (cat: ProductCategory) => {
    setActiveCategories(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  const toggleColor = (color: string) => {
    setActiveColors(prev => {
      const next = new Set(prev);
      next.has(color) ? next.delete(color) : next.add(color);
      return next;
    });
  };

  const clearFilters = () => {
    setActiveCategories(new Set());
    setActiveColors(new Set());
  };

  // Filtered + sorted list
  const displayed = useMemo(() => {
    let list = [...CATALOG_PRODUCTS];

    if (activeCategories.size > 0) {
      list = list.filter(p => activeCategories.has(p.category));
    }
    if (activeColors.size > 0) {
      list = list.filter(p => p.colors.some(c => activeColors.has(c)));
    }

    switch (sortBy) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'name-az':    list.sort((a, b) => a.name.localeCompare(b.name, 'es')); break;
    }

    return list;
  }, [activeCategories, activeColors, sortBy]);

  const activeSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label ?? 'Ordenar';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      <main className="pt-[96px]">

        {/* Breadcrumb */}
        <div className="nodo-container pt-6">
          <nav className="flex items-center gap-1.5">
            <Link
              to="/"
              className="hover:underline underline-offset-2 transition-colors"
              style={{ fontSize: '13px', color: '#9E9E9C', letterSpacing: 0 }}
            >
              Inicio
            </Link>
            <span style={{ fontSize: '13px', color: '#9E9E9C' }}>›</span>
            <span style={{ fontSize: '13px', color: '#1C1C1A', letterSpacing: 0 }}>Catálogo</span>
          </nav>
        </div>

        {/* Category header */}
        <div className="nodo-container pt-5 pb-10 flex items-start justify-between gap-12">
          <h1
            className="text-4xl shrink-0"
            style={{ fontWeight: 300, letterSpacing: 0, lineHeight: 1.1 }}
          >
            Catálogo
          </h1>
          <p
            className="text-sm leading-relaxed max-w-[500px]"
            style={{ color: '#5F5E5A', letterSpacing: 0 }}
          >
            Sistema modular NODO — cada módulo se conecta sin herramientas.
            Configura tu espacio libremente y crece cuando quieras.
          </p>
        </div>

        <div className="nodo-container">

          {/* Filter + sort toolbar */}
          <div className="flex items-center justify-between mb-10 gap-4">

            {/* Result count */}
            <p style={{ fontSize: '12px', color: '#9E9E9C', letterSpacing: 0 }}>
              Mostrando {displayed.length} de {CATALOG_PRODUCTS.length} productos
            </p>

            <div className="flex items-center gap-4">

              {/* ── Filter dropdown ── */}
              <div ref={filterRef} className="relative">
                <button
                  onClick={() => { setFilterOpen(o => !o); setSortOpen(false); }}
                  className="flex items-center gap-1.5 text-sm transition-colors duration-200"
                  style={{ color: filterOpen || hasActiveFilters ? '#1C1C1A' : '#5F5E5A', letterSpacing: 0 }}
                >
                  <SlidersHorizontal strokeWidth={1.5} size={15} />
                  Filtrar
                  {hasActiveFilters && (
                    <span
                      className="inline-flex items-center justify-center text-[10px] font-medium w-4 h-4 rounded-full"
                      style={{ backgroundColor: '#1C1C1A', color: '#F2EDE4' }}
                    >
                      {activeCategories.size + activeColors.size}
                    </span>
                  )}
                </button>

                {filterOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 z-30 flex flex-col gap-6 p-6"
                    style={{
                      width: '260px',
                      backgroundColor: '#FAFAF8',
                      border: '1px solid rgba(0,0,0,0.08)',
                      borderRadius: '6px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    }}
                  >
                    {/* Group 1 — Tipo */}
                    <div>
                      <p className="text-xs font-medium mb-3" style={{ color: '#1C1C1A', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        Tipo de producto
                      </p>
                      <div className="flex flex-col gap-2.5">
                        {CATEGORY_OPTIONS.map(opt => (
                          <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group/check">
                            <input
                              type="checkbox"
                              checked={activeCategories.has(opt.value)}
                              onChange={() => toggleCategory(opt.value)}
                              className="w-4 h-4 rounded accent-[#1C1C1A] cursor-pointer"
                            />
                            <span
                              className="text-sm group-hover/check:text-[#1C1C1A] transition-colors"
                              style={{ color: activeCategories.has(opt.value) ? '#1C1C1A' : '#5F5E5A', letterSpacing: 0 }}
                            >
                              {opt.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Divider */}
                    <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.07)' }} />

                    {/* Group 2 — Color */}
                    <div>
                      <p className="text-xs font-medium mb-3" style={{ color: '#1C1C1A', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        Color
                      </p>
                      <div className="flex flex-col gap-2.5">
                        {COLOR_OPTIONS.map(color => (
                          <label key={color} className="flex items-center gap-2.5 cursor-pointer group/check">
                            <input
                              type="checkbox"
                              checked={activeColors.has(color)}
                              onChange={() => toggleColor(color)}
                              className="w-4 h-4 rounded accent-[#1C1C1A] cursor-pointer"
                            />
                            <span
                              className="w-4 h-4 rounded-full shrink-0 border"
                              style={{
                                backgroundColor: COLOR_HEX[color],
                                borderColor: color === 'Blanco Hueso' ? 'rgba(0,0,0,0.15)' : 'transparent',
                              }}
                            />
                            <span
                              className="text-sm group-hover/check:text-[#1C1C1A] transition-colors"
                              style={{ color: activeColors.has(color) ? '#1C1C1A' : '#5F5E5A', letterSpacing: 0 }}
                            >
                              {color}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Clear */}
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 text-xs hover:opacity-60 transition-opacity self-start"
                        style={{ color: '#9E9E9C', letterSpacing: 0 }}
                      >
                        <X size={12} />
                        Limpiar filtros
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ── Sort dropdown ── */}
              <div ref={sortRef} className="relative">
                <button
                  onClick={() => { setSortOpen(o => !o); setFilterOpen(false); }}
                  className="flex items-center gap-1.5 text-sm transition-colors duration-200"
                  style={{ color: sortOpen || sortBy !== 'relevance' ? '#1C1C1A' : '#5F5E5A', letterSpacing: 0 }}
                >
                  <ArrowUpDown strokeWidth={1.5} size={15} />
                  {activeSortLabel}
                </button>

                {sortOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 z-30 flex flex-col"
                    style={{
                      width: '220px',
                      backgroundColor: '#FAFAF8',
                      border: '1px solid rgba(0,0,0,0.08)',
                      borderRadius: '6px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                      overflow: 'hidden',
                    }}
                  >
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                        className="flex items-center justify-between px-5 py-3 text-sm text-left hover:bg-[#F2EDE4] transition-colors"
                        style={{
                          color: sortBy === opt.value ? '#1C1C1A' : '#5F5E5A',
                          fontWeight: sortBy === opt.value ? 500 : 400,
                          letterSpacing: 0,
                        }}
                      >
                        {opt.label}
                        {sortBy === opt.value && (
                          <span style={{ color: '#1C1C1A', fontSize: '16px', lineHeight: 1 }}>·</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product grid */}
          {displayed.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-sm" style={{ color: '#9E9E9C', letterSpacing: 0 }}>
                No hay productos que coincidan con los filtros seleccionados.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 text-sm underline underline-offset-2 hover:opacity-60 transition-opacity"
                style={{ color: '#1C1C1A', letterSpacing: 0 }}
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 pb-24">
              {displayed.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
