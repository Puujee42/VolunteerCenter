"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FaUserCircle, FaMapMarkedAlt, FaTasks, FaBirthdayCake, 
  FaMedal, FaClipboardList, FaLightbulb, FaHandsHelping, 
  FaChartPie, FaCheckCircle, FaLeaf, FaPaw, FaGraduationCap, 
  FaFlag, FaUser, FaPlusCircle, FaCalendarAlt, FaSignOutAlt, FaTrash 
} from 'react-icons/fa';
import { 
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer 
} from 'recharts';

// --- 1. ICON MAPPER ---
const IconMap: any = {
  FaUserCircle, FaMapMarkedAlt, FaTasks, FaBirthdayCake,
  FaMedal, FaClipboardList, FaLightbulb, FaHandsHelping,
  FaChartPie, FaCheckCircle, FaLeaf, FaPaw, FaGraduationCap,
  FaFlag, FaUser, FaCalendarAlt
};

// --- 2. INTERFACES ---
interface DashboardClientProps {
  user: {
    id: string;
    firstName: string | null;
    username: string | null;
    imageUrl: string;
  };
  dbUser: any;
  opportunities: any[];
  events: any[]; 
}

// --- 3. MAIN COMPONENT ---
export default function DashboardClient({ user, dbUser, opportunities: initialOpps, events: initialEvents }: DashboardClientProps) {
  const router = useRouter();
  
  const [history, setHistory] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]); 
  const [loadingJoin, setLoadingJoin] = useState<string | null>(null);
  const [loadingLeave, setLoadingLeave] = useState<string | null>(null); // NEW

  // Initialize state
  useEffect(() => {
    if (dbUser) {
      setHistory(dbUser.history || []);

      const taggedOpps = (initialOpps || []).map(o => ({ ...o, type: 'opportunity' }));
      const taggedEvents = (initialEvents || []).map(e => ({ ...e, type: 'event' }));
      
      setItems([...taggedOpps, ...taggedEvents]);
    }
  }, [dbUser, initialOpps, initialEvents]);

  if (!dbUser) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;

  // --- JOIN LOGIC ---
  const handleJoin = async (item: any) => {
    setLoadingJoin(item.id);
    try {
      const res = await fetch('/api/user/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: item, type: item.type })
      });
      const data = await res.json();
      if (data.success) {
        setHistory([data.newHistoryItem, ...history]);
        router.refresh(); 
      }
    } catch (error) { console.error(error); } 
    finally { setLoadingJoin(null); }
  };

  // --- LEAVE LOGIC (NEW) ---
  const handleLeave = async (itemId: string, type: string) => {
    if (!confirm("Are you sure you want to leave this activity?")) return;

    setLoadingLeave(itemId);
    try {
        const res = await fetch('/api/user/leave', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemId, type })
        });
        const data = await res.json();

        if (data.success) {
            // Remove from local history immediately
            setHistory(prev => prev.filter(h => h.id !== itemId));
            router.refresh();
        }
    } catch (error) { console.error(error); }
    finally { setLoadingLeave(null); }
  };

  // --- FILTER LOGIC ---
  const availableItems = items.filter((item) => {
    const itemTitle = typeof item.title === 'string' ? item.title : (item.title?.en || item.title?.mn || "");
    const isTaken = history.some((h) => h.id === item._id || (h.title && h.title.toLowerCase().includes(itemTitle.toLowerCase())));
    return !isTaken;
  });

  const { profileDetails, rank, strengths, recommendations } = dbUser;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 pt-50">
      <div className="max-w-7xl mx-auto pt-35">
        
        {/* Header */}
        <motion.div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-800">
              Welcome Back, <span className="text-blue-600">{dbUser.name || user.firstName}!</span>
            </h1>
            <p className="mt-2 text-lg text-slate-500">Here is your volunteering impact snapshot.</p>
          </div>
          <img src={user.imageUrl} alt="Profile" className="w-16 h-16 rounded-full border-4 border-white shadow-md" />
        </motion.div>

        {/* Main Grid */}
        <motion.div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          
          <div className="lg:col-span-4 flex flex-col gap-8">
            <ProfileCard details={profileDetails} />
            <StrengthsRadarChart strengths={strengths} />
          </div>

          <div className="lg:col-span-5 flex flex-col gap-8">
             <RankCard rank={rank} />
             {/* Pass handleLeave to HistoryTimeline */}
             <HistoryTimeline history={history} onLeave={handleLeave} loadingLeave={loadingLeave} />
          </div>

          <div className="lg:col-span-3 flex flex-col gap-8">
             <OpportunityHub items={availableItems} onJoin={handleJoin} loadingId={loadingJoin} />
             <RecommendationsCard recommendations={recommendations} />
          </div>

        </motion.div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// UPDATED SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────

