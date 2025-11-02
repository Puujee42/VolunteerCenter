"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight
} from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import LanguageToggle from "./LanguageToggle";

// --- Enriched Bilingual Data ---
const activities = [
  {
    id: 1,
    category: { mn: "Олон нийт", en: "Community" },
    title: { mn: "Хүүхдийн Цэцэрлэгт Ханын Зураг Зурах", en: "Painting Walls at a Local Kindergarten" },
    desc: { mn: "Бид хүүхдүүдийн тоглоомын талбайг өнгөөр дүүргэж, тэдний инээмсэглэлийг бэлэглэлээ.", en: "We filled the children's learning space with vibrant colors, bringing creativity and joy to their daily lives." },
    date: new Date("2025-11-15"),
    location: { mn: "Улаанбаатар, Баянгол", en: "Ulaanbaatar, Bayangol" },
    image: "/pic1.png",
  },
  {
    id: 2,
    category: { mn: "Байгаль орчин", en: "Environment" },
    title: { mn: "Ойн Тариалалт – Ногоон Монгол", en: "Tree Planting for a Green Mongolia" },
    desc: { mn: "500 гаруй мод тарьж, ирээдүйн ногоон ирээдүйд хувь нэмрээ орууллаа. Та ч гэсэн бидэнтэй нэгдээрэй!", en: "We planted over 500 saplings, making a lasting contribution to a greener future. Join our next eco-initiative!" },
    date: new Date("2025-10-28"),
    location: { mn: "Төв аймаг, Зуунмод", en: "Tuv Province, Zuunmod" },
    image: "/girl.png",
  },
  {
    id: 3,
    category: { mn: "Нийгмийн халамж", en: "Social Care" },
    title: { mn: "Ахмадын Гэрт Хайр Түгээе", en: "Bringing Joy to Elderly Homes" },
    desc: { mn: "Ахмадуудын гэрт дулаан, хайр, хоол хүргэж, үнэ цэнэтэй мөчүүдийг хамтдаа өнгөрөөлөө.", en: "Delivered warmth, companionship, and essential supplies to the elderly, sharing precious moments together." },
    date: new Date("2025-10-20"),
    location: { mn: "Улаанбаатар, Сүхбаатар", en: "Ulaanbaatar, Sukhbaatar" },
    image: "/vol.png",
  },
];

const AUTOPLAY_DURATION = 7000; // 7 seconds for a more cinematic feel

/* ────────────────────── Main Hero Slider Component ────────────────────── */
const HeadSlider = () => {
  const { language } = useLanguage();
  const [slideIndex, setSlideIndex] = useState(0);
  const t = (obj: any) => obj[language];
  const timeoutRef = useRef<any>(null);

  const startAutoplay = () => {
    timeoutRef.current = setTimeout(() => {
        setSlideIndex((prevIndex) => (prevIndex + 1) % activities.length);
    }, AUTOPLAY_DURATION);
  }

  useEffect(() => {
    startAutoplay();
    return () => clearTimeout(timeoutRef.current);
  }, [slideIndex]);

  const goToSlide = (index: number) => {
    clearTimeout(timeoutRef.current);
    setSlideIndex(index);
  };
  
  const activeSlide = activities[slideIndex];

  return (
    <section className="relative h-screen min-h-[700px] bg-slate-900 text-white flex items-center justify-center overflow-hidden">
        <div className="absolute top-6 right-6 z-30">
          <LanguageToggle />
        </div>
        
        {/* Background Images */}
        <AnimatePresence>
            <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, scale: 1.15 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 1.5, ease: [0.42, 0, 0.58, 1] } }}
                exit={{ opacity: 0, transition: { duration: 1, ease: "easeOut" } }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${activeSlide.image})` }}
            />
        </AnimatePresence>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />

        <div className="relative z-10 container mx-auto px-4 max-w-7xl w-full grid grid-cols-12 items-center">
            {/* Left Column: Slide Content */}
            <div className="col-span-12 lg:col-span-7">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSlide.id}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0 }}
                        variants={{ visible: { transition: { staggerChildren: 0.1 }}}}
                        className="max-w-xl text-left"
                    >
                        <motion.p variants={itemVariants} className="mb-4 text-lg font-semibold text-violet-300 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full inline-block">{t(activeSlide.category)}</motion.p>
                        
                        <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-black leading-tight mb-6">
                            {/* Staggered title animation */}
                            <AnimatePresence>
                              {t(activeSlide.title).split(" ").map((word: string, i: number) => (
                                <motion.span key={i} variants={{hidden: {opacity: 0, y: 20}, visible: {opacity: 1, y: 0}}} className="inline-block mr-4">
                                  {word}
                                </motion.span>
                              ))}
                            </AnimatePresence>
                        </motion.h1>
                        
                        <motion.p variants={itemVariants} className="text-lg text-slate-200 mb-8 max-w-lg">{t(activeSlide.desc)}</motion.p>
                        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-300 mb-10">
                            <span className="flex items-center gap-2"><FaCalendarAlt /> {format(activeSlide.date, "yyyy.MM.dd")}</span>
                            <span className="flex items-center gap-2"><FaMapMarkerAlt /> {t(activeSlide.location)}</span>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <ShinyButton link={`/events/${activeSlide.id}`} text={language === "mn" ? "Дэлгэрэнгүй" : "Learn More"} />
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>
             {/* Right Column: Navigation */}
             <div className="hidden lg:block col-span-5">
                <VerticalPagination items={activities} currentIndex={slideIndex} onSelect={goToSlide} language={language} />
             </div>
        </div>

        {/* Bottom Nav for mobile */}
        <div className="lg:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
             {activities.map((_, index) => (
              <button key={index} onClick={() => goToSlide(index)} className={`w-10 h-1 rounded-full ${index === slideIndex ? 'bg-violet-400' : 'bg-white/20'}`}></button>
            ))}
        </div>
    </section>
  );
};

/* ────────────────────── Sub-Components ────────────────────── */
const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const ShinyButton: React.FC<{link: string, text: string}> = ({link, text}) => (
   <Link href={link}>
     <motion.button 
        whileHover="hover"
        className="relative group inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-lg shadow-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-violet-500/40"
     >
       <motion.span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent" variants={{hover: { left: "100%", transition: { duration: 0.7, ease: "easeInOut" }}}} />
       {text}
       <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
     </motion.button>
   </Link>
)

const VerticalPagination: React.FC<{ items: any[], currentIndex: number, onSelect: (index: number) => void, language: 'mn' | 'en' }> = ({ items, currentIndex, onSelect, language }) => (
    <div className="flex flex-col gap-4 items-end">
        {items.map((item, index) => (
            <button key={item.id} onClick={() => onSelect(index)} className="group text-right">
                <p className={`font-bold text-lg transition-colors ${index === currentIndex ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                    0{index + 1}
                </p>
                <p className={`text-sm transition-colors ${index === currentIndex ? 'text-violet-300' : 'text-slate-500 group-hover:text-slate-300'}`}>
                    {item.category[language]}
                </p>
                <div className="mt-2 w-full h-1 bg-white/20 rounded-full overflow-hidden">
                   <motion.div
                    className="h-full bg-gradient-to-r from-violet-400 to-purple-400"
                    initial={{ width: "0%" }}
                    animate={{ width: index === currentIndex ? "100%" : "0%" }}
                    transition={index === currentIndex ? { duration: AUTOPLAY_DURATION / 1000, ease: "linear" } : { duration: 0.5 }}
                />
                </div>
            </button>
        ))}
    </div>
);


export default HeadSlider;