'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { FaMapMarkerAlt, FaUsers, FaGripHorizontal, FaList, FaChevronDown, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useLanguage } from "../context/LanguageContext";

// --- Bilingual Data Store for UI Text ---
const eventsContentData = {
  mn: {
    heroTitle: "Үйл явдлууд",
    heroBreadcrumb: "Нүүр хуудас",
    sectionTitle: "Бүх Үйл явдал",
    sortBy: "Эрэмбэлэх:",
    filterBy: "Шүүх:",
    sortOptions: {
      date_desc: "Огноо (Шинэ)",
      date_asc: "Огноо (Хуучин)",
      popularity: "Алдартай",
    },
    filterOptions: {
      all: 'Бүгд',
      open: 'Нээлттэй',
      full: 'Дүүрсэн',
      ended: 'Дууссан'
    },
    register: "Бүртгүүлэх",
    viewDetails: "Дэлгэрэнгүй",
    spotsLeft: "суудал үлдсэн",
    full: "Дүүрсэн",
    ended: "Дууссан",
    open: "Нээлттэй",
    registrationCloses: "Бүртгэл дуусна:",
  },
  en: {
    heroTitle: "Events",
    heroBreadcrumb: "Home",
    sectionTitle: "All Events",
    sortBy: "Sort By:",
    filterBy: "Filter By:",
    sortOptions: {
      date_desc: "Date (Newest)",
      date_asc: "Date (Oldest)",
      popularity: "Popularity",
    },
    filterOptions: {
      all: 'All Statuses',
      open: 'Open',
      full: 'Full',
      ended: 'Ended'
    },
    register: "Register Now",
    viewDetails: "View Details",
    spotsLeft: "spots left",
    full: "Full",
    ended: "Ended",
    open: "Open",
    registrationCloses: "Closes:",
  }
};

// --- Updated EventItem Interface ---
type EventStatus = 'open' | 'full' | 'ended';

interface EventItem {
  id: string;
  deadline: string; // ISO Date string for sorting
  startDate: { day: string; month: string; }; // For display badge
  fullDate: string;
  imageUrl: string;
  link: string;
  status: EventStatus;
  registered: number;
  capacity: number;
  title: { mn: string; en: string; };
  location: { mn: string; en: string; };
}

// --- Fully Bilingual Mock Data ---
const bilingualMockEventsData: EventItem[] = [
    { id: 'future-owner-2022', deadline: '2022-04-10', startDate: { day: '25', month: 'MAR' }, fullDate: '2022-03-25', status: 'ended', registered: 3000, capacity: 3000, title: { mn: '"Ирээдүйн эзэд 2022" Мэргэжил сонголтын аян', en: '"Future Owners 2022" Career Choice Campaign' }, location: { mn: 'Улаанбаатар', en: 'Ulaanbaatar' }, imageUrl: '/data.jpg', link: '/event-1' },
    { id: 'family-dev-training', deadline: '2021-04-23', startDate: { day: '12', month: 'MAY' }, fullDate: '2021-05-12', status: 'ended', registered: 50, capacity: 50, title: { mn: '"Гэр бүлээ хөгжье" Цахим сургалт', en: '"Develop Your Family" E-Learning Course' }, location: { mn: 'Онлайн', en: 'Online' }, imageUrl: '/data.jpg', link: '/event-2' },
    { id: 'youth-hackathon-2023', deadline: '2023-09-01', startDate: { day: '15', month: 'SEP' }, fullDate: '2023-09-15', status: 'open', registered: 85, capacity: 120, title: { mn: 'Залуучуудын Инновацийн Хакертон', en: 'Youth Innovation Hackathon' }, location: { mn: 'Технологийн Парк', en: 'Technology Park' }, imageUrl: '/data.jpg', link: '/event-3' },
    { id: 'volunteer-meetup-2023', deadline: '2023-07-20', startDate: { day: '05', month: 'AUG' }, fullDate: '2023-08-05', status: 'full', registered: 200, capacity: 200, title: { mn: 'Сайн дурынхны уулзалт 2023', en: 'Annual Volunteer Meetup 2023' }, location: { mn: 'Үндэсний цэцэрлэгт хүрээлэн', en: 'National Park' }, imageUrl: '/data.jpg', link: '/event-4' },
    // Adding more events for pagination
    { id: 'code-for-good-2024', deadline: '2024-10-15', startDate: { day: '01', month: 'NOV' }, fullDate: '2024-11-01', status: 'open', registered: 45, capacity: 100, title: { mn: '"Сайн сайхны төлөө код" Уралдаан', en: '"Code for Good" Competition' }, location: { mn: 'Онлайн', en: 'Online' }, imageUrl: '/data.jpg', link: '/event-5' },
    { id: 'enviro-cleanup-2024', deadline: '2024-06-01', startDate: { day: '10', month: 'JUN' }, fullDate: '2024-06-10', status: 'open', registered: 150, capacity: 250, title: { mn: 'Байгаль орчныг цэвэрлэх өдөр', en: 'Environmental Cleanup Day' }, location: { mn: 'Туул голын эрэг', en: 'Tuul River Bank' }, imageUrl: '/data.jpg', link: '/event-6' },
    { id: 'leadership-workshop-2024', deadline: '2024-08-20', startDate: { day: '05', month: 'SEP' }, fullDate: '2024-09-05', status: 'full', registered: 75, capacity: 75, title: { mn: 'Манлайллын ур чадвар хөгжүүлэх сургалт', en: 'Leadership Development Workshop' }, location: { mn: 'Corporate Tower', en: 'Corporate Tower' }, imageUrl: '/data.jpg', link: '/event-7' },
];


