import Image from "next/image";
import Hero from "./components/Hero";
import HeadSlider from "./components/HeadSlider";
import StatsAndEvents from "./components/StatsAndEvents";
import TeamSection from "./components/TeamSection";
import PartnersSection from "./components/PartnersSection";
import Footer from "./components/Footer";
export default function Home() {
  return (
    <>
      <HeadSlider />
      <Hero />
      <StatsAndEvents />
      <TeamSection />
      <PartnersSection />
      <Footer />
    </>
  );
}
