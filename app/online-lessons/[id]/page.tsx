"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import Link from "next/link";
import { FaArrowLeft, FaClock, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import Footer from "@/app/components/Footer";

// Interface matches your Seed Data structure
interface Lesson {
  _id: string;
  id: string; // e.g., "lesson-1"
  title: { mn: string; en: string };
  content: { mn: string; en: string };
  duration: { mn: string; en: string };
  videoUrl: string;
}

export default function SingleLessonPage() {
  const params = useParams(); // Get the [id] from the URL
  const { language } = useLanguage();
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Determine the ID (handle array or string case from Next.js params)
    const lessonId = Array.isArray(params.id) ? params.id[0] : params.id;

    if (!lessonId) return;

    async function fetchLesson() {
      try {
        // Call the API with the specific ID
        const res = await fetch(`/api/lessons?id=${lessonId}`);
        const json = await res.json();

        if (json.success) {
          setLesson(json.data);
        } else {
          setError("Lesson not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load lesson");
      } finally {
        setLoading(false);
      }
    }

    fetchLesson();
  }, [params.id]);

  // --- UI TEXT ---
  const t = {
    mn: { back: "Буцах", loading: "Уншиж байна...", notFound: "Хичээл олдсонгүй", duration: "Үргэлжлэх хугацаа" },
    en: { back: "Go Back", loading: "Loading...", notFound: "Lesson not found", duration: "Duration" }
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500">{t[language].loading}</p>
        </div>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (error || !lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{t[language].notFound}</h2>
        <Link href="/online-lessons" className="text-blue-600 hover:underline flex items-center gap-2">
          <FaArrowLeft /> {t[language].back}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Breadcrumb / Back Button */}
        <Link 
          href="/online-lessons" 
          className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-6 font-medium"
        >
          <FaArrowLeft /> {t[language].back}
        </Link>

        {/* Video Player Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video w-full mb-8"
        >
          <iframe
            width="100%"
            height="100%"
            src={lesson.videoUrl} 
            title={lesson.title[language]}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </motion.div>

        {/* Lesson Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                {lesson.title[language]}
              </h1>
              
              <div className="flex items-center gap-4 text-slate-500 mb-6 text-sm">
                <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-slate-200">
                  <FaClock className="text-blue-500" /> {lesson.duration[language]}
                </span>
                <span className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
                  <FaCheckCircle /> Free Access
                </span>
              </div>

              <div className="prose prose-slate max-w-none bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-slate-800">
                  {language === 'mn' ? "Хичээлийн тухай" : "About this lesson"}
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {lesson.content[language]}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Sidebar (Optional: Could list other lessons here later) */}
          <div className="lg:col-span-1">
             <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg sticky top-8">
                <h3 className="font-bold text-xl mb-4">
                  {language === 'mn' ? "Санамж" : "Note"}
                </h3>
                <p className="opacity-90 leading-relaxed mb-6">
                  {language === 'mn' 
                    ? "Та энэ хичээлийг үзэж дууссаны дараа дараагийн шатны шалгалтыг өгөх боломжтой болно."
                    : "After completing this lesson, you will be eligible to take the next level assessment."
                  }
                </p>
                <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-lg hover:bg-blue-50 transition-colors">
                  {language === 'mn' ? "Шалгалт өгөх" : "Take Quiz"}
                </button>
             </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}