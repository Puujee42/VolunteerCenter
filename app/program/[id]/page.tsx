"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext"; 
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FaArrowLeft, 
  FaCheckCircle, 
  FaSpinner, 
  FaSignInAlt,
  FaHandHoldingHeart,
  FaGraduationCap, 
  FaHandsHelping, 
  FaChild, 
  FaTree, 
  FaHeartbeat, 
  FaLightbulb,
  FaGlobe,
  FaUsers,
  FaChartLine,
  FaInfoCircle
} from "react-icons/fa";
import Footer from "../../components/Footer"; 
// --- Interfaces ---

interface BilingualString {
  mn: string;
  en: string;
}

interface Participant {
  userId: string;
  name: string;
  imageUrl: string;
}

interface ProgramItem {
  _id: string;
  id: string; 
  icon: string; 
  color: string; 
  title: BilingualString;
  description: BilingualString; 
  content?: BilingualString;    
  imageUrl?: string;            
  focus: { mn: string[]; en: string[] }; 
  stats?: { value: string; label: BilingualString }[]; 
  participants?: Participant[];
  status: 'active' | 'completed' | 'upcoming';
}

// --- Mappings ---

const iconMap: Record<string, React.ElementType> = {
  education: FaGraduationCap,
  community: FaHandsHelping,
  children: FaChild,
  environment: FaTree,
  health: FaHeartbeat,
  innovation: FaLightbulb,
  global: FaGlobe,
  people: FaUsers,
  // Fallbacks for direct icon names
  FaGraduationCap: FaGraduationCap,
  FaHandsHelping: FaHandsHelping,
  FaChild: FaChild,
  FaTree: FaTree,
  FaHeartbeat: FaHeartbeat,
  FaLightbulb: FaLightbulb,
  FaGlobe: FaGlobe
};

// Color Theme Map
interface ColorTheme {
  bg: string;
  text: string;
  border: string;
  btn: string;
  ring: string;
  gradientFrom: string; 
  gradientTo: string;   
}

const colorMap: Record<string, ColorTheme> = {
  blue:   { bg: "bg-blue-50",   text: "text-blue-600",   border: "border-blue-100", btn: "bg-blue-600 hover:bg-blue-700", ring: "ring-blue-200", gradientFrom: "from-slate-900", gradientTo: "to-blue-900" },
  green:  { bg: "bg-green-50",  text: "text-green-600",  border: "border-green-100", btn: "bg-green-600 hover:bg-green-700", ring: "ring-green-200", gradientFrom: "from-slate-900", gradientTo: "to-green-900" },
  red:    { bg: "bg-red-50",    text: "text-red-600",    border: "border-red-100",   btn: "bg-red-600 hover:bg-red-700", ring: "ring-red-200", gradientFrom: "from-slate-900", gradientTo: "to-red-900" },
  yellow: { bg: "bg-amber-50",  text: "text-amber-600",  border: "border-amber-100", btn: "bg-amber-600 hover:bg-amber-700", ring: "ring-amber-200", gradientFrom: "from-slate-900", gradientTo: "to-amber-900" },
  orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100", btn: "bg-orange-600 hover:bg-orange-700", ring: "ring-orange-200", gradientFrom: "from-slate-900", gradientTo: "to-orange-900" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100", btn: "bg-purple-600 hover:bg-purple-700", ring: "ring-purple-200", gradientFrom: "from-slate-900", gradientTo: "to-purple-900" },
  cyan:   { bg: "bg-cyan-50",   text: "text-cyan-600",   border: "border-cyan-100",  btn: "bg-cyan-600 hover:bg-cyan-700", ring: "ring-cyan-200", gradientFrom: "from-slate-900", gradientTo: "to-cyan-900" },
  pink:   { bg: "bg-pink-50",   text: "text-pink-600",   border: "border-pink-100",  btn: "bg-pink-600 hover:bg-pink-700", ring: "ring-pink-200", gradientFrom: "from-slate-900", gradientTo: "to-pink-900" },
};

