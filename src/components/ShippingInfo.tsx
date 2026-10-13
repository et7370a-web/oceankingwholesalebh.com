import { motion } from 'framer-motion';
import { Truck, Clock, MapPin, Package, Zap, DollarSign } from 'lucide-react';

const deliveryAreas = [
  'All five boroughs of New York City',
  'Long Island',
  'Westchester',
  'New Jersey',
];

const schedule = [
  { order: 'Sunday', delivery: 'Monday' },
  { order: 'Monday', delivery: 'Tuesday' },
  { order: 'Tuesday', delivery: 'Wednesday' },
  { order: 'Wednesday', delivery: 'Thursday' },
  { order: 'Thursday', delivery: 'Friday' },
];

const ShippingInfo = () => {
  return (
    <section id="shipping" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.span
              className="inline-block text-secondary font-semibold uppercase tracking-widest text-sm mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Delivery Information
            </motion.span>
            <motion.h2
              className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Fresh to Your Door,{' '}
              <span className="text-ocean-gradient">Guaranteed</span>
            </motion.h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Delivery Areas */}
            <motion.div
              className="bg-card rounded-3xl p-8 shadow-ocean border border-border/50"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="font-display text-2xl font-bold text-primary">
                  Where We Deliver
                </h3>
              </div>
              
              <p className="text-muted-foreground mb-6">
                We currently deliver to the greater New York metropolitan area:
              </p>
              
              <ul className="space-y-3">
                {deliveryAreas.map((area, index) => (
                  <motion.li
                    key={area}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    viewport={{ once: true }}
                  >
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    <span className="text-foreground">{area}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8 p-4 bg-ocean-foam/50 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-5 h-5 text-primary" />
                  <span className="text-sm text-foreground font-medium">
                    5 lb minimum order — can be the same or various types of fish
                  </span>
                </div>
                <p className="text-xs text-muted-foreground ml-8">
                  Mix & match any fish from our selection to meet the minimum.
                </p>
              </div>
            </motion.div>

            {/* Delivery Schedule */}
            <motion.div
              className="bg-card rounded-3xl p-8 shadow-ocean border border-border/50"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
                  <Clock className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-display text-2xl font-bold text-primary">
                  Delivery Schedule
                </h3>
              </div>
              
              <p className="text-muted-foreground mb-6">
                We deliver next day, within 24 hours of your order:
              </p>
              
              <div className="space-y-3">
                {schedule.map((item, index) => (
                  <motion.div
                    key={item.order}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    viewport={{ once: true }}
                  >
                    <span className="text-foreground">
                      Order <strong>{item.order}</strong>
                    </span>
                    <span className="text-primary font-semibold flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      {item.delivery}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-destructive/10 rounded-xl border border-destructive/20">
                <p className="text-sm text-foreground">
                  <strong className="text-destructive">Friday 3:00 PM – Saturday 8:00 PM:</strong>
                  <br />
                  Store closed. Orders placed during this time will be delivered the following Monday.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Packaging & Delivery Fee */}
          <div className="grid lg:grid-cols-2 gap-12 mt-16">
            <motion.div
              className="bg-card rounded-3xl p-8 shadow-ocean border border-border/50"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
                  <Package className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-display text-2xl font-bold text-primary">
                  Packaging & Drop-Off
                </h3>
              </div>
              
              <p className="text-muted-foreground mb-6">
                Your order is delivered in chilled, insulated packaging designed to keep everything cold and fresh. This allows your delivery to be safely left at your doorstep for a short period of time if you're not home.
              </p>
              
              <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
                <p className="text-sm text-foreground">
                  <span className="font-medium">We still recommend bringing it inside as soon as possible.</span>
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-card rounded-3xl p-8 shadow-ocean border border-border/50"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="font-display text-2xl font-bold text-primary">
                  Delivery Fee
                </h3>
              </div>
              
              <div className="mb-6">
                <div className="text-4xl font-display font-bold text-secondary mb-2">
                  FREE
                </div>
                <p className="text-muted-foreground mb-4">
                  Delivery is always free.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg">
                  <Truck className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="text-foreground font-medium">
                    No surprises
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg">
                  <Truck className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="text-foreground font-medium">
                    No fine print
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShippingInfo;
