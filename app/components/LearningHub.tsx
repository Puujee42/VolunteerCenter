"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import React from "react";
import Link from "next/link";
import Image from "next/image"; // Use next/image for optimized images
import { FaChalkboardTeacher, FaPodcast, FaVideo, FaArrowRight } from "react-icons/fa";

// --- Bilingual Data Store (structure remains the same) ---
const learningHubData = {
  mn: {
    heroTitle: "Мэдлэгийн Төв",
    heroSubtitle: "Ур чадвараa хөгжүүлж, дэлхийг өөрчлөхөд тань туслах нөөцүүд.",
    categories: [
      {
        icon: FaChalkboardTeacher,
        title: "Цахим хичээл",
        tagline: "Алхам алхмаар суралц",
        description: "Интерактив сургалтууд, гарын авлага, хичээлүүд.",
        image: "/data.jpg",
        href: "/online-lessons",
        cta: "Хичээлүүд үзэх",
      },
      {
        icon: FaPodcast,
        title: "Подкастууд",
        tagline: "Сонсоод урам зориг ав",
        description: "Мэргэжилтнүүдийн яриа, урам зориг өгөх түүхүүд.",
        image: "/data.jpg",
        href: "/podcasts",
        cta: "Подкастууд сонсох",
      },
      {
        icon: FaVideo,
        title: "Видео Сан",
        tagline: "Хараад суралц",
        description: "Сургалтын видео, вебинар, арга хэмжээний бичлэгүүд.",
        image: "/data.jpg",
        href: "/videos",
        cta: "Видео үзэх",
      },
    ],
  },
  en: {
    heroTitle: "The Learning Hub",
    heroSubtitle: "Resources to build your skills and empower you to make a difference.",
    categories: [
      {
        icon: FaChalkboardTeacher,
        title: "Online Courses",
        tagline: "Step-by-step learning",
        description: "Interactive lessons, guides, and structured tutorials.",
        image: "/data.jpg",
        href: "/online-lessons",
        cta: "Explore Courses",
      },
      {
        icon: FaPodcast,
        title: "Podcasts",
        tagline: "Listen & get inspired",
        description: "Engaging talks with experts and powerful real-world stories.",
        image: "/data.jpg",
        href: "/podcasts",
        cta: "Start Listening",
      },
      {
        icon: FaVideo,
        title: "Video Library",
        tagline: "Watch & learn",
        description: "Visual tutorials, past webinars, and event recordings.",
        image: "/data.jpg",
        href: "/videos",
        cta: "Browse Videos",
      },
    ],
  },
};

// --- Main Learning Hub Component ---
const LearningHub = () => {
  const { language } = useLanguage();
  const t = learningHubData[language];

  const featuredCategory = t.categories[0];
  const shelfCategories = t.categories.slice(1);

  return (
    <section className="py-24 bg-white relative">
        {/* Subtle Dot Grid Background */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:2rem_2rem]"></div>
      
      <div className="container px-4 mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">
            {t.heroTitle}
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">{t.heroSubtitle}</p>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}>
            <FeaturedCategoryCard category={featuredCategory} />
        </motion.div>
        
        <div className="mt-12 md:mt-16">
             <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
                {shelfCategories.map((category) => (
                    <ShelfCategoryCard key={category.title} category={category} />
                ))}
            </motion.div>
        </div>
      </div>
    </section>
  );
};


// --- Sub-Components ---
interface Category {
  icon: React.ElementType;
  title: string;
  tagline: string;
  description: string;
  image: string;
  href: string;
  cta: string;
}

const FeaturedCategoryCard: React.FC<{ category: Category }> = ({ category }) => {
    const { icon: Icon, title, tagline, description, image, href, cta } = category;
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-8 md:p-12 order-2 lg:order-1">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                        <Icon className="text-3xl" />
                    </div>
                    <div>
                        <p className="font-semibold text-blue-600">{tagline}</p>
                        <h2 className="text-4xl font-bold text-slate-800">{title}</h2>
                    </div>
                </div>
                 <p className="text-slate-600 max-w-lg mb-8 text-lg leading-relaxed">{description}</p>
                 <Link href={href} className="group inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-blue-600 text-white font-bold text-lg shadow-lg hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-1">
                    {cta} <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                 </Link>
            </div>
            <div className="relative h-64 lg:h-full min-h-[350px] order-1 lg:order-2">
                 <Image src={image} alt={title} layout="fill" objectFit="cover" />
            </div>
        </div>
    );
};

const ShelfCategoryCard: React.FC<{ category: Category }> = ({ category }) => {
  const { icon: Icon, title, tagline, description, image, href, cta } = category;

  return (
    <motion.div
        variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Link href={href} className="group block relative h-80 rounded-2xl overflow-hidden shadow-xl border border-slate-200">
          <Image src={image} alt={title} layout="fill" objectFit="cover" className="transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          
          <div className="relative h-full flex flex-col justify-end p-6 text-white overflow-hidden">
            <div className="transform transition-transform duration-500 ease-in-out group-hover:-translate-y-16">
                <div className="flex items-center gap-3 mb-2">
                    <Icon className="text-2xl text-cyan-300" />
                    <h3 className="text-2xl font-bold">{title}</h3>
                </div>
                <p className="text-slate-300">{tagline}</p>
            </div>
            
            <div className="absolute bottom-0 left-0 p-6 opacity-0 transform translate-y-8 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:translate-y-0">
                <p className="text-slate-200 mb-4">{description}</p>
                 <div className="inline-flex items-center gap-2 font-bold text-cyan-300">
                    {cta} <FaArrowRight />
                </div>
            </div>
          </div>
      </Link>
    </motion.div>
  );
};


export default LearningHub;