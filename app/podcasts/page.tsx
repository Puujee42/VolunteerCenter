"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import React, { useState, useMemo } from "react";
import { FaPodcast, FaPlay, FaSearch, FaClock, FaCalendarAlt, FaSearchMinus } from "react-icons/fa";
import Footer from "../components/Footer";
import Image from "next/image"; // Import next/image for optimized images

// --- Bilingual Data Store (structure remains the same) ---
const podcastsData = {
  mn: {
    heroTitle: "Подкастууд",
    heroBreadcrumb: "Нүүр хуудас",
    featuredTitle: "Онцлох дугаар",
    searchPlaceholder: "Дугаарын нэрээр хайх...",
    allEpisodesTitle: "Бүх дугаарууд",
    playButton: "Сонсох",
    emptyState: {
      title: "Илэрц олдсонгүй",
      message: "Хайлтын шалгуураа өөрчилж дахин оролдоно уу.",
    },
    podcasts: [
      { id: 1, ep: 3, title: "Нийгмийн өөрчлөлтийг бүтээгчид", description: "Энэ дугаарт бид олон нийтийн төсөл хэрхэн эхлүүлэх, амжилттай удирдах талаар ярилцана.", duration: "42 мин", date: "2025-10-28", cover: "/data.jpg", audioSrc: "#" },
      { id: 2, ep: 2, title: "Сайн дурын ажлын сэтгэл зүй", description: "Бусдад туслахын ач тус ба сэтгэл зүйн үр нөлөөний талаар.", duration: "35 мин", date: "2025-10-15", cover: "/data.jpg", audioSrc: "#" },
      { id: 3, ep: 1, title: "Анхны алхам: Яагаад сайн дурын ажилтан болох хэрэгтэй вэ?", description: "Сайн дурын ажилтан болохын үнэ цэнэ, анхны туршлагын тухай.", duration: "28 мин", date: "2025-10-01", cover: "/data.jpg", audioSrc: "#" },
    ],
  },
  en: {
    heroTitle: "Podcasts",
    heroBreadcrumb: "Home",
    featuredTitle: "Featured Episode",
    searchPlaceholder: "Search by episode title...",
    allEpisodesTitle: "All Episodes",
    playButton: "Play Episode",
    emptyState: {
      title: "No Episodes Found",
      message: "Try adjusting your search term to find what you're looking for.",
    },
    podcasts: [
      { id: 1, ep: 3, title: "The Art of Community Organizing", description: "In this episode, we dive deep into the strategies behind starting and managing a successful community project.", duration: "42 min", date: "2025-10-28", cover: "/data.jpg", audioSrc: "#" },
      { id: 2, ep: 2, title: "The Psychology of Volunteering", description: "Exploring the mental and emotional benefits of giving back to the community with Dr. Anya Sharma.", duration: "35 min", date: "2025-10-15", cover: "/data.jpg", audioSrc: "#" },
      { id: 3, ep: 1, title: "Taking the First Step: Why Volunteer?", description: "A foundational discussion on the value of volunteering and how to get started on your journey.", duration: "28 min", date: "2025-10-01", cover: "/data.jpg", audioSrc: "#" },
    ],
  },
};

// --- Main Podcasts Page Component ---
const PodcastsPage = () => {
    const { language } = useLanguage();
    const t = podcastsData[language];
    const [searchTerm, setSearchTerm] = useState('');
    const featuredEpisode = t.podcasts[0];
    
    const filteredEpisodes = useMemo(() => 
        t.podcasts.filter(ep => ep.title.toLowerCase().includes(searchTerm.toLowerCase()))
    , [t.podcasts, searchTerm]);

  return (
    <div className="bg-white">
      <PodcastsHero t={t} />
      <section className="py-24 bg-slate-50">
        <div className="container px-4 mx-auto max-w-5xl">
            <FeaturedEpisode episode={featuredEpisode} t={t} />

            <div className="mt-20">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h2 className="text-3xl font-bold text-slate-800">{t.allEpisodesTitle}</h2>
                    <div className="relative w-full md:w-72">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder={t.searchPlaceholder} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                    </div>
                </div>

                {filteredEpisodes.length > 0 ? (
                    <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }} className="space-y-4">
                        {filteredEpisodes.map(ep => <EpisodeRowItem key={ep.id} episode={ep} t={t} />)}
                    </motion.div>
                ) : (
                    <EmptyState t={t.emptyState} />
                )}
            </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

// --- Sub-Components ---

const PodcastsHero: React.FC<{ t: any }> = ({ t }) => (
  <div className="relative py-20 bg-white border-b border-slate-200">
    <div className="container mx-auto max-w-7xl px-4 relative z-10 text-center">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="text-5xl md:text-6xl font-bold mb-2 text-slate-800">{t.heroTitle}</motion.h1>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }} className="text-lg text-slate-500">{t.heroBreadcrumb} / {t.heroTitle}</motion.p>
    </div>
  </div>
);

const FeaturedEpisode: React.FC<{ episode: any, t: any }> = ({ episode, t }) => (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }} className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <motion.div whileHover={{ scale: 1.03 }} className="w-full aspect-square rounded-lg overflow-hidden shadow-lg">
            <Image src={episode.cover} alt={episode.title} width={400} height={400} className="w-full h-full object-cover"/>
        </motion.div>
        <div className="md:col-span-2">
            <p className="text-sm font-semibold text-blue-600 mb-2">{t.featuredTitle}</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">{episode.title}</h2>
            <p className="text-slate-600 mb-6">{episode.description}</p>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-6 text-slate-500">
                    <span className="flex items-center gap-2 font-medium"><FaClock /> {episode.duration}</span>
                    <span className="flex items-center gap-2 font-medium"><FaCalendarAlt /> {episode.date}</span>
                </div>
                <motion.a href={episode.audioSrc} whileHover={{ scale: 1.05 }} className="group inline-flex items-center gap-3 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/40 hover:bg-blue-700 transition-all">
                    <FaPlay /> {t.playButton}
                </motion.a>
            </div>
        </div>
    </motion.div>
);

const EpisodeRowItem: React.FC<{ episode: any, t: any }> = ({ episode, t }) => (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="group grid grid-cols-[auto,1fr,auto] items-center gap-4 p-4 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 transition-colors duration-300">
        <div className="relative w-16 h-16 rounded-md overflow-hidden">
            <Image src={episode.cover} alt={episode.title} layout="fill" objectFit="cover" />
        </div>
        <div>
            <h3 className="font-bold text-slate-800 text-lg">{episode.title}</h3>
            <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                <span className="flex items-center gap-1.5"><FaClock /> {episode.duration}</span>
                <span className="flex items-center gap-1.5"><FaCalendarAlt /> {episode.date}</span>
            </div>
        </div>
        <a href={episode.audioSrc} className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-200 text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <FaPlay />
        </a>
    </motion.div>
);

const EmptyState: React.FC<{ t: any }> = ({ t }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-slate-800">
        <FaSearchMinus className="text-5xl text-slate-400 mx-auto mb-6" />
        <h3 className="text-xl font-bold mb-2">{t.title}</h3>
        <p className="text-slate-500">{t.message}</p>
    </motion.div>
);

export default PodcastsPage;