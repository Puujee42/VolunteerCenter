"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext"; 
import { motion } from "framer-motion";
import { FaPlay, FaHeadphones } from "react-icons/fa";
import Image from "next/image";
import Footer from "../components/Footer";

export default function PodcastsPage() {
  const { language } = useLanguage();
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/podcasts");
        const json = await res.json();
        if (json.success) setPodcasts(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const t = {
    mn: { title: "Подкастууд", loading: "Уншиж байна...", listen: "Сонсох" },
    en: { title: "Podcasts", loading: "Loading...", listen: "Listen Now" },
  };

  if (loading) return <div className="p-20 text-center">{t[language].loading}</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-800 mb-12 flex items-center gap-3">
          <FaHeadphones className="text-blue-600" /> {t[language].title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {podcasts.map((pod, i) => (
            <motion.div
              key={pod._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100 hover:shadow-2xl transition-all"
            >
              {/* Cover Image */}
              <div className="relative h-48 w-full bg-slate-200">
                {pod.cover && (
                  <Image 
                    src={pod.cover} 
                    alt={pod.title[language]} 
                    layout="fill" 
                    objectFit="cover" 
                  />
                )}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                   <button className="bg-white p-4 rounded-full text-blue-600 shadow-lg">
                     <FaPlay />
                   </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-2 text-xs text-slate-500">
                   <span>Ep. {pod.ep}</span>
                   <span>{pod.duration}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2">
                  {pod.title[language]}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                  {pod.description[language]}
                </p>
                <button className="w-full py-2 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                  {t[language].listen}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}