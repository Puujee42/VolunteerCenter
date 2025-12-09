"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaUserFriends, 
  FaClock, FaShareAlt, FaCheckCircle, FaSpinner, FaSignInAlt,
  FaCog, FaClipboardList // Added new icons
} from "react-icons/fa";
import Footer from "../../components/Footer";

// --- Types ---
interface Participant {
    userId: string;
    name: string;
    imageUrl: string;
}

interface EventItem {
  _id: string;
  id: string;
  deadline: string;
  startDate: string;
  imageUrl: string;
  status: 'open' | 'full' | 'ended';
  registered: number;
  capacity: number;
  title: { mn: string; en: string };
  description: { mn: string; en: string };
  location: { mn: string; en: string };
  participants?: Participant[]; 
}

export default function SingleEventPage() {
  const params = useParams();
  const { language } = useLanguage();
  const router = useRouter();
  const { user, isLoaded: isUserLoaded } = useUser();
  
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // --- 0. PERMISSION CHECK ---
  // Get the role from Clerk metadata
  const userRole = user?.publicMetadata?.role as string | undefined;
  const isManager = userRole === 'admin' || userRole === 'manager';
  
  // Normalize ID for links
  const eventId = Array.isArray(params.id) ? params.id[0] : params.id;

  // --- 1. FETCH EVENT DATA ---
  useEffect(() => {
    if (!eventId) return;

    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events?id=${eventId}`);
        const json = await res.json();
        if (json.success) {
          setEvent(json.data);
          
          if (user && json.data.participants) {
             const alreadyJoined = json.data.participants.some((p: any) => p.userId === user.id);
             if (alreadyJoined) setIsRegistered(true);
          }
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [eventId, user]);

  // --- 2. HANDLE REGISTRATION ---
  const handleRegister = async () => {
    if (!user) {
        router.push('/sign-in');
        return;
    }

    setIsRegistering(true);

    try {
        const res = await fetch('/api/user/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item: event, type: 'event' }) 
        });

        const data = await res.json();

        if (res.ok && data.success) {
            setIsRegistered(true);
            
            if (event) {
                const newParticipant: Participant = {
                    userId: user.id,
                    name: user.fullName || user.username || "Volunteer",
                    imageUrl: user.imageUrl
                };

                setEvent({ 
                    ...event, 
                    registered: event.registered + 1,
                    participants: [newParticipant, ...(event.participants || [])] 
                });
            }
            setTimeout(() => router.push('/dashboard'), 2000);
        } else {
            alert("Registration failed. Please try again.");
        }
    } catch (err) {
        console.error("Registration error:", err);
    } finally {
        setIsRegistering(false);
    }
  };

  // --- Translations ---
  const t = {
    mn: { 
      back: "Арга хэмжээ рүү буцах", 
      loading: "Уншиж байна...", 
      register: "Бүртгүүлэх",
      registering: "Бүртгүүлж байна...",
      success: "Амжилттай!",
      loginToJoin: "Нэвтрэх",
      full: "Бүртгэл дүүрсэн",
      ended: "Бүртгэл дууссан",
      date: "Огноо",
      capacity: "Багтаамж",
      share: "Хуваалцах",
      about: "Арга хэмжээний тухай",
      volunteers: "Оролцогчид",
      joinUs: "Бидэнтэй нэгдээрэй!",
      description_placeholder: "Энэхүү арга хэмжээний дэлгэрэнгүй мэдээлэл удахгүй орно.",
      // New translations
      managerTools: "Менежерийн хэрэгсэл",
      viewReport: "Тайлан харах / Засах"
    },
    en: { 
      back: "Back to Events", 
      loading: "Loading...", 
      register: "Register Now",
      registering: "Registering...",
      success: "Registered!",
      loginToJoin: "Sign in to Join",
      full: "Registration Full",
      ended: "Event Ended",
      date: "Date",
      capacity: "Capacity",
      share: "Share",
      about: "About Event",
      volunteers: "Volunteers",
      joinUs: "Join the team!",
      description_placeholder: "Details for this event will be updated soon.",
      // New translations
      managerTools: "Manager Tools",
      viewReport: "View / Edit Report"
    }
  };

  const labels = t[language];
  const isRegisterable = event?.status === 'open';

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
        <p className="text-slate-500">{labels.loading}</p>
    </div>
  );
  
  if (!event) return <div className="p-10 text-center">Event not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* --- HERO HEADER --- */}
      <div className="relative h-[400px] w-full bg-slate-900 group">
        <img 
            src={event.imageUrl} 
            alt={event.title[language]}
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <Link href="/events" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors">
                    <FaArrowLeft /> {labels.back}
                </Link>
                
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-5xl font-bold text-white mb-4 shadow-sm"
                >
                    {event.title[language]}
                </motion.h1>

                <div className="flex flex-wrap items-center gap-6 text-slate-200 font-medium">
                    <span className="flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-full backdrop-blur-sm border border-slate-700">
                        <FaCalendarAlt className="text-cyan-400"/> {new Date(event.startDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-full backdrop-blur-sm border border-slate-700">
                        <FaMapMarkerAlt className="text-red-400"/> {event.location[language]}
                    </span>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: DESCRIPTION --- */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    {labels.about}
                </h2>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg">
                    {event.description?.[language] || labels.description_placeholder}
                </div>
            </div>
        </div>

        {/* --- RIGHT COLUMN: SIDEBAR --- */}
        <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-24 space-y-6">
                
                {/* --- 1. NEW: MANAGER TOOLS (Conditional Render) --- */}
                {isManager && (
                    <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 text-white">
                        <h4 className="font-bold flex items-center gap-2 mb-4 text-yellow-400 border-b border-slate-600 pb-2">
                            <FaCog className="animate-spin-slow" /> {labels.managerTools}
                        </h4>
                        <div className="space-y-3">
                            <Link 
                                href={`/events/${eventId}/report`}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg"
                            >
                                <FaClipboardList /> {labels.viewReport}
                            </Link>
                        </div>
                    </div>
                )}

                {/* --- 2. REGISTRATION CARD --- */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 ring-1 ring-slate-100">
                    <div className="mb-6 pb-6 border-b border-slate-100">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-500 font-medium">{labels.capacity}</span>
                            <span className="font-bold text-slate-800">{event.registered} / {event.capacity}</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((event.registered / event.capacity) * 100, 100)}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full rounded-full ${event.status === 'full' ? 'bg-red-500' : 'bg-blue-600'}`} 
                            />
                        </div>
                    </div>

                    {isRegisterable ? (
                        <button 
                            onClick={handleRegister}
                            disabled={isRegistering || isRegistered}
                            className={`w-full py-4 font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-lg
                                ${isRegistered 
                                    ? "bg-green-100 text-green-700 border border-green-200 cursor-default" 
                                    : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-200 hover:-translate-y-1"}
                                ${isRegistering ? "opacity-75 cursor-wait" : ""}
                            `}
                        >
                            {isUserLoaded && !user ? <><FaSignInAlt /> {labels.loginToJoin}</> : 
                             isRegistering ? <><FaSpinner className="animate-spin" /> {labels.registering}</> : 
                             isRegistered ? <><FaCheckCircle /> {labels.success}</> : labels.register}
                        </button>
                    ) : (
                        <button disabled className="w-full py-4 bg-slate-100 text-slate-400 font-bold rounded-xl cursor-not-allowed border border-slate-200">
                            {event.status === 'full' ? labels.full : labels.ended}
                        </button>
                    )}
                </div>

                {/* --- 3. VOLUNTEERS LIST --- */}
                <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                            <FaUserFriends className="text-blue-500" /> {labels.volunteers}
                        </h4>
                        {event.participants && event.participants.length > 0 && (
                            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-lg">
                                {event.participants.length}
                            </span>
                        )}
                    </div>
                    
                    {event.participants && event.participants.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            <div className="flex -space-x-3 overflow-hidden p-2 justify-center">
                                {event.participants.slice(0, 8).map((p, i) => (
                                    <img 
                                        key={i} 
                                        className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover bg-slate-200" 
                                        src={p.imageUrl || "/default-avatar.png"} 
                                        alt={p.name} 
                                        title={p.name}
                                    />
                                ))}
                                {event.participants.length > 8 && (
                                    <div className="flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-white bg-slate-100 text-xs font-bold text-slate-500 z-10">
                                        +{event.participants.length - 8}
                                    </div>
                                )}
                            </div>
                            
                            <p className="text-center text-xs text-slate-400">
                                {event.participants.slice(0,3).map(p => p.name.split(' ')[0]).join(', ')} 
                                {event.participants.length > 3 ? ` and ${event.participants.length - 3} others` : ''} joined.
                            </p>
                        </div>
                    ) : (
                        <div className="text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                            <p className="text-sm text-slate-500 italic">{labels.joinUs}</p>
                        </div>
                    )}
                </div>

                {/* --- 4. INFO CARD --- */}
                <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                    <div className="space-y-4">
                        <InfoRow icon={FaCalendarAlt} label={labels.date} value={new Date(event.startDate).toLocaleDateString()} />
                        <InfoRow icon={FaClock} label="Deadline" value={new Date(event.deadline).toLocaleDateString()} />
                    </div>
                    <button className="w-full mt-6 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors">
                        <FaShareAlt /> {labels.share}
                    </button>
                </div>

            </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}

const InfoRow = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-center justify-between group">
        <div className="flex items-center gap-3 text-slate-500 group-hover:text-blue-600 transition-colors">
            <Icon className="text-blue-500" />
            <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm font-bold text-slate-800">{value}</span>
    </div>
);