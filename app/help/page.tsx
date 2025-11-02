"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { FaSearch, FaChevronDown, FaQuestionCircle, FaHandsHelping, FaHeart, FaArrowRight, FaSearchMinus } from "react-icons/fa";
import Footer from "../components/Footer";

// --- Bilingual Data Store ---
const helpData = {
  mn: {
    heroTitle: "Танд хэрхэн туслах вэ?",
    heroSubtitle: "Түгээмэл асуултуудаас хайлт хийж, хариултаа олоорой.",
    searchPlaceholder: "Асуултаа энд бичнэ үү...",
    allCategories: "Бүгд",
    categories: {
      general: "Ерөнхий",
      volunteering: "Сайн дурын ажил",
      donations: "Хандив",
    },
    emptyState: { title: "Илэрц олдсонгүй", message: "Хайлтын шалгуураа өөрчилж дахин оролдоно уу." },
    ctaTitle: "Хариултаа олсонгүй юу?",
    ctaSubtitle: "Манай баг танд туслахад бэлэн байна. Бидэнтэй холбогдоорой.",
    ctaButton: "Холбоо барих",
    faqs: [
      { category: "general", q: "Volunteer.com гэж юу вэ?", a: "Энэ нь сайн дурынхныг олон нийтийн ажилд холбодог платформ юм." },
      { category: "volunteering", q: "Би хэрхэн сайн дурын ажилтан болох вэ?", a: "Манай 'Сайн дурын ажил' хуудас руу орж, сонирхсон ажлын байрандаа бүртгүүлээрэй." },
      { category: "donations", q: "Миний хандив хаана зарцуулагдах вэ?", a: "Таны хандив манай хөтөлбөрүүдийг дэмжихэд шууд зарцуулагдана." },
      { category: "volunteering", q: "Ямар нэгэн шаардлага байдаг уу?", a: "Ихэнх үйл ажиллагаанд тусгай ур чадвар шаардлагагүй, зөвхөн туслах чин сэтгэл байхад хангалттай." },
    ],
  },
  en: {
    heroTitle: "How can we help?",
    heroSubtitle: "Search our frequently asked questions to find what you're looking for.",
    searchPlaceholder: "Type your question here...",
    allCategories: "All",
    categories: {
      general: "General",
      volunteering: "Volunteering",
      donations: "Donations",
    },
    emptyState: { title: "No Results Found", message: "We couldn't find any matches for your search. Please try different keywords." },
    ctaTitle: "Still have questions?",
    ctaSubtitle: "Our team is here to help. Please don't hesitate to reach out to us directly.",
    ctaButton: "Contact Us",
    faqs: [
      { category: "general", q: "What is Volunteer.com?", a: "Volunteer.com is a platform that connects passionate volunteers with meaningful opportunities to serve the community." },
      { category: "volunteering", q: "How do I sign up to be a volunteer?", a: "Simply visit our 'Volunteer Work' page, browse the available opportunities, and fill out the enrollment form for the one that interests you." },
      { category: "donations", q: "Where does my donation go?", a: "100% of your donation goes directly towards funding our core programs in education, child protection, and community development." },
      { category: "volunteering", q: "Are there any specific skills required to volunteer?", a: "For most of our general events, no specific skills are required—just a willingness to help! Some specialized roles may have specific requirements listed in the description." },
      { category: "donations", q: "Is my donation tax-deductible?", a: "Yes, as a registered non-profit organization, all donations are fully tax-deductible. You will receive a receipt via email." },
    ],
  },
};

// --- Main Help Page Component ---
const HelpPage = () => {
  const { language } = useLanguage();
  const t = helpData[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredFaqs = useMemo(() => {
    return t.faqs.filter(faq =>
      (activeCategory === 'all' || faq.category === activeCategory) &&
      (faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || faq.a.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [t.faqs, activeCategory, searchTerm]);

  return (
    <>
      <HelpHero t={t} setSearchTerm={setSearchTerm} />
      <section className="py-24 bg-slate-50">
        <div className="container px-4 mx-auto max-w-4xl">
            {/* Category Filters */}
            <CategoryFilters t={t} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
            
            {/* FAQ List or Empty State */}
            {filteredFaqs.length > 0 ? (
                <motion.div layout className="space-y-4">
                    {filteredFaqs.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
                </motion.div>
            ) : (
                <EmptyState t={t.emptyState} />
            )}
        </div>
      </section>
      <HelpCta t={t} />
      <Footer />
    </>
  );
};

// --- Sub-Components ---

const HelpHero: React.FC<{ t: any, setSearchTerm: (term: string) => void }> = ({ t, setSearchTerm }) => (
    <div className="py-24 bg-white text-center">
        <div className="container px-4 mx-auto max-w-3xl">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {t.heroTitle}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-slate-600 mb-8">
                {t.heroSubtitle}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="relative max-w-2xl mx-auto">
                <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border-2 border-slate-200 rounded-full py-4 pl-14 pr-6 text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                />
            </motion.div>
        </div>
    </div>
);

const CategoryFilters: React.FC<{ t: any; activeCategory: string; setActiveCategory: (cat: string) => void }> = ({ t, activeCategory, setActiveCategory }) => {
    const categories = ['all', ...Object.keys(t.categories)];
    return (
        <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="relative px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
                >
                    {activeCategory === cat && <motion.div layoutId="category-pill" className="absolute inset-0 bg-blue-600 rounded-full" />}
                    <span className={`relative z-10 ${activeCategory === cat ? 'text-white' : 'text-slate-700 hover:text-blue-600'}`}>
                        {cat === 'all' ? t.allCategories : t.categories[cat]}
                    </span>
                </button>
            ))}
        </div>
    );
};

const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div layout className="border border-slate-200 rounded-lg bg-white overflow-hidden">
      <motion.button layout onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-5 font-semibold text-lg text-left text-slate-800">
        <span>{q}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><FaChevronDown className="text-blue-500" /></motion.div>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="prose text-slate-600 p-5 pt-0">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const EmptyState: React.FC<{ t: any }> = ({ t }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
        <FaSearchMinus className="text-6xl text-slate-400 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-slate-700 mb-2">{t.title}</h3>
        <p className="text-slate-500">{t.message}</p>
    </motion.div>
);

const HelpCta: React.FC<{ t: any }> = ({ t }) => (
    <section className="py-20 bg-white">
        <div className="container px-4 mx-auto max-w-4xl text-center">
             <div className="p-10 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                <h2 className="text-3xl font-bold text-slate-800 mb-4">{t.ctaTitle}</h2>
                <p className="text-lg text-slate-600 mb-8">{t.ctaSubtitle}</p>
                <Link href="/contact" className="group inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors">
                    {t.ctaButton} <FaArrowRight />
                </Link>
             </div>
        </div>
    </section>
);

export default HelpPage;