const itemsPerPage = 6;

// --- Main Events Section Component ---
const EventsSection: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'popularity'>('date_desc');
  const [filterBy, setFilterBy] = useState<EventStatus | 'all'>('all');

  const { language } = useLanguage();
  const t = eventsContentData[language];

  const filteredAndSortedEvents = useMemo(() => {
    const filtered = [...bilingualMockEventsData].filter(event => 
      filterBy === 'all' || event.status === filterBy
    );
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.registered - a.registered;
        case 'date_asc':
          return new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime();
        case 'date_desc':
        default:
          return new Date(b.fullDate).getTime() - new Date(a.fullDate).getTime();
      }
    });
  }, [sortBy, filterBy]);

  const totalPages = Math.ceil(filteredAndSortedEvents.length / itemsPerPage);
  const currentEvents = filteredAndSortedEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };


  return (
    <div className='bg-slate-900'>
      <EventsHero t={t} />
      <section className="py-24 bg-slate-100">
        <div className="container mx-auto max-w-7xl px-4">
          <ControlsHeader 
            t={t} 
            viewMode={viewMode} 
            setViewMode={setViewMode} 
            sortBy={sortBy} 
            setSortBy={setSortBy}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            numResults={filteredAndSortedEvents.length}
          />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode + currentPage + sortBy + filterBy} 
              variants={{
                  hidden: { opacity: 0 },
                  visible: {
                      opacity: 1,
                      transition: {
                          staggerChildren: 0.1,
                      },
                  },
              }}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className={`transition-all duration-500 ease-in-out ${
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                  : 'flex flex-col gap-6'
              }`}
            >
              {currentEvents.map((item) => (
                <EventCard key={item.id} item={item} t={t} language={language} viewMode={viewMode} />
              ))}
            </motion.div>
          </AnimatePresence>
          
           {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}

        </div>
      </section>
    </div>
  );
};

 // --- Hero Component ---
 const EventsHero: React.FC<{ t: typeof eventsContentData.en }> = ({ t }) => (
   <div className="relative py-28 bg-[#0d1127] text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/10 z-10"></div>
       <div className="absolute inset-0 z-0 opacity-50">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#a855f799,_transparent_50%)]" />
       </div>
     <div className="container mx-auto max-w-7xl px-4 relative z-20 text-center">
       <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="text-5xl md:text-6xl font-bold mb-2">
         {t.heroTitle}
       </motion.h1>
       <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }} className="text-lg text-slate-300">
         {t.heroBreadcrumb} / {t.heroTitle}
       </motion.p>
     </div>
   </div>
 );


