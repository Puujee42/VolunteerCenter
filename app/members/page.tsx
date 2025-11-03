// app/introduction/page.tsx
import Footer from "../components/Footer";
import GreetingsSection from "../components/GreetingSection";
import IntroductionSection from "../components/IntroducesSection"; // Adjust if your component path is different
import Members from "../components/Members";
import Layout from "../layout";
export default function IntroductionPage() {
  return (
    <>
        <Members />
    </>
  );
}

export const metadata = {
  title: "Introduction | Volunteering Web",
  description: "Learn more about our mission and founder.",
};