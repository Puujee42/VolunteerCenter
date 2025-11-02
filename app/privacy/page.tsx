"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import React, { useState } from "react";
import Footer from "../components/Footer";

// --- Bilingual Data Store ---
const privacyData = {
  mn: {
    heroTitle: "Нууцлалын бодлого",
    lastUpdated: "Сүүлд шинэчилсэн: 2025 оны 11 сарын 1",
    sections: [
      {
        id: "introduction",
        title: "Оршил",
        content: "Энэхүү Нууцлалын бодлого нь таны мэдээллийг хэрхэн цуглуулж, ашиглаж, хамгаалдгийг тайлбарлана. Манай үйлчилгээг ашигласнаар та энэхүү бодлогыг зөвшөөрч байна.",
      },
      {
        id: "info-collection",
        title: "Бидний цуглуулдаг мэдээлэл",
        content: "Бид таныг бүртгүүлэх, хандив өгөх, эсвэл бидэнтэй холбоо барих үед нэр, имэйл хаяг зэрэг хувийн мэдээллийг цуглуулдаг. Мөн вэбсайтын ашиглалтын талаарх техникийн мэдээллийg автоматаар цуглуулж болно.",
      },
      {
        id: "info-use",
        title: "Мэдээллийн ашиглалт",
        content: "Таны мэдээллийг үйлчилгээ үзүүлэх, харилцаа холбоог сайжруулах, сайн дурын ажлын боломжуудыг санал болгох зорилгоор ашигладаг. Бид таны мэдээллийг таны зөвшөөрөлгүйгээр гуравдагч этгээдэд худалдахгүй.",
      },
      {
        id: "data-security",
        title: "Мэдээллийн аюулгүй байдал",
        content: "Бид таны хувийн мэдээллийг хамгаалахын тулд салбарын стандарт аюулгүй байдлын арга хэмжээг ашигладаг. Гэсэн хэдий ч, интернэтээр дамжуулах ямар ч арга 100% аюулгүй биш юм.",
      },
      {
        id: "your-rights",
        title: "Таны эрх",
        content: "Та өөрийн хувийн мэдээлэлд хандах, засварлах, устгах эрхтэй. Эдгээр эрхийг эдлэхийн тулд бидэнтэй холбогдоно уу.",
      },
      {
        id: "contact-us",
        title: "Бидэнтэй холбогдох",
        content: "Энэхүү Нууцлалын бодлогын талаар асуух зүйл байвал манай 'Холбоо барих' хуудсаар дамжуулан бидэнтэй холбогдоно уу.",
      },
    ],
  },
  en: {
    heroTitle: "Privacy Policy",
    lastUpdated: "Last Updated: November 1, 2025",
    sections: [
      {
        id: "introduction",
        title: "Introduction",
        content: "This Privacy Policy explains how we collect, use, and protect your information when you visit our website. By using our services, you agree to the collection and use of information in accordance with this policy.",
      },
      {
        id: "info-collection",
        title: "Information We Collect",
        content: "We collect personal identification information, such as your name and email address, when you register, donate, or otherwise interact with our services. We may also collect non-personal information, such as browser type and IP address, automatically.",
      },
      {
        id: "info-use",
        title: "How We Use Your Information",
        content: "Your information is used to provide and improve our services, to communicate with you about volunteer opportunities and updates, and to process your donations. We will not sell or rent your personal information to third parties without your consent.",
      },
      {
        id: "data-security",
        title: "Data Security",
        content: "We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure.",
      },
      {
        id: "your-rights",
        title: "Your Rights",
        content: "You have the right to access, update, or delete the information we have on you. You can exercise these rights by contacting us through the information provided below.",
      },
      {
        id: "contact-us",
        title: "Contact Us",
        content: "If you have any questions about this Privacy Policy, please contact us via our Contact Page. We are committed to protecting your privacy and will address any concerns you may have.",
      },
    ],
  },
};

// --- Main Privacy Page Component ---
const PrivacyPage = () => {
  const { language } = useLanguage();
  const t = privacyData[language];
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
                <h3 className="text-lg font-bold text-slate-800 mb-4">Sections</h3>
                <PolicyNav sections={t.sections} activeSection={activeSection} />
              </div>
            </aside>

            {/* --- Right Column: Policy Content --- */}
            <main className="lg:col-span-3">
              <div className="prose prose-lg max-w-none prose-h2:font-bold prose-h2:text-slate-800 prose-p:text-slate-600 prose-a:text-blue-600">
                {t.sections.map((section) => (
                  <motion.section
                    key={section.id}
                    id={section.id}
                    className="mb-12 scroll-mt-24"
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
        {t.lastUpdated}
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
                        />
                    )}
                    {section.title}
                </a>
            </li>
        ))}
    </ul>
);

export default PrivacyPage;