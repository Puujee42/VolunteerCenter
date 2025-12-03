// app/introduction/page.tsx
import AboutSection from "../components/AboutSection";
import Footer from "../components/Footer";
import Layout from "../layout";
export default function IntroductionPage() {
  return (
    <>
      <Layout>
        <AboutSection />
        <Footer />
      </Layout>
    </>
  );
}

export const metadata = {
  title: "Introduction | Volunteering Web",
  description: "Learn more about our mission and founder.",
};
