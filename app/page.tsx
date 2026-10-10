import Nav, { SoundHint } from "@/components/ui/Nav";
import PlayheadRail from "@/components/ui/PlayheadRail";
import Preloader from "@/components/ui/Preloader";
import ReelModal from "@/components/ui/ReelModal";
import Hero from "@/components/sections/Hero";
import Ticker from "@/components/sections/Ticker";
import Work from "@/components/sections/Work";
import Grade from "@/components/sections/Grade";
import Process from "@/components/sections/Process";
import Tools from "@/components/sections/Tools";
import Testimonials from "@/components/sections/Testimonials";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import { profile } from "@/content/data";
import { PageIn } from "@/components/Transitions";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    email: profile.email,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Preloader />
      <Nav />
      <PlayheadRail />
      <ReelModal />
      <SoundHint />
      <main>
        <PageIn>
        <Hero />
        <Ticker />
        <Work />
        <Grade />
        <Process />
        <Tools />
        <Testimonials />
        <About />
        <Contact />
        </PageIn>
      </main>
      <Footer />
    </>
  );
}