// 2. History Timeline (UPDATED with Leave Button)
const HistoryTimeline = ({ history, onLeave, loadingLeave }: { history: any[], onLeave: (id: string, type: string) => void, loadingLeave: string | null }) => (
    <motion.div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex-1" variants={fadeInUp}>
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FaClipboardList className="text-blue-500" /> Recent Activity
        </h3>
        <div className="space-y-6 relative pl-4 border-l-2 border-slate-100 h-96 overflow-y-auto pr-2 custom-scrollbar">
            {(!history || history.length === 0) ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <FaFlag className="text-3xl mb-2 opacity-30" />
                    <p className="text-sm italic">No history yet.</p>
                </div>
            ) : (
                history.map((item, idx) => {
                    const ItemIcon = IconMap[item.iconName] || FaCheckCircle;
                    // Assuming item in history has 'type' stored, if not default to 'opportunity'
                    // Make sure your join API saves the 'type' in history!
                    const itemType = item.type || 'opportunity'; 

                    return (
                        <div key={idx} className="relative pl-6 pb-2 group">
                            <div className="absolute -left-[25px] top-0 bg-white border-2 border-blue-500 rounded-full p-1 text-blue-500 text-xs">
                                <ItemIcon />
                            </div>
                            
                            {/* Header Row */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{item.date}</span>
                                    <h4 className="font-bold text-slate-800">{item.title}</h4>
                                </div>
                                
                                {/* LEAVE BUTTON */}
                                <button 
                                    onClick={() => onLeave(item.id, itemType)}
                                    disabled={loadingLeave === item.id}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full"
                                    title="Leave this activity"
                                >
                                    {loadingLeave === item.id ? <div className="animate-spin w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full"></div> : <FaTrash size={12} />}
                                </button>
                            </div>
                            
                            <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                        </div>
                    );
                })
            )}
        </div>
    </motion.div>
);

// ... (Other components OpportunityHub, ProfileCard, etc. stay exactly the same)
// Just include the rest of your existing sub-components here for the file to be complete.

