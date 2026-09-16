import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import OrderingRules from '@/components/OrderingRules';
import FeaturedProducts from '@/components/FeaturedProducts';
import MembershipSection from '@/components/MembershipSection';
import QualityPromise from '@/components/QualityPromise';
import StorySection from '@/components/StorySection';
import ShippingInfo from '@/components/ShippingInfo';
import Newsletter from '@/components/Newsletter';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Ocean King Fishmarket – Fresh Wild-Caught Seafood | Brooklyn, NY</title>
        <meta name="description" content="Brooklyn's trusted source for fresh wild-caught fish since 1994. Salmon, tuna, branzino & more delivered to NYC, Long Island & NJ. Call (646) 750-9232." />
        <link rel="canonical" href="https://oceankingwholesalebh.com/" />
        <meta property="og:title" content="Ocean King Fishmarket – Fresh Wild-Caught Seafood" />
        <meta property="og:description" content="Premium wild-caught seafood delivered fresh to NYC, Long Island & NJ. Order online or call (646) 750-9232." />
        <meta property="og:url" content="https://oceankingwholesalebh.com/" />
      </Helmet>
      <Header />
      <main>
        <Hero />
        <OrderingRules />
        <FeaturedProducts />
        <MembershipSection />
        <QualityPromise />
        <StorySection />
        <ShippingInfo />
        <Newsletter />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
