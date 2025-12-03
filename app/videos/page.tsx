"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext"; 
import { motion } from "framer-motion";
import { FaVideo } from "react-icons/fa";
import Footer from "../components/Footer";

export default function VideosPage() {
  const { language } = useLanguage();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/videos", { cache: 'no-store' }); // Ensure fresh data
        const json = await res.json();
        if (json.success) {
          setVideos(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch videos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const t = {
    mn: { title: "Видео Сан", loading: "Уншиж байна..." },
    en: { title: "Video Library", loading: "Loading..." },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-12 flex items-center gap-3">
          <FaVideo className="text-red-500" /> {t[language].title}
        </h1>

        {videos.length === 0 ? (
            <div className="text-center text-slate-400 py-20">
                <FaVideo className="text-6xl mx-auto opacity-20 mb-4" />
                <p>No videos available yet.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {videos.map((vid, i) => (
                <VideoCard key={vid._id || vid.id} vid={vid} index={i} language={language} />
              ))}
            </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

// --- SUB-COMPONENT: VIDEO CARD ---
const VideoCard = ({ vid, index, language }: { vid: any, index: number, language: 'mn' | 'en' }) => {
  const videoSrc = vid.videoUrl || vid.videoSrc;
  
  // ✅ Check if the URL is a YouTube link
  const isYouTube = videoSrc && (videoSrc.includes("youtube.com") || videoSrc.includes("youtu.be"));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      {/* --- CONDITIONAL VIDEO PLAYER --- */}
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-700 mb-4">
        {isYouTube ? (
          // Renders for YouTube links
          <iframe 
            src={videoSrc} 
            title={vid.title[language]} 
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          // Renders for direct file uploads (e.g., Cloudinary)
          <video 
            src={videoSrc} 
            controls 
            preload="metadata"
            poster={vid.thumbnail} // Use the uploaded thumbnail
            className="w-full h-full object-cover"
          >
            Your browser does not support the video tag.
          </video>
        )}
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
        <p className="text-slate-300 leading-relaxed line-clamp-3">
          {vid.description[language]}
        </p>
      </div>
    </motion.div>
  );
};