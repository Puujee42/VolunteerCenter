"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext"; // Adjust path
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  FaHeart, 
  FaHandsHelping, 
  FaLightbulb, 
  FaUsers, 
  FaMapMarkerAlt, 
  FaClock, 
  FaSearchMinus 
} from "react-icons/fa";
import Footer from "../components/Footer"; // Adjust path
import { JobOpening } from "@/lib/mongo/types";

// --- Types ---
// Defining a helper type for localized content to fix TypeScript indexing errors
type LocalizedString = {
  mn: string;
  en: string;
};

// --- Static Text ---
const staticContent = {
  mn: {
    heroTitle: "Бидний эрхэм зорилгод нэгдээрэй",
    heroSubtitle: "Өөрчлөлтийг бүтээх хүсэл тэмүүлэлтэй багт нэгдэж, утга учиртай ажил хийгээрэй.",
    ctaButton: "Нээлттэй ажлын байр харах",
    valuesTitle: "Бидний үнэт зүйлс",
    openingsTitle: "Нээлттэй ажлын байр",
    filterLabels: { department: "Алба хэлтэс", location: "Байршил", type: "Төрөл", all: "Бүгд" },
    viewDetails: "Дэлгэрэнгүй",
    emptyState: { title: "Тохирох ажлын байр олдсонгүй", message: "Хайлтын шалгуураа өөрчилж дахин оролдоно уу." },
    values: [
      { icon: FaHeart, title: "Эрхэм зорилго", description: "Нийгэмд эерэг нөлөө үзүүлэх." },
      { icon: FaHandsHelping, title: "Хамтын ажиллагаа", description: "Бие биенээ дэмжин ажилладаг." },
      { icon: FaLightbulb, title: "Инноваци", description: "Шинэлэг арга замыг эрэлхийлдэг." },
      { icon: FaUsers, title: "Олон нийт", description: "Олон нийтийн сайн сайхныг дээдэлдэг." },
    ],
  },
  en: {
    heroTitle: "Join Our Mission",
    heroSubtitle: "Become part of a passionate team driving change.",
    ctaButton: "View Open Roles",
    valuesTitle: "What We Stand For",
    openingsTitle: "Open Opportunities",
    filterLabels: { department: "Department", location: "Location", type: "Type", all: "All" },
    viewDetails: "View Details",
    emptyState: { title: "No Opportunities Found", message: "Try adjusting your filters." },
    values: [
      { icon: FaHeart, title: "Purpose-Driven", description: "Creating positive impact." },
      { icon: FaHandsHelping, title: "Collaborative", description: "Power of teamwork." },
      { icon: FaLightbulb, title: "Innovative", description: "Seeking creative solutions." },
      { icon: FaUsers, title: "Community", description: "Community at heart." },
    ],
  },
};

interface CareersClientProps {
  dbJobs: JobOpening[]; // Ensure the parent component converts Mongo _id to string before passing here!
}

const CareersClient: React.FC<CareersClientProps> = ({ dbJobs = [] }) => {
  const { language } = useLanguage();
  const langKey = (language === 'mn' ? 'mn' : 'en') as keyof LocalizedString;
  const t = staticContent[langKey];
  
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');

  // --- Helper to safely get localized string ---
  const getLocalized = (obj: any): string => {
    return obj?.[langKey] || obj?.['en'] || "";
  };

  // --- Dynamic Filters based on DB Data ---
  const departments = useMemo(() => {
    return Array.from(new Set(dbJobs.map(j => j.department))).filter(Boolean);
  }, [dbJobs]);

  const locations = useMemo(() => {
    return Array.from(new Set(dbJobs.map(j => getLocalized(j.location)))).filter(Boolean);
  }, [dbJobs, langKey]);

  const types = useMemo(() => {
    return Array.from(new Set(dbJobs.map(j => getLocalized(j.type)))).filter(Boolean);
  }, [dbJobs, langKey]);

  // --- Filter Logic ---
  const filteredJobs = useMemo(() => dbJobs.filter(job => {
    const jobLoc = getLocalized(job.location);
    const jobType = getLocalized(job.type);

    return (
      (!department || job.department === department) &&
      (!location || jobLoc === location) &&
      (!type || jobType === type)
    );
  }), [dbJobs, department, location, type, langKey]);

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[450px] flex items-center justify-center text-center text-white bg-slate-900">
        <div className="absolute inset-0 bg-black/50 z-10" />
        {/* Note: Ensure /team-hero.jpg exists in public folder or use Next/Image */}
        <img 
            src="/team-hero.jpg" 
            alt="Team" 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="relative z-20 max-w-4xl px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{t.heroTitle}</h1>
            <p className="text-lg md:text-xl text-slate-200">{t.heroSubtitle}</p>
            <a href="#openings" className="mt-8 inline-block px-8 py-3 bg-blue-600 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-colors">
                {t.ctaButton}
            </a>
        </div>
      </div>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="container px-4 mx-auto max-w-6xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-12">{t.valuesTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {t.values.map((value, i) => {
                    const Icon = value.icon;
                    return (
                        <div key={i} className="p-6 bg-slate-50 border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
                            <Icon className="text-4xl text-blue-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{value.title}</h3>
                            <p className="text-slate-600">{value.description}</p>
                        </div>
                    )
                })}
            </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section id="openings" className="py-24 bg-slate-50">
        <div className="container px-4 mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-8">{t.openingsTitle}</h2>
            
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">{t.filterLabels.department}</label>
                    <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                       <option value="">{t.filterLabels.all}</option>
                       {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">{t.filterLabels.location}</label>
                    <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                       <option value="">{t.filterLabels.all}</option>
                       {locations.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">{t.filterLabels.type}</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                       <option value="">{t.filterLabels.all}</option>
                       {types.map(typ => <option key={typ} value={typ}>{typ}</option>)}
                    </select>
                </div>
            </div>
            
            {/* Job Cards */}
            {filteredJobs.length > 0 ? (
                <div className="space-y-4">
                    {filteredJobs.map(job => (
                      <motion.div 
                        // Ensure job._id is a string here. If it's an ObjectId, utilize job._id.toString() in the parent component.
                        key={String(job._id)} 
                        initial={{ opacity: 0, y: 10 }} 
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row items-start md:items-center gap-6 border border-transparent hover:border-blue-200 hover:shadow-md transition-all"
                      >
                          <div className="grow">
                              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-2">
                                {job.department}
                              </span>
                              <h3 className="text-xl font-bold text-slate-800">{getLocalized(job.title)}</h3>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-3">
                                  <span className="flex items-center gap-1.5">
                                    <FaMapMarkerAlt className="text-blue-500" /> {getLocalized(job.location)}
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <FaClock className="text-blue-500" /> {getLocalized(job.type)}
                                  </span>
                              </div>
                          </div>
                          <Link href={`/careers/${job._id}`} className="w-full md:w-auto"> 
                              <span className="block w-full text-center px-6 py-3 bg-slate-50 text-slate-700 font-bold rounded-lg border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition cursor-pointer">
                                  {t.viewDetails}
                              </span>
                          </Link>
                      </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                    <FaSearchMinus className="text-6xl text-slate-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-slate-700">{t.emptyState.title}</h3>
                    <p className="text-slate-500">{t.emptyState.message}</p>
                    <button 
                        onClick={() => { setDepartment(''); setLocation(''); setType(''); }}
                        className="mt-4 text-blue-600 font-semibold hover:underline"
                    >
                        {t.filterLabels.all} {t.filterLabels.all}
                    </button>
                </div>
            )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default CareersClient;