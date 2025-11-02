"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { FaHeart, FaHandsHelping, FaLightbulb, FaUsers, FaArrowRight, FaBriefcase, FaMapMarkerAlt, FaClock, FaSearchMinus } from "react-icons/fa";
import Footer from "../components/Footer";

// --- Bilingual Data Store ---
const careersData = {
  mn: {
    heroTitle: "Бидний эрхэм зорилгод нэгдээрэй",
    heroSubtitle: "Өөрчлөлтийг бүтээх хүсэл тэмүүлэлтэй багт нэгдэж, утга учиртай ажил хийгээрэй.",
    ctaButton: "Нээлттэй ажлын байр харах",
    valuesTitle: "Бидний үнэт зүйлс",
    values: [
      { icon: FaHeart, title: "Эрхэм зорилго", description: "Бидний хийж буй бүх зүйл нийгэмд эерэг нөлөө үзүүлэхэд чиглэгддэг." },
      { icon: FaHandsHelping, title: "Хамтын ажиллагаа", description: "Хамтдаа илүү ихийг бүтээж, бие биенээ дэмжин ажилладаг." },
      { icon: FaLightbulb, title: "Инноваци", description: "Нийгмийн асуудлуудыг шийдвэрлэх шинэлэг арга замыг эрэлхийлдэг." },
      { icon: FaUsers, title: "Олон нийт", description: "Бид үйлчилдэг олон нийтийнхээ сайн сайхныг 최우선д тавьдаг." },
    ],
    openingsTitle: "Нээлттэй ажлын байр",
    filterLabels: { department: "Алба хэлтэс", location: "Байршил", type: "Төрөл", all: "Бүгд" },
    viewDetails: "Дэлгэрэнгүй",
    emptyState: { title: "Тохирох ажлын байр олдсонгүй", message: "Хайлтын шалгуураа өөрчилж дахин оролдоно уу." },
    spontaneous: { title: "Таны хүсч буй ажлын байр байхгүй байна уу?", subtitle: "Бид үргэлж авьяаслаг хүмүүсийг хайж байдаг. Та өөрийн анкетыг илгээнэ үү.", cta: "Холбоо барих" },
    jobOpenings: [
        { id: 1, title: "Төслийн менежер", department: "Хөтөлбөр", location: "Улаанбаатар", type: "Бүтэн цаг" },
        { id: 2, title: "Харилцааны мэргэжилтэн", department: "Маркетинг", location: "Улаанбаатар", type: "Цагийн ажил" },
        { id: 3, title: "Орон нутгийн зохицуулагч", department: "Хөтөлбөр", location: "Эрдэнэт", type: "Сайн дурын" },
    ],
  },
  en: {
    heroTitle: "Join Our Mission",
    heroSubtitle: "Become part of a passionate team driving change and doing work that matters.",
    ctaButton: "View Open Roles",
    valuesTitle: "What We Stand For",
    values: [
      { icon: FaHeart, title: "Purpose-Driven", description: "Everything we do is aimed at creating a tangible, positive impact on society." },
      { icon: FaHandsHelping, title: "Collaborative Spirit", description: "We believe in the power of teamwork and support each other to achieve great things." },
      { icon: FaLightbulb, title: "Innovative Solutions", description: "We constantly seek creative and effective new ways to solve social challenges." },
      { icon: FaUsers, title: "Community-Focused", description: "The well-being of the communities we serve is at the heart of all our decisions." },
    ],
    openingsTitle: "Open Opportunities",
    filterLabels: { department: "Department", location: "Location", type: "Type", all: "All" },
    viewDetails: "View Details",
    emptyState: { title: "No Matching Opportunities Found", message: "Try adjusting your search filters to find what you're looking for." },
    spontaneous: { title: "Don't see the right fit?", subtitle: "We're always looking for talented individuals. Feel free to send us your resume.", cta: "Get in Touch" },
    jobOpenings: [
      { id: 1, title: "Project Manager", department: "Programs", location: "Ulaanbaatar", type: "Full-time" },
      { id: 2, title: "Communications Specialist", department: "Marketing", location: "Ulaanbaatar", type: "Part-time" },
      { id: 3, title: "Regional Field Coordinator", department: "Programs", location: "Erdenet", type: "Volunteer" },
      { id: 4, title: "Grant Writer", department: "Fundraising", location: "Remote", type: "Full-time" },
    ],
  },
};

