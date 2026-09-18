import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Loader2, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/data/products';
import { CUT_STYLES, DEFAULT_CUT_STYLE, getCutStyleLabel } from '@/data/cutStyles';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCartStore } from '@/stores/cartStore';
import { useQuery } from '@tanstack/react-query';
import { fetchShopifyProducts } from '@/lib/shopify';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  const [cutStyle, setCutStyle] = useState(DEFAULT_CUT_STYLE);

  // Fetch matching Shopify product by title
  const { data: shopifyProducts } = useQuery({
    queryKey: ['shopify-products'],
    queryFn: () => fetchShopifyProducts(50),
    staleTime: 5 * 60 * 1000,
  });

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Find the matching Shopify product
    const shopifyProduct = shopifyProducts?.find(
      (sp) => sp.node.title.toLowerCase() === product.name.toLowerCase()
    );

    if (!shopifyProduct) {
      toast.error('Product not available for purchase yet');
      return;
    }

    const variant = shopifyProduct.node.variants.edges[0]?.node;
    if (!variant) {
      toast.error('No variant available');
      return;
    }

    await addItem({
      product: shopifyProduct,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
      customAttributes: [{ key: 'Cut Style', value: getCutStyleLabel(cutStyle) }],
    });

    toast.success(`${product.name} (${getCutStyleLabel(cutStyle)}) added to cart`, {
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
                <a href="tel:+16467509232" className="block">
                  <Button size="sm" className="w-full">
                    <Phone className="w-4 h-4 mr-1" />
                    Call for Pricing
                  </Button>
                </a>
              </div>
            ) : (
              <>
                {/* Cut Style */}
                <div
                  className="mb-3"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                >
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

                {/* Price & Add to Cart */}
                <div className="flex items-end justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      / lb
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleAddToCart}
                    disabled={isLoading}
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
