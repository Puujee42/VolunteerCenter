"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext"; // Check path
import Footer from "../components/Footer"; // Check path
import Link from "next/link";
import { 
  FaGraduationCap, 
  FaHandsHelping, 
  FaChild, 
  FaTree, 
  FaHeartbeat, 
  FaLightbulb,
  FaArrowRight,
  FaSpinner,
  FaGlobe,
  FaUsers
} from "react-icons/fa";

// --- Mappings ---

// Map DB string 'icon' values to React Components
const iconMap: Record<string, React.ElementType> = {
  FaGraduationCap,
  FaHandsHelping,
  FaChild,
  FaTree,
  FaHeartbeat,
  FaLightbulb,
  FaGlobe,
  FaUsers,
  // Map category names to icons as fallback
  education: FaGraduationCap,
  volunteering: FaHandsHelping,
  protection: FaChild,
  environment: FaTree,
  health: FaHeartbeat,
  innovation: FaLightbulb
};

// Map DB 'color' (e.g., 'blue') to Tailwind classes
const colorMap: Record<string, string> = {
  blue:   "bg-blue-100 text-blue-600",
  green:  "bg-green-100 text-green-600",
  red:    "bg-red-100 text-red-600",
  orange: "bg-orange-100 text-orange-600",
  yellow: "bg-amber-100 text-amber-600",
  purple: "bg-purple-100 text-purple-600",
  cyan:   "bg-cyan-100 text-cyan-600",
  pink:   "bg-pink-100 text-pink-600",
};

// --- Interfaces ---

interface BilingualString {
  mn: string;
  en: string;
}

interface Program {
  id: string;
  category: string;
  icon: string;
  title: BilingualString;
  description: BilingualString;
  focus: { mn: string[]; en: string[] };
  color: string;
}

interface PageData {
  heroTitle: string;
  heroSubtitle: string;
  stats: { label: string; value: string }[];
  categories: Record<string, string>;
  programs: Program[];
}

// --- Component ---

export default function ProgramsPage() {
  const { language } = useLanguage();
  const [filter, setFilter] = useState("all");
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch Data from API
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/programs?locale=${language}`);
        const json = await res.json();
        
        if (json.success) {
          setData(json.data);
        } else {
          console.error("API Error:", json.error);
        }
      } catch (error) {
        console.error("Fetch failed:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [language]);

  // Helper to safely get localized string
  const getLocStr = (obj: any) => {
    if (!obj) return "";
    return typeof obj === 'string' ? obj : obj[language] || obj['mn'];
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  // Error/Empty State
  if (!data) return <div className="text-center py-20">No data available.</div>;

  // Filter Logic
  const filteredPrograms = filter === "all" 
    ? data.programs 
    : data.programs.filter(p => p.category === filter);

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* --- Hero Section --- */}
      <section className="relative py-24 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f9ff_1px,transparent_1px),linear-gradient(to_bottom,#f0f9ff_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="container px-4 mx-auto relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-5xl md:text-7xl font-black text-slate-800 mb-6 tracking-tight"
          >
            {data.heroTitle}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto mb-12"
          >
            {data.heroSubtitle}
          </motion.p>

          {/* Stats Row */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {data.stats.map((stat, i) => (
              <div key={i} className="p-6 bg-white rounded-2xl shadow-lg border border-slate-100">
                <div className="text-4xl font-extrabold text-blue-600 mb-1">{stat.value}</div>
                <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- Programs Content --- */}
      <section className="py-20">
        <div className="container px-4 mx-auto max-w-7xl">
          
          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {Object.entries(data.categories).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  filter === key 
                    ? "bg-slate-800 text-white shadow-lg scale-105" 
                    : "bg-white text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Programs Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredPrograms.map((program) => {
                // Determine Icon
                const Icon = iconMap[program.icon] || iconMap[program.category] || FaLightbulb;
                // Determine Color Class
                const colorClass = colorMap[program.color] || colorMap.blue; 

                // Get Localized Arrays
                const focusArray = program.focus ? (program.focus[language as 'mn'|'en'] || []) : [];

                return (
                  <motion.div
                    layout
                    key={program.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col h-full"
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${colorClass}`}>
                      <Icon className="text-3xl" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">
                      {getLocStr(program.title)}
                    </h3>
                    <p className="text-slate-600 mb-6 leading-relaxed flex-grow line-clamp-3">
                      {getLocStr(program.description)}
                    </p>

                    <div className="mb-8">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                        {language === 'mn' ? "Үндсэн чиглэл" : "Key Focus"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {focusArray.slice(0, 3).map((tag: string, idx: number) => (
                          <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link 
                      href={`/program/${program.id}`} 
                      className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all mt-auto"
                    >
                      {language === 'mn' ? "Дэлгэрэнгүй" : "Learn More"} <FaArrowRight />
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>

      <Footer />
    </div>
  );
}