const OpportunityHub = ({ items, onJoin, loadingId }: any) => (
    <motion.div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100" variants={fadeInUp}>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FaHandsHelping className="text-blue-500" /> Discover
            </h3>
            <span className="text-xs font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded-full">{items.length} New</span>
        </div>
        
        {items.length === 0 ? (
            <div className="text-center text-slate-400 py-6 text-sm border-2 border-dashed border-slate-100 rounded-xl">
                <FaCheckCircle className="mx-auto text-2xl text-green-400 mb-2" />
                You've joined everything!
            </div>
        ) : (
            <div className="space-y-3">
                {items.slice(0, 4).map((item: any, i: number) => {
                    const title = typeof item.title === 'string' ? item.title : (item.title?.en || item.title?.mn);
                    const isEvent = item.type === 'event';
                    let isFull = false;
                    let spotsLeft = 0;

                    if (isEvent) {
                        isFull = item.registered >= item.capacity;
                        spotsLeft = item.capacity - item.registered;
                    } else {
                        const filled = item.slots?.filled || 0;
                        const total = item.slots?.total || 10;
                        isFull = filled >= total;
                        spotsLeft = total - filled;
                    }

                    return (
                        <div key={i} className="p-3 rounded-xl border border-slate-100 hover:border-blue-300 transition-all bg-slate-50/50 flex flex-col gap-2 relative">
                            <span className={`absolute top-2 right-2 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${isEvent ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                                {isEvent ? "Event" : "Job"}
                            </span>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm pr-12 line-clamp-1">{title}</h4>
                                <div className="flex justify-between items-center mt-1 text-xs text-slate-500">
                                    <span>{isEvent ? item.startDate : (item.cause || "Volunteer")}</span>
                                    <span className={isFull ? "text-red-500" : "text-green-600 font-medium"}>
                                        {spotsLeft} spots left
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={() => onJoin(item)}
                                disabled={isFull || loadingId === item.id}
                                className={`w-full py-1.5 text-xs font-bold rounded flex items-center justify-center gap-1 transition-colors ${
                                    isFull 
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                            >
                                {loadingId === item.id ? "Joining..." : isFull ? "Full" : <>Join <FaPlusCircle /></>}
                            </button>
                        </div>
                    );
                })}
            </div>
        )}
    </motion.div>
);

const ProfileCard = ({ details }: any) => (
  <motion.div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100" variants={fadeInUp}>
    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <FaUserCircle className="text-blue-500" /> My Profile
    </h3>
    <div className="space-y-4">
        <ProfileRow label="Age" value={details.age} icon={FaBirthdayCake} />
        <ProfileRow label="Location" value={`${details.province}, ${details.district}`} icon={FaMapMarkedAlt} />
        <ProfileRow label="Program" value={details.program} icon={FaTasks} />
    </div>
  </motion.div>
);

const ProfileRow = ({ label, value, icon: Icon }: any) => (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-md text-slate-400 shadow-sm"><Icon /></div>
            <span className="text-sm text-slate-500 font-medium">{label}</span>
        </div>
        <span className="font-bold text-slate-800">{value}</span>
    </div>
);

const RankCard = ({ rank }: any) => {
    const RankIcon = IconMap[rank.iconName] || FaMedal;
    return (
        <motion.div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden" variants={fadeInUp}>
            <div className="relative z-10 flex items-center gap-6">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full">
                    <RankIcon className="text-5xl text-yellow-300 drop-shadow-md" />
                </div>
                <div className="flex-1">
                    <p className="text-blue-100 font-medium mb-1">Current Rank</p>
                    <h2 className="text-3xl font-bold mb-2">{rank.current}</h2>
                    <div className="flex items-center gap-2 text-sm text-blue-100 mb-2">
                        <span>Next Level Progress</span>
                        <span className="font-bold">{rank.progress}%</span>
                    </div>
                    <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${rank.progress}%` }}></div>
                    </div>
                </div>
            </div>
            <FaMedal className="absolute -bottom-4 -right-4 text-9xl text-white/5 rotate-12" />
        </motion.div>
    );
};

const StrengthsRadarChart = ({ strengths }: any) => (
    <motion.div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100" variants={fadeInUp}>
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FaChartPie className="text-blue-500" /> Skills Radar
        </h3>
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={strengths}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="skill" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="My Skills" dataKey="value" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.5} />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    </motion.div>
);

const RecommendationsCard = ({ recommendations }: any) => (
    <motion.div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg" variants={fadeInUp}>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FaLightbulb className="text-yellow-400" /> Recommended
        </h3>
        <div className="space-y-4">
            {recommendations.map((rec: any, i: number) => {
                const RecIcon = IconMap[rec.iconName] || FaLightbulb;
                return (
                    <div key={i} className="flex gap-3 items-start">
                        <div className="mt-1 min-w-[24px]"><RecIcon className="text-indigo-400" /></div>
                        <div>
                            <h4 className="font-bold text-sm text-indigo-100">{rec.title}</h4>
                            <p className="text-xs text-slate-400 mt-1">{rec.description}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    </motion.div>
);

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};