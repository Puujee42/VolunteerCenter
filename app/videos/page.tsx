"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext"; 
import { motion } from "framer-motion";
import { FaVideo, FaPlayCircle } from "react-icons/fa";
import Footer from "../components/Footer";

export default function VideosPage() {
  const { language } = useLanguage();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/videos");
        const json = await res.json();
        if (json.success) setVideos(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const t = {
    mn: { title: "Видео Сан", loading: "Уншиж байна...", watch: "Үзэх" },
    en: { title: "Video Library", loading: "Loading...", watch: "Watch" },
  };

  if (loading) return <div className="p-20 text-center">{t[language].loading}</div>;

  return (
    <div className="min-h-screen bg-slate-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-12 flex items-center gap-3">
          <FaVideo className="text-red-500" /> {t[language].title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {videos.map((vid, i) => (
            <motion.div
              key={vid._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              {/* Video Embed/Thumbnail */}
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-700 mb-4">
                <iframe 
                  src={vid.videoUrl || vid.videoSrc} 
                  title={vid.title[language]} 
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {vid.title[language]}
                </h3>
                <div className="flex items-center gap-4 text-slate-400 text-sm mb-3">
                   <span>{vid.speaker}</span>
                   <span>•</span>
                   <span>{vid.date}</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {vid.description[language]}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}