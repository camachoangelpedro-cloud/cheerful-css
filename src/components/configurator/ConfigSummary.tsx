import { useConfiguratorStore } from '@/stores/configuratorStore';
import { NODO_PRODUCTS, NODO_COLORS } from '@/data/modulesCatalog';
import { toast } from 'sonner';

const COP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

export default function ConfigSummary() {
  const { getTotalPrice, getModuleSummary, placedModules } = useConfiguratorStore();
  const summary = getModuleSummary();
  const total   = getTotalPrice();

  const handleAddToCart = () => {
    if (placedModules.length === 0) {
      toast.error('Añade al menos un módulo al configurador');
      return;
    }
    toast.info('Los productos se están preparando en la tienda. Pronto podrás completar tu compra.');
  };

  return (
    <div className="border-t border-border bg-background p-4 space-y-3 shrink-0">
      <p className="font-body text-[10px] uppercase tracking-[.12em] text-muted-foreground">Resumen</p>

      {summary.length === 0 ? (
        <p className="font-body text-[10px] text-muted-foreground/60">Sin módulos colocados</p>
      ) : (
        <div className="space-y-1 max-h-36 overflow-y-auto">
          {summary.map((item, i) => {
            const product = NODO_PRODUCTS.find(p => p.handle === item.handle);
            const color   = NODO_COLORS.find(c => c.id === item.colorCode);
            return (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 shrink-0"
                    style={{ background: color?.hex ?? '#ccc', border: '1px solid rgba(0,0,0,0.10)' }}
                  />
                  <span className="font-body text-[9px] text-foreground/80 leading-tight">
                    {product?.title ?? item.handle}
                    {item.interior ? ` · ${item.interior}` : ''}
                  </span>
                  <span className="font-body text-[9px] text-muted-foreground">×{item.count}</span>
                </div>
                <span className="font-body text-[9px] font-medium shrink-0 ml-2">
                  {COP(item.unitPrice * item.count)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="font-body text-[10px] uppercase tracking-[.12em] text-muted-foreground">Total</span>
        <span className="font-body text-sm font-semibold">{COP(total)}</span>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={placedModules.length === 0}
        className="w-full py-3 bg-[#1A2B3C] text-[#F2EDE4] font-body text-[10px] tracking-[.12em] uppercase font-medium hover:opacity-85 transition-opacity disabled:opacity-40"
      >
        Añadir al carrito
      </button>
    </div>
  );
}
