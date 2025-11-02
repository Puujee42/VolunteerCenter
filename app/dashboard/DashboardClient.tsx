"use client";

import { FaUserCircle, FaMapMarkedAlt, FaTasks, FaBirthdayCake, FaMedal, FaClipboardList, FaLightbulb, FaHandsHelping, FaChartPie, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { volunteeringHistory, recommendations, rankData, strengths } from './data/dashboardData';
import { ProfileCard } from './ProfileCard';
import { StrengthsRadarChart } from './StrengthRadarChart';
import { RankCard } from './RankCard';
import { HistoryTimeline } from './HistoryTimeline';
import { RecommendationsCard } from './RecommendationsCard';
import { ActivityCard } from './ActivityCard';
import { OpportunityHub } from './OpportunityHub';

// Define a simple interface for the user data.
interface SimpleUser {
  id: string;
  firstName: string | null;
  username: string | null;
}

// Update the main props interface.
interface DashboardClientProps {
  user: SimpleUser | null;
  age: number | string;
  province: string;
  district: string;
  program: string;
}

export default function DashboardClient({ user, age, province, district, program }: DashboardClientProps) {
  if (!user) return null; // Or return a loading/error state

  // Animation variants for staggering children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // This will animate children one by one with a 0.2s delay
      },
    },
  };

  return (
    <div>
      {/* --- Welcome Header --- */}
      <motion.div
        className="mb-12 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800">
          Welcome Back, <span className="text-blue-600">{user.firstName || user.username}!</span>
        </h1>
        <p className="mt-2 text-lg text-slate-500">Here's a snapshot of your journey and progress.</p>
      </motion.div>

      {/* --- Main Grid --- */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Column */}
        <div className="flex flex-col gap-8">
          <ProfileCard user={user} age={age} province={province} district={district} program={program} />
          <ActivityCard />
          <StrengthsRadarChart strengths={strengths} />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-8">
          <OpportunityHub />
          <RankCard rankData={rankData} />
          <HistoryTimeline history={volunteeringHistory} />
          <RecommendationsCard recommendations={recommendations} />
        </div>
      </motion.div>
    </div>
  );
}