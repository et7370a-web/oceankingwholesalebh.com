import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, Fish } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { getProductsBySpecies, speciesInfo, getAllSpecies } from '@/data/products';

const FishSpecies = () => {
  const { species } = useParams<{ species: string }>();
  
  if (!species || !speciesInfo[species]) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24">
          <div className="text-center">
            <Fish className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Fish Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              We couldn't find that fish species. Browse our available selection below.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {getAllSpecies().map((s) => (
                <Link key={s} to={`/fish/${s}`}>
                  <Button variant="outline" className="capitalize">
                    {speciesInfo[s].name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const info = speciesInfo[species];
  const speciesProducts = getProductsBySpecies(species);

  const canonicalUrl = `https://oceankingwholesalebh.com/fish/${species}`;
  const pageTitle = `${info.name} – Fresh Wild-Caught | Ocean King Fishmarket`;
  const pageDesc = `${info.description.slice(0, 155)}`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
      </Helmet>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={info.heroImage}
              alt={info.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
          
          <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-12">
            <Link to="/#products">
              <Button variant="ghost" className="mb-4 text-foreground/80 hover:text-foreground -ml-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Products
              </Button>
            </Link>
            
            <motion.h1
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {info.name}
            </motion.h1>
            
            <motion.p
              className="text-lg text-muted-foreground max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {info.description}
            </motion.p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Available Cuts
              </h2>
              <p className="text-muted-foreground mt-2">
                {speciesProducts.length} product{speciesProducts.length !== 1 ? 's' : ''} available
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {speciesProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Browse Other Species */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
              Browse Other Species
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {getAllSpecies()
                .filter((s) => s !== species)
                .map((s) => (
                  <Link key={s} to={`/fish/${s}`}>
                    <Button
                      variant="outline"
                      className="border-2 border-primary/30 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      {speciesInfo[s].name}
                    </Button>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FishSpecies;
