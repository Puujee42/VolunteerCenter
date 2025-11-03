// app/introduction/page.tsx
import CoursesSection from "../components/CoursesSection";
import Footer from "../components/Footer";
import IntroductionSection from "../components/IntroducesSection"; // Adjust if your component path is different
import News from "../components/News";
import Layout from "../layout";
export default function IntroductionPage() {
  return (
    <>
        <News/>
    </>
  );
}

export const metadata = {
  title: "Introduction | Volunteering Web",
  description: "Learn more about our mission and founder.",
};