import { motion } from 'framer-motion';
import { Scale, ShoppingBag, Info } from 'lucide-react';

const rules = [
  {
    icon: Scale,
    title: 'Sold by the Pound',
    description: 'All online fish orders are sold in 1 lb units. Select how many pounds you need.',
  },
  {
    icon: ShoppingBag,
    title: '5 lb Minimum Order',
    description: 'Your total order must be at least 5 lbs. Mix and match any combination of fish.',
  },
];

const OrderingRules = () => {
  return (
    <section className="py-16 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="flex items-center justify-center gap-2 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Info className="w-5 h-5 text-primary" />
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center">
              How Ordering Works
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {rules.map((rule, index) => (
              <motion.div
                key={rule.title}
                className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <rule.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  {rule.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {rule.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-10 rounded-3xl border-2 border-secondary bg-gradient-to-br from-secondary/15 via-background to-primary/10 p-8 md:p-10 shadow-ocean text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-sm md:text-base uppercase tracking-[0.3em] text-secondary font-bold mb-3">
              Questions? Call Us
            </p>
            <a
              href="tel:+16467509232"
              className="block font-display text-5xl md:text-7xl font-black text-foreground tracking-tight mb-6 hover:text-secondary transition-colors"
            >
              (646) 750-9232
            </a>
            <p className="text-base md:text-lg text-foreground max-w-2xl mx-auto">
              Need a custom cut, a bigger order, or a fish you don't see here? Give us a call.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OrderingRules;
