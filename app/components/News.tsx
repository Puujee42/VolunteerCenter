'use client';

import React, {useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useLanguage } from "../context/LanguageContext";

// --- Enhanced Bilingual Data ---
const newsContentData = {
  mn: {
    title: "Сүүлийн үеийн мэдээ",
    totalNewsText: (count) => `Нийт ${count} мэдээлэл байна`,
    readMore: "Дэлгэрэнгүй",
    prevButton: "Өмнөх",
    nextButton: "Дараах",
  },
  en: {
    title: "Latest News & Updates",
    totalNewsText: (count) => `Showing ${count} total articles`,
    readMore: "Read More",
    prevButton: "Previous",
    nextButton: "Next",
  }
};

interface NewsItem {
  id: string;
  date: string;
  imageUrl: string;
  link: string;
  category: { mn: string; en: string };
  title: { mn:string; en: string };
}

const bilingualMockNewsData: NewsItem[] = [
    { id: 'hackathon-2022', date: '2022-05-09', category: { mn: "Тэмцээн", en: "Competition" }, title: { mn: 'HACKATHON 2022', en: 'HACKATHON 2022' }, imageUrl: '/data.jpg', link: '/news/hackathon-2022' },
    { id: 'anti-addiction-campaign', date: '2022-04-14', category: { mn: "Аян", en: "Campaign" }, title: { mn: '“ХОРТ ЗУРШЛЫН ЭСРЭГ ХАМТДАА” АЯН', en: '"TOGETHER AGAINST BAD HABITS" Campaign' }, imageUrl: '/data.jpg', link: '/news/anti-addiction-campaign' },
    { id: 'youth-dev-training', date: '2022-04-13', category: { mn: "Сургалт", en: "Training" }, title: { mn: 'ЗАЛУУЧУУДЫН ЗӨВЛӨЛИЙГ ЧАДАВХЖУУЛАХ НЬ', en: 'Empowering the Youth Development Council' }, imageUrl: '/data.jpg', link: '/news/youth-development-training' },
    { id: 'umnugovi-council-meeting', date: '2022-02-24', category: { mn: "Орон нутаг", en: "Local News" }, title: { mn: 'ӨМНӨГОВЬ АЙМГИЙН ЗАЛУУЧУУДЫН ЗӨВЛӨЛ ХУРАЛДЛАА', en: 'Umnugovi Province Youth Council Meeting' }, imageUrl: '/data.jpg', link: '/news/umnugovi-council-meeting' },
    { id: 'top-100-awards', date: '2021-12-01', category: { mn: "Шагнал", en: "Awards" }, title: { mn: '"ШИЛДЭГ 100 ЗАЛУУ" ШАЛГАРУУЛАЛТ', en: '"TOP 100 YOUTH" Selection' }, imageUrl: '/data.jpg', link: '/news/top-100-youth-awards' },
    { id: 'khovd-council-awards', date: '2021-12-01', category: { mn: "Орон нутаг", en: "Local News" }, title: { mn: 'ХОВД АЙМГИЙН ШИЛДЭГ ЗӨВЛӨЛҮҮД', en: 'Best Councils of Khovd Province' }, imageUrl: '/data.jpg', link: '/news/khovd-council-awards' },
    { id: 'volunteer-initiative-ub', date: '2021-11-15', category: { mn: "Санаачилга", en: "Initiative" }, title: { mn: 'УЛААНБААТАР ХОТЫН ШИНЭ САНААЧИЛГА', en: 'New Volunteer Initiative in Ulaanbaatar' }, imageUrl: '/data.jpg', link: '/news/new-volunteer-initiative' },
];

const itemsPerPage = 5; // Adjusted for the magazine layout (1 large + 4 small)

// --- Main News Section Component ---
const News: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { language } = useLanguage();
  const t = newsContentData[language];

  const totalPages = Math.ceil(bilingualMockNewsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNews = bilingualMockNewsData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto max-w-7xl px-4">
        {/* --- Header --- */}
        <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">{t.title}</h1>
          <p className="text-lg text-gray-600">{t.totalNewsText(bilingualMockNewsData.length)}</p>
        </motion.div>

        {/* --- News Grid --- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { staggerChildren: 0.1 } }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {currentNews.map((item, index) =>
              // Render the first item as a large featured card
              index === 0 ? (
                <FeaturedNewsCard key={item.id} item={item} readMoreText={t.readMore} language={language} />
              ) : (
                <NewsCard key={item.id} item={item} readMoreText={t.readMore} language={language} />
              )
            )}
          </motion.div>
        </AnimatePresence>

        {/* --- Pagination Controls --- */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-4">
            <PaginationButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}><FaChevronLeft /></PaginationButton>
            <span className="font-semibold text-gray-700">Page {currentPage} of {totalPages}</span>
            <PaginationButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}><FaChevronRight /></PaginationButton>
          </div>
        )}
      </div>
    </section>
  );
};

// --- Sub-Components ---

interface CardProps {
  item: NewsItem;
  readMoreText: string;
  language: 'mn' | 'en';
}

const FeaturedNewsCard: React.FC<CardProps> = ({ item, readMoreText, language }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }}
      whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0, 71, 171, 0.2)' }}
      className="lg:col-span-2 lg:row-span-2 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col group cursor-pointer relative"
    >
      <img src={item.imageUrl} alt={item.title[language]} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="relative p-8 flex flex-col flex-grow justify-end text-white">
        <span className="mb-3 inline-block bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full">{item.category[language]}</span>
        <h3 className="text-3xl font-bold leading-tight mb-4">{item.title[language]}</h3>
        <div className="flex items-center gap-2 text-sm text-slate-200 mb-6">
          <FaCalendarAlt />
          <span>{item.date}</span>
        </div>
        <a href={item.link} className="inline-flex items-center gap-2 font-bold self-start bg-white text-blue-600 px-5 py-2.5 rounded-lg group-hover:bg-cyan-100 transition-all duration-300">
          {readMoreText} <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
    </motion.div>
  );
};

const NewsCard: React.FC<CardProps> = ({ item, readMoreText, language }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }}
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0, 71, 171, 0.15)' }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col group cursor-pointer"
    >
      <div className="overflow-hidden h-48"><img src={item.imageUrl} alt={item.title[language]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"/></div>
      <div className="p-6 flex flex-col flex-grow">
        <span className="mb-3 inline-block bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full self-start">{item.category[language]}</span>
        <h3 className="text-lg font-bold text-gray-800 leading-snug flex-grow mb-3">{item.title[language]}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-5"><FaCalendarAlt /> <span>{item.date}</span></div>
        <a href={item.link} className="mt-auto font-bold text-blue-600 group-hover:text-cyan-600 transition-colors duration-300 flex items-center gap-2">
          {readMoreText} <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
    </motion.div>
  );
};

const PaginationButton: React.FC<{ children: React.ReactNode; onClick: () => void; disabled: boolean; }> = ({ children, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center w-10 h-10 bg-white border-2 border-gray-300 rounded-full font-semibold text-gray-700 hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    >
      {children}
    </button>
  );
};

export default News;