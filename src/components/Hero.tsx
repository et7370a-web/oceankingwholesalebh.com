import { motion } from 'framer-motion';
import { ArrowRight, Truck, Fish } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-fish-market.jpg';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Premium New York fish market"
          className="w-full h-full object-cover"
          width="1920"
          height="1080"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/70 via-ocean-deep/50 to-ocean-deep/90" />
      </div>

      {/* Animated Wave Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg viewBox="0 0 1440 120" className="w-full h-32" preserveAspectRatio="none">
            <path
              d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,60 1440,60 L1440,120 L0,120 Z"
              className="fill-background"
            />
          </svg>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Premium Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-dark text-ocean-surface mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Fish className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide uppercase">
              New York's Premium Fish Market
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-primary-foreground">Wild-Caught.</span>
            <br />
            <span className="text-gold-light italic">Delivered Fresh.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-ocean-surface/90 mb-10 max-w-2xl mx-auto font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Premium wild-caught seafood sourced daily from trusted fisheries.
            Next-day delivery to your door across NYC, Long Island, Westchester & NJ.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a href="#products">
              <Button
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-6 text-lg font-semibold shadow-ocean group w-full sm:w-auto"
              >
                Shop Our Catch
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            <a href="#story">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-ocean-deep bg-white text-ocean-deep hover:bg-ocean-deep hover:text-white px-8 py-6 text-lg font-semibold w-full sm:w-auto"
              >
                Our Story
              </Button>
            </a>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="mt-16 flex flex-wrap justify-center gap-4 md:gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            {[
              { value: 'Next-Day', label: 'Delivery', icon: Truck },
              { value: 'Wild', label: 'Caught', icon: Fish },
              { value: '30+', label: 'Years Experience' },
              { value: 'Kosher', label: 'Certified' },
            ].map((stat) => (
              <div key={stat.label} className="text-center bg-black/50 rounded-xl px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-white font-semibold uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
