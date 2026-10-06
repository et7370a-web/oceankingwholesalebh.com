import { motion } from 'framer-motion';
import { Check, Crown, Truck, Tags, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { useQuery } from '@tanstack/react-query';
import { fetchShopifyProducts } from '@/lib/shopify';
import { toast } from 'sonner';

const perks = [
  { icon: Truck, text: 'Free shipping on every order' },
  { icon: Tags, text: '$9.99/lb on whole fish (5 lb minimum)' },
  { icon: Crown, text: 'Members-only deals and early access' },
];

const MembershipSection = () => {
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);

  const { data: shopifyProducts } = useQuery({
    queryKey: ['shopify-products'],
    queryFn: () => fetchShopifyProducts(50),
    staleTime: 5 * 60 * 1000,
  });

  const findMembershipVariant = (titleQuery: string) => {
    const product = shopifyProducts?.find(sp =>
      sp.node.title.toLowerCase().includes(titleQuery.toLowerCase())
    );
    const variant = product?.node.variants.edges[0]?.node;
    return { product, variant };
  };

  const handleAddMembership = async (titleQuery: string) => {
    const { product, variant } = findMembershipVariant(titleQuery);
    if (!product || !variant) {
      toast.error('Membership product is not available yet');
      return;
    }

    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });

    toast.success(`${product.node.title} added to cart`, { position: 'top-center' });
  };

  return (
    <section className="py-24 bg-muted/30 border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <motion.span
              className="inline-block text-secondary font-semibold uppercase tracking-widest text-sm mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Ocean King Fishmarket Membership
            </motion.span>
            <motion.h2
              className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Join for <span className="text-ocean-gradient">Free Shipping</span> & Wholesale Prices
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              One yearly payment gets you free delivery and
              wholesale pricing on every whole fish order.
            </motion.p>
          </div>

          <div className="max-w-md mx-auto">
            {/* Annual plan */}
            <motion.div
              className="relative bg-card rounded-3xl p-8 border-2 border-border/50 shadow-ocean flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
                Best Value
              </div>
              <div className="mb-6">
                <h3 className="font-display text-2xl font-bold text-foreground">Annual Membership</h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="font-display text-5xl font-black text-primary">$36</span>
                  <span className="text-muted-foreground">/ year</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Billed once. Cancel anytime.</p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {perks.map((perk, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <perk.icon className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{perk.text}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className="w-full"
                onClick={() => handleAddMembership('Annual Membership')}
                disabled={isLoading}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add Annual Membership
              </Button>
            </motion.div>
          </div>

          <motion.p
            className="text-center text-sm text-muted-foreground mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Memberships are added to your cart like any other item. Checkout securely with Shopify.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default MembershipSection;
