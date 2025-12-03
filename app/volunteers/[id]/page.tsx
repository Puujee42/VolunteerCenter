"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaBuilding, 
  FaCheckCircle, FaLeaf, FaUsers, FaMask, FaFutbol, 
  FaQuestionCircle, FaHandsHelping, FaSpinner, FaSignInAlt,
  FaUserFriends // Added this icon
} from "react-icons/fa";

// --- Icon Mapper ---
const IconMap: any = {
  FaLeaf, FaUsers, FaMask, FaFutbol, FaQuestionCircle, FaHandsHelping
};

// Added Participant Interface
interface Participant {
    userId: string;
    name: string;
    imageUrl: string;
}

export default function VolunteerDetailPage() {
  const { id } = useParams();
  const { language } = useLanguage();
  const router = useRouter();
  const { user, isLoaded: isUserLoaded } = useUser();

  const [volunteer, setVolunteer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchVolunteer() {
      try {
        const res = await fetch(`/api/volunteers/${id}`);
        const json = await res.json();

        if (json.success) {
          setVolunteer(json.data);
          // Check if already joined based on participants list
          if (user && json.data.participants) {
             const alreadyJoined = json.data.participants.some((p: any) => p.userId === user.id);
             if (alreadyJoined) setHasJoined(true);
          }
        } else {
          setError("Opportunity not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }

    fetchVolunteer();
  }, [id, user]);

  // --- FIXED HANDLE JOIN ---
  const handleJoin = async () => {
    if (!user) {
        router.push('/sign-in');
        return;
    }

    setIsJoining(true);

    try {
        // ✅ FIX 1: Send 'item' and 'type' to match the API requirements
        const res = await fetch('/api/user/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                item: volunteer, 
                type: 'opportunity' // Must specify type
            }) 
        });

        const data = await res.json();

        if (res.ok && data.success) {
            setHasJoined(true);
            
            // ✅ FIX 2: Optimistic UI Update (Add myself to the list visually)
            if(volunteer) {
                const newParticipant = {
                    userId: user.id,
                    name: user.firstName || "Me",
                    imageUrl: user.imageUrl
                };
                
                setVolunteer({
                    ...volunteer,
                    // Update slots
                    slots: { ...volunteer.slots, filled: (volunteer.slots?.filled || 0) + 1 },
                    // Update participants list
                    participants: [newParticipant, ...(volunteer.participants || [])]
                });
            }

            setTimeout(() => router.push('/dashboard'), 2000);
        } else {
            // Handle "Already joined" specifically
            if (res.status === 400) {
                setHasJoined(true);
                alert("You are already signed up for this!");
            } else {
                alert("Could not join. Please try again.");
            }
        }
    } catch (err) {
        console.error("Join error:", err);
        alert("Something went wrong.");
    } finally {
        setIsJoining(false);
    }
  };

  const t = {
    mn: {
      back: "Буцах",
      apply: "Бүртгүүлэх",
      joining: "Бүртгүүлж байна...",
      success: "Амжилттай!",
      loginToApply: "Нэвтэрч бүртгүүлнэ үү",
      org: "Байгууллага",
      loc: "Байршил",
      dates: "Бүртгэлийн хугацаа",
      posted: "Нийтэлсэн",
      desc: "Дэлгэрэнгүй мэдээлэл",
      loading: "Уншиж байна...",
      volunteers: "Оролцогчид",
      joinUs: "Анхны оролцогч болоорой!"
    },
    en: {
      back: "Go Back",
      apply: "Apply Now",
      joining: "Joining...",
      success: "Joined!",
      loginToApply: "Sign in to Apply",
      org: "Organization",
      loc: "Location",
      dates: "Registration Period",
      posted: "Posted On",
      desc: "Description",
      loading: "Loading...",
      volunteers: "Volunteers",
      joinUs: "Be the first to join!"
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error || !volunteer) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-bold text-slate-800">{error}</h2>
      <Link href="/" className="text-blue-600 hover:underline">Return Home</Link>
    </div>
  );

  const Icon = IconMap[volunteer.icon] || FaHandsHelping;
  const labels = t[language];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        
        <button 
          onClick={() => router.back()} 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 transition-colors font-medium"
        >
          <FaArrowLeft /> {labels.back}
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 md:p-12 text-white relative overflow-hidden">
             <Icon className="absolute -bottom-6 -right-6 text-9xl text-white/10 rotate-12" />
             
             <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-4 border border-white/20">
                   <FaCheckCircle /> {volunteer.organization}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                  {volunteer.title[language]}
                </h1>
                <div className="flex flex-wrap gap-6 text-blue-100 font-medium">
                   <span className="flex items-center gap-2"><FaMapMarkerAlt /> {volunteer.city}</span>
                   <span className="flex items-center gap-2"><FaCalendarAlt /> {volunteer.addedDate}</span>
                </div>
             </div>
          </div>

          <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Left: Description */}
            <div className="md:col-span-2">
               <h3 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                 {labels.desc}
               </h3>
               <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
                 {volunteer.description[language]}
               </p>
            </div>

            {/* Right: Sidebar */}
            <div className="md:col-span-1 space-y-6">
               
               {/* Registration Card */}
               <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div className="mb-4">
                      <div className="flex justify-between items-center mb-2 text-sm">
                          <span className="text-slate-500 font-medium">Spots Filled</span>
                          <span className="font-bold text-slate-800">
                              {volunteer.slots?.filled || 0} / {volunteer.slots?.total || 20}
                          </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                              className="h-2 rounded-full bg-blue-600 transition-all duration-500" 
                              style={{ width: `${Math.min(((volunteer.slots?.filled||0) / (volunteer.slots?.total||20)) * 100, 100)}%` }}
                          ></div>
                      </div>
                  </div>

                  <button 
                    onClick={handleJoin}
                    disabled={isJoining || hasJoined}
                    className={`w-full py-4 font-bold rounded-xl shadow-lg transition-all transform flex items-center justify-center gap-2
                        ${hasJoined 
                            ? "bg-green-500 text-white cursor-default" 
                            : "bg-blue-600 hover:bg-blue-700 text-white hover:-translate-y-1"
                        }
                        ${isJoining ? "opacity-75 cursor-wait" : ""}
                    `}
                  >
                    {isUserLoaded && !user ? <><FaSignInAlt /> {labels.loginToApply}</> : 
                     isJoining ? <><FaSpinner className="animate-spin" /> {labels.joining}</> : 
                     hasJoined ? <><FaCheckCircle /> {labels.success}</> : labels.apply}
                  </button>
               </div>

               {/* --- ADDED: VOLUNTEERS LIST --- */}
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm">
                        <FaUserFriends className="text-blue-500" /> {labels.volunteers}
                    </h4>
                    
                    {volunteer.participants && volunteer.participants.length > 0 ? (
                        <div className="flex -space-x-2 overflow-hidden p-1">
                            {volunteer.participants.slice(0, 5).map((p: any, i: number) => (
                                <img 
                                    key={i} 
                                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" 
                                    src={p.imageUrl} 
                                    alt={p.name} 
                                    title={p.name}
                                />
                            ))}
                            {volunteer.participants.length > 5 && (
                                <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 text-xs font-bold text-slate-500">
                                    +{volunteer.participants.length - 5}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 italic">{labels.joinUs}</p>
                    )}
               </div>

               {/* Org Info */}
               <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                     <FaBuilding />
                  </div>
                  <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">{labels.org}</p>
                      <p className="font-bold text-slate-700 text-sm">{volunteer.organization}</p>
                  </div>
               </div>

            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}