// --- Controls Header Component ---
interface ControlsHeaderProps {
  t: typeof eventsContentData.en;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  sortBy: string;
  setSortBy: (sort: 'date_desc' | 'date_asc' | 'popularity') => void;
  filterBy: EventStatus | 'all';
  setFilterBy: (filter: EventStatus | 'all') => void;
  numResults: number;
}
const ControlsHeader: React.FC<ControlsHeaderProps> = ({ t, viewMode, setViewMode, sortBy, setSortBy, filterBy, setFilterBy, numResults }) => (
  <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border">
    <div>
      <h2 className="text-3xl font-bold text-slate-800">{t.sectionTitle}</h2>
      <p className='text-slate-500'>{numResults} events found</p>
    </div>
    <div className="flex items-center gap-4 flex-wrap justify-center">
      {/* Filter Dropdown */}
      <div className="relative">
        <label className='text-sm font-semibold text-slate-600 absolute -top-5 left-1'>{t.filterBy}</label>
        <select value={filterBy} onChange={(e) => setFilterBy(e.target.value as any)} className="appearance-none bg-white border border-slate-300 rounded-lg py-2 pl-4 pr-10 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition">
          <option value="all">{t.filterOptions.all}</option>
          <option value="open">{t.filterOptions.open}</option>
          <option value="full">{t.filterOptions.full}</option>
          <option value="ended">{t.filterOptions.ended}</option>
        </select>
        <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>

      {/* Sort Dropdown */}
       <div className="relative">
        <label className='text-sm font-semibold text-slate-600 absolute -top-5 left-1'>{t.sortBy}</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="appearance-none bg-white border border-slate-300 rounded-lg py-2 pl-4 pr-10 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition">
          <option value="date_desc">{t.sortOptions.date_desc}</option>
          <option value="date_asc">{t.sortOptions.date_asc}</option>
          <option value="popularity">{t.sortOptions.popularity}</option>
        </select>
        <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>

      <div className="flex items-center bg-slate-200 rounded-lg p-1 self-end">
        <ViewToggleButton icon={FaGripHorizontal} active={viewMode === 'grid'} onClick={() => setViewMode('grid')} />
        <ViewToggleButton icon={FaList} active={viewMode === 'list'} onClick={() => setViewMode('list')} />
      </div>
    </div>
  </div>
);

// --- View Toggle Button ---
const ViewToggleButton: React.FC<{ icon: React.ElementType; active: boolean; onClick: () => void; }> = ({ icon: Icon, active, onClick }) => (
  <button onClick={onClick} className="relative p-2.5 rounded-md transition-colors text-slate-600 hover:text-purple-600">
    <Icon size={20} />
    {active && <motion.div layoutId="view-toggle-pill" className="absolute inset-0 bg-white rounded-md shadow-md z-[-1]" transition={{ type: 'spring', stiffness: 300, damping: 25 }} />}
  </button>
);


