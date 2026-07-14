import Hero from '../../components/hero/Hero';
import HowItWorks from '../../components/howItWorks/HowItWorks';
import Books from '../../components/books/Books';
import Features from '../../components/features/Features';
import Testimonials from '../../components/testimonials/Testimonials';
import AdventureSection from '../../components/adventureSection/AdventureSection';
import OurStory from '../../components/ourStory/OurStory';  
function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <AdventureSection />
      <OurStory />
      <Books />
      <Features />
      <Testimonials />
    </>
  );
}

export default Home;
