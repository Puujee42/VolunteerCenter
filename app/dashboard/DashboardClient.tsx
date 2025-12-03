"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaUserCircle, FaMapMarkedAlt, FaTasks, FaBirthdayCake, 
  FaMedal, FaClipboardList, FaLightbulb, FaHandsHelping, 
  FaChartPie, FaCheckCircle, FaLeaf, FaPaw, FaGraduationCap, 
  FaFlag, FaUser 
} from 'react-icons/fa';
import { 
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer 
} from 'recharts';

// --- 1. ICON MAPPER ---
// MongoDB stores "FaMedal", but React needs the actual component.
const IconMap: any = {
  FaUserCircle, FaMapMarkedAlt, FaTasks, FaBirthdayCake,
  FaMedal, FaClipboardList, FaLightbulb, FaHandsHelping,
  FaChartPie, FaCheckCircle, FaLeaf, FaPaw, FaGraduationCap,
  FaFlag, FaUser
};

// --- 2. INTERFACES ---
interface DashboardClientProps {
  user: {
    id: string;
    firstName: string | null;
    username: string | null;
    imageUrl: string;
  };
  dbUser: any;      // The full user profile from MongoDB
  opportunities: any[]; // The list of opportunities from MongoDB
}

// --- 3. MAIN COMPONENT ---
export default function DashboardClient({ user, dbUser, opportunities }: DashboardClientProps) {
  
  // Safety Check: If DB sync hasn't finished yet
  if (!dbUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800">Setting up your profile...</h2>
            <p className="text-slate-500">Please refresh the page in a moment.</p>
        </div>
      </div>
    );
  }

  // --- PREPARE DATA FROM DB ---
  const { profileDetails, rank, history, strengths, recommendations } = dbUser;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Welcome Header --- */}
        <motion.div
          className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-800">
              Welcome Back, <span className="text-blue-600">{dbUser.name || user.firstName}!</span>
            </h1>
            <p className="mt-2 text-lg text-slate-500">Here is your volunteering impact snapshot.</p>
          </div>
          <img 
            src={user.imageUrl} 
            alt="Profile" 
            className="w-16 h-16 rounded-full border-4 border-white shadow-md"
          />
        </motion.div>

        {/* --- Main Grid --- */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* LEFT COLUMN (Profile, Stats, Radar) - Spans 4 columns */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <ProfileCard details={profileDetails} />
            <StrengthsRadarChart strengths={strengths} />
          </div>

          {/* MIDDLE COLUMN (Rank, History) - Spans 5 columns */}
          <div className="lg:col-span-5 flex flex-col gap-8">
             <RankCard rank={rank} />
             <HistoryTimeline history={history} />
          </div>

          {/* RIGHT COLUMN (Opportunities, Recommendations) - Spans 3 columns */}
          <div className="lg:col-span-3 flex flex-col gap-8">
             <OpportunityHub opportunities={opportunities} />
             <RecommendationsCard recommendations={recommendations} />
          </div>

        </motion.div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTS (Included here for easy copy-paste)
// ─────────────────────────────────────────────────────────────

// 1. Profile Card
const ProfileCard = ({ details }: { details: any }) => (
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

// 2. Rank Card
const RankCard = ({ rank }: { rank: any }) => {
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
            {/* Decoration */}
            <FaMedal className="absolute -bottom-4 -right-4 text-9xl text-white/5 rotate-12" />
        </motion.div>
    );
};

// 3. History Timeline
const HistoryTimeline = ({ history }: { history: any[] }) => (
    <motion.div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex-1" variants={fadeInUp}>
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FaClipboardList className="text-blue-500" /> Recent Activity
        </h3>
        <div className="space-y-6 relative pl-4 border-l-2 border-slate-100">
            {history.length === 0 ? (
                <p className="text-slate-500 text-sm italic">No history yet. Start volunteering!</p>
            ) : (
                history.map((item, idx) => {
                    const ItemIcon = IconMap[item.iconName] || FaCheckCircle;
                    return (
                        <div key={idx} className="relative pl-6">
                            <div className="absolute -left-[25px] top-0 bg-white border-2 border-blue-500 rounded-full p-1 text-blue-500 text-xs">
                                <ItemIcon />
                            </div>
                            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{item.date}</span>
                            <h4 className="font-bold text-slate-800">{item.title}</h4>
                            <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                        </div>
                    );
                })
            )}
        </div>
    </motion.div>
);

// 4. Radar Chart
const StrengthsRadarChart = ({ strengths }: { strengths: any[] }) => (
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

// 5. Opportunity Hub
const OpportunityHub = ({ opportunities }: { opportunities: any[] }) => (
    <motion.div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100" variants={fadeInUp}>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FaHandsHelping className="text-blue-500" /> Opportunities
            </h3>
            <span className="text-xs font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded-full">{opportunities.length} New</span>
        </div>
        <div className="space-y-3">
            {opportunities.slice(0, 3).map((opp, i) => (
                <div key={i} className="p-3 rounded-xl border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group bg-slate-50/50">
                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{opp.title}</h4>
                    <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                        <span>{opp.cause}</span>
                        <span className="text-green-600 font-medium">{opp.slots.total - opp.slots.filled} spots left</span>
                    </div>
                </div>
            ))}
        </div>
    </motion.div>
);

// 6. Recommendations
const RecommendationsCard = ({ recommendations }: { recommendations: any[] }) => (
    <motion.div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg" variants={fadeInUp}>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FaLightbulb className="text-yellow-400" /> Recommended
        </h3>
        <div className="space-y-4">
            {recommendations.map((rec, i) => {
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

// Animation Helper
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};