// --- Event Card Component ---
interface EventCardProps {
  item: EventItem;
  t: typeof eventsContentData.en;
  language: 'mn' | 'en';
  viewMode: 'grid' | 'list';
}
const EventCard: React.FC<EventCardProps> = ({ item, t, language, viewMode }) => {
  const progress = (item.registered / item.capacity) * 100;

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" }},
  };

  const statusColors = {
    open: "bg-green-500",
    full: "bg-orange-500",
    ended: "bg-slate-500",
  }

  // Common content moved into a variable to avoid repetition
  const cardContent = (
    <>
     <div className={`p-6 w-full flex flex-col flex-grow`}>
        <p className="text-sm text-slate-500 mb-2">{t.registrationCloses} {item.deadline}</p>
        <h3 className="text-xl font-bold text-slate-800 mb-3 leading-tight group-hover:text-purple-600 transition-colors">
          {item.title[language]}
        </h3>
        <div className="flex items-center gap-4 text-sm text-slate-500 mt-auto">
          <span className="flex items-center gap-1.5"><FaMapMarkerAlt className="text-purple-500" />{item.location[language]}</span>
        </div>
      </div>
      <div className="p-6 pt-0 md:pt-6 w-full md:w-auto">
        <div className="my-2">
            <div className="flex justify-between text-sm font-semibold text-slate-600 mb-1">
                <span className="flex items-center gap-1.5"><FaUsers /> {item.registered} / {item.capacity}</span>
                {item.status === 'open' && <span className='text-green-600 font-bold'>{item.capacity - item.registered} {t.spotsLeft}</span>}
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
                <motion.div initial={{ width: 0 }} whileInView={{ width: `${progress}%`}} viewport={{once: true}} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }} className={`h-2 rounded-full ${progress >= 100 ? 'bg-orange-500' : 'bg-gradient-to-r from-purple-500 to-fuchsia-500'}`} />
            </div>
        </div>
        <a
          href={item.status === 'open' ? item.link : '#'}
          onClick={item.status !== 'open' ? (e) => e.preventDefault() : undefined}
          aria-disabled={item.status !== 'open'}
          tabIndex={item.status !== 'open' ? -1 : 0}
          className={`mt-4 block text-center w-full px-6 py-2.5 font-bold rounded-lg transition-all shadow-md group-hover:shadow-lg ${item.status === 'open' ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-slate-200 text-slate-600 cursor-not-allowed'}`}
        >
          {item.status === 'open' ? t.register : t.viewDetails}
        </a>
      </div>
    </>
  );

  return (
    <motion.div
      layout
      variants={cardVariants}
      className={`bg-white rounded-2xl shadow-lg overflow-hidden group border border-transparent hover:border-purple-300 transition-all duration-300 flex hover:shadow-purple-100 hover:-translate-y-1 ${viewMode === 'grid' ? 'flex-col' : 'flex-col md:flex-row items-center'}`}
    >
      <div className={`relative overflow-hidden ${viewMode === 'grid' ? 'h-56 w-full' : 'h-full w-full md:w-2/5'}`}>
        <div className={`absolute top-4 left-4 text-center z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-2 leading-none`}>
          <p className="text-3xl font-bold text-purple-600">{item.startDate.day}</p>
          <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">{item.startDate.month}</p>
        </div>
        <img src={item.imageUrl} alt={item.title[language]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-4 right-4 text-white">
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[item.status]}`}>
            {t[item.status]}
          </span>
        </div>
      </div>
      {/* List view needs specific layout */}
      {viewMode === 'list' ? (
        <div className="flex flex-col md:flex-row w-full items-center">
         {cardContent}
        </div>
      ) : (
        <>
        <div className="p-6 w-full flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-slate-800 mb-3 leading-tight group-hover:text-purple-600 transition-colors h-14">
            {item.title[language]}
          </h3>
          <div className="flex items-center gap-4 text-sm text-slate-500 mt-auto">
            <span className="flex items-center gap-1.5"><FaMapMarkerAlt className="text-purple-500" />{item.location[language]}</span>
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="my-2">
              <div className="flex justify-between text-sm font-semibold text-slate-600 mb-1">
                  <span className="flex items-center gap-1.5"><FaUsers /> {item.registered} / {item.capacity}</span>
                  {item.status === 'open' && <span className='text-green-600 font-bold'>{item.capacity - item.registered} {t.spotsLeft}</span>}
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${progress}%`}} viewport={{once: true}} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }} className={`h-2 rounded-full ${progress >= 100 ? 'bg-orange-500' : 'bg-gradient-to-r from-purple-500 to-fuchsia-500'}`} />
              </div>
          </div>
          <a
            href={item.status === 'open' ? item.link : '#'}
            onClick={item.status !== 'open' ? (e) => e.preventDefault() : undefined}
            aria-disabled={item.status !== 'open'}
            tabIndex={item.status !== 'open' ? -1 : 0}
            className={`mt-4 block text-center w-full px-6 py-2.5 font-bold rounded-lg transition-all shadow-md group-hover:shadow-lg ${item.status === 'open' ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-slate-200 text-slate-600 cursor-not-allowed'}`}
          >
            {item.status === 'open' ? t.register : t.viewDetails}
          </a>
        </div>
        </>
      )}
    </motion.div>
  );
};

const PaginationControls: React.FC<{ currentPage: number, totalPages: number, onPageChange: (page: number) => void }> = ({ currentPage, totalPages, onPageChange }) => (
    <div className="flex justify-center items-center gap-4 mt-16">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <FaArrowLeft />
            Previous
        </button>

        <span className="font-semibold text-slate-600">
            Page {currentPage} of {totalPages}
        </span>

        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Next
            <FaArrowRight />
        </button>
    </div>
);


export default EventsSection;