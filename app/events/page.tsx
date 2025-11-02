"use client";
import React,{ useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarCheck, FaMapMarkerAlt, FaUsers, FaGripHorizontal, FaList, FaChevronDown, FaArrowRight, FaSearchMinus } from 'react-icons/fa';
import { useLanguage } from "../context/LanguageContext";
import Footer from '../components/Footer';

// --- Bilingual Data Store ---
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
  }
};

type EventStatus = 'open' | 'full' | 'ended';
interface EventItem {
  id: string;
  deadline: string;
  startDate: string;
  imageUrl: string;
  link: string;
  status: EventStatus;
  registered: number;
  capacity: number;
  title: { mn: string; en: string; };
  location: { mn: string; en: string; };
}

const bilingualMockEventsData: EventItem[] = [
    { id: 'youth-hackathon-2023', deadline: '2025-12-15T23:59:59', startDate: '2025-12-28', status: 'open', registered: 85, capacity: 120, title: { mn: 'Залуучуудын Инновацийн Хакертон', en: 'Youth Innovation Hackathon' }, location: { mn: 'Технологийн Парк', en: 'Technology Park' }, imageUrl: '/data.jpg', link: '/event-3' },
    { id: 'future-owner-2022', deadline: '2022-04-10T23:59:59', startDate: '2022-03-25', status: 'ended', registered: 3000, capacity: 3000, title: { mn: '"Ирээдүйн эзэд 2022"', en: '"Future Owners 2022"' }, location: { mn: 'Улаанбаатар', en: 'Ulaanbaatar' }, imageUrl: '/data.jpg', link: '/event-1' },
    { id: 'family-dev-training', deadline: '2021-04-23T23:59:59', startDate: '2021-05-12', status: 'ended', registered: 50, capacity: 50, title: { mn: '"Гэр бүлээ хөгжье" сургалт', en: '"Develop Your Family" Course' }, location: { mn: 'Онлайн', en: 'Online' }, imageUrl: '/data.jpg', link: '/event-2' },
    { id: 'volunteer-meetup-2023', deadline: '2023-07-20T23:59:59', startDate: '2023-08-05', status: 'full', registered: 200, capacity: 200, title: { mn: 'Сайн дурынхны уулзалт 2023', en: 'Annual Volunteer Meetup 2023' }, location: { mn: 'Үндэсний цэцэрлэгт хүрээлэн', en: 'National Park' }, imageUrl: '/data.jpg', link: '/event-4' },
];

// --- Main Events Page Component ---
const EventsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'popularity'>('date_desc');
  const { language } = useLanguage();
  const t = eventsContentData[language];

  // Find the first 'open' event to feature, or fallback to the first event overall.
  const featuredEvent = bilingualMockEventsData.find(e => e.status === 'open') || bilingualMockEventsData[0];
  
  const sortedEvents = useMemo(() => {
    return [...bilingualMockEventsData].sort((a, b) => {
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
  }, [sortBy]);

  // For pagination (if needed in the future)
  const itemsPerPage = 6;
  const currentEvents = sortedEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <FeaturedEventHero t={t} event={featuredEvent} language={language} />
      <section id="all-events" className="py-24 bg-slate-50">
        <div className="container mx-auto max-w-7xl px-4">
          <ControlsHeader t={t} viewMode={viewMode} setViewMode={setViewMode} sortBy={sortBy} setSortBy={setSortBy} />
          {currentEvents.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode + currentPage}
                initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { staggerChildren: 0.1 } }} exit={{ opacity: 0 }}
                className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'flex flex-col gap-6'}
              >
                {currentEvents.map((item) => <EventCard key={item.id} item={item} t={t} language={language} viewMode={viewMode} />)}
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
        <div className="relative h-screen min-h-[700px] text-white flex items-center">
            <div className="absolute inset-0 bg-black/60 z-10" />
            <img src={event.imageUrl} alt={event.title[language]} className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative z-20 container mx-auto px-4 max-w-7xl">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }} className="max-w-2xl">
                    <p className="font-semibold text-cyan-300 mb-2">{t.heroTitle}</p>
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">{event.title[language]}</h1>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-200 mb-8">
                        <span className="flex items-center gap-2"><FaCalendarCheck /> {event.startDate}</span>
                        <span className="flex items-center gap-2"><FaMapMarkerAlt /> {event.location[language]}</span>
                    </div>
                    <div className="flex gap-4 mb-8">
                        <CountdownItem value={countdown.days} unit="days" />
                        <CountdownItem value={countdown.hours} unit="hours" />
                        <CountdownItem value={countdown.minutes} unit="minutes" />
                        <CountdownItem value={countdown.seconds} unit="seconds" />
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <a href={event.link} className="px-8 py-4 bg-cyan-500 rounded-lg font-bold shadow-lg hover:bg-cyan-600 transition-colors">
                            {t.registerNow}
                        </a>
                        <a href="#all-events" className="px-8 py-4 bg-white/20 backdrop-blur-sm rounded-lg font-bold hover:bg-white/30 transition-colors">
                            {t.allEvents}
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const CountdownItem: React.FC<{ value: number; unit: string }> = ({ value, unit }) => (
    <div className="text-center">
        <div className="text-4xl font-bold w-20 h-20 flex items-center justify-center bg-white/10 backdrop-blur-sm p-4 rounded-lg">{String(value).padStart(2, '0')}</div>
        <p className="text-xs uppercase mt-2 text-slate-300">{unit}</p>
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
  <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
    <h2 className="text-3xl font-bold text-slate-800">{t.allEvents}</h2>
    <div className="flex items-center gap-4">
      <div className="relative">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="appearance-none bg-white border border-gray-300 rounded-lg py-2.5 pl-4 pr-10 font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
          <option value="date_desc">{t.sortOptions.date_desc}</option>
          <option value="date_asc">{t.sortOptions.date_asc}</option>
          <option value="popularity">{t.sortOptions.popularity}</option>
        </select>
        <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
      <div className="flex items-center bg-slate-200/70 rounded-lg p-1">
        <ViewToggleButton icon={FaGripHorizontal} active={viewMode === 'grid'} onClick={() => setViewMode('grid')} />
        <ViewToggleButton icon={FaList} active={viewMode === 'list'} onClick={() => setViewMode('list')} />
      </div>
    </div>
  </div>
);

