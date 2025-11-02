"use client";

import { motion, Variants } from "framer-motion";
import { FaUsers, FaBriefcase, FaCalendarCheck, FaBullhorn, FaArrowRight } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import CountUp from "react-countup";
import React from "react";
import Link from "next/link"; // Import Link for event cards

// --- Bilingual Data (structure remains the same) ---
const impactData = {
    mn: {
      sectionTitle: "Бидний Нөлөө & Үйл Ажиллагаа",
      subtitle: "Тоо баримт, бодит үйлсээр илэрхийлэгдэх бидний амжилт.",
      stats: [
        { icon: FaUsers, value: 2850, label: "Идэвхтэй сайн дурынхан", suffix: "+" },
        { icon: FaBriefcase, value: 142, label: "Амжилттай хэрэгжсэн төсөл", suffix: "+" },
        { icon: FaCalendarCheck, value: 50, label: "Жилд зохиогддог арга хэмжээ", suffix: "+" },
        { icon: FaBullhorn, value: 6, label: "Томоохон түнш байгууллага", suffix: "" },
      ],
      eventsTitle: "Сүүлийн үеийн онцлох үйл явдлууд",
      viewEvent: "Дэлгэрэнгүй",
      events: [
        { title: "Сайн дурынхны 'Марафон' 2022", date: "2022-03-25", category: "Олон нийт", image: "/data.jpg", link: "#" },
        { title: "'ГЭР БҮЛ' Цахим сургалт", date: "2021-05-12", category: "Сургалт", image: "/data.jpg", link: "#" },
        { title: "Мод тарих аян", date: "2022-10-15", category: "Байгаль орчин", image: "/girl.png", link: "#" },
        { title: "Ахмадууддаа тусалъя", date: "2022-11-20", category: "Нийгмийн халамж", image: "/vol.png", link: "#" },
        { title: "Цусны донорын өдөрлөг", date: "2023-01-10", category: "Эрүүл мэнд", image: "/data.jpg", link: "#" },
      ],
    },
    en: {
      sectionTitle: "Our Impact & Activities",
      subtitle: "Our success, measured in numbers and real-world action.",
      stats: [
        { icon: FaUsers, value: 2850, label: "Active Volunteers", suffix: "+" },
        { icon: FaBriefcase, value: 142, label: "Projects Completed", suffix: "+" },
        { icon: FaCalendarCheck, value: 50, label: "Annual Events Hosted", suffix: "+" },
        { icon: FaBullhorn, value: 6, label: "Major Partner Organizations", suffix: "" },
      ],
      eventsTitle: "Recent Highlights",
      viewEvent: "View Event",
      events: [
        { title: "Volunteer 'Marathon' 2022", date: "2022-03-25", category: "Community", image: "/data.jpg", link: "#" },
        { title: "'FAMILY' Online Training", date: "2021-05-12", category: "Training", image: "/data.jpg", link: "#" },
        { title: "Annual Tree Planting Drive", date: "2022-10-15", category: "Environment", image: "/girl.png", link: "#" },
        { title: "Elderly Home Support Day", date: "2022-11-20", category: "Social Care", image: "/vol.png", link: "#" },
        { title: "Blood Donation Drive", date: "2023-01-10", category: "Health", image: "/data.jpg", link: "#" },
      ],
    },
  };

const StatsAndEvents = () => {
  const { language } = useLanguage();
  const t = impactData[language];

  return (
    <section className="py-24 bg-white text-slate-800">
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
          {t.stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </motion.div>
        
        {/* --- Event Ticker --- */}
        <EventTicker events={t.events} title={t.eventsTitle} viewEventText={t.viewEvent} />
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
            <CountUp end={value} duration={3} separator="," />
            {suffix}
        </div>
        <p className="text-sm text-slate-500 mt-2 font-medium">{label}</p>
    </motion.div>
);

const EventTicker: React.FC<{ events: any[], title: string, viewEventText: string }> = ({ events, title, viewEventText }) => {
    const duplicatedEvents = [...events, ...events];
    const marqueeVariants: Variants = {
        animate: {
            x: [0, -1 * (events.length * 352)], // Card width (320px) + gap (32px) = 352
            transition: { x: { repeat: Infinity, repeatType: "loop", duration: events.length * 6, ease: "linear" } },
        },
    };

    return (
        <div className="w-full">
            <h3 className="text-3xl font-bold text-center mb-8 text-slate-800">{title}</h3>
            <div className="w-full overflow-hidden relative group">
                <motion.div className="flex gap-8 py-4" variants={marqueeVariants} animate="animate">
                    {duplicatedEvents.map((event, i) => (
                        <EventTickerCard key={i} event={event} viewEventText={viewEventText} />
                    ))}
                </motion.div>
                {/* Fading overlay for seamless loop */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-white via-transparent to-white" />
            </div>
        </div>
    );
}

const EventTickerCard: React.FC<{ event: any, viewEventText: string }> = ({ event, viewEventText }) => (
    <div className="flex-shrink-0 w-80 group/card bg-white rounded-xl shadow-lg border border-slate-200 transition-shadow duration-300 hover:shadow-2xl overflow-hidden">
        <div className="overflow-hidden">
            <img src={event.image} alt={event.title} className="w-full h-48 object-cover transition-transform duration-500 group-hover/card:scale-105" />
        </div>
        <div className="p-5">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">{event.category}</span>
                <p className="text-xs text-slate-500">{event.date}</p>
            </div>
            <h4 className="font-bold text-lg text-slate-800 mb-4 truncate">{event.title}</h4>
            <Link href={event.link} className="inline-flex items-center gap-2 font-semibold text-blue-600 group-hover/card:underline">
                {viewEventText}
                <FaArrowRight className="transition-transform duration-300 group-hover/card:translate-x-1" />
            </Link>
        </div>
    </div>
);

export default StatsAndEvents;