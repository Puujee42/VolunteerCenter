"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext"; // Check your path
import Link from "next/link";
import Image from "next/image";
import { FaChalkboardTeacher, FaPodcast, FaVideo, FaArrowRight } from "react-icons/fa";

// --- Main Component ---
const LearningHub = () => {
  const { language } = useLanguage();
  
  // 1. State for dynamic counts from Database
  const [counts, setCounts] = useState({ lessons: 0, podcasts: 0, videos: 0 });
  const [loading, setLoading] = useState(true);

  // 2. Fetch data from your APIs
  useEffect(() => {
    async function fetchHubData() {
      try {
        const [lessonsRes, podcastsRes, videosRes] = await Promise.all([
          fetch("/api/lessons"),
          fetch("/api/podcasts"),
          fetch("/api/videos")
        ]);

        const lessons = await lessonsRes.json();
        const podcasts = await podcastsRes.json();
        const videos = await videosRes.json();

        setCounts({
          // Handle array length or 'count' property depending on your API structure
          lessons: lessons.success ? (lessons.data?.length || 0) : 0,
          podcasts: podcasts.success ? (podcasts.data?.length || 0) : 0,
          videos: videos.success ? (videos.data?.length || 0) : 0,
        });
      } catch (error) {
        console.error("Error connecting to Learning Hub APIs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHubData();
  }, []);

  // 3. Content Definition
  const content = {
    mn: {
      heroTitle: "Мэдлэгийн Төв",
      heroSubtitle: "Ур чадвараa хөгжүүлж, дэлхийг өөрчлөхөд тань туслах нөөцүүд.",
      categories: [
        {
          icon: FaChalkboardTeacher,
          title: "Цахим хичээл",
          tagline: loading ? "Уншиж байна..." : `${counts.lessons} Хичээл`,
          description: "Интерактив сургалтууд, гарын авлага, хичээлүүд.",
          image: "/data.jpg", // Make sure this image exists in /public
          href: "/online-lessons",
          cta: "Хичээлүүд үзэх",
        },
        {
          icon: FaPodcast,
          title: "Подкастууд",
          tagline: loading ? "Уншиж байна..." : `${counts.podcasts} Дугаар`,
          description: "Мэргэжилтнүүдийн яриа, урам зориг өгөх түүхүүд.",
          image: "/data.jpg",
          href: "/podcasts",
          cta: "Подкастууд сонсох",
        },
        {
          icon: FaVideo,
          title: "Видео Сан",
          tagline: loading ? "Уншиж байна..." : `${counts.videos} Бичлэг`,
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
          tagline: loading ? "Loading..." : `${counts.lessons} Courses`,
          description: "Interactive lessons, guides, and structured tutorials.",
          image: "/data.jpg",
          href: "/online-lessons",
          cta: "Explore Courses",
        },
        {
          icon: FaPodcast,
          title: "Podcasts",
          tagline: loading ? "Loading..." : `${counts.podcasts} Episodes`,
          description: "Engaging talks with experts and powerful real-world stories.",
          image: "/data.jpg",
          href: "/podcasts",
          cta: "Start Listening",
        },
        {
          icon: FaVideo,
          title: "Video Library",
          tagline: loading ? "Loading..." : `${counts.videos} Videos`,
          description: "Visual tutorials, past webinars, and event recordings.",
          image: "/data.jpg",
          href: "/videos",
          cta: "Browse Videos",
        },
      ],
    },
  };

  const t = content[language];
  const featured = t.categories[0];
  const shelf = t.categories.slice(1);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:2rem_2rem]"></div>
      
      <div className="container px-4 mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">
            {t.heroTitle}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">{t.heroSubtitle}</p>
        </motion.div>

        {/* Featured Card (Lessons) */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }}
            className="mb-12"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                <div className="p-8 md:p-12 order-2 lg:order-1">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                            <featured.icon className="text-3xl" />
                        </div>
                        <div>
                            <p className="font-bold text-blue-600 uppercase text-xs tracking-wider mb-1">{featured.tagline}</p>
                            <h2 className="text-3xl font-bold text-slate-800">{featured.title}</h2>
                        </div>
                    </div>
                    <p className="text-slate-600 text-lg mb-8 leading-relaxed">{featured.description}</p>
                    <Link href={featured.href} className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all hover:-translate-y-1 shadow-lg shadow-blue-200">
                        {featured.cta} <FaArrowRight />
                    </Link>
                </div>
                <div className="relative h-64 lg:h-full min-h-[400px] order-1 lg:order-2 bg-slate-100">
                    <Image src={featured.image} alt={featured.title} fill className="object-cover" />
                </div>
            </div>
        </motion.div>
        
        {/* Secondary Grid (Podcasts & Videos) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {shelf.map((cat, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                >
                    <Link href={cat.href} className="group block relative h-80 rounded-3xl overflow-hidden shadow-lg border border-slate-100">
                        <Image src={cat.image} alt={cat.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        <div className="absolute bottom-0 left-0 p-8 w-full">
                            <div className="flex items-center gap-3 mb-2 text-cyan-300">
                                <cat.icon className="text-2xl" />
                                <span className="font-bold text-sm tracking-wider uppercase">{cat.tagline}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{cat.title}</h3>
                            <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-300 opacity-0 group-hover:opacity-100">
                                <p className="text-slate-300 mb-4 text-sm">{cat.description}</p>
                                <span className="inline-flex items-center gap-2 text-white font-bold border-b border-white pb-1">
                                    {cat.cta} <FaArrowRight />
                                </span>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>

      </div>
    </section>
  );
};

export default LearningHub;