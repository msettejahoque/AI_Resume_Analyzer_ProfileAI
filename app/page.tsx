import Features from '@/components/landing/Features';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import Nav from '@/components/landing/Nav';
import Pricing from '@/components/landing/Pricing';
import ProblemSection from '@/components/landing/ProblemSection';
import SocialProof from '@/components/landing/SocialProof';

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <Features />
      <SocialProof />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
}


