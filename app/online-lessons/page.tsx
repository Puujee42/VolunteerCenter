"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import React, { useState, useMemo } from "react";
import { FaBook, FaSearch, FaLayerGroup, FaSignal, FaArrowRight, FaSearchMinus, FaClock } from "react-icons/fa";
import Link from "next/link";
import Footer from "../components/Footer";
import Image from "next/image"; // Use next/image for optimized images

// --- Bilingual Data Store (structure remains the same) ---
const lessonsData = {
  mn: {
    heroTitle: "Цахим хичээлүүд",
    heroBreadcrumb: "Нүүр хуудас",
    subtitle: "Ур чадвараа хөгжүүлж, мэдлэгээ тэлэхэд зориулсан интерактив хичээлүүд.",
    filterLabels: {
      search: "Хичээлийн нэрээр хайх...",
      category: "Ангилал сонгох",
      allCategories: "Бүх ангилал",
      difficulty: "Түвшин сонгох",
      allDifficulties: "Бүх түвшин",
    },
    viewButton: "Хичээл эхлүүлэх",
    emptyState: {
      title: "Хичээл олдсонгүй",
      message: "Хайлтын шалгуураа өөрчилж дахин оролдоно уу.",
    },
    difficulties: { beginner: "Анхан шат", intermediate: "Дунд шат", advanced: "Ахисан шат" },
    lessons: [
      { id: 1, title: "Volunteer Management 101", description: "Learn the fundamentals of leading teams and organizing projects effectively.", category: "Management", duration: "45 min", difficulty: "intermediate", thumbnail: "/data.jpg", href: "#" },
      { id: 2, title: "Child Protection Policies", description: "Essential ethics and safety protocols for working with children.", category: "Safety", duration: "60 min", difficulty: "beginner", thumbnail: "/data.jpg", href: "#" },
      { id: 3, title: "Public Speaking & Outreach", description: "Build confidence and skills for effective community communication.", category: "Communication", duration: "30 min", difficulty: "beginner", thumbnail: "/data.jpg", href: "#" },
      { id: 4, title: "Advanced Project Grant Writing", description: "Master the art of securing funding for your volunteer initiatives.", category: "Management", duration: "90 min", difficulty: "advanced", thumbnail: "/data.jpg", href: "#" },
    ],
  },
  en: {
    heroTitle: "Online Lessons",
    heroBreadcrumb: "Home",
    subtitle: "A curated collection of interactive lessons to help you build skills and expand your knowledge.",
    filterLabels: {
      search: "Search by lesson title...",
      category: "Select category",
      allCategories: "All Categories",
      difficulty: "Select difficulty",
      allDifficulties: "All Difficulties",
    },
    viewButton: "Start Lesson",
    emptyState: {
      title: "No Lessons Found",
      message: "Try adjusting your search filters to find what you're looking for.",
    },
    difficulties: { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
    lessons: [
      { id: 1, title: "Volunteer Management 101", description: "Learn the fundamentals of leading teams and organizing projects effectively.", category: "Management", duration: "45 min", difficulty: "intermediate", thumbnail: "/data.jpg", href: "#" },
      { id: 2, title: "Child Protection Policies", description: "Essential ethics and safety protocols for working with children.", category: "Safety", duration: "60 min", difficulty: "beginner", thumbnail: "/data.jpg", href: "#" },
      { id: 3, title: "Public Speaking & Outreach", description: "Build confidence and skills for effective community communication.", category: "Communication", duration: "30 min", difficulty: "beginner", thumbnail: "/data.jpg", href: "#" },
      { id: 4, title: "Advanced Project Grant Writing", description: "Master the art of securing funding for your volunteer initiatives.", category: "Management", duration: "90 min", difficulty: "advanced", thumbnail: "/data.jpg", href: "#" },
    ],
  },
};

// --- Main Online Lessons Page Component ---
const OnlineLessonsPage = () => {
    const { language } = useLanguage();
    const t = lessonsData[language];

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    
    const categories = useMemo(() => Array.from(new Set(lessonsData.en.lessons.map(l => l.category))), []);
    const mnCategories = useMemo(() => Array.from(new Set(lessonsData.mn.lessons.map(l => l.category))), []);
    const difficulties = useMemo(() => Array.from(new Set(lessonsData.en.lessons.map(l => l.difficulty))), []);

    const filteredLessons = useMemo(() => t.lessons.filter(lesson => 
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!selectedCategory || lesson.category === selectedCategory) &&
        (!selectedDifficulty || lesson.difficulty === selectedDifficulty)
    ), [t.lessons, searchTerm, selectedCategory, selectedDifficulty]);

  return (
    <div className="bg-white">
      <LessonsHero t={t} />
      <section className="py-24 relative">
        {/* Subtle Dot Grid Background */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:2rem_2rem]"></div>
        
        <div className="container px-4 mx-auto max-w-7xl relative z-10">
            <ControlHeader 
                t={t}
                categories={language === 'mn' ? mnCategories : categories}
                difficulties={difficulties}
                setSearchTerm={setSearchTerm}
                setSelectedCategory={setSelectedCategory}
                setSelectedDifficulty={setSelectedDifficulty}
            />
            {filteredLessons.length > 0 ? (
                <motion.div
                    key={searchTerm + selectedCategory + selectedDifficulty}
                    initial="hidden"
                    animate="visible"
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {filteredLessons.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} t={t} />)}
                </motion.div>
            ) : (
                <EmptyState t={t.emptyState} />
            )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

// --- Sub-Components ---

const LessonsHero: React.FC<{ t: any }> = ({ t }) => (
  <div className="relative py-20 bg-slate-50 border-b border-slate-200">
    <div className="container mx-auto max-w-7xl px-4 text-center">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="text-5xl md:text-6xl font-bold mb-2 text-slate-800">{t.heroTitle}</motion.h1>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }} className="text-lg text-slate-500">{t.heroBreadcrumb} / {t.heroTitle}</motion.p>
    </div>
  </div>
);

