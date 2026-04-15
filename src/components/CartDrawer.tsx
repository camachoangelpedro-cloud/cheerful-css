import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ExternalLink, Loader2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/shopify";

const CROSS_SELL = [
  { name: "Clip Latón",  price: "$ 29.000", link: "/producto/clip-decorativo-laton" },
  { name: "Clip Acero",  price: "$ 22.000", link: "/producto/clip-decorativo-acero" },
  { name: "Base 36×36", price: "$ 78.000", link: "/producto/base-36-36" },
];

export function CartDrawer() {
  const { 
    items, 
    isLoading, 
    isSyncing, 
    isOpen, 
    setIsOpen,
    updateQuantity, 
    removeItem, 
    getCheckoutUrl, 
    syncCart 
  } = useCartStore();
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) syncCart();
  };

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'begin_checkout', {
          currency: 'COP',
          value: totalPrice || 0,
        });
      }
      window.open(checkoutUrl, '_blank');
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-background border-l border-border/50">
        <SheetHeader className="flex-shrink-0 border-b border-border/30 pb-4">
          <SheetTitle className="font-display text-xl">
            Tu Carrito
          </SheetTitle>
          <p className="font-body text-sm text-muted-foreground">
            {totalItems === 0 
              ? "Tu carrito está vacío" 
              : `${totalItems} artículo${totalItems !== 1 ? 's' : ''}`
            }
          </p>
        </SheetHeader>

        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="font-body text-muted-foreground">
                  Aún no has agregado productos
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Promo banner */}
              <div className="flex-shrink-0 mb-4 rounded-sm px-3 py-2.5 text-center" style={{ backgroundColor: '#F5EDD6' }}>
                <span className="font-body text-[13px]" style={{ color: '#7A5C1E' }}>
                  Usa el código <strong>LANZAMIENTO</strong> al pagar para envío gratis 🎉
                </span>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4">
                      <div className="w-20 h-20 bg-muted/30 overflow-hidden flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img 
                            src={item.product.node.images.edges[0].node.url} 
                            alt={item.product.node.title} 
                            className="w-full h-full object-cover" 
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-sm truncate">
                          {item.product.node.title}
                        </h4>
                        {item.variantTitle !== 'Default Title' && (
                          <p className="font-body text-xs text-muted-foreground mt-1">
                            {item.selectedOptions.map(option => option.value).join(' / ')}
                          </p>
                        )}
                        <p className="font-body text-sm mt-2">
                          {formatPrice(item.price.amount, item.price.currencyCode)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <button 
                          onClick={() => removeItem(item.variantId)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="flex items-center gap-2 border border-border/50">
                          <button 
                            className="p-1 hover:bg-muted transition-colors"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center font-body text-sm">
                            {item.quantity}
                          </span>
                          <button 
                            className="p-1 hover:bg-muted transition-colors"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cross-sell */}
              <div className="flex-shrink-0 pt-5 pb-1">
                <p className="font-body text-sm font-medium mb-3">Completa tu sistema</p>
                <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1 snap-x">
                  {CROSS_SELL.map(item => (
                    <Link
                      key={item.link}
                      to={item.link}
                      className="flex-shrink-0 w-[90px] snap-start group"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="w-full aspect-square bg-muted/40 flex items-center justify-center mb-1.5 overflow-hidden">
                        <span className="font-body text-[8px] uppercase tracking-wide text-muted-foreground/40 text-center px-1 leading-tight">{item.name}</span>
                      </div>
                      <p className="font-body text-[11px] font-medium leading-snug group-hover:underline">{item.name}</p>
                      <p className="font-body text-[11px] text-muted-foreground">{item.price}</p>
                      <p className="font-body text-[10px] text-foreground/50 underline underline-offset-1 mt-0.5">Ver</p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex-shrink-0 space-y-4 pt-6 border-t border-border/30 bg-background">
                <div className="flex justify-between items-center">
                  <span className="font-body text-sm text-muted-foreground">Subtotal</span>
                  <span className="font-display text-lg">
                    {formatPrice(totalPrice.toString(), items[0]?.price.currencyCode || 'COP')}
                  </span>
                </div>
                <p className="font-body text-xs text-muted-foreground">
                  Envío calculado al finalizar la compra
                </p>
                <Button 
                  onClick={handleCheckout} 
                  className="w-full nodo-button rounded-full bg-[#1C1C1A] text-white px-8 py-3.5 text-sm tracking-wide font-medium hover:opacity-90 transition-opacity"
                  disabled={items.length === 0 || isLoading || isSyncing}
                >
                  {isLoading || isSyncing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Finalizar Compra
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
