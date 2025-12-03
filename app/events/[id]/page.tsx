"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaUserFriends, 
  FaClock, FaShareAlt, FaCheckCircle, FaSpinner, FaSignInAlt 
} from "react-icons/fa";
import Footer from "../../components/Footer";

// Interface update to include participants
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
  location: { mn: string; en: string };
  participants?: Participant[]; // New field
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

  useEffect(() => {
    const eventId = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!eventId) return;

    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events?id=${eventId}`);
        const json = await res.json();
        if (json.success) {
          setEvent(json.data);
          
          // Check if current user is already in the participants list
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
  }, [params.id, user]); // Re-run if user loads

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
            
            // Optimistic UI Update: Add myself to the list visually
            if (event) {
                const newParticipant = {
                    userId: user.id,
                    name: user.firstName || "Me",
                    imageUrl: user.imageUrl
                };
                setEvent({ 
                    ...event, 
                    registered: event.registered + 1,
                    participants: [newParticipant, ...(event.participants || [])] 
                });
            }
            setTimeout(() => router.push('/dashboard'), 2000);
        }
    } catch (err) {
        console.error("Registration error:", err);
    } finally {
        setIsRegistering(false);
    }
  };

  // ... (Your translations object remains here) ...
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
      description_placeholder: "Энэхүү арга хэмжээ нь залуучуудын хөгжлийг дэмжих зорилготой."
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
      description_placeholder: "This event aims to support youth development."
    }
  };

  const labels = t[language];
  const isRegisterable = event?.status === 'open';

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!event) return <div className="p-10 text-center">Event not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Hero Header (Unchanged) */}
      <div className="relative h-[400px] w-full bg-slate-900">
        <img src={event.imageUrl} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <Link href="/events" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6">
                    <FaArrowLeft /> {labels.back}
                </Link>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 shadow-sm">{event.title[language]}</h1>
                <div className="flex flex-wrap items-center gap-6 text-slate-200">
                    <span className="flex items-center gap-2"><FaCalendarAlt className="text-cyan-400"/> {event.startDate}</span>
                    <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-red-400"/> {event.location[language]}</span>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Description */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">{labels.about}</h2>
                <p className="text-slate-600 leading-relaxed text-lg">{labels.description_placeholder}</p>
            </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-8 space-y-6">
                
                {/* Registration Card */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
                    <div className="mb-6 pb-6 border-b border-slate-100">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-500 font-medium">{labels.capacity}</span>
                            <span className="font-bold text-slate-800">{event.registered} / {event.capacity}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className={`h-2 rounded-full ${event.status === 'full' ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: `${Math.min((event.registered / event.capacity) * 100, 100)}%` }}></div>
                        </div>
                    </div>

                    {isRegisterable ? (
                        <button 
                            onClick={handleRegister}
                            disabled={isRegistering || isRegistered}
                            className={`w-full py-4 font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2
                                ${isRegistered ? "bg-green-500 text-white cursor-default" : "bg-blue-600 hover:bg-blue-700 text-white hover:-translate-y-1"}
                                ${isRegistering ? "opacity-75 cursor-wait" : ""}
                            `}
                        >
                            {isUserLoaded && !user ? <><FaSignInAlt /> {labels.loginToJoin}</> : 
                             isRegistering ? <><FaSpinner className="animate-spin" /> {labels.registering}</> : 
                             isRegistered ? <><FaCheckCircle /> {labels.success}</> : labels.register}
                        </button>
                    ) : (
                        <button disabled className="w-full py-4 bg-slate-200 text-slate-500 font-bold rounded-xl cursor-not-allowed">
                            {event.status === 'full' ? labels.full : labels.ended}
                        </button>
                    )}
                </div>

                {/* --- NEW SECTION: VOLUNTEERS LIST --- */}
                <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <FaUserFriends className="text-blue-500" /> {labels.volunteers}
                    </h4>
                    
                    {event.participants && event.participants.length > 0 ? (
                        <div className="flex -space-x-3 overflow-hidden p-2">
                            {event.participants.slice(0, 8).map((p, i) => (
                                <img 
                                    key={i} 
                                    className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" 
                                    src={p.imageUrl} 
                                    alt={p.name} 
                                    title={p.name}
                                />
                            ))}
                            {event.participants.length > 8 && (
                                <div className="flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-white bg-slate-100 text-xs font-bold text-slate-500">
                                    +{event.participants.length - 8}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 italic">{labels.joinUs}</p>
                    )}
                </div>

                {/* Info Card */}
                <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                    <div className="space-y-4">
                        <InfoRow icon={FaCalendarAlt} label={labels.date} value={event.startDate} />
                        <InfoRow icon={FaClock} label="Deadline" value={event.deadline.split('T')[0]} />
                    </div>
                    <button className="w-full mt-6 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 flex items-center justify-center gap-2">
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

// --- Helper Components ---
const InfoRow = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-slate-500">
            <Icon className="text-blue-500" />
            <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm font-bold text-slate-800">{value}</span>
    </div>
);

const useCountdown = (targetDate: string) => {
    // ... same as before
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }; 
};