import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Fish } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartDrawer } from '@/components/CartDrawer';

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'Shop', href: '#products' },
  { name: 'Our Story', href: '#story' },
  { name: 'Shipping', href: '#shipping' },
  { name: 'Contact', href: '#contact' },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.a
              href="#"
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <Fish className="w-10 h-10 text-primary" />
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="flex flex-col">
              <span className="font-display text-2xl font-bold text-primary tracking-tight">
                  OCEAN KING
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground -mt-1">
                  Wholesale
                </span>
              </div>
            </motion.a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="relative font-medium text-foreground/80 hover:text-primary transition-colors group"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </nav>

            {/* Desktop Actions */}
            <motion.div
              className="hidden lg:flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button variant="ghost" size="icon" className="hover:bg-ocean-surface/50" aria-label="Search">
                <Search className="w-5 h-5" />
              </Button>
              <CartDrawer />
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6">
                Shop Now
              </Button>
            </motion.div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <CartDrawer />
              <button
                className="p-2"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="lg:hidden glass border-b border-border/50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="font-medium text-foreground/80 hover:text-primary py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <Button className="w-full bg-primary text-primary-foreground mt-4">
                Shop Now
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
