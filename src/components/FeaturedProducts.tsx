import ProductCard from './ProductCard';
import { products } from '@/data/products';

const FeaturedProducts = () => {
  return (
    <section id="products" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* All whole fish products on one page */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
