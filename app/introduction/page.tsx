// app/introduction/page.tsx
import Footer from "../components/Footer";
import IntroductionSection from "../components/IntroducesSection"; // Adjust if your component path is different
export default function IntroductionPage() {
  return (
    <>
      <IntroductionSection />
      <Footer />
    </>
  );
}

export const metadata = {
  title: "Introduction | Volunteering Web",
  description: "Learn more about our mission and founder.",
};
