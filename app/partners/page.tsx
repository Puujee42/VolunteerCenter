"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaHandshake, FaArrowRight, FaGlobeAsia, FaBuilding } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext"; // Adjust path if needed
import Footer from "../components/Footer";

// --- Data Structure ---
const partnersPageData = {
  mn: {
    hero: {
      title: "Бидний Итгэлт Түншүүд",
      subtitle: "Сайн дурын үйлсийг дэмжигч, хамтран ажиллагч байгууллагууд",
      desc: "Бид нийгэмд эерэг өөрчлөлт авчрах зорилготой олон улсын болон дотоодын шилдэг байгууллагуудтай хамтран ажиллаж байгаадаа баяртай байна.",
    },
    categories: {
      intl: "Олон Улсын Байгууллагууд",
      nat: "Дотоодын Байгууллагууд & Төр",
    },
    cta: {
      title: "Бидэнтэй хамтран ажиллах",
      desc: "Танай байгууллага нийгмийн сайн сайхны төлөө хувь нэмрээ оруулахыг хүсч байна уу?",
      btn: "Холбогдох",
    },
  },
  en: {
    hero: {
      title: "Our Trusted Partners",
      subtitle: "Organizations supporting volunteerism and social impact",
      desc: "We are proud to collaborate with leading international and national organizations dedicated to driving positive change in our community.",
    },
    categories: {
      intl: "International Organizations",
      nat: "National Organizations & Government",
    },
    cta: {
      title: "Become a Partner",
      desc: "Does your organization want to contribute to the greater good of society?",
      btn: "Contact Us",
    },
  },
};

// Mock Data - Combine with your real logos
const partnersList = [
  // International
  { name: "World Vision", logo: "/world-vision.png", type: "intl" },
  { name: "Peace Corps", logo: "/peace-corps.png", type: "intl" },
  { name: "Good Neighbors", logo: "/good-neighbors.png", type: "intl" },
  { name: "Caritas Czech", logo: "/caritas-czech.png", type: "intl" },
  { name: "Caritas Mongolia", logo: "/caritas-mongolia.png", type: "intl" },
  // National / Government
  { name: "MLSP", logo: "/mlsp.png", type: "nat" },
  { name: "Red Cross", logo: "/red-cross.png", type: "nat" },
];

export default function PartnersPage() {
  const { language } = useLanguage();
  const t = partnersPageData[language];

  // Filter partners
  const internationalPartners = partnersList.filter(p => p.type === "intl");
  const nationalPartners = partnersList.filter(p => p.type === "nat");

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <main className="bg-slate-50 min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <section className="relative py-24 bg-teal-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">{t.hero.title}</h1>
            <p className="text-xl md:text-2xl text-teal-100 font-light mb-8">{t.hero.subtitle}</p>
            <p className="text-slate-300 leading-relaxed">{t.hero.desc}</p>
          </motion.div>
        </div>
      </section>

      {/* --- PARTNERS GRID --- */}
      <section className="py-20 px-4 container mx-auto max-w-6xl">
        
        {/* International Category */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-teal-100 text-teal-700 rounded-full"><FaGlobeAsia size={24} /></div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-800">{t.categories.intl}</h2>
            <div className="flex-1 h-px bg-slate-200 ml-4"></div>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {internationalPartners.map((partner, idx) => (
              <PartnerCard key={idx} partner={partner} variants={itemVariants} />
            ))}
          </motion.div>
        </div>

        {/* National Category */}
        <div>
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-teal-100 text-teal-700 rounded-full"><FaBuilding size={24} /></div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-800">{t.categories.nat}</h2>
            <div className="flex-1 h-px bg-slate-200 ml-4"></div>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {nationalPartners.map((partner, idx) => (
              <PartnerCard key={idx} partner={partner} variants={itemVariants} />
            ))}
          </motion.div>
        </div>

      </section>

      {/* --- BECOME A PARTNER CTA --- */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-slate-900 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl"
          >
            {/* Decorative circles */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-teal-600/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>

            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <FaHandshake className="text-6xl text-teal-400 mx-auto" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold">{t.cta.title}</h2>
              <p className="text-slate-300 text-lg">{t.cta.desc}</p>
              
              <Link href="/contact" className="inline-block">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-teal-500 hover:bg-teal-400 text-white font-bold py-4 px-10 rounded-full flex items-center gap-3 mx-auto transition-colors"
                >
                  {t.cta.btn} <FaArrowRight />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

// --- Sub-Component: Partner Card ---
function PartnerCard({ partner, variants }: { partner: { name: string; logo: string }; variants: any }) {
  return (
    <motion.div 
      variants={variants}
      className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-teal-100 transition-all duration-300 group flex items-center justify-center h-40 relative"
    >
      <div className="relative w-full h-full">
        <Image
          src={partner.logo}
          alt={partner.name}
          fill
          className="object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110"
        />
      </div>
    </motion.div>
  );
}