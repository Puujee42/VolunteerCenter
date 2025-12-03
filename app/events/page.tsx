"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarCheck, FaMapMarkerAlt, FaGripHorizontal, FaList, FaChevronDown, FaArrowRight, FaSearchMinus } from 'react-icons/fa';
import { useLanguage } from "../context/LanguageContext"; // Adjust path if necessary
import Footer from '../components/Footer'; // Adjust path if necessary
import Link from 'next/link';

// --- Bilingual Data Store (Static Text Only) ---
const eventsContentData = {
  mn: {
    heroTitle: "Онцлох Арга Хэмжээ",
    registerNow: "Одоо бүртгүүлэх",
    allEvents: "Бүх арга хэмжээ",
    sortBy: "Эрэмбэлэх:",
    sortOptions: { date_desc: "Шинэ", date_asc: "Хуучин", popularity: "Алдартай" },
    register: "Бүртгүүлэх",
    viewDetails: "Дэлгэрэнгүй",
    spotsLeft: "суудал үлдсэн",
    full: "Дүүрсэн",
    ended: "Дууссан",
    open: "Нээлттэй",
    deadline: "Бүртгэл дуусна:",
    loading: "Уншиж байна...",
  },
  en: {
    heroTitle: "Featured Upcoming Event",
    registerNow: "Register Now",
    allEvents: "All Events",
    sortBy: "Sort By:",
    sortOptions: { date_desc: "Newest", date_asc: "Oldest", popularity: "Popularity" },
    register: "Register",
    viewDetails: "View Details",
    spotsLeft: "spots left",
    full: "Full",
    ended: "Ended",
    open: "Open",
    deadline: "Registration Closes:",
    loading: "Loading...",
  }
};

type EventStatus = 'open' | 'full' | 'ended';

interface EventItem {
  _id: string; // MongoDB ID
  id: string;  // Custom ID from seed
  deadline: string;
  startDate: string;
  imageUrl: string;
  status: EventStatus;
  registered: number;
  capacity: number;
  title: { mn: string; en: string; };
  location: { mn: string; en: string; };
}

// --- Main Events Page Component ---
const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'popularity'>('date_desc');
  const { language } = useLanguage();
  const t = eventsContentData[language];

  // 1. Fetch Data from API
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/events');
        const json = await res.json();
        if (json.success) {
          setEvents(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // 2. Determine Featured Event (First 'open' event, or just the first one)
  const featuredEvent = useMemo(() => {
    if (events.length === 0) return null;
    return events.find(e => e.status === 'open') || events[0];
  }, [events]);
  
  // 3. Sort Events
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.registered - a.registered;
        case 'date_asc':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'date_desc':
        default:
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }
    });
  }, [events, sortBy]);

  const itemsPerPage = 6;
  const currentEvents = sortedEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500 mb-4"></div>
        <p className="text-white text-lg animate-pulse">{t.loading}</p>
      </div>
    );
  }

  return (
    <>
      {featuredEvent && (
        <FeaturedEventHero t={t} event={featuredEvent} language={language} />
      )}
      
      <section id="all-events" className="py-24 bg-slate-50 min-h-screen">
        <div className="container mx-auto max-w-7xl px-4">
          <ControlsHeader t={t} viewMode={viewMode} setViewMode={setViewMode} sortBy={sortBy} setSortBy={setSortBy} />
          
          {currentEvents.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode + sortBy} // Re-animate when view or sort changes
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1, transition: { staggerChildren: 0.1 } }} 
                exit={{ opacity: 0 }}
                className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'flex flex-col gap-6'}
              >
                {currentEvents.map((item) => (
                  <EventCard key={item._id} item={item} t={t} language={language} viewMode={viewMode} />
                ))}
              </motion.div>
            </AnimatePresence>
          ) : <EmptyState t={t} />}
        </div>
      </section>
      <Footer />
    </>
  );
};


// --- Sub-Components ---

