import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { ManifestoSection } from '@/components/ManifestoSection';
import { FeaturedCollection } from '@/components/FeaturedCollection';
import { Footer } from '@/components/FooterNodo';
import { CartDrawer } from '@/components/CartDrawer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      <main>
        <HeroSection />
        <ManifestoSection />
        <FeaturedCollection />
      </main>
      <Footer />
    </div>
  );
}
