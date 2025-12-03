"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext"; // Adjust path to your context
import { motion } from "framer-motion";
import { FaPlayCircle, FaClock } from "react-icons/fa";
import Link from "next/link";
import Footer from "../components/Footer";

interface Lesson {
  _id: string;
  id: string;
  title: { mn: string; en: string };
  content: { mn: string; en: string };
  duration: { mn: string; en: string };
  videoUrl: string;
}

export default function OnlineLessonsPage() {
  const { language } = useLanguage();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch data from the API on mount
  useEffect(() => {
    async function fetchLessons() {
      try {
        const res = await fetch("/api/lessons");
        const json = await res.json();
        if (json.success) {
          setLessons(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch lessons", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLessons();
  }, []);

  // UI Text based on language
  const labels = {
    mn: { title: "Цахим хичээлүүд", loading: "Уншиж байна...", watch: "Хичээл үзэх" },
    en: { title: "Online Courses", loading: "Loading...", watch: "Watch Lesson" },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-slate-800 mb-12 text-center"
        >
          {labels[language].title}
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lessons.map((lesson, index) => (
            <motion.div
              key={lesson._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col"
            >
              {/* Fake Video Thumbnail Area */}
              <div className="h-48 bg-slate-800 relative flex items-center justify-center group cursor-pointer">
                <FaPlayCircle className="text-5xl text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <FaClock /> {lesson.duration[language]}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {lesson.title[language]}
                </h3>
                <p className="text-slate-600 text-sm mb-6 flex-1 line-clamp-3">
                  {lesson.content[language]}
                </p>

                {/* If you have a detailed page for single lesson, link there using ID */}
                <Link 
                  href={`/online-lessons/${lesson.id}`} 
                  className="w-full block text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {labels[language].watch}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}