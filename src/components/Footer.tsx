import { motion } from 'framer-motion';
import { Fish, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

const footerLinks = {
  shop: [
    { name: 'All Products', href: '#' },
    { name: 'Salmon', href: '#' },
    { name: 'Tuna', href: '#' },
    { name: 'White Fish', href: '#' },
  ],
  company: [
    { name: 'Our Story', href: '#' },
    { name: 'Sustainability', href: '#' },
    { name: 'Wholesale', href: '#' },
    { name: 'Careers', href: '#' },
  ],
  support: [
    { name: 'Shipping Info', href: '#' },
    { name: 'Returns', href: '#' },
    { name: 'FAQ', href: '#' },
    { name: 'Contact Us', href: '#' },
  ],
};

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'Youtube' },
];

const Footer = () => {
  return (
    <footer className="bg-ocean-deep text-ocean-surface">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <motion.a
              href="#"
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Fish className="w-10 h-10 text-gold-light" />
              <div className="flex flex-col">
              <span className="font-display text-2xl font-bold text-ocean-surface tracking-tight">
                  OCEAN KING
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-ocean-surface/60 -mt-1">
                  Wholesale
                </span>
              </div>
            </motion.a>
            
            <p className="text-ocean-surface/70 mb-6 max-w-sm">
              Premium wild-caught seafood delivered fresh to your door. 
              Sustainably sourced, expertly prepared, and guaranteed fresh.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-ocean-mid/30 flex items-center justify-center hover:bg-secondary/30 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-ocean-surface mb-4">
              Shop
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-ocean-surface/70 hover:text-gold-light transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-ocean-surface mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-ocean-surface/70 hover:text-gold-light transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-ocean-surface mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-ocean-surface/70 hover:text-gold-light transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-ocean-mid/30 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-ocean-surface/80 text-sm">
              © 2024 Ocean King Fishmarket. All rights reserved. Call us at{' '}
              <a href="tel:+16467509232" className="underline hover:text-gold-light transition-colors">
                (646) 750-9232
              </a>
            </p>
            <div className="flex gap-6 text-sm text-ocean-surface/80">
              <a href="#" className="hover:text-ocean-surface transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-ocean-surface transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-ocean-surface transition-colors">
                Kosher Certification
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
