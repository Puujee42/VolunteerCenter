import Image from "next/image";
import Layout from "./layout";
import Hero from "./components/Hero";
import HeadSlider from "./components/HeadSlider";
import Footer from "./components/Footer";
import StatsAndEvents from "./components/StatsAndEvents";
import TeamSection from "./components/TeamSection";
import PartnersSection from "./components/PartnersSection";
export default function Home() {
  return (
    <>
    <Layout>
      <HeadSlider />
      <Hero />
      <StatsAndEvents />
      <TeamSection />
      <PartnersSection />
    </Layout>
    <Footer />
    </>
  );
}
