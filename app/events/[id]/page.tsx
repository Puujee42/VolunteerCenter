"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaUserFriends, 
  FaClock, 
  FaShareAlt 
} from "react-icons/fa";
import Footer from "@/app/components/Footer";

// Interface matching your Seed Data
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
}

export default function SingleEventPage() {
  const params = useParams();
  const { language } = useLanguage();
  
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);

  // --- 1. Fetch Data ---
  useEffect(() => {
    const eventId = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!eventId) return;

    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events?id=${eventId}`);
        const json = await res.json();
        if (json.success) {
          setEvent(json.data);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [params.id]);

  // --- 2. Translations ---
  const t = {
    mn: { 
      back: "Арга хэмжээ рүү буцах", 
      loading: "Уншиж байна...", 
      register: "Бүртгүүлэх",
      full: "Бүртгэл дүүрсэн",
      ended: "Бүртгэл дууссан",
      date: "Огноо",
      location: "Байршил",
      capacity: "Багтаамж",
      share: "Хуваалцах",
      about: "Арга хэмжээний тухай",
      description_placeholder: "Энэхүү арга хэмжээ нь залуучуудын хөгжлийг дэмжих, нийгмийн оролцоог нэмэгдүүлэх зорилготой. Та энэхүү үйл ажиллагаанд нэгдсэнээр шинэ ур чадвар эзэмшиж, танилын хүрээгээ тэлэх боломжтой."
    },
    en: { 
      back: "Back to Events", 
      loading: "Loading...", 
      register: "Register Now",
      full: "Registration Full",
      ended: "Event Ended",
      date: "Date",
      location: "Location",
      capacity: "Capacity",
      share: "Share",
      about: "About Event",
      description_placeholder: "This event aims to support youth development and increase social participation. By joining this activity, you will have the opportunity to learn new skills and expand your network."
    }
  };

  const countdown = useCountdown(event?.deadline || "");

  // --- 3. Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return <div className="p-10 text-center">Event not found.</div>;
  }

  const isRegisterable = event.status === 'open';

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* --- HERO HEADER --- */}
      <div className="relative h-[400px] w-full bg-slate-900">
        <img 
            src={event.imageUrl} 
            alt={event.title[language]} 
            className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <Link href="/events" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors">
                    <FaArrowLeft /> {t[language].back}
                </Link>
                <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-3xl md:text-5xl font-bold text-white mb-4 shadow-sm"
                >
                    {event.title[language]}
                </motion.h1>
                <div className="flex flex-wrap items-center gap-6 text-slate-200">
                    <span className="flex items-center gap-2"><FaCalendarAlt className="text-cyan-400"/> {event.startDate}</span>
                    <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-red-400"/> {event.location[language]}</span>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: CONTENT --- */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">{t[language].about}</h2>
                <p className="text-slate-600 leading-relaxed text-lg">
                    {/* Using placeholder since seed data doesn't have long description */}
                    {t[language].description_placeholder}
                </p>
                <p className="text-slate-600 leading-relaxed text-lg mt-4">
                   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </div>

            {/* Google Maps Placeholder */}
            <div className="bg-slate-200 rounded-2xl h-64 flex items-center justify-center relative overflow-hidden">
                 <FaMapMarkerAlt className="text-5xl text-slate-400 mb-2" />
                 <span className="absolute bottom-4 text-slate-500 font-medium">{event.location[language]}</span>
            </div>
        </div>

        {/* --- RIGHT COLUMN: SIDEBAR --- */}
        <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
                
                {/* Registration Card */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
                    <div className="mb-6 pb-6 border-b border-slate-100">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-500 font-medium">{t[language].capacity}</span>
                            <span className="font-bold text-slate-800">{event.registered} / {event.capacity}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                            <div 
                                className={`h-2 rounded-full ${event.status === 'full' ? 'bg-red-500' : 'bg-blue-600'}`} 
                                style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {isRegisterable ? (
                        <>
                            <div className="grid grid-cols-4 gap-2 mb-6 text-center">
                                <CountdownBox val={countdown.days} label="D" />
                                <CountdownBox val={countdown.hours} label="H" />
                                <CountdownBox val={countdown.minutes} label="M" />
                                <CountdownBox val={countdown.seconds} label="S" />
                            </div>
                            <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/30">
                                {t[language].register}
                            </button>
                        </>
                    ) : (
                        <button disabled className="w-full py-4 bg-slate-200 text-slate-500 font-bold rounded-xl cursor-not-allowed">
                            {event.status === 'full' ? t[language].full : t[language].ended}
                        </button>
                    )}
                </div>

                {/* Info Card */}
                <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                    <div className="space-y-4">
                        <InfoRow icon={FaCalendarAlt} label={t[language].date} value={event.startDate} />
                        <InfoRow icon={FaClock} label="Deadline" value={event.deadline.split('T')[0]} />
                        <InfoRow icon={FaUserFriends} label="Status" value={event.status.toUpperCase()} />
                    </div>
                    <button className="w-full mt-6 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 flex items-center justify-center gap-2">
                        <FaShareAlt /> {t[language].share}
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
const CountdownBox = ({ val, label }: { val: number, label: string }) => (
    <div className="bg-slate-50 rounded-lg p-2 border border-slate-200">
        <div className="text-xl font-bold text-slate-800">{val}</div>
        <div className="text-[10px] text-slate-500 font-bold">{label}</div>
    </div>
);

const InfoRow = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-slate-500">
            <Icon className="text-blue-500" />
            <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm font-bold text-slate-800">{value}</span>
    </div>
);

// --- Countdown Hook ---
const useCountdown = (targetDate: string) => {
    const [countDown, setCountDown] = useState(0);
  
    useEffect(() => {
      if (!targetDate) return;
      const target = new Date(targetDate).getTime();
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = target - now;
        setCountDown(distance > 0 ? distance : 0);
      }, 1000);
      return () => clearInterval(interval);
    }, [targetDate]);
  
    return {
      days: Math.floor(countDown / (1000 * 60 * 60 * 24)),
      hours: Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((countDown % (1000 * 60)) / 1000)
    };
};