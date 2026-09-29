import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2, Calendar } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import {
  earliestDeliveryDateISO,
  latestDeliveryDateISO,
  isValidDeliveryDate,
  nearestValidDeliveryDate,
  formatDeliveryDate,
} from '@/lib/deliveryDate';
import { toast } from 'sonner';

const isOrderingBlocked = () => {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 5=Fri, 6=Sat
  const hour = now.getHours();
  // Blocked: Friday 3:00 PM through Saturday 8:00 PM
  if (day === 5 && hour >= 15) return true; // Friday from 3pm
  if (day === 6 && hour < 20) return true; // Saturday before 8pm
  return false;
};

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, isLoading, isSyncing, deliveryDate, updateQuantity, removeItem, setDeliveryDate, getCheckoutUrl, syncCart } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);
  const orderBlocked = isOrderingBlocked();
  const effectiveDeliveryDate = deliveryDate && isValidDeliveryDate(deliveryDate) ? deliveryDate : earliestDeliveryDateISO();

  useEffect(() => { if (isOpen) syncCart(); }, [isOpen, syncCart]);

  // Make sure a delivery date is always attached to the order, even if the
  // customer never touches the picker.
  useEffect(() => {
    if (items.length > 0 && !deliveryDate) setDeliveryDate(earliestDeliveryDateISO());
  }, [items.length, deliveryDate, setDeliveryDate]);

  const handleDeliveryDateChange = (value: string) => {
    if (!value) return;
    if (!isValidDeliveryDate(value)) {
      const corrected = nearestValidDeliveryDate(value);
      toast.info('We only deliver Monday–Friday — moved to the nearest available day.');
      setDeliveryDate(corrected);
      return;
    }
    setDeliveryDate(value);
  };

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-ocean-surface/50 relative" aria-label={`Open cart${totalItems > 0 ? ` (${totalItems} items)` : ''}`}>
          <ShoppingCart className="w-5 h-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-secondary text-secondary-foreground">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {totalItems === 0 ? 'Your cart is empty' : `${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                <div className="space-y-4">
                  {items.map((item, i) => {
                    const cutStyle = item.customAttributes?.find((a) => a.key === 'Cut Style')?.value;
                    const key = item.lineId ?? `${item.variantId}-${i}`;
                    return (
                      <div key={key} className="flex gap-4 p-3 bg-muted/30 rounded-xl">
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          {item.product.node.images?.edges?.[0]?.node && (
                            <img src={item.product.node.images.edges[0].node.url} alt={item.product.node.title} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate text-foreground">{item.product.node.title}</h4>
                          {cutStyle && <p className="text-xs text-muted-foreground truncate">{cutStyle}</p>}
                          <p className="text-sm font-semibold text-primary">${parseFloat(item.price.amount).toFixed(2)} per lb</p>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => item.lineId && removeItem(item.lineId)} aria-label={`Remove ${item.product.node.title}`}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          <div className="flex items-center gap-1">
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => item.lineId && updateQuantity(item.lineId, item.quantity - 1)} aria-label="Decrease quantity">
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => item.lineId && updateQuantity(item.lineId, item.quantity + 1)} aria-label="Increase quantity">
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex-shrink-0 space-y-4 pt-4 border-t bg-background">
                <div>
                  <label htmlFor="delivery-date" className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Delivery date
                  </label>
                  <input
                    id="delivery-date"
                    type="date"
                    value={effectiveDeliveryDate}
                    min={earliestDeliveryDateISO()}
                    max={latestDeliveryDateISO()}
                    onChange={(e) => handleDeliveryDateChange(e.target.value)}
                    className="w-full rounded-lg border-2 border-border px-3 py-2 text-sm bg-background text-foreground"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDeliveryDate(effectiveDeliveryDate)} · We deliver Monday–Friday
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
                </div>
                {orderBlocked && (
                  <p className="text-sm text-destructive text-center font-medium">Orders are closed from Friday 3:00 PM to Saturday 8:00 PM</p>
                )}
                {!orderBlocked && totalItems < 5 && (
                  <p className="text-sm text-destructive text-center">Minimum order: 5 items ({5 - totalItems} more needed)</p>
                )}
                <Button onClick={handleCheckout} className="w-full" size="lg" disabled={orderBlocked || totalItems < 5 || isLoading || isSyncing}>
                  {isLoading || isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ExternalLink className="w-4 h-4 mr-2" />Checkout with Shopify</>}
                </Button>
                <div className="rounded-2xl border-2 border-secondary bg-secondary/10 p-4 text-center">
                  <p className="text-xs uppercase tracking-widest text-secondary font-bold mb-2">Pay With</p>
                  <p className="font-display text-2xl font-extrabold text-primary leading-tight">Zelle &amp; Venmo</p>
                  <p className="text-3xl font-black text-foreground mt-2 tracking-tight">(646) 750-9232</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Send payment to the number above and include your <strong className="text-foreground">order details</strong> in the note.
                  </p>
                  <p className="text-sm font-semibold text-secondary mt-2">
                    Delivery within 24 hours of payment.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
