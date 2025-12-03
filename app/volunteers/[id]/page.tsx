"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { useUser } from "@clerk/nextjs"; // Import Clerk
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaBuilding, 
  FaCheckCircle, FaLeaf, FaUsers, FaMask, FaFutbol, 
  FaQuestionCircle, FaHandsHelping, FaSpinner, FaSignInAlt
} from "react-icons/fa";

// --- Icon Mapper ---
const IconMap: any = {
  FaLeaf, FaUsers, FaMask, FaFutbol, FaQuestionCircle, FaHandsHelping
};

export default function VolunteerDetailPage() {
  const { id } = useParams();
  const { language } = useLanguage();
  const router = useRouter();
  const { user, isLoaded: isUserLoaded } = useUser(); // Get auth state

  const [volunteer, setVolunteer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // --- JOINING STATE ---
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  // --- Fetch Data ---
  useEffect(() => {
    if (!id) return;

    async function fetchVolunteer() {
      try {
        const res = await fetch(`/api/volunteers/${id}`);
        const json = await res.json();

        if (json.success) {
          setVolunteer(json.data);
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
  }, [id]);

  // --- HANDLE JOIN ACTION ---
  const handleJoin = async () => {
    // 1. If not logged in, go to login
    if (!user) {
        router.push('/sign-in');
        return;
    }

    setIsJoining(true);

    try {
        // 2. Call the API
        const res = await fetch('/api/user/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ opportunity: volunteer }) // Send current page data
        });

        const data = await res.json();

        if (res.ok && data.success) {
            setHasJoined(true);
            // Optional: Redirect to dashboard after 2 seconds
            setTimeout(() => router.push('/dashboard'), 2000);
        } else {
            alert("Could not join. You might have already joined this event.");
        }
    } catch (err) {
        console.error("Join error:", err);
        alert("Something went wrong. Please try again.");
    } finally {
        setIsJoining(false);
    }
  };

  // --- UI Text ---
  const t = {
    mn: {
      back: "Буцах",
      apply: "Бүртгүүлэх",
      joining: "Бүртгүүлж байна...",
      success: "Амжилттай бүртгэгдлээ!",
      loginToApply: "Нэвтэрч бүртгүүлнэ үү",
      org: "Байгууллага",
      loc: "Байршил",
      dates: "Бүртгэлийн хугацаа",
      posted: "Нийтэлсэн",
      desc: "Дэлгэрэнгүй мэдээлэл",
      loading: "Уншиж байна...",
    },
    en: {
      back: "Go Back",
      apply: "Apply Now",
      joining: "Joining...",
      success: "Successfully Joined!",
      loginToApply: "Sign in to Apply",
      org: "Organization",
      loc: "Location",
      dates: "Registration Period",
      posted: "Posted On",
      desc: "Description",
      loading: "Loading...",
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

  // Dynamic Icon
  const Icon = IconMap[volunteer.icon] || FaHandsHelping;
  const labels = t[language];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
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
             {/* Background Decoration */}
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

          {/* Content Body */}
          <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Left: Description */}
            <div className="md:col-span-2">
               <h3 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                 {labels.desc}
               </h3>
               <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
                 {volunteer.description[language]}
               </p>
               <p className="mt-4 text-slate-600">
                 This is a great opportunity to contribute to your community. By joining, you will be part of a team dedicated to making a positive impact.
               </p>
            </div>

            {/* Right: Sidebar Info */}
            <div className="md:col-span-1 space-y-6">
               <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-4">{labels.dates}</h4>
                  <div className="space-y-3 text-sm">
                     <div className="flex justify-between">
                        <span className="text-slate-500">Start:</span>
                        <span className="font-bold text-slate-700">{volunteer.registrationStart}</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-slate-500">End:</span>
                        <span className="font-bold text-slate-700">{volunteer.registrationEnd}</span>
                     </div>
                  </div>
               </div>

               <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-4">{labels.org}</h4>
                  <div className="flex items-center gap-3">
                     <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <FaBuilding />
                     </div>
                     <span className="font-bold text-slate-700">{volunteer.organization}</span>
                  </div>
               </div>

               {/* --- DYNAMIC BUTTON --- */}
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
                 {isUserLoaded && !user ? (
                    // User Not Logged In
                    <> <FaSignInAlt /> {labels.loginToApply} </>
                 ) : isJoining ? (
                    // Loading State
                    <> <FaSpinner className="animate-spin" /> {labels.joining} </>
                 ) : hasJoined ? (
                    // Success State
                    <> <FaCheckCircle /> {labels.success} </>
                 ) : (
                    // Default State
                    labels.apply
                 )}
               </button>

            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}