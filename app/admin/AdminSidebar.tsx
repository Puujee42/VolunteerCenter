"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FaUsers, FaCalendarAlt, FaHandsHelping, 
  FaChartLine, FaCog, FaSignOutAlt, FaGlobe 
} from "react-icons/fa";
import { SignOutButton } from "@clerk/nextjs";
import { useLanguage } from "../context/LanguageContext"; // Adjust path

// --- Translation Data ---
const sidebarText = {
  mn: {
    title: "Админ Панель",
    dashboard: "Хяналтын самбар",
    users: "Хэрэглэгчид",
    events: "Арга хэмжээ",
    opportunities: "Сайн дурын ажил",
    settings: "Тохиргоо",
    role: "Супер Админ",
    signout: "Гарах",
    switchLang: "English"
  },
  en: {
    title: "Admin Panel",
    dashboard: "Dashboard",
    users: "Manage Users",
    events: "Events",
    opportunities: "Opportunities",
    settings: "Settings",
    role: "Super Admin",
    signout: "Sign Out",
    switchLang: "Монгол хэл"
  }
};

interface SidebarProps {
  user: {
    name: string;
    imageUrl: string;
  };
}

export default function AdminSidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const t = sidebarText[language];

  const toggleLanguage = () => {
    setLanguage(language === "mn" ? "en" : "mn");
  };

  return (
    <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col fixed h-full z-50">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-400">{t.title}</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <NavItem href="/admin" icon={FaChartLine} label={t.dashboard} active={pathname === "/admin"} />
        <NavItem href="/admin/users" icon={FaUsers} label={t.users} active={pathname.startsWith("/admin/users")} />
        <NavItem href="/admin/events" icon={FaCalendarAlt} label={t.events} active={pathname.startsWith("/admin/events")} />
        <NavItem href="/admin/opportunities" icon={FaHandsHelping} label={t.opportunities} active={pathname.startsWith("/admin/opportunities")} />
        <NavItem href="/admin/settings" icon={FaCog} label={t.settings} active={pathname.startsWith("/admin/settings")} />
      </nav>

      <div className="p-4 border-t border-slate-800">
        {/* Language Toggle */}
        <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 text-xs font-bold uppercase tracking-wider transition-colors w-full"
        >
            <FaGlobe /> {t.switchLang}
        </button>

        <div className="flex items-center gap-3 mb-4">
            <img src={user.imageUrl} alt="Admin" className="w-10 h-10 rounded-full border border-slate-600" />
            <div>
                <p className="text-sm font-bold max-w-[120px] truncate">{user.name}</p>
                <p className="text-xs text-slate-400">{t.role}</p>
            </div>
        </div>
        <SignOutButton>
            <button className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-bold w-full transition-colors">
                <FaSignOutAlt /> {t.signout}
            </button>
        </SignOutButton>
      </div>
    </aside>
  );
}

// Helper for Links
const NavItem = ({ icon: Icon, label, href, active }: any) => (
    <Link 
        href={href} 
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            active 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
    >
        <Icon className="text-lg" />
        <span className="font-medium">{label}</span>
    </Link>
);