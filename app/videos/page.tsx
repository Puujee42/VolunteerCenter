"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import React, { useState, useMemo } from "react";
import { FaVideo, FaPlay, FaSearch, FaClock, FaCalendarAlt, FaSearchMinus, FaUserTie } from "react-icons/fa";
import Footer from "../components/Footer";
import Image from "next/image"; // Import next/image

// --- Bilingual Data Store (structure remains the same) ---
const videosData = {
  mn: {
    heroTitle: "Видео сан",
    heroBreadcrumb: "Нүүр хуудас",
    upNextTitle: "Дараагийн бичлэгүүд",
    searchPlaceholder: "Бичлэгийн нэрээр хайх...",
    emptyState: {
      title: "Илэрц олдсонгүй",
      message: "Хайлтын шалгуураа өөрчилж дахин оролдоно уу.",
    },
    videos: [
      { id: 1, title: "Сайн дурын ажлын нөлөө: Бодит түүхүүд", description: "Бидний үйл ажиллагаа олон нийтэд хэрхэн нөлөөлж буйг харуулсан сэтгэл хөдөлгөм бичлэг.", speaker: "Б. Цэвэлмаа", date: "2025-10-20", duration: "12:35", thumbnail: "/data.jpg", videoSrc: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: 2, title: "Төсөл хэрхэн эхлүүлэх вэ? | Вебинар", description: "Төслийн санаагаа бодит ажил хэрэг болгох алхамчилсан заавар.", speaker: "Х. Сэлэнгэ", date: "2025-09-15", duration: "28:10", thumbnail: "/data.jpg", videoSrc: "https://www.youtube.com/embed/VIDEO_ID_2" },
      { id: 3, title: "2024 оны арга хэмжээний онцлох агшин", description: "Өнгөрсөн жилийн хамгийн дурсамжтай мөчүүдийг нэгтгэсэн бичлэг.", speaker: "VCM Баг", date: "2025-08-01", duration: "05:40", thumbnail: "/data.jpg", videoSrc: "https://www.youtube.com/embed/VIDEO_ID_3" },
    ],
  },
  en: {
    heroTitle: "Video Library",
    heroBreadcrumb: "Home",
    upNextTitle: "Up Next",
    searchPlaceholder: "Search by video title...",
    emptyState: {
      title: "No Videos Found",
      message: "Try adjusting your search term to find what you're looking for.",
    },
    videos: [
      { id: 1, title: "The Impact of Volunteering: Real Stories", description: "A powerful look at how our initiatives are making a tangible difference in the community.", speaker: "B. Tsevelmaa", date: "2025-10-20", duration: "12:35", thumbnail: "/data.jpg", videoSrc: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: 2, title: "How to Start a Community Project | Webinar", description: "A step-by-step guide to turning your passion project into a successful reality.", speaker: "Kh. Selenge", date: "2025-09-15", duration: "28:10", thumbnail: "/data.jpg", videoSrc: "https://www.youtube.com/embed/VIDEO_ID_2" },
      { id: 3, title: "2024 Year in Review: Event Highlights", description: "A look back at the most memorable moments and achievements from our events last year.", speaker: "The VCM Team", date: "2025-08-01", duration: "05:40", thumbnail: "/data.jpg", videoSrc: "https://www.youtube.com/embed/VIDEO_ID_3" },
    ],
  },
};

