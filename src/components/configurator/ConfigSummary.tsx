import { useConfiguratorStore } from '@/stores/configuratorStore';
import { MODULE_COLORS } from '@/data/modulesCatalog';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

export default function ConfigSummary() {
  const { getTotalPrice, getModuleSummary, clipCount, placedModules } = useConfiguratorStore();
  const summary = getModuleSummary();
  const total = getTotalPrice();

  const handleAddToCart = () => {
    if (placedModules.length === 0) {
      toast.error('Añade al menos un módulo al configurador');
      return;
    }
    toast.info('Los productos se están preparando en la tienda. Pronto podrás completar tu compra.');
  };

  return (
    <div className="border-t border-border bg-background p-4 space-y-3">
      <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Resumen</h3>

      {summary.length === 0 && clipCount === 0 ? (
        <p className="text-xs text-muted-foreground">Ningún módulo seleccionado</p>
      ) : (
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {summary.map((item, i) => {
            const color = MODULE_COLORS.find(c => c.id === item.colorId);
            return (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: color?.hex }} />
                  <span className="font-mono">{item.module.sku}</span>
                  <span className="text-muted-foreground">×{item.count}</span>
                </div>
                <span className="font-medium">{item.module.price * item.count}€</span>
              </div>
            );
          })}
          {clipCount > 0 && (
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                <span className="font-mono">CLIP</span>
                <span className="text-muted-foreground">×{clipCount}</span>
              </div>
              <span className="font-medium">{clipCount * 5}€</span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-sm font-medium">Total</span>
        <span className="text-lg font-mono font-bold">{total}€</span>
      </div>

      <Button
        className="w-full"
        onClick={handleAddToCart}
        disabled={placedModules.length === 0 && clipCount === 0}
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        Añadir al carrito
      </Button>
    </div>
  );
}
