"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaCalendarAlt, FaHandsHelping, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

// --- Types ---
interface Item {
  id: string;
  title: { mn: string; en: string };
  location: { mn: string; en: string };
  startDate?: string;
  registrationEnd?: string;
  capacity?: number;
  registered?: number;
  slots?: { filled: number; total: number };
}

interface EventsManagerProps {
  events: Item[];
  opportunities: Item[];
  defaultTab?: "event" | "opportunity";
}

// --- Main Component ---
export default function EventsManager({ events, opportunities, defaultTab = "event" }: EventsManagerProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"event" | "opportunity">(defaultTab);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    titleMn: "", titleEn: "",
    descMn: "", descEn: "",
    locationMn: "", locationEn: "",
    date: "", capacity: "20"
  });

  const activeList = activeTab === "event" ? events : opportunities;

  // --- HANDLERS ---

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    setLoading(true);
    try {
        await fetch("/api/admin/events", {
            method: "DELETE",
            body: JSON.stringify({ id, type: activeTab })
        });
        router.refresh();
    } catch (e) {
        console.error(e);
        alert("Delete failed");
    } finally {
        setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        await fetch("/api/admin/events", {
            method: "POST",
            body: JSON.stringify({ ...formData, type: activeTab })
        });
        setIsCreating(false);
        setFormData({ titleMn: "", titleEn: "", descMn: "", descEn: "", locationMn: "", locationEn: "", date: "", capacity: "20" });
        router.refresh();
    } catch (e) {
        console.error(e);
        alert("Create failed");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* --- HEADER & TABS --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex bg-slate-100 p-1 rounded-lg">
            <TabButton 
                active={activeTab === "event"} 
                onClick={() => setActiveTab("event")} 
                icon={FaCalendarAlt} 
                label="Events" 
            />
            <TabButton 
                active={activeTab === "opportunity"} 
                onClick={() => setActiveTab("opportunity")} 
                icon={FaHandsHelping} 
                label="Volunteer Jobs" 
            />
        </div>
        <button 
            type="button"
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
            <FaPlus /> Post New {activeTab === "event" ? "Event" : "Job"}
        </button>
      </div>

      {/* --- CREATE FORM MODAL --- */}
      <AnimatePresence>
        {isCreating && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="text-xl font-bold text-slate-800">Create New {activeTab === "event" ? "Event" : "Volunteer Opportunity"}</h3>
                        <button type="button" onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600"><FaTimes size={20} /></button>
                    </div>
                    
                    <div className="overflow-y-auto p-6">
                        <form id="createForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Title Section */}
                            <div className="col-span-2 space-y-4">
                                <h4 className="text-sm font-bold text-blue-600 uppercase">1. Basic Info</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input label="Title (Mongolian)" value={formData.titleMn} onChange={v => setFormData({...formData, titleMn: v})} />
                                    <Input label="Title (English)" value={formData.titleEn} onChange={v => setFormData({...formData, titleEn: v})} />
                                </div>
                            </div>

                            {/* Location Section */}
                            <div className="col-span-2 space-y-4">
                                <h4 className="text-sm font-bold text-blue-600 uppercase">2. Location & Date</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input label="Location (MN)" value={formData.locationMn} onChange={v  => setFormData({...formData, locationMn: v})} />
                                    <Input label="Location (EN)" value={formData.locationEn} onChange={v => setFormData({...formData, locationEn: v})} />
                                    <Input type="date" label="Date / Deadline" value={formData.date} onChange={v => setFormData({...formData, date: v})} />
                                    <Input type="number" label="Capacity / Slots" value={formData.capacity} onChange={v => setFormData({...formData, capacity: v})} />
                                </div>
                            </div>

                            {/* Description Section */}
                            <div className="col-span-2 space-y-4">
                                <h4 className="text-sm font-bold text-blue-600 uppercase">3. Details</h4>
                                <TextArea label="Description (MN)" value={formData.descMn} onChange={v => setFormData({...formData, descMn: v})} />
                                <TextArea label="Description (EN)" value={formData.descEn} onChange={v => setFormData({...formData, descEn: v})} />
                            </div>
                        </form>
                    </div>

                    <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                        <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg">Cancel</button>
                        <button form="createForm" type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50">
                            {loading ? "Posting..." : "Post Now"}
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* --- DATA LIST --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {activeList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                            <div className="font-bold text-slate-800">{item.title?.mn || "No Title"}</div>
                            <div className="text-xs text-slate-500">{item.title?.en}</div>
                        </td>
                        <td className="p-4 text-sm text-slate-600">
                            {item.startDate || item.registrationEnd}
                        </td>
                        <td className="p-4 text-sm text-slate-600">
                            {item.location?.en}
                        </td>
                        <td className="p-4">
                            <div className="text-xs font-bold">
                                {activeTab === 'event' ? (
                                    <span className="text-purple-600 bg-purple-100 px-2 py-1 rounded">
                                        {item.registered} / {item.capacity} Reg
                                    </span>
                                ) : (
                                    <span className="text-green-600 bg-green-100 px-2 py-1 rounded">
                                        {item.slots?.filled} / {item.slots?.total} Filled
                                    </span>
                                )}
                            </div>
                        </td>
                        <td className="p-4 text-right">
                            <button 
                                onClick={() => handleDelete(item.id)} 
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <FaTrash />
                            </button>
                        </td>
                    </tr>
                ))}
                {activeList.length === 0 && (
                    <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400">No items found.</td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>

    </div>
  );
}

// --- SUB COMPONENTS ---

type TabButtonProps = {
    active: boolean;
    onClick: () => void;
    icon: any; // Using any to safely accept React Icons
    label: string;
};

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon: Icon, label }) => (
    <button 
        type="button" 
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-2 rounded-md transition-all ${
            active ? "bg-white text-blue-600 shadow-sm font-bold" : "text-slate-500 hover:text-slate-700"
        }`}
    >
        <Icon /> 
        {label}
    </button>
);

type InputProps = {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
};

const Input: React.FC<InputProps> = ({ label, value, onChange, type = "text" }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 mb-1">{label}</label>
        <input 
            type={type} 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            required
            className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
    </div>
);

type TextAreaProps = {
    label: string;
    value: string;
    onChange: (v: string) => void;
};

const TextArea: React.FC<TextAreaProps> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 mb-1">{label}</label>
        <textarea 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            required
            rows={3}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
    </div>
);