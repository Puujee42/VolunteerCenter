"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  FaUsers, FaCalendarAlt, FaClipboardList, 
  FaUserPlus, FaMapMarkedAlt
} from "react-icons/fa";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useLanguage } from "../context/LanguageContext"; 

// 1. Import Types
import { UserLocation } from "../map/Volunteermap"; 

// 2. Dynamic Import of Map
const VolunteerMap = dynamic(() => import("../map/Volunteermap"), {
    ssr: false,
    loading: () => (
        <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">
            Loading Map...
        </div>
    )
});


const adminTranslations = {
  mn: {
    header: { title: "Хяналтын Самбар", subtitle: "Тавтай морил, өнөөдрийн статистик мэдээлэл.", viewSite: "Вэбсайт руу очих" },
    stats: { totalUsers: "Нийт хэрэглэгч", newUsers: "Өнөөдөр бүртгүүлсэн", activeEvents: "Идэвхтэй эвэнт", applications: "Бүртгэлүүд", growth: "Өсөлттэй!", noSignups: "Бүртгэл алга" },
    map: { title: "Сайн дурынхны байршил", subtitle: "Хэрэглэгчдийн тархалт (Аймгаар)" },
    chart: { title: "Хэрэглэгчийн өсөлт (Сүүлийн 7 хоног)" },
    actions: { title: "Шуурхай үйлдлүүд", postEvent: "Шинэ эвэнт нийтлэх", reviewApps: "Бүртгэл шалгах", editRoles: "Хэрэглэгчийн эрх засах" },
    status: { label: "Системийн төлөв:", value: "Хэвийн" }
  },
  en: {
    header: { title: "Dashboard Overview", subtitle: "Welcome back, here is what's happening today.", viewSite: "View Live Site" },
    stats: { totalUsers: "Total Users", newUsers: "New Users Today", activeEvents: "Active Events", applications: "Applications", growth: "Growth!", noSignups: "No signups yet" },
    map: { title: "Volunteer Distribution", subtitle: "User Density Map by Province" },
    chart: { title: "User Signups (Last 7 Days)" },
    actions: { title: "Quick Actions", postEvent: "Post New Event", reviewApps: "Review Applications", editRoles: "Edit User Roles" },
    status: { label: "System Status:", value: "Operational" }
  }
};

interface AdminProps {
  user: { name: string; image: string };
  stats: {
    users: number;
    events: number;
    opportunities: number;
    applications: number;
    signupsToday: number;
  };
  chartData: { date: string; signups: number }[];
  allUsers: UserLocation[]; 
}

export default function AdminDashboardClient({ user, stats, chartData, allUsers }: AdminProps) {
  const { language, setLanguage } = useLanguage();
  const t = adminTranslations[language];

  const toggleLanguage = () => {
    setLanguage(language === "mn" ? "en" : "mn");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <main className="pt-24 flex-1 p-8 overflow-y-auto ml-64">
        
        {/* Header */}
        <header className="mb-8 flex justify-between items-center">
            <div>
                <h2 className="text-3xl font-bold text-slate-800">{t.header.title}</h2>
                <p className="text-slate-500">{t.header.subtitle}</p>
            </div>
            <div className="flex gap-4">
                 <button onClick={toggleLanguage} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                    {language === 'mn' ? 'EN' : 'MN'}
                </button>
                <Link href="/" className="px-4 py-2 bg-blue-600 border border-blue-600 rounded-lg text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                    {t.header.viewSite}
                </Link>
            </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard icon={FaUsers} label={t.stats.totalUsers} value={stats.users} color="bg-blue-500" />
            <StatCard 
                icon={FaUserPlus} 
                label={t.stats.newUsers} 
                value={stats.signupsToday} 
                color="bg-emerald-500" 
                subtext={stats.signupsToday > 0 ? t.stats.growth : t.stats.noSignups}
            />
            <StatCard icon={FaCalendarAlt} label={t.stats.activeEvents} value={stats.events} color="bg-purple-500" />
            <StatCard icon={FaClipboardList} label={t.stats.applications} value={stats.applications} color="bg-orange-500" />
        </div>

        {/* Map Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <FaMapMarkedAlt className="text-xl" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800">{t.map.title}</h3>
                    <p className="text-xs text-slate-500">{t.map.subtitle}</p>
                </div>
            </div>
            {/* Map Container - using explicit style to be safe */}
            <div style={{ width: '100%', height: '400px' }}>
                <VolunteerMap users={allUsers} />
            </div>
        </div>

        {/* Charts & Actions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Chart Container */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-6">{t.chart.title}</h3>
                
                {/* --- FIX: Use inline style for height to prevent Recharts error --- */}
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis 
                                dataKey="date" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#64748b', fontSize: 12}} 
                                dy={10} 
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#64748b', fontSize: 12}} 
                                allowDecimals={false} 
                            />
                            <Tooltip 
                                cursor={{fill: '#f1f5f9'}} 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                            />
                            <Bar 
                                dataKey="signups" 
                                fill="#3b82f6" 
                                radius={[4, 4, 0, 0]} 
                                barSize={40} 
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-4">{t.actions.title}</h3>
                <div className="flex flex-col gap-3">
                    <Link href="/admin/events" className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-600 font-medium transition-colors flex justify-between items-center group">
                        {t.actions.postEvent} <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                    <Link href="/admin/opportunities" className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-600 font-medium transition-colors flex justify-between items-center group">
                        {t.actions.reviewApps} <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                    <Link href="/admin/users" className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-600 font-medium transition-colors flex justify-between items-center group">
                        {t.actions.editRoles} <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>
                <div className="mt-auto pt-6 border-t border-slate-100">
                    <p className="text-xs text-slate-400">{t.status.label} <span className="text-green-500 font-bold">{t.status.value}</span></p>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}

// Helper with explicit Types
interface StatCardProps {
    icon: React.ElementType;
    label: string;
    value: number;
    color: string;
    subtext?: string;
}

const StatCard = ({ icon: Icon, label, value, color, subtext }: StatCardProps) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md transition-shadow"
    >
        <div className={`p-4 rounded-lg text-white ${color}`}>
            <Icon className="text-2xl" />
        </div>
        <div>
            <p className="text-sm text-slate-500 font-medium">{label}</p>
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
            {subtext && <p className="text-xs text-green-600 font-bold mt-1">{subtext}</p>}
        </div>
    </motion.div>
);