"use client";

import { motion, Variants } from "framer-motion";
import { FaUsers, FaBriefcase, FaCalendarCheck, FaBullhorn, FaArrowRight, FaHandsHelping } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import CountUp from "react-countup";
import React, { useEffect, useState } from "react";
import Link from "next/link";

// --- 1. UI Text Labels (Static) ---
const uiText = {
    mn: {
      sectionTitle: "Бидний Нөлөө & Үйл Ажиллагаа",
      subtitle: "Тоо баримт, бодит үйлсээр илэрхийлэгдэх бидний амжилт.",
      statsLabels: {
        volunteers: "Нээлттэй ажлын байр",
        projects: "Амжилттай хэрэгжсэн төсөл",
        events: "Зохион байгуулсан арга хэмжээ",
        partners: "Томоохон түнш байгууллага"
      },
      eventsTitle: "Сүүлийн үеийн онцлох үйл явдлууд",
      viewEvent: "Дэлгэрэнгүй",
      categories: { event: "Арга хэмжээ", volunteer: "Сайн дурын ажил" }
    },
    en: {
      sectionTitle: "Our Impact & Activities",
      subtitle: "Our success, measured in numbers and real-world action.",
      statsLabels: {
        volunteers: "Open Opportunities",
        projects: "Projects Completed",
        events: "Events Hosted",
        partners: "Major Partners"
      },
      eventsTitle: "Recent Highlights",
      viewEvent: "View Details",
      categories: { event: "Event", volunteer: "Volunteer" }
    },
};