const FeaturedEventHero: React.FC<{ t: any; event: EventItem; language: 'mn' | 'en' }> = ({ t, event, language }) => {
    const countdown = useCountdown(event.deadline);
    
    return (
        <div className="relative h-[85vh] min-h-[600px] text-white flex items-center overflow-hidden">
            <div className="absolute inset-0 bg-black/50 z-10" />
            <img src={event.imageUrl} alt={event.title[language]} className="absolute inset-0 w-full h-full object-cover" />
            
            <div className="relative z-20 container mx-auto px-4 max-w-7xl mt-16">
                <motion.div 
                  initial={{ opacity: 0, x: -50 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 0.8, ease: "easeOut" }} 
                  className="max-w-3xl"
                >
                    <div className="inline-block px-4 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-cyan-300 font-semibold mb-4 backdrop-blur-md">
                        {t.heroTitle}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
                        {event.title[language]}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-6 text-lg text-slate-200 mb-8 font-medium">
                        <span className="flex items-center gap-2"><FaCalendarCheck className="text-cyan-400" /> {event.startDate}</span>
                        <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-red-400" /> {event.location[language]}</span>
                    </div>

                    {/* Countdown */}
                    {event.status === 'open' && (
                        <div className="flex gap-4 mb-10">
                            <CountdownItem value={countdown.days} unit={language === 'mn' ? "Өдөр" : "Days"} />
                            <CountdownItem value={countdown.hours} unit={language === 'mn' ? "Цаг" : "Hours"} />
                            <CountdownItem value={countdown.minutes} unit={language === 'mn' ? "Минут" : "Mins"} />
                            <CountdownItem value={countdown.seconds} unit={language === 'mn' ? "Секунд" : "Secs"} />
                        </div>
                    )}

                    <div className="flex flex-wrap gap-4">
                        <Link href={`/events/${event.id}`} className="px-8 py-4 bg-cyan-600 rounded-lg font-bold shadow-lg hover:bg-cyan-500 transition-all transform hover:-translate-y-1">
                            {t.registerNow}
                        </Link>
                        <a href="#all-events" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg font-bold hover:bg-white/20 transition-all">
                            {t.allEvents}
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const CountdownItem: React.FC<{ value: number; unit: string }> = ({ value, unit }) => (
    <div className="text-center group">
        <div className="text-3xl md:text-4xl font-bold w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/10 group-hover:border-cyan-500/50 transition-colors rounded-xl shadow-lg">
            {String(value).padStart(2, '0')}
        </div>
        <p className="text-[10px] md:text-xs uppercase mt-2 text-slate-300 tracking-wider">{unit}</p>
    </div>
);

interface ControlsHeaderProps {
  t: typeof eventsContentData.en;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  sortBy: string;
  setSortBy: (sort: 'date_desc' | 'date_asc' | 'popularity') => void;
}

const ControlsHeader: React.FC<ControlsHeaderProps> = ({ t, viewMode, setViewMode, sortBy, setSortBy }) => (
  <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 border-b border-slate-200 pb-6">
    <h2 className="text-3xl font-bold text-slate-800">{t.allEvents}</h2>
    <div className="flex items-center gap-4">
      <div className="relative">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="appearance-none bg-white border border-gray-300 rounded-lg py-2.5 pl-4 pr-10 font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm cursor-pointer">
          <option value="date_desc">{t.sortOptions.date_desc}</option>
          <option value="date_asc">{t.sortOptions.date_asc}</option>
          <option value="popularity">{t.sortOptions.popularity}</option>
        </select>
        <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
      <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
        <ViewToggleButton icon={FaGripHorizontal} active={viewMode === 'grid'} onClick={() => setViewMode('grid')} />
        <ViewToggleButton icon={FaList} active={viewMode === 'list'} onClick={() => setViewMode('list')} />
      </div>
    </div>
  </div>
);

const ViewToggleButton: React.FC<{ icon: React.ElementType; active: boolean; onClick: () => void; }> = ({ icon: Icon, active, onClick }) => (
  <button onClick={onClick} className={`relative p-2.5 rounded-md transition-colors ${active ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
    <Icon size={20} />
    {active && <motion.div layoutId="view-toggle-pill" className="absolute inset-0 bg-blue-50 rounded-md -z-10" transition={{ type: 'spring', stiffness: 300, damping: 25 }} />}
  </button>
);

const EventCard: React.FC<{ item: EventItem; t: any; language: 'mn' | 'en'; viewMode: 'grid' | 'list' }> = ({ item, t, language, viewMode }) => {
  const progress = Math.min((item.registered / item.capacity) * 100, 100);
  
  // Status Colors
  const statusColors = {
    open: 'bg-green-500',
    full: 'bg-red-500',
    ended: 'bg-slate-500'
  };

  return (
    <motion.div
      layout
      variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
      className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 flex ${viewMode === 'grid' ? 'flex-col' : 'flex-col md:flex-row items-stretch'}`}
    >
      {/* Image Section */}
      <div className={`relative overflow-hidden ${viewMode === 'grid' ? 'h-56 w-full' : 'h-64 md:h-auto w-full md:w-72 shrink-0'}`}>
        <img src={item.imageUrl} alt={item.title[language]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold text-white rounded-full shadow-sm ${statusColors[item.status]}`}>
            {t[item.status]}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-800 leading-tight mb-3 group-hover:text-blue-600 transition-colors">
            {item.title[language]}
        </h3>
        
        <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <FaCalendarCheck className="text-blue-400"/> <span>{item.startDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <FaMapMarkerAlt className="text-red-400"/> <span>{item.location[language]}</span>
            </div>
        </div>

        {/* Capacity Bar */}
        <div className="mt-auto">
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                <span>{item.registered} / {item.capacity}</span>
                {item.status === 'open' && <span className="text-green-600">{item.capacity - item.registered} {t.spotsLeft}</span>}
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }} 
                    whileInView={{ width: `${progress}%`}} 
                    viewport={{ once: true }} 
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${item.status === 'full' ? 'bg-red-500' : 'bg-blue-500'}`} 
                />
            </div>
        </div>

        <Link 
            href={`/events/${item.id}`} 
            className="mt-6 w-full py-3 rounded-lg border-2 border-slate-100 font-bold text-slate-600 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all flex items-center justify-center gap-2"
        >
            {item.status === 'open' ? t.register : t.viewDetails} 
            <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

const EmptyState: React.FC<{ t: any }> = ({ t }) => (
    <div className="text-center py-20 col-span-full bg-white rounded-2xl border border-dashed border-slate-300">
        <FaSearchMinus className="text-6xl text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-600">No events found</h3>
    </div>
);

// --- Helper Hook for Countdown ---
const useCountdown = (targetDate: string) => {
  // Handle empty or invalid dates
  if(!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  
  const countDownDate = new Date(targetDate).getTime();
  const [countDown, setCountDown] = useState(countDownDate - new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = countDownDate - new Date().getTime();
      setCountDown(remaining > 0 ? remaining : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [countDownDate]);

  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};

export default EventsPage;