// --- Main Careers Page Component ---
const CareersPage = () => {
  const { language } = useLanguage();
  const t = careersData[language];
  
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');

  const departments = useMemo(() => Array.from(new Set(careersData.en.jobOpenings.map(j => j.department))), []);
  const mnDepartments = useMemo(() => Array.from(new Set(careersData.mn.jobOpenings.map(j => j.department))), []);
  const locations = useMemo(() => Array.from(new Set(careersData.en.jobOpenings.map(j => j.location))), []);
  const mnLocations = useMemo(() => Array.from(new Set(careersData.mn.jobOpenings.map(j => j.location))), []);
  const types = useMemo(() => Array.from(new Set(careersData.en.jobOpenings.map(j => j.type))), []);
  const mnTypes = useMemo(() => Array.from(new Set(careersData.mn.jobOpenings.map(j => j.type))), []);

  const filteredJobs = useMemo(() => t.jobOpenings.filter(job => 
    (!department || job.department === department) &&
    (!location || job.location === location) &&
    (!type || job.type === type)
  ), [t.jobOpenings, department, location, type]);

  return (
    <>
      <CareersHero t={t} />
      <ValuesSection t={t} />
      <section id="openings" className="py-24 bg-slate-50">
        <div className="container px-4 mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-4">{t.openingsTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 p-4 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-lg">
                <FilterDropdown label={t.filterLabels.department} options={language === 'mn' ? mnDepartments : departments} value={department} onChange={setDepartment} allLabel={t.filterLabels.all + " " + t.filterLabels.department} />
                <FilterDropdown label={t.filterLabels.location} options={language === 'mn' ? mnLocations : locations} value={location} onChange={setLocation} allLabel={t.filterLabels.all + " " + t.filterLabels.location} />
                <FilterDropdown label={t.filterLabels.type} options={language === 'mn' ? mnTypes : types} value={type} onChange={setType} allLabel={t.filterLabels.all + " " + t.filterLabels.type} />
            </div>
            
            {filteredJobs.length > 0 ? (
                <div className="space-y-4">
                    {filteredJobs.map(job => <JobCard key={job.id} job={job} t={t} />)}
                </div>
            ) : (
                <EmptyState t={t.emptyState} />
            )}
        </div>
      </section>
      <SpontaneousApplication t={t} />
      <Footer />
    </>
  );
};


// --- Sub-Components ---

const CareersHero: React.FC<{ t: any }> = ({ t }) => (
  <div className="relative h-[60vh] min-h-[450px] flex items-center justify-center text-center text-white">
    <div className="absolute inset-0 bg-black/50 z-10" />
    <img src="/team-hero.jpg" alt="A team of volunteers collaborating" className="absolute inset-0 w-full h-full object-cover"/>
    <div className="relative z-20 max-w-4xl px-4">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl md:text-6xl font-bold mb-4">{t.heroTitle}</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-lg md:text-xl text-slate-200">{t.heroSubtitle}</motion.p>
        <motion.a href="#openings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="mt-8 inline-block px-8 py-3 bg-blue-600 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-colors">{t.ctaButton}</motion.a>
    </div>
  </div>
);

const ValuesSection: React.FC<{ t: any }> = ({ t }) => (
    <section className="py-24 bg-white">
        <div className="container px-4 mx-auto max-w-6xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-12">{t.valuesTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {t.values.map((value: any, i: number) => {
                    const Icon = value.icon;
                    return (
                        <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}>
                            <div className="p-6 bg-slate-50/70 border border-slate-200/80 rounded-xl h-full">
                                <Icon className="text-4xl text-blue-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{value.title}</h3>
                                <p className="text-slate-600">{value.description}</p>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    </section>
);

const FilterDropdown: React.FC<{ label: string; options: string[]; value: string; onChange: (val: string) => void; allLabel: string; }> = ({ label, options, value, onChange, allLabel }) => (
    <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full appearance-none bg-white border border-slate-300 rounded-lg py-3 px-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
            <option value="">{allLabel}</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

const JobCard: React.FC<{ job: any; t: any }> = ({ job, t }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="group bg-white rounded-xl shadow-lg border border-slate-200 p-6 flex flex-col md:flex-row items-center gap-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300">
        <div className="flex-grow">
            <p className="text-sm font-semibold text-blue-600">{job.department}</p>
            <h3 className="text-xl font-bold text-slate-800">{job.title}</h3>
            <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                <span className="flex items-center gap-1.5"><FaMapMarkerAlt /> {job.location}</span>
                <span className="flex items-center gap-1.5"><FaClock /> {job.type}</span>
            </div>
        </div>
        <Link href={`/careers/${job.id}`}>
            <span className="w-full md:w-auto text-center px-6 py-3 bg-blue-50 text-blue-600 font-bold rounded-lg border-2 border-transparent group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                {t.viewDetails}
            </span>
        </Link>
    </motion.div>
);

const EmptyState: React.FC<{ t: any }> = ({ t }) => (
    <div className="text-center py-20">
        <FaSearchMinus className="text-6xl text-slate-400 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-slate-700 mb-2">{t.title}</h3>
        <p className="text-slate-500">{t.message}</p>
    </div>
);

const SpontaneousApplication: React.FC<{ t: any }> = ({ t }) => (
    <section className="py-20 bg-white">
        <div className="container px-4 mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">{t.spontaneous.title}</h2>
            <p className="text-lg text-slate-600 mb-8">{t.spontaneous.subtitle}</p>
            <Link href="/contact" className="group inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white font-bold rounded-lg shadow-lg hover:bg-slate-900 transition-colors">
                {t.spontaneous.cta} <FaArrowRight />
            </Link>
        </div>
    </section>
);

export default CareersPage;