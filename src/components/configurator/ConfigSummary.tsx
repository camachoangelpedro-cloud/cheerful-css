import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import { NODO_PRODUCTS, NODO_COLORS } from '@/data/modulesCatalog';
import { useCartStore } from '@/stores/cartStore';
import { fetchProductByHandle } from '@/lib/shopify';
import { toast } from 'sonner';

const COP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

export default function ConfigSummary() {
  const { getTotalPrice, getModuleSummary, placedModules } = useConfiguratorStore();
  const { addItem } = useCartStore();
  const summary = getModuleSummary();
  const total   = getTotalPrice();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (placedModules.length === 0) {
      toast.error('Añade al menos un módulo al configurador');
      return;
    }

setIsAdding(true);
    let addedCount = 0;
    let failedCount = 0;

    try {
      // Fetch each unique product once
      const cache = new Map<string, Awaited<ReturnType<typeof fetchProductByHandle>>>();
      for (const item of summary) {
        if (!cache.has(item.handle)) {
          cache.set(item.handle, await fetchProductByHandle(item.handle));
        }
      }

      // Add items to cart sequentially to avoid cart-creation race conditions
      for (const item of summary) {
        const productNode = cache.get(item.handle);
        if (!productNode) { failedCount += item.count; continue; }

        const colorInfo = NODO_COLORS.find(c => c.id === item.colorCode);
        if (!colorInfo) { failedCount += item.count; continue; }

        // Only include options the product actually has in Shopify
        const optionNames = new Set(productNode.options.map((o: { name: string }) => o.name));
        const selectedOptions: Array<{ name: string; value: string }> = [];
        if (optionNames.has('Color'))    selectedOptions.push({ name: 'Color',    value: colorInfo.name });
        if (optionNames.has('Interior')) selectedOptions.push({ name: 'Interior', value: item.interior });
        if (optionNames.has('Panel'))    selectedOptions.push({ name: 'Panel',    value: item.panel });

        const variantEdge = productNode.variants.edges.find((edge: { node: { selectedOptions: Array<{ name: string; value: string }> } }) =>
          selectedOptions.every(so =>
            edge.node.selectedOptions.some((vo: { name: string; value: string }) =>
              vo.name === so.name && vo.value === so.value
            )
          )
        );

        if (!variantEdge) {
          console.warn(`No Shopify variant for ${item.handle} | color:${item.colorCode} | interior:${item.interior} | panel:${item.panel}`);
          failedCount += item.count;
          continue;
        }

        await addItem({
          product: { node: productNode },
          variantId: variantEdge.node.id,
          variantTitle: variantEdge.node.title,
          price: variantEdge.node.price,
          quantity: item.count,
          selectedOptions: variantEdge.node.selectedOptions,
        });
        addedCount++;
      }

      if (addedCount === 0 && failedCount > 0) {
        toast.error('No se pudieron añadir los módulos. Por favor intenta de nuevo.');
      } else if (failedCount > 0) {
        toast.warning(`${addedCount} producto(s) añadidos. ${failedCount} no se pudieron agregar.`);
      } else {
        toast.success('¡Módulos añadidos al carrito!');
      }
    } catch (err) {
      console.error('Error adding configurator items to cart:', err);
      toast.error('Error al añadir al carrito. Por favor intenta de nuevo.');
    } finally {
      setIsAdding(false);
    }
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
                    className="w-3 h-3 rounded-full shrink-0"
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
        disabled={placedModules.length === 0 || isAdding}
        className="w-full py-3 bg-[#1C1C1A] text-[#F2EDE4] font-body text-[10px] tracking-[.12em] uppercase font-medium hover:opacity-85 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
      >
        {isAdding
          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
          : 'Añadir al carrito'
        }
      </button>
    </div>
  );
}