// --- Main Videos Page Component ---
const VideosPage = () => {
    const { language } = useLanguage();
    const t = videosData[language];
    
    const [searchTerm, setSearchTerm] = useState('');
    const [featuredVideoId, setFeaturedVideoId] = useState(t.videos[0].id);

    const filteredVideos = useMemo(() => 
        t.videos.filter(v => v.title.toLowerCase().includes(searchTerm.toLowerCase()))
    , [t.videos, searchTerm]);

    const featuredVideo = useMemo(() => 
        t.videos.find(v => v.id === featuredVideoId) || t.videos[0]
    , [featuredVideoId, t.videos]);

  return (
    <div className="bg-white">
      <VideosHero t={t} />
      <section className="py-24 bg-slate-50">
        <div className="container px-4 mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        <FeaturedVideo key={featuredVideo.id} video={featuredVideo} />
                    </AnimatePresence>
                </div>

                <div className="flex flex-col gap-6">
                    <h2 className="text-2xl font-bold text-slate-800">{t.upNextTitle}</h2>
                    <div className="relative w-full">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder={t.searchPlaceholder} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                    </div>
                    
                    <div className="flex-1 space-y-3 pr-2 overflow-y-auto max-h-[600px]">
                        {filteredVideos.length > 0 ? (
                           filteredVideos.map(video => (
                                <VideoPlaylistItem 
                                    key={video.id} 
                                    video={video}
                                    isActive={featuredVideoId === video.id}
                                    onClick={() => setFeaturedVideoId(video.id)}
                                />
                           ))
                        ) : (
                           <EmptyState t={t.emptyState} />
                        )}
                    </div>
                </div>
            </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

// --- Sub-Components ---

const VideosHero: React.FC<{ t: any }> = ({ t }) => (
  <div className="relative py-20 bg-white border-b border-slate-200">
    <div className="container mx-auto max-w-7xl px-4 relative z-10 text-center">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="text-5xl md:text-6xl font-bold mb-2 text-slate-800">{t.heroTitle}</motion.h1>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }} className="text-lg text-slate-500">{t.heroBreadcrumb} / {t.heroTitle}</motion.p>
    </div>
  </div>
);

const FeaturedVideo: React.FC<{ video: any }> = ({ video }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
    >
        <div className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl bg-black border border-slate-200">
            <iframe
                width="100%"
                height="100%"
                src={video.videoSrc}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            ></iframe>
        </div>
        <div className="mt-6">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">{video.title}</h2>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500 text-sm mb-4">
                <span className="flex items-center gap-2 font-medium"><FaUserTie /> {video.speaker}</span>
                <span className="flex items-center gap-2 font-medium"><FaCalendarAlt /> {video.date}</span>
                <span className="flex items-center gap-2 font-medium"><FaClock /> {video.duration}</span>
            </div>
            <p className="text-slate-600 leading-relaxed">{video.description}</p>
        </div>
    </motion.div>
);

const VideoPlaylistItem: React.FC<{ video: any, isActive: boolean, onClick: () => void }> = ({ video, isActive, onClick }) => (
    <motion.button
        onClick={onClick}
        className={`w-full grid grid-cols-3 gap-4 p-3 rounded-lg transition-all duration-300 text-left border-l-4 ${isActive ? 'bg-blue-50 border-blue-500' : 'bg-white hover:bg-slate-100 border-transparent'}`}
        whileHover={{ x: isActive ? 0 : 5 }}
    >
        <div className="col-span-1 aspect-video rounded-md overflow-hidden relative">
            <Image src={video.thumbnail} alt={video.title} layout="fill" objectFit="cover" />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                {isActive ? 
                    <span className="text-xs font-bold bg-blue-600 text-white px-2 py-0.5 rounded">PLAYING</span> : 
                    <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white"><FaPlay className="text-xs ml-0.5" /></div>
                }
            </div>
        </div>
        <div className="col-span-2">
            <h4 className={`font-bold leading-tight ${isActive ? 'text-blue-600' : 'text-slate-800'}`}>{video.title}</h4>
            <p className="text-xs text-slate-500 mt-1">{video.duration}</p>
        </div>
    </motion.button>
);

const EmptyState: React.FC<{ t: any }> = ({ t }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-slate-500">
        <FaSearchMinus className="text-5xl text-slate-400 mx-auto mb-6" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">{t.title}</h3>
        <p>{t.message}</p>
    </motion.div>
);

export default VideosPage;