const ControlHeader: React.FC<any> = ({ t, categories, difficulties, setSearchTerm, setSelectedCategory, setSelectedDifficulty }) => (
    <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }} className="bg-white rounded-xl p-4 border border-slate-200 shadow-lg flex flex-col md:flex-row items-center gap-4 mb-16">
        <div className="relative w-full md:flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder={t.filterLabels.search} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-100 border border-slate-300 rounded-lg py-2.5 pl-12 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
        </div>
        <div className="relative w-full md:w-auto">
            <FaLayerGroup className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <select onChange={(e) => setSelectedCategory(e.target.value)} className="appearance-none w-full md:w-56 bg-slate-100 border border-slate-300 rounded-lg py-2.5 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                <option value="">{t.filterLabels.allCategories}</option>
                {categories.map((cat: string) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
        </div>
        <div className="relative w-full md:w-auto">
            <FaSignal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <select onChange={(e) => setSelectedDifficulty(e.target.value)} className="appearance-none w-full md:w-56 bg-slate-100 border border-slate-300 rounded-lg py-2.5 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                <option value="">{t.filterLabels.allDifficulties}</option>
                {difficulties.map((diff: string) => <option key={diff} value={diff}>{t.difficulties[diff]}</option>)}
            </select>
        </div>
    </motion.div>
);

const LessonCard: React.FC<{ lesson: any, t: any }> = ({ lesson, t }) => {
    const difficultyColors: { [key: string]: string } = {
        beginner: "bg-green-100 text-green-800",
        intermediate: "bg-yellow-100 text-yellow-800",
        advanced: "bg-red-100 text-red-800",
    };

    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="group bg-white rounded-2xl h-full flex flex-col border border-slate-200 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
        >
            <div className="relative h-48 w-full overflow-hidden">
                <Image src={lesson.thumbnail} alt={lesson.title} layout="fill" objectFit="cover" className="group-hover:scale-105 transition-transform duration-500"/>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-semibold text-blue-600">{lesson.category}</p>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${difficultyColors[lesson.difficulty]}`}>{t.difficulties[lesson.difficulty]}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 flex-grow">{lesson.title}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-4 pt-4 border-t border-slate-200">
                    <FaClock /> <span>{lesson.duration}</span>
                </div>
            </div>
            <div className="p-6 pt-0">
                <Link href={lesson.href} className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300">
                    {t.viewButton} <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
};

const EmptyState: React.FC<{ t: any }> = ({ t }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20 text-slate-800">
        <FaSearchMinus className="text-6xl text-slate-400 mx-auto mb-6" />
        <h3 className="text-2xl font-bold mb-2">{t.title}</h3>
        <p className="text-slate-500">{t.message}</p>
    </motion.div>
);

export default OnlineLessonsPage;