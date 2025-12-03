"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FaUsers, FaCalendarAlt, FaHandsHelping, FaClipboardList, 
  FaChartLine, FaCog, FaSignOutAlt, FaUserPlus, FaGlobe
} from "react-icons/fa";
import { SignOutButton } from "@clerk/nextjs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useLanguage } from "../context/LanguageContext"; // Adjust path if needed

// --- TRANSLATION DATA ---
const adminTranslations = {
  mn: {
    sidebar: {
      title: "Админ Панель",
      dashboard: "Хяналтын самбар",
      users: "Хэрэглэгчид",
      events: "Арга хэмжээ",
      opportunities: "Сайн дурын ажил",
      settings: "Тохиргоо",
      role: "Супер Админ",
      signout: "Гарах"
    },
    header: {
      title: "Хяналтын Самбар",
      subtitle: "Тавтай морил, өнөөдрийн статистик мэдээлэл.",
      viewSite: "Вэбсайт руу очих"
    },
    stats: {
      totalUsers: "Нийт хэрэглэгч",
      newUsers: "Өнөөдөр бүртгүүлсэн",
      activeEvents: "Идэвхтэй эвэнт",
      applications: "Бүртгэлүүд",
      growth: "Өсөлттэй!",
      noSignups: "Бүртгэл алга"
    },
    chart: {
      title: "Хэрэглэгчийн өсөлт (Сүүлийн 7 хоног)"
    },
    actions: {
      title: "Шуурхай үйлдлүүд",
      postEvent: "Шинэ эвэнт нийтлэх",
      reviewApps: "Бүртгэл шалгах",
      editRoles: "Хэрэглэгчийн эрх засах"
    },
    status: {
      label: "Системийн төлөв:",
      value: "Хэвийн"
    }
  },
  en: {
    sidebar: {
      title: "Admin Panel",
      dashboard: "Dashboard",
      users: "Manage Users",
      events: "Events",
      opportunities: "Opportunities",
      settings: "Settings",
      role: "Super Admin",
      signout: "Sign Out"
    },
    header: {
      title: "Dashboard Overview",
      subtitle: "Welcome back, here is what's happening today.",
      viewSite: "View Live Site"
    },
    stats: {
      totalUsers: "Total Users",
      newUsers: "New Users Today",
      activeEvents: "Active Events",
      applications: "Applications",
      growth: "Growth!",
      noSignups: "No signups yet"
    },
    chart: {
      title: "User Signups (Last 7 Days)"
    },
    actions: {
      title: "Quick Actions",
      postEvent: "Post New Event",
      reviewApps: "Review Applications",
      editRoles: "Edit User Roles"
    },
    status: {
      label: "System Status:",
      value: "Operational"
    }
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
  chartData: any[];
}

export default function AdminDashboardClient({ user, stats, chartData }: AdminProps) {
  const { language, setLanguage } = useLanguage();
  const t = adminTranslations[language];

  // Simple toggle function for the admin panel
  const toggleLanguage = () => {
    setLanguage(language === "mn" ? "en" : "mn");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      
    

      {/* --- Main Content --- */}
      <main className="pt-24 flex-1 p-8 overflow-y-auto ml-64">
        <header className="mb-8 flex justify-between items-center">
            <div>
                <h2 className="text-3xl font-bold text-slate-800">{t.header.title}</h2>
                <p className="text-slate-500">{t.header.subtitle}</p>
            </div>
            <Link href="/" className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                {t.header.viewSite}
            </Link>
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

        {/* --- Charts Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 1. Main Chart: User Growth */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-6">{t.chart.title}</h3>
                <div className="h-64 w-full">
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

            {/* 2. Side Panel: Quick Actions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-4">{t.actions.title}</h3>
                <div className="flex flex-col gap-3">
                    <Link href="/admin/events" className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-600 font-medium transition-colors flex justify-between items-center">
                        {t.actions.postEvent} <span>→</span>
                    </Link>
                    <Link href="/admin/opportunities" className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-600 font-medium transition-colors flex justify-between items-center">
                        {t.actions.reviewApps} <span>→</span>
                    </Link>
                    <Link href="/admin/users" className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-600 font-medium transition-colors flex justify-between items-center">
                        {t.actions.editRoles} <span>→</span>
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

// --- Sub Components ---

const NavItem = ({ icon: Icon, label, href }: { icon: any, label: string, href: string }) => {
    const pathname = usePathname();
    const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

    return (
        <Link 
            href={href} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
        >
            <Icon className="text-lg" />
            <span className="font-medium">{label}</span>
        </Link>
    );
};

const StatCard = ({ icon: Icon, label, value, color, subtext }: any) => (
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