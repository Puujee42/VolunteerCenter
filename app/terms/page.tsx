"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import React, { useState } from "react";
import Footer from "../components/Footer";

// --- Bilingual Data Store ---
// The Mongolian text is from your prompt. The English text is a professional translation.
const termsData = {
  mn: {
    heroTitle: "Үйлчилгээний нөхцөл",
    effectiveDate: "Хүчин төгөлдөр болсон огноо: 2025 оны 11 сарын 1",
    sections: [
      {
        id: "introduction",
        title: "Бидний үүрэг",
        content: "Монгол Улсын нийт хүн амын 33 хувийг 0-18 насны хүүхэд, гуравны нэгийг 18-35 насны залуус, 800.0 мянга гаруй гэр бүл эзэлж байна. Гэр бүл, хүүхэд, залуучуудын хөгжлийн газар нь эдгээр иргэдэд чиглэсэн төрийн бодлогыг хэрэгжүүлэх нэр хүндтэй, хариуцлагатай үүргийг гүйцэтгэн ажиллаж байна.",
      },
      {
        id: "policy-level",
        title: "Бодлогын түвшин",
        content: "Анх удаа төрөөс гэр бүл, залуучуудын асуудлыг бодлогын түвшинд оруулж ирсэн онцгой цаг үед бид нийгмийн хөгжлийн үндэс суурь болох гэр бүл, хүүхэд, залуучуудын чиглэлээрх хууль тогтоомж, бодлого шийдвэрийг үр дүнтэй хэрэгжүүлэх, сайжруулахад онцгой анхаарч байна.",
      },
      {
        id: "organization-structure",
        title: "Байгууллагын бүтэц",
        content: "Манай байгууллага нь үндэсний хэмжээнд аймаг, нийслэлийн газар, хэлтэс, харьяа “Өнөр бүл” хүүхдийн төв, Олон улсын хүүхдийн “Найрамдал” цогцолбор, Хүүхдийн тусламжийн 108 утасны үйлчилгээний төв зэрэг бүтэцтэйгээр 1004 албан хаагчтайгаар бодлогын хэрэгжилтийг хангаж байна.",
      },
      {
        id: "collaboration",
        title: "Хамтын ажиллагаа",
        content: "Бид төрийн бодлого хэрэгжүүлэхдээ олон улсын байгууллага, иргэн, аж ахуйн нэгж, салбар дундын хамтын ажиллагааг зохицуулах, хамтран ажиллах чиглэлээр хариуцлагатай ажиллаж ирсэн бөгөөд бидний үүд хаалга үргэлж нээлттэй байх болно.",
      },
      {
        id: "our-goal",
        title: "Бидний зорилго",
        content: "Хүүхдийн оюун санааны өв тэгш, эрүүл байдал, нийгэмшихүйн асуудалд анхаарч, тэднийг хүсэл тэмүүлэлтэй, хариуцлагатай, бүтээлч, хүнлэг, ёс зүйтэй, үндэсний өв соёлоо дээдэлдэг Монгол хүн болгон төлөвшүүлэх чиглэлээр ажиллана.",
      },
      {
        id: "user-participation",
        title: "Таны оролцоо",
        content: "Энэхүү зорилгод хүрэхийн тулд олон улсын туршлагаас судалж, Монгол ахуйтайгаа уялдуулан хэрэгжүүлэхэд таны оролцоо чухал юм. Иймд хүн бүрийн тус, дэмжлэгээр гэрэл гэгээтэй нийгмийг хамтдаа бүтээж чадна гэдэгт итгэлтэй байна.",
      },
    ],
  },
  en: {
    heroTitle: "Terms of Service",
    effectiveDate: "Effective Date: November 1, 2025",
    sections: [
      {
        id: "introduction",
        title: "Our Mandate",
        content: "Statistics show that 33% of Mongolia's total population are children aged 0-18, one-third are youth aged 18-35, and there are over 800,000 families. The Agency for Family, Child, and Youth Development is honored to carry the responsible duty of implementing state policies aimed at these citizens.",
      },
      {
        id: "policy-level",
        title: "Policy-Level Commitment",
        content: "At this unique time, when the state has brought family and youth issues to the policy level for the first time, we are paying special attention to effectively implementing and improving laws, national programs, and policy decisions concerning families, children, and youth—the three pillars of our society's foundation.",
      },
      {
        id: "organization-structure",
        title: "Organizational Structure",
        content: "Our organization ensures policy implementation with 1,004 employees nationwide, through a structure that includes provincial and capital city departments, the 'Onor Bul' children's center, the 'Nairamdal' international children's complex, and the Child Helpline 108 service center.",
      },
      {
        id: "collaboration",
        title: "Collaboration and Partnerships",
        content: "In implementing state policy, we have responsibly worked to coordinate and collaborate with international organizations, citizens, business entities, and across sectors. Our doors are always open for partnership in creating positive social change.",
      },
      {
        id: "our-goal",
        title: "Our Goal",
        content: "We focus on the intellectual, spiritual, and social well-being of children, aiming to raise them to be aspirational, responsible, creative, humane, ethical individuals who honor and preserve their national heritage and traditions.",
      },
      {
        id: "user-participation",
        title: "Your Participation",
        content: "To achieve this goal, your participation is crucial as we study international trends and adapt them to our unique Mongolian context. We are confident that with the support and involvement of every responsible citizen, we can create a brighter society together.",
      },
    ],
  },
};

// --- Main Terms Page Component ---
const TermsPage = () => {
  const { language } = useLanguage();
  const t = termsData[language];
  const [activeSection, setActiveSection] = useState(t.sections[0].id);

  return (
    <>
      <PolicyHero t={t} />
      <section className="py-24 bg-slate-50">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* --- Left Column: Sticky Navigation --- */}
            <aside className="lg:col-span-1">
              <div className="sticky top-28">
                <PolicyNav sections={t.sections} activeSection={activeSection} />
              </div>
            </aside>

            {/* --- Right Column: Policy Content --- */}
            <main className="lg:col-span-3">
              <div className="prose prose-lg max-w-none prose-h2:font-bold prose-h2:text-slate-800 prose-p:text-slate-600 prose-a:text-blue-600 prose-headings:scroll-mt-24">
                {t.sections.map((section) => (
                  <motion.section
                    key={section.id}
                    id={section.id}
                    className="mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    onViewportEnter={() => setActiveSection(section.id)}
                    viewport={{ amount: 0.3, once: false }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <h2>{section.title}</h2>
                    <p>{section.content}</p>
                  </motion.section>
                ))}
              </div>
            </main>

          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};


// --- Sub-Components ---

const PolicyHero: React.FC<{ t: any }> = ({ t }) => (
  <div className="py-20 bg-white border-b border-slate-200">
    <div className="container px-4 mx-auto max-w-6xl text-center">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
        {t.heroTitle}
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-md text-slate-500">
        {t.effectiveDate}
      </motion.p>
    </div>
  </div>
);

const PolicyNav: React.FC<{ sections: any[], activeSection: string }> = ({ sections, activeSection }) => (
    <ul className="space-y-1 border-l-2 border-slate-200">
        {sections.map(section => (
            <li key={section.id}>
                <a 
                    href={`#${section.id}`}
                    className={`block relative pl-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                        activeSection === section.id 
                        ? 'text-blue-600' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                    {activeSection === section.id && (
                        <motion.div 
                            layoutId="active-section-indicator"
                            className="absolute -left-0.5 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full"
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        />
                    )}
                    {section.title}
                </a>
            </li>
        ))}
    </ul>
);

export default TermsPage;