const ViewToggleButton: React.FC<{ icon: React.ElementType; active: boolean; onClick: () => void; }> = ({ icon: Icon, active, onClick }) => (
  <button onClick={onClick} className="relative p-2.5 rounded-md transition-colors text-slate-600 hover:text-blue-600 z-10">
    <Icon size={20} />
    {active && <motion.div layoutId="view-toggle-pill" className="absolute inset-0 bg-white rounded-md shadow-md z-[-1]" transition={{ type: 'spring', stiffness: 300, damping: 25 }} />}
  </button>
);

const EventCard: React.FC<{ item: EventItem; t: any; language: 'mn' | 'en'; viewMode: 'grid' | 'list' }> = ({ item, t, language, viewMode }) => {
  const progress = (item.registered / item.capacity) * 100;
  return (
    <motion.div
      layout
      variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`group relative bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200/80 flex ${viewMode === 'grid' ? 'flex-col' : 'flex-col md:flex-row items-stretch'}`}
    >
      <div className={`relative overflow-hidden ${viewMode === 'grid' ? 'h-56 w-full' : 'h-full w-full md:w-2/5'}`}>
        <img src={item.imageUrl} alt={item.title[language]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
        <span className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold text-white rounded-full ${item.status === 'open' ? 'bg-green-500' : item.status === 'full' ? 'bg-red-500' : 'bg-slate-500'}`}>{t[item.status]}</span>
      </div>

      <div className={`p-6 w-full flex flex-col`}>
        <h3 className="text-xl font-bold text-slate-800 leading-tight mb-4 group-hover:text-blue-600 transition-colors">{item.title[language]}</h3>
        {/* Hover-to-reveal Details */}
        <motion.div className="overflow-hidden space-y-3 flex-grow" initial={{ height: 0, opacity: 0 }} whileHover={{ height: 'auto', opacity: 1 }}>
            <div className="flex items-center gap-2 text-sm text-slate-500"><FaCalendarCheck /> <span>{item.startDate}</span></div>
            <div className="flex items-center gap-2 text-sm text-slate-500"><FaMapMarkerAlt /> <span>{item.location[language]}</span></div>
            <div>
                 <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                    <span>{item.registered} / {item.capacity}</span>
                    {item.status === 'open' && <span>{item.capacity - item.registered} {t.spotsLeft}</span>}
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2"><motion.div initial={{ width: 0 }} whileInView={{ width: `${progress}%`}} viewport={{ once: true }} className={`h-2 rounded-full ${progress >= 100 ? 'bg-red-500' : 'bg-blue-500'}`} /></div>
            </div>
        </motion.div>
        <a href={item.link} className="mt-auto self-start mt-4 font-bold text-blue-600 group-hover:text-cyan-600 flex items-center gap-2">
            {item.status === 'open' ? t.register : t.viewDetails} <FaArrowRight className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </motion.div>
  );
};
const EmptyState: React.FC<{ t: any }> = ({ t }) => <div className="text-center py-20 col-span-full"><FaSearchMinus className="text-6xl text-slate-400 mx-auto mb-6" /><h3 className="text-2xl font-bold text-slate-700">No Events Found</h3></div>;

// --- Helper Hook for Countdown ---
const useCountdown = (targetDate: string) => {
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