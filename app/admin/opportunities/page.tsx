"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";
import Link from "next/link";
import { 
  FaSearch, FaMapMarkerAlt, FaBriefcase, FaBuilding, 
  FaLeaf, FaUsers, FaMask, FaFutbol, FaQuestionCircle, FaHandsHelping, FaArrowRight 
} from "react-icons/fa";
import Footer from "../../components/Footer";

// --- Icon Mapper ---
const IconMap: any = {
  FaLeaf, FaUsers, FaMask, FaFutbol, FaQuestionCircle, FaHandsHelping
};

export default function OpportunitiesPage() {
  const { language } = useLanguage();
  
  // State
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // --- Fetch Data ---
  useEffect(() => {
    async function fetchData() {
      try {
        // ✅ Add cache: 'no-store' to ensure we see new admin posts immediately
        const res = await fetch("/api/admin/opportunities", { cache: 'no-store' });
        const json = await res.json();
        
        if (json.success) {
          setOpportunities(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch opportunities", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // --- Filter Logic ---
  const filteredOpps = opportunities.filter((opp) => {
    // Handle potential missing bilingual fields safely
    const title = opp.title?.[language] || opp.title || "";
    const desc = opp.description?.[language] || opp.description || "";
    const city = opp.city || opp.location?.[language] || opp.location || "";

    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          desc.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Normalize city matching
    const matchesCity = !selectedCity || city.includes(selectedCity);

    return matchesSearch && matchesCity;
  });

  // Get unique cities for filter dropdown (safely)
  const cities = Array.from(new Set(opportunities.map(o => o.city || o.location?.en || o.location))).filter(Boolean);

  // --- UI Text ---
  const t = {
    mn: {
      title: "Сайн дурын ажлын боломжууд",
      subtitle: "Таны тусламж хэрэгтэй төслүүдтэй нэгдэж, нийгэмдээ хувь нэмрээ оруулаарай.",
      searchPlaceholder: "Ажил хайх...",
      allCities: "Бүх байршил",
      viewDetails: "Дэлгэрэнгүй",
      spots: "Суудал",
      loading: "Уншиж байна...",
      noResults: "Илэрц олдсонгүй."
    },
    en: {
      title: "Volunteer Opportunities",
      subtitle: "Join projects that need your help and make a difference in your community.",
      searchPlaceholder: "Search opportunities...",
      allCities: "All Locations",
      viewDetails: "View Details",
      spots: "Spots",
      loading: "Loading...",
      noResults: "No opportunities found."
    }
  };

  const labels = t[language];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-b-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* --- HERO SECTION --- */}
      <div className="bg-slate-900 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/volunteers.png')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90" />
        
        <div className="relative z-10 container mx-auto max-w-6xl text-center">
            <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg"
            >
                {labels.title}
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-light"
            >
                {labels.subtitle}
            </motion.p>
        </div>
      </div>

      {/* --- SEARCH & FILTER --- */}
      <div className="container mx-auto max-w-6xl px-4 -mt-8 relative z-20">
        <div className="bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-3.5 text-slate-400" />
                <input 
                    type="text" 
                    placeholder={labels.searchPlaceholder} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
            </div>
            <div className="relative w-full md:w-64">
                <FaMapMarkerAlt className="absolute left-4 top-3.5 text-slate-400" />
                <select 
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition"
                >
                    <option value="">{labels.allCities}</option>
                    {cities.map((city: any) => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
            </div>
        </div>
      </div>

      {/* --- GRID --- */}
      <div className="container mx-auto max-w-6xl px-4 py-16">
        {filteredOpps.length === 0 ? (
            <div className="text-center text-slate-500 py-12">
                <FaBriefcase className="text-6xl mx-auto mb-4 opacity-20" />
                <p className="text-xl font-medium">{labels.noResults}</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                    {filteredOpps.map((opp, index) => (
                        <OpportunityCard key={opp._id} opp={opp} index={index} language={language} labels={labels} />
                    ))}
                </AnimatePresence>
            </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

// --- SUB-COMPONENT: CARD ---
const OpportunityCard = ({ opp, index, language, labels }: any) => {
    // Dynamic Icon
    const Icon = IconMap[opp.icon] || FaHandsHelping;
    
    // Slots Logic
    const filled = opp.slots?.filled || 0;
    const total = opp.slots?.total || 20; // Default if missing
    const isFull = filled >= total;
    const percentage = Math.min((filled / total) * 100, 100);

    // Bilingual Data
    const title = opp.title?.[language] || opp.title;
    const desc = opp.description?.[language] || opp.description;
    const city = opp.city || opp.location?.[language] || opp.location;
    const org = opp.organization || "Volunteer Center";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden flex flex-col h-full transition-all duration-300 hover:-translate-y-1"
        >
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Icon className="text-2xl" />
                    </div>
                    {isFull ? (
                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">FULL</span>
                    ) : (
                        <span className="bg-green-100 text-green-600 text-xs font-bold px-2 py-1 rounded">OPEN</span>
                    )}
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2 h-[3.5rem]">
                    {title}
                </h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-3 flex-1">
                    {desc}
                </p>

                <div className="flex flex-col gap-2 text-xs text-slate-400 font-medium mb-4">
                    <div className="flex items-center gap-2"><FaBuilding /> {org}</div>
                    <div className="flex items-center gap-2"><FaMapMarkerAlt /> {city}</div>
                </div>
            </div>

            {/* Footer / Progress Bar */}
            <div className="px-6 pb-6 mt-auto">
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>{labels.spots}</span>
                    <span className={isFull ? "text-red-500" : "text-blue-600"}>
                        {filled} / {total}
                    </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-6 overflow-hidden">
                    <div 
                        className={`h-2 rounded-full transition-all duration-500 ${isFull ? "bg-red-500" : "bg-blue-500"}`} 
                        style={{ width: `${percentage}%` }} 
                    />
                </div>

                {/* Link to Detail Page */}
                <Link 
                    href={`/volunteers/${opp.id}`} 
                    className="w-full py-3 rounded-lg border-2 border-slate-100 text-slate-600 font-bold flex items-center justify-center gap-2 group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all"
                >
                    {labels.viewDetails} <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
        </motion.div>
    );
};