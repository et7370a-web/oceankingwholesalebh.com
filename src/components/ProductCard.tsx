import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Loader2, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product, speciesInfo } from '@/data/products';
import { CUT_STYLES, DEFAULT_CUT_STYLE, getCutStyleLabel } from '@/data/cutStyles';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCartStore } from '@/stores/cartStore';
import { useQuery } from '@tanstack/react-query';
import { fetchShopifyProducts, ShopifyProduct } from '@/lib/shopify';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  index: number;
}

// Our species display name doesn't always match Shopify's product naming
// (e.g. we call it "Buffalo Fish", Shopify lists it as "Buffalo Fillet" / "Buffalo Whole").
const SPECIES_SHOPIFY_ALIAS: Record<string, string> = {
  buffalo: 'Buffalo',
};

const ProductCard = ({ product, index }: ProductCardProps) => {
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  const [selectedId, setSelectedId] = useState<string>('');
  const [cutStyle, setCutStyle] = useState(DEFAULT_CUT_STYLE);

  // Fetch the real Shopify catalog
  const { data: shopifyProducts } = useQuery({
    queryKey: ['shopify-products'],
    queryFn: () => fetchShopifyProducts(50),
    staleTime: 5 * 60 * 1000,
  });

  // Real Shopify products for this species (e.g. "Tuna Fillet Fresh", "Tuna Steaks" for tuna) —
  // each is a distinct cut with its own real price, so the dropdown IS the Shopify catalog.
  const speciesName = SPECIES_SHOPIFY_ALIAS[product.species] ?? speciesInfo[product.species]?.name ?? product.name;
  const matches: ShopifyProduct[] = useMemo(() => {
    if (!shopifyProducts) return [];
    const needle = speciesName.toLowerCase();
    const forSpecies = shopifyProducts.filter((sp) => sp.node.title.toLowerCase().includes(needle));
    // Sold as whole fish; the customer picks how it's cut below.
    const whole = forSpecies.filter((sp) => /whole/i.test(sp.node.title));
    return whole.length > 0 ? whole : forSpecies;
  }, [shopifyProducts, speciesName]);

  useEffect(() => {
    if (matches.length > 0 && !matches.some((m) => m.node.id === selectedId)) {
      setSelectedId(matches[0].node.id);
    }
  }, [matches, selectedId]);

  const selected = matches.find((m) => m.node.id === selectedId);
  const selectedVariant = selected?.node.variants.edges[0]?.node;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selected || !selectedVariant) {
      toast.error('Product not available for purchase yet');
      return;
    }

    await addItem({
      product: selected,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
      customAttributes: [{ key: 'Cut Style', value: getCutStyleLabel(cutStyle) }],
    });

    toast.success(`${selected.node.title} (${getCutStyleLabel(cutStyle)}) added to cart`, {
      position: 'top-center',
    });
  };

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link to={`/fish/${product.species}/${product.id}`} className="block">
        <div className="relative bg-card rounded-2xl overflow-hidden shadow-ocean hover:shadow-2xl transition-all duration-500 border border-border/50">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-muted/30">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
            />

            {/* Badge */}
            {product.badge && (
              <span className={`absolute top-4 left-4 ${product.badgeColor} text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider`}>
                {product.badge}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < product.rating ? 'text-accent fill-accent' : 'text-muted'}`}
                />
              ))}
            </div>

            {/* Name & Origin */}
            <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-sm text-muted-foreground">
                {product.origin}
              </p>
            </div>

            {product.callForPrice ? (
              /* Special order: call for pricing */
              <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                <p className="text-sm text-muted-foreground mb-3">
                  Special order — price varies by size and availability.
                </p>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => { window.location.href = 'tel:+16467509232'; }}
                >
                  <Phone className="w-4 h-4 mr-1" />
                  Call for Pricing
                </Button>
              </div>
            ) : matches.length === 0 ? (
              /* No matching real Shopify product yet */
              <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                <p className="text-sm text-muted-foreground mb-3">
                  Not available for online ordering yet — call to check stock.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => { window.location.href = 'tel:+16467509232'; }}
                >
                  <Phone className="w-4 h-4 mr-1" />
                  Call (646) 750-9232
                </Button>
              </div>
            ) : (
              <>
                <div
                  className="mb-3 space-y-3"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                >
                  {/* Only shown when a species has more than one whole-fish product (e.g. origins) */}
                  {matches.length > 1 && (
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                        Option
                      </label>
                      <Select value={selectedId} onValueChange={setSelectedId}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {matches.map((sp) => (
                            <SelectItem key={sp.node.id} value={sp.node.id}>
                              {sp.node.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                      Cut Style
                    </label>
                    <Select value={cutStyle} onValueChange={setCutStyle}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CUT_STYLES.map((style) => (
                          <SelectItem key={style.value} value={style.value}>
                            {style.label} — {style.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Price & Add to Cart */}
                <div className="flex items-end justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">
                      ${selectedVariant ? parseFloat(selectedVariant.price.amount).toFixed(2) : '—'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      / lb
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleAddToCart}
                    disabled={isLoading || !selectedVariant}
                    className="flex-shrink-0"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Add
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