export default function SingleProgramPage() {
  const params = useParams();
  const { language } = useLanguage(); 
  const router = useRouter();
  const { user, isLoaded: isUserLoaded } = useUser();
  
  const [program, setProgram] = useState<ProgramItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  // --- 1. Fetch Data ---
  useEffect(() => {
    // Correctly handle Next.js params
    // Note: in Next 15 params is a Promise, but useParams() hook handles unwrapping for Client Components automatically.
    const programId = params?.id; 

    if (!programId) return;

    async function fetchProgram() {
      try {
        // Fetch from the API route we created
        const res = await fetch(`/api/programs/${programId}`);
        const json = await res.json();
        
        if (json.success) {
          setProgram(json.data);
          
          if (user && json.data.participants) {
             const alreadyJoined = json.data.participants.some((p: Participant) => p.userId === user.id);
             if (alreadyJoined) setIsJoined(true);
          }
        } else {
            console.error("API Error:", json.error);
            setProgram(null);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProgram();
  }, [params.id, user]); 

  // --- 2. Handle Join ---
  const handleJoin = async () => {
    if (!user) {
        router.push('/sign-in'); 
        return;
    }
    setIsJoining(true);

    try {
        const res = await fetch('/api/user/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item: program, type: 'program' }) 
        });

        const data = await res.json();

        if (res.ok && data.success) {
            setIsJoined(true);
            // Optimistic update
            if (program) {
                const newParticipant: Participant = {
                    userId: user.id,
                    name: user.fullName || user.firstName || "Volunteer",
                    imageUrl: user.imageUrl
                };
                setProgram({ 
                    ...program, 
                    participants: [newParticipant, ...(program.participants || [])] 
                });
            }
        } else {
            alert("Failed to join: " + (data.error || "Unknown error"));
        }
    } catch (err) {
        console.error("Join error:", err);
    } finally {
        setIsJoining(false);
    }
  };

  // --- 3. UI Mappings (Robust) ---
  const theme = useMemo(() => {
    if (!program || !program.color) return colorMap.blue;
    
    // FIX: The DB has "bg-blue-100 text-blue-600". We need to extract just "blue".
    // 1. Try exact match
    if (colorMap[program.color]) return colorMap[program.color];

    // 2. Try to find the color name inside the string
    const foundColor = Object.keys(colorMap).find(key => program.color.includes(key));
    
    return foundColor ? colorMap[foundColor] : colorMap.blue;
  }, [program]);

  const Icon = useMemo(() => {
    if (!program) return FaLightbulb;
    return iconMap[program.icon] || iconMap.innovation;
  }, [program]);

  const labels = {
    mn: { 
      back: "Хөтөлбөрүүд рүү буцах", 
      loading: "Уншиж байна...", 
      join: "Сайн дураар нэгдэх",
      joining: "Бүртгүүлж байна...",
      success: "Нэгдсэн!",
      loginToJoin: "Нэвтэрч нэгдэх",
      about: "Хөтөлбөрийн тухай",
      volunteers: "Идэвхтэн гишүүд",
      joinUs: "Бидэнтэй нэгдэж хувь нэмрээ оруулаарай!",
      focus: "Үндсэн чиглэл",
      impact: "Үр нөлөө",
      status: "Төлөв",
      status_active: "Хэрэгжиж буй",
      status_completed: "Хэрэгжсэн",
      status_upcoming: "Төлөвлөгдсөн"
    },
    en: { 
      back: "Back to Programs", 
      loading: "Loading...", 
      join: "Volunteer / Join",
      joining: "Joining...",
      success: "Joined!",
      loginToJoin: "Sign in to Join",
      about: "About Program",
      volunteers: "Active Volunteers",
      joinUs: "Join us and make an impact!",
      focus: "Key Focus Areas",
      impact: "Our Impact",
      status: "Status",
      status_active: "Active",
      status_completed: "Completed",
      status_upcoming: "Upcoming"
    }
  }[language as 'mn'|'en'] || { back: "Back" }; // Fallback

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
    </div>
  );
  
  if (!program) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-slate-400">Program not found</h2>
        <Link href="/programs" className="text-blue-500 hover:underline">
            {labels.back}
        </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      
      {/* Hero */}
      <div className={`relative h-[400px] w-full bg-slate-900 overflow-hidden`}>
        {program.imageUrl ? (
             <img src={program.imageUrl} className="w-full h-full object-cover opacity-50" alt="Cover" />
        ) : (
            <div className={`w-full h-full bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} opacity-50`} />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <Link href="/programs" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors">
                    <FaArrowLeft /> {labels.back}
                </Link>
                
                <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-xl ${theme.bg} ${theme.text} backdrop-blur-md bg-opacity-90`}>
                        <Icon className="text-2xl" />
                    </div>
                    {program.status && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white border border-white/10`}>
                            {labels[`status_${program.status}` as keyof typeof labels] || program.status}
                        </span>
                    )}
                </div>

                <motion.h1 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-3xl md:text-5xl font-black text-white mb-4 shadow-sm leading-tight max-w-4xl"
                >
                    {program.title[language as 'mn'|'en']}
                </motion.h1>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Content */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <FaInfoCircle className={theme.text} />
                    {labels.about}
                </h2>
                <div className="text-slate-600 leading-relaxed text-lg whitespace-pre-line space-y-4">
                    <p>
                        {program.content 
                            ? program.content[language as 'mn' | 'en'] 
                            : program.description[language as 'mn' | 'en']
                        }
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wide opacity-80">
                    {labels.focus}
                </h3>
                <div className="flex flex-wrap gap-3">
                    {program.focus && program.focus[language as 'mn'|'en']?.map((tag, idx) => (
                        <span 
                            key={idx} 
                            className={`px-4 py-2 rounded-xl text-sm font-bold border ${theme.bg} ${theme.text} ${theme.border}`}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-24 space-y-6">
                
                <div className={`bg-white rounded-3xl p-6 shadow-xl border border-slate-100 ring-4 ${theme.ring} ring-opacity-30`}>
                    <p className="text-slate-500 mb-6 font-medium text-center">
                        {labels.joinUs}
                    </p>
                    <button 
                        onClick={handleJoin}
                        disabled={isJoining || isJoined}
                        className={`w-full py-4 font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 transform active:scale-95 text-white
                            ${isJoined ? "bg-green-500 cursor-default shadow-green-500/30" : `${theme.btn} shadow-blue-500/30`}
                            ${isJoining ? "opacity-75 cursor-wait" : ""}
                        `}
                    >
                        {isUserLoaded && !user ? <><FaSignInAlt /> {labels.loginToJoin}</> : 
                         isJoining ? <><FaSpinner className="animate-spin" /> {labels.joining}</> : 
                         isJoined ? <><FaCheckCircle /> {labels.success}</> : 
                         <><FaHandHoldingHeart /> {labels.join}</>}
                    </button>
                </div>

                {program.stats && program.stats.length > 0 && (
                    <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100">
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                            <FaChartLine className={theme.text} /> {labels.impact}
                        </h4>
                        <div className="space-y-4">
                            {program.stats.map((stat, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-slate-500 font-medium text-sm">
                                        {stat.label[language as 'mn' | 'en']}
                                    </span>
                                    <span className={`text-xl font-black ${theme.text}`}>{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <FaUsers className={theme.text} /> {labels.volunteers}
                    </h4>
                    {program.participants && program.participants.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {program.participants.slice(0, 15).map((p, i) => (
                                <div key={i} className="relative group/avatar">
                                    <img 
                                        className="h-10 w-10 rounded-full ring-2 ring-white object-cover shadow-sm transition-transform hover:scale-110 hover:z-10" 
                                        src={p.imageUrl} 
                                        alt={p.name} 
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <p className="text-sm text-slate-400 italic">Be the first to join!</p>
                        </div>
                    )}
                </div>

            </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}