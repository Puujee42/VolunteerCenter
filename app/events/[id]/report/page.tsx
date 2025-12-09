"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { FaArrowLeft, FaSave, FaSpinner, FaStar, FaExclamationTriangle } from "react-icons/fa";

// Interface for the data we need to report on
interface ParticipantReport {
    userId: string;
    name: string;
    imageUrl: string;
    hours: number;
    rating: number; // 1-5
    feedback: string;
    status: 'pending' | 'submitted';
}

export default function EventReportPage() {
    const params = useParams();
    const router = useRouter();
    const { user, isLoaded } = useUser();
    
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [reports, setReports] = useState<ParticipantReport[]>([]);
    const [eventTitle, setEventTitle] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);

    // --- 1. SECURITY CHECK (Role Guard) ---
    useEffect(() => {
        if (!isLoaded) return;

        // Get role from Clerk Metadata
        const role = user?.publicMetadata?.role as string | undefined;

        // Strict Check: Must be 'admin' or 'manager'
        if (role !== 'admin' && role !== 'manager') {
            // Redirect unauthorized users immediately
            router.push('/'); 
        } else {
            setIsAuthorized(true);
        }
    }, [isLoaded, user, router]);

    // --- 2. FETCH PARTICIPANTS ---
    useEffect(() => {
        if (!isAuthorized) return; // Don't fetch if not authorized

        const eventId = Array.isArray(params.id) ? params.id[0] : params.id;
        if (!eventId) return;

        const fetchData = async () => {
            try {
                const res = await fetch(`/api/events?id=${eventId}`);
                const json = await res.json();
                
                if (json.success && json.data) {
                    setEventTitle(json.data.title.en); 
                    
                    // Transform participants into report objects
                    // We assume new reports have 0 hours by default
                    const initialReports = json.data.participants.map((p: any) => ({
                        userId: p.userId,
                        name: p.name,
                        imageUrl: p.imageUrl,
                        hours: 0, 
                        rating: 5,
                        feedback: "",
                        status: 'pending'
                    }));
                    setReports(initialReports);
                }
            } catch (e) {
                console.error("Error loading event data:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [params.id, isAuthorized]);

    // --- 3. HANDLE INPUT CHANGES ---
    const handleUpdate = (index: number, field: keyof ParticipantReport, value: any) => {
        const newReports = [...reports];
        (newReports[index] as any)[field] = value;
        setReports(newReports);
    };

    // --- 4. SUBMIT TO API ---
    const handleSubmitAll = async () => {
        if (!confirm(`Are you sure you want to submit reports for ${reports.length} volunteers?`)) return;
        
        setSubmitting(true);
        try {
            const res = await fetch('/api/admin/events/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId: params.id,
                    reports: reports
                })
            });

            if (res.ok) {
                alert("Reports submitted successfully!");
                router.push(`/events/${params.id}`);
            } else {
                alert("Failed to save reports.");
            }
        } catch (e) {
            console.error(e);
            alert("Error submitting reports.");
        } finally {
            setSubmitting(false);
        }
    };

    // --- LOADING / UNAUTHORIZED STATES ---
    if (!isLoaded || !isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
                    <p className="text-slate-500">Verifying permissions...</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <FaSpinner className="animate-spin text-4xl text-blue-600" />
            </div>
        );
    }

    // --- MAIN UI ---
    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <Link href={`/events/${params.id}`} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-2 transition-colors">
                            <FaArrowLeft /> Back to Event
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-800">Volunteer Report</h1>
                        <p className="text-slate-600 flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Event</span>
                            {eventTitle}
                        </p>
                    </div>
                    <button 
                        onClick={handleSubmitAll}
                        disabled={submitting || reports.length === 0}
                        className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {submitting ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        Submit Reports
                    </button>
                </div>

                {/* Main Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-100 text-slate-600 text-sm uppercase">
                                    <th className="p-4 border-b border-slate-200">Volunteer</th>
                                    <th className="p-4 border-b border-slate-200 w-32">Hours</th>
                                    <th className="p-4 border-b border-slate-200 w-48">Rating (1-5)</th>
                                    <th className="p-4 border-b border-slate-200">Feedback / Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {reports.map((report, index) => (
                                    <tr key={report.userId} className="hover:bg-slate-50 transition-colors">
                                        {/* Volunteer Info */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img 
                                                    src={report.imageUrl || "/default-avatar.png"} 
                                                    alt={report.name}
                                                    className="w-10 h-10 rounded-full bg-slate-200 object-cover border border-slate-200" 
                                                />
                                                <div>
                                                    <p className="font-bold text-slate-700">{report.name}</p>
                                                    <p className="text-xs text-slate-400">ID: {report.userId.slice(-6)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        {/* Hours Input */}
                                        <td className="p-4">
                                            <input 
                                                type="number" 
                                                min="0"
                                                step="0.5"
                                                value={report.hours}
                                                onChange={(e) => handleUpdate(index, 'hours', parseFloat(e.target.value) || 0)}
                                                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none text-center font-mono"
                                            />
                                        </td>

                                        {/* Rating Input */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="range" 
                                                    min="1" max="5"
                                                    value={report.rating}
                                                    onChange={(e) => handleUpdate(index, 'rating', parseInt(e.target.value))}
                                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                                />
                                                <span className="font-bold text-slate-700 w-6 text-center">{report.rating}</span>
                                                <FaStar className="text-yellow-400 mb-1" />
                                            </div>
                                        </td>

                                        {/* Feedback Input */}
                                        <td className="p-4">
                                            <input 
                                                type="text" 
                                                placeholder="Write a comment..."
                                                value={report.feedback}
                                                onChange={(e) => handleUpdate(index, 'feedback', e.target.value)}
                                                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {reports.length === 0 && !loading && (
                    <div className="text-center p-12 bg-white rounded-xl border border-dashed border-slate-300 mt-4">
                        <FaExclamationTriangle className="text-yellow-500 text-4xl mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-slate-700">No Participants Found</h3>
                        <p className="text-slate-500">No volunteers have registered for this event yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}