"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";
import Footer from "../../components/Footer";

export default function SinglePodcastPage() {
  const { id } = useParams();
  const { language } = useLanguage();

  const [podcast, setPodcast] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchPodcast() {
      try {
        const res = await fetch(`/api/podcasts?id=${id}`);
        const json = await res.json();
        if (json.success) setPodcast(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPodcast();
  }, [id]);

  const t = {
    mn: { back: "Бусад дугаарууд", loading: "Уншиж байна..." },
    en: { back: "All Episodes", loading: "Loading..." },
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!podcast) return <div className="p-10 text-center">Podcast not found.</div>;
  
  // ✅ --- SMART PLAYER LOGIC ---
  const mediaSrc = podcast.audioSrc || "";
  const isYouTube = mediaSrc.includes("youtube.com") || mediaSrc.includes("youtu.be");
  const isVideoFile = mediaSrc.endsWith('.mp4');
  const isAudioFile = mediaSrc.endsWith('.mp3') || mediaSrc.endsWith('.wav');

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-4xl mx-auto py-12 px-4">
        
        <Link href="/podcasts" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 font-medium transition-colors">
            <FaArrowLeft /> {t[language].back}
        </Link>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200"
        >
            <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Cover Image */}
                <div className="relative h-64 md:h-auto">
                    <Image 
                        src={podcast.cover || "/data.jpg"} 
                        alt={podcast.title[language]} 
                        layout="fill" 
                        objectFit="cover" 
                    />
                </div>

                {/* Details */}
                <div className="md:col-span-2 p-8 flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                            Episode {podcast.ep}
                        </span>
                        <span className="text-sm text-slate-500">{podcast.duration}</span>
                    </div>
                    
                    <h1 className="text-3xl font-bold text-slate-800 my-4">
                        {podcast.title[language]}
                    </h1>

                    <p className="text-slate-600 leading-relaxed mb-8 flex-1">
                        {podcast.description[language]}
                    </p>

                    {/* ✅ --- SMART MEDIA PLAYER --- */}
                    <div className="mt-auto">
                        {isYouTube ? (
                            <div className="aspect-video">
                                <iframe src={mediaSrc} title={podcast.title[language]} className="w-full h-full rounded-lg" allowFullScreen />
                            </div>
                        ) : isVideoFile ? (
                            <video controls className="w-full rounded-lg" poster={podcast.cover || "/data.jpg"}>
                                <source src={mediaSrc} type="video/mp4" />
                                Your browser does not support this video.
                            </video>
                        ) : isAudioFile ? (
                            <audio controls className="w-full">
                                <source src={mediaSrc} type="audio/mpeg" />
                                Your browser does not support this audio.
                            </audio>
                        ) : (
                            <div className="text-center text-slate-400 p-4 border rounded-lg">Media not available.</div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}