"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaPlus, 
  FaTrash, 
  FaEdit, // Added Edit Icon
  FaCalendarAlt, 
  FaHandsHelping, 
  FaTimes, 
  FaCloudUploadAlt, 
  FaImage, 
  FaSpinner 
} from "react-icons/fa";
import { useRouter } from "next/navigation";

// --- Types ---
interface Item {
  id: string;
  title: { mn: string; en: string };
  description: { mn: string; en: string }; // Added description to interface
  location: { mn: string; en: string };
  startDate?: string;
  registrationEnd?: string;
  capacity?: number;
  registered?: number;
  slots?: { filled: number; total: number };
  imageUrl?: string;
  city?: string; // For legacy volunteer location support
}

interface EventsManagerProps {
  events: Item[];
  opportunities: Item[];
  defaultTab?: "event" | "opportunity";
}

export default function EventsManager({ events, opportunities, defaultTab = "event" }: EventsManagerProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"event" | "opportunity">(defaultTab);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: "", // Empty for create, filled for edit
    titleMn: "", titleEn: "",
    descMn: "", descEn: "",
    locationMn: "", locationEn: "",
    date: "", capacity: "20",
    imageUrl: "" 
  });

  const activeList = activeTab === "event" ? events : opportunities;

  // --- HANDLERS ---

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
        alert("File is too large. Max 15MB.");
        return;
    }

    setUploadingImage(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);
    data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!);

    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: data });
        const uploadedImage = await res.json();
        if (uploadedImage.secure_url) {
            setFormData((prev) => ({ ...prev, imageUrl: uploadedImage.secure_url }));
        }
    } catch (err) { alert("Upload failed."); } 
    finally { setUploadingImage(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    setLoading(true);
    try {
        await fetch("/api/admin/events", {
            method: "DELETE",
            body: JSON.stringify({ id, type: activeTab })
        });
        router.refresh();
    } catch (e) { alert("Delete failed"); } 
    finally { setLoading(false); }
  };

  // --- EDIT HANDLER ---
  const handleEdit = (item: Item) => {
    setFormData({
        id: item.id,
        titleMn: item.title?.mn || "",
        titleEn: item.title?.en || "",
        descMn: item.description?.mn || "",
        descEn: item.description?.en || "",
        locationMn: item.location?.mn || "",
        locationEn: item.location?.en || item.city || "",
        date: item.startDate || item.registrationEnd || "",
        capacity: (item.capacity || item.slots?.total || 20).toString(),
        imageUrl: item.imageUrl || ""
    });
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setFormData({ id: "", titleMn: "", titleEn: "", descMn: "", descEn: "", locationMn: "", locationEn: "", date: "", capacity: "20", imageUrl: "" });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Determine Method (POST for create, PUT for edit)
    const method = formData.id ? "PUT" : "POST";

    try {
        await fetch("/api/admin/events", {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, type: activeTab })
        });
        
        setIsModalOpen(false);
        router.refresh();
    } catch (e) { alert("Operation failed"); } 
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex bg-slate-100 p-1 rounded-lg">
            <TabButton active={activeTab === "event"} onClick={() => setActiveTab("event")} icon={FaCalendarAlt} label="Events" />
            <TabButton active={activeTab === "opportunity"} onClick={() => setActiveTab("opportunity")} icon={FaHandsHelping} label="Volunteer Jobs" />
        </div>
        <button type="button" onClick={handleOpenCreate} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
            <FaPlus /> Post New {activeTab === "event" ? "Event" : "Job"}
        </button>
      </div>

      {/* --- MODAL (CREATE / EDIT) --- */}
      <AnimatePresence>
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="text-xl font-bold text-slate-800">
                            {formData.id ? "Edit Item" : `Create New ${activeTab === "event" ? "Event" : "Volunteer Job"}`}
                        </h3>
                        <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><FaTimes size={20} /></button>
                    </div>
                    
                    <div className="overflow-y-auto p-6">
                        <form id="contentForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Image Upload */}
                            <div className="col-span-2">
                                <h4 className="text-sm font-bold text-blue-600 uppercase mb-2">1. Cover Image</h4>
                                <div 
                                    className={`border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors relative overflow-hidden ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {uploadingImage ? (
                                        <div className="py-10 flex flex-col items-center">
                                            <FaSpinner className="animate-spin text-3xl text-blue-500 mb-2" />
                                            <p className="text-sm text-slate-500">Uploading...</p>
                                        </div>
                                    ) : formData.imageUrl ? (
                                        <img src={formData.imageUrl} alt="Preview" className="h-48 w-full object-cover rounded-lg" />
                                    ) : (
                                        <div className="py-4">
                                            <FaCloudUploadAlt className="text-4xl text-slate-400 mx-auto mb-2" />
                                            <p className="text-sm text-slate-500 font-medium">Click to upload image</p>
                                        </div>
                                    )}
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    {!uploadingImage && formData.imageUrl && (
                                        <button 
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setFormData({...formData, imageUrl: ""}); if(fileInputRef.current) fileInputRef.current.value = ""; }}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-md"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="col-span-2 space-y-4">
                                <h4 className="text-sm font-bold text-blue-600 uppercase">2. Basic Info</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input label="Title (Mongolian)" value={formData.titleMn} onChange={v => setFormData({...formData, titleMn: v})} />
                                    <Input label="Title (English)" value={formData.titleEn} onChange={v => setFormData({...formData, titleEn: v})} />
                                </div>
                            </div>

                            {/* Location & Date */}
                            <div className="col-span-2 space-y-4">
                                <h4 className="text-sm font-bold text-blue-600 uppercase">3. Location & Date</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input label="Location (MN)" value={formData.locationMn} onChange={v  => setFormData({...formData, locationMn: v})} />
                                    <Input label="Location (EN)" value={formData.locationEn} onChange={v => setFormData({...formData, locationEn: v})} />
                                    <Input type="date" label="Date / Deadline" value={formData.date} onChange={v => setFormData({...formData, date: v})} />
                                    <Input type="number" label="Capacity / Slots" value={formData.capacity} onChange={v => setFormData({...formData, capacity: v})} />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="col-span-2 space-y-4">
                                <h4 className="text-sm font-bold text-blue-600 uppercase">4. Details</h4>
                                <TextArea label="Description (MN)" value={formData.descMn} onChange={v => setFormData({...formData, descMn: v})} />
                                <TextArea label="Description (EN)" value={formData.descEn} onChange={v => setFormData({...formData, descEn: v})} />
                            </div>
                        </form>
                    </div>

                    <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg">Cancel</button>
                        <button form="contentForm" type="submit" disabled={loading || uploadingImage} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50">
                            {loading ? "Saving..." : (formData.id ? "Update Item" : "Post Now")}
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                <tr>
                    <th className="p-4">Image</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Location</th>
                    <th className="p-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {activeList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 w-20">
                            <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><FaImage /></div>}
                            </div>
                        </td>
                        <td className="p-4">
                            <div className="font-bold text-slate-800">{item.title?.mn || "No Title"}</div>
                            <div className="text-xs text-slate-500">{item.title?.en}</div>
                        </td>
                        <td className="p-4 text-sm text-slate-600">{item.startDate || item.registrationEnd}</td>
                        <td className="p-4 text-sm text-slate-600">{item.location?.en || item.city}</td>
                        <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                                <button onClick={() => handleEdit(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                    <FaEdit />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                    <FaTrash />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                {activeList.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-400">No items found.</td></tr>}
            </tbody>
        </table>
      </div>
    </div>
  );
}

// Sub Components
type TabButtonProps = { active: boolean; onClick: () => void; icon: any; label: string; };
const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon: Icon, label }) => (
    <button type="button" onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-md transition-all ${active ? "bg-white text-blue-600 shadow-sm font-bold" : "text-slate-500 hover:text-slate-700"}`}><Icon /> {label}</button>
);
type InputProps = { label: string; value: string; onChange: (v: string) => void; type?: string; };
const Input: React.FC<InputProps> = ({ label, value, onChange, type = "text" }) => (
    <div><label className="block text-xs font-bold text-slate-500 mb-1">{label}</label><input type={type} value={value} onChange={(e) => onChange(e.target.value)} required className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" /></div>
);
type TextAreaProps = { label: string; value: string; onChange: (v: string) => void; };
const TextArea: React.FC<TextAreaProps> = ({ label, value, onChange }) => (
    <div><label className="block text-xs font-bold text-slate-500 mb-1">{label}</label><textarea value={value} onChange={(e) => onChange(e.target.value)} required rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" /></div>
);