const StatsAndEvents = () => {
  const { language } = useLanguage();
  const t = uiText[language];

  // --- 2. State for Dynamic Data ---
  const [highlights, setHighlights] = useState<any[]>([]);
  const [stats, setStats] = useState({
    opportunities: 0,
    events: 0,
    projects: 142, // Hardcoded for now (or fetch if you have a projects API)
    partners: 6    // Hardcoded
  });
  const [loading, setLoading] = useState(true);

  // --- 3. Fetch Data ---
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch both in parallel
        const [eventsRes, oppsRes] = await Promise.all([
            fetch("/api/events"),
            fetch("/api/volunteers")
        ]);

        const eventsData = await eventsRes.json();
        const oppsData = await oppsRes.json();

        const rawEvents = eventsData.success ? eventsData.data : [];
        const rawOpps = oppsData.success ? oppsData.data : [];

        // Update Stats based on DB counts
        setStats(prev => ({
            ...prev,
            events: rawEvents.length,
            opportunities: rawOpps.length
        }));

        // --- Merge & Format for the Ticker ---
        const formattedEvents = rawEvents.map((e: any) => ({
            id: e.id,
            type: 'event',
            title: e.title, // Object {mn, en}
            date: e.startDate,
            image: e.imageUrl,
            link: `/events/${e.id}`
        }));

        const formattedOpps = rawOpps.map((o: any) => ({
            id: o.id,
            type: 'volunteer',
            title: o.title, // Object {mn, en}
            date: o.addedDate, // Or registrationStart
            image: "/volunteers.png", // Use a generic image or add image field to volunteer DB
            link: `/volunteers/${o.id}`
        }));

        // Combine and Sort by Date (Newest first)
        const combined = [...formattedEvents, ...formattedOpps].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setHighlights(combined);

      } catch (error) {
        console.error("Error loading stats/events:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // --- 4. Prepare Data for Render ---
  const statItems = [
    { icon: FaHandsHelping, value: stats.opportunities, label: t.statsLabels.volunteers, suffix: "+" },
    { icon: FaCalendarCheck, value: stats.events, label: t.statsLabels.events, suffix: "" },
    { icon: FaBriefcase, value: stats.projects, label: t.statsLabels.projects, suffix: "+" },
    { icon: FaBullhorn, value: stats.partners, label: t.statsLabels.partners, suffix: "" },
  ];

  return (
    <section className="py-24 bg-white text-slate-800 overflow-hidden">
      <div className="container px-4 mx-auto">
        {/* --- Header --- */}
        <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-500 bg-clip-text text-transparent">
            {t.sectionTitle}
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">{t.subtitle}</p>
        </motion.div>

        {/* --- Stats Grid --- */}
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24"
        >
          {statItems.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </motion.div>
        
        {/* --- Event Ticker --- */}
        {!loading && highlights.length > 0 ? (
            <EventTicker 
                items={highlights} 
                title={t.eventsTitle} 
                viewText={t.viewEvent} 
                language={language}
                labels={t.categories}
            />
        ) : (
            <div className="text-center text-slate-400">Loading highlights...</div>
        )}
      </div>
    </section>
  );
};

// --- Sub-Components ---

const StatCard: React.FC<{ icon: React.ElementType, value: number, label: string, suffix: string }> = ({ icon: Icon, value, label, suffix }) => (
    <motion.div
        variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-2xl p-6 text-center border border-slate-200 shadow-md hover:shadow-xl hover:border-blue-400 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center"
    >
        <Icon className="text-4xl text-blue-500 mb-4" />
        <div className="text-4xl font-black text-slate-900">
            <CountUp end={value} duration={2.5} separator="," />
            {suffix}
        </div>
        <p className="text-sm text-slate-500 mt-2 font-medium">{label}</p>
    </motion.div>
);

const EventTicker: React.FC<{ items: any[], title: string, viewText: string, language: string, labels: any }> = ({ items, title, viewText, language, labels }) => {
    // Duplicate items to ensure smooth infinite scroll if few items exist
    const duplicatedItems = items.length < 5 ? [...items, ...items, ...items, ...items] : [...items, ...items];
    
    const marqueeVariants: Variants = {
        animate: {
            x: [0, -1 * (items.length * 352)], // Card width (320px) + gap (32px) = 352
            transition: { x: { repeat: Infinity, repeatType: "loop", duration: items.length * 10, ease: "linear" } },
        },
    };

    return (
        <div className="w-full">
            <h3 className="text-3xl font-bold text-center mb-8 text-slate-800">{title}</h3>
            <div className="w-full overflow-hidden relative group">
                <motion.div className="flex gap-8 py-4" variants={marqueeVariants} animate="animate">
                    {duplicatedItems.map((item, i) => (
                        <EventTickerCard 
                            key={`${item.id}-${i}`} 
                            item={item} 
                            viewText={viewText} 
                            language={language}
                            categoryLabel={labels[item.type]} 
                        />
                    ))}
                </motion.div>
                {/* Fading overlay for seamless loop */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-white via-transparent to-white z-10" />
            </div>
        </div>
    );
}

const EventTickerCard: React.FC<{ item: any, viewText: string, language: string, categoryLabel: string }> = ({ item, viewText, language, categoryLabel }) => {
    // Resolve bilingual title
    const title = item.title[language] || item.title;
    const isEvent = item.type === 'event';

    return (
        <div className="flex-shrink-0 w-80 group/card bg-white rounded-xl shadow-lg border border-slate-200 transition-shadow duration-300 hover:shadow-2xl overflow-hidden relative">
            <div className="overflow-hidden h-48 relative">
                <img src={item.image || '/data.jpg'} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105" />
                {/* Type Badge */}
                <span className={`absolute top-3 right-3 text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm 
                    ${isEvent ? 'bg-purple-500 text-white' : 'bg-green-500 text-white'}`}>
                    {categoryLabel}
                </span>
            </div>
            
            <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                        <FaCalendarCheck /> {item.date}
                    </p>
                </div>
                <h4 className="font-bold text-lg text-slate-800 mb-4 line-clamp-2 min-h-[3.5rem]">{title}</h4>
                <Link href={item.link} className="inline-flex items-center gap-2 font-semibold text-blue-600 group-hover/card:underline">
                    {viewText}
                    <FaArrowRight className="transition-transform duration-300 group-hover/card:translate-x-1" />
                </Link>
            </div>
        </div>
    );
};

export default StatsAndEvents;