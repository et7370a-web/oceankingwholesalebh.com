import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Package, Phone, Plus, Minus } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { products, speciesInfo, getProductsBySpecies } from '@/data/products';
import ProductCard from '@/components/ProductCard';

const isWholeFish = (type: string) => type.toLowerCase().includes('whole');

const ProductDetail = () => {
  const { species, productId } = useParams<{ species: string; productId: string }>();
  const [quantity, setQuantity] = useState(5);

  const product = products.find((p) => p.id === Number(productId));

  if (!product || !species || !speciesInfo[species]) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const wholeFish = isWholeFish(product.type);
  const relatedProducts = getProductsBySpecies(species).filter((p) => p.id !== product.id);

  // Get all available prep types for this species
  const speciesProducts = getProductsBySpecies(species);
  const prepTypes = [...new Set(speciesProducts.map((p) => p.type))];

  const canonicalUrl = `https://oceankingwholesalebh.com/fish/${species}/${product.id}`;
  const pageTitle = `${product.name} – ${product.type} | Ocean King Fishmarket`;
  const pageDesc = `${product.name} from ${product.origin}. ${product.type}. Fresh wild-caught ${speciesInfo[species].name.toLowerCase()} delivered to NYC, Long Island & NJ.`.slice(0, 158);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="product" />
      </Helmet>
      <Header />
      <main>
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 pt-24 pb-4">
          <Link to={`/fish/${species}`}>
            <Button variant="ghost" className="text-foreground/80 hover:text-foreground -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {speciesInfo[species].name}
            </Button>
          </Link>
        </div>

        {/* Product Detail */}
        <section className="container mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Image */}
            <motion.div
              className="relative rounded-3xl overflow-hidden shadow-ocean border border-border/50"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full aspect-square object-cover"
                loading="lazy"
              />
              {product.badge && (
                <span className={`absolute top-4 left-4 sm:top-6 sm:left-6 ${product.badgeColor} text-primary-foreground text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full uppercase tracking-wider`}>
                  {product.badge}
                </span>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              className="flex flex-col justify-center"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 sm:w-5 h-4 sm:h-5 ${i < product.rating ? 'text-accent fill-accent' : 'text-muted'}`} />
                ))}
              </div>

              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{product.origin}</span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-6 text-sm sm:text-base leading-relaxed">
                Fresh, wild-caught {speciesInfo[species].name.toLowerCase()} sourced daily from trusted fisheries.
                Hand-selected for quality, expertly prepared, and delivered to your door at peak freshness.
              </p>

              {/* Preparation Type Selector */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Preparation
                </h3>
                <div className="flex flex-wrap gap-2">
                  {prepTypes.map((type) => {
                    const matchingProduct = speciesProducts.find((p) => p.type === type);
                    const isActive = product.type === type;
                    return (
                      <Link
                        key={type}
                        to={`/fish/${species}/${matchingProduct?.id}`}
                      >
                        <Button
                          variant={isActive ? 'default' : 'outline'}
                          size="sm"
                          className={isActive ? '' : 'border-2 border-primary/30 hover:border-primary hover:bg-primary hover:text-primary-foreground'}
                        >
                          {type}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Pricing & Quantity */}
              <div className="mb-6 p-5 sm:p-6 bg-card rounded-2xl border border-border/50 shadow-ocean">
                {wholeFish ? (
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Phone className="w-6 h-6 text-primary" />
                      <span className="font-display text-xl sm:text-2xl font-bold text-primary">Call for Pricing</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">
                      Whole fish pricing varies by size and availability. Give us a call for
                      current stock and pricing.
                    </p>
                    <a href="tel:+16467509232">
                      <Button className="w-full" size="lg">
                        <Phone className="w-4 h-4 mr-2" />
                        Call (646) 750-9232
                      </Button>
                    </a>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-display text-3xl sm:text-4xl font-bold text-primary">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-muted-foreground">/ lb</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">Sold in 1 lb units</p>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-foreground">Quantity (lbs):</span>
                      <div className="flex items-center border-2 border-border rounded-lg overflow-hidden">
                        <button
                          onClick={() => setQuantity(Math.max(5, quantity - 1))}
                          className="p-2 sm:p-3 hover:bg-muted transition-colors active:bg-muted/80"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 sm:px-6 py-2 font-bold text-lg min-w-[3rem] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-2 sm:p-3 hover:bg-muted transition-colors active:bg-muted/80"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      Subtotal: <strong className="text-foreground">${(product.price * quantity).toFixed(2)}</strong>
                    </p>
                  </div>
                )}
              </div>

              {/* Order Info */}
              <div className="space-y-2">
                <div className="p-3 sm:p-4 bg-muted/50 rounded-xl text-sm text-muted-foreground flex items-start gap-3">
                  <Package className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                  <p>5 lb minimum total order — mix & match any fish. Free delivery to NYC, Long Island & NJ.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Other cuts of the same species */}
        {relatedProducts.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
                Other {speciesInfo[species].name} Cuts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
