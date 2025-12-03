"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaChalkboardTeacher, FaPodcast, FaVideo, FaBook, FaCloudUploadAlt, FaSpinner, FaImage, FaTimes, FaYoutube, FaFileVideo, FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

// --- Types ---
type ContentType = "course" | "lesson" | "podcast" | "video";

interface ContentManagerProps {
  courses: any[];
  lessons: any[];
  podcasts: any[];
  videos: any[];
}

// --- Main Component ---
export default function ContentManager({ courses, lessons, podcasts, videos }: ContentManagerProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState<ContentType>("course");
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaSourceType, setMediaSourceType] = useState<"link" | "file">("link");

  const [formData, setFormData] = useState({
    titleMn: "", titleEn: "",
    descMn: "", descEn: "",
    categoryMn: "", categoryEn: "", 
    author: "", 
    episode: "", 
    duration: "", 
    date: "",
    mediaUrl: "", 
    imageUrl: "" 
  });

  const activeList = ({ course: courses, lesson: lessons, podcast: podcasts, video: videos } as Record<ContentType, any[]>)[activeTab];

  // --- HANDLERS ---

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert("Image too large (Max 5MB)");

    setUploadingImage(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!); 
    data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!);

    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: data });
        const json = await res.json();
        if (json.secure_url) setFormData(prev => ({ ...prev, imageUrl: json.secure_url }));
    } catch (err) { alert("Image upload failed"); } 
    finally { setUploadingImage(false); }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) return alert("File too large (Max 100MB)");

    setUploadingMedia(true);
    const resourceType = activeTab === 'podcast' ? 'video' : 'video'; // Cloudinary treats audio as a type of video for uploads
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);
    data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!);
    data.append("resource_type", resourceType);

    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`, { method: "POST", body: data });
        const json = await res.json();
        if (json.secure_url) setFormData(prev => ({ ...prev, mediaUrl: json.secure_url }));
    } catch (err) { alert("Media upload failed"); } 
    finally { setUploadingMedia(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    setLoading(true);
    try {
        await fetch("/api/admin/content", {
            method: "DELETE",
            body: JSON.stringify({ id, type: activeTab })
        });
        router.refresh();
    } catch (e) { alert("Delete failed"); } 
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        await fetch("/api/admin/content", {
            method: "POST",
            body: JSON.stringify({ ...formData, type: activeTab })
        });
        setIsCreating(false);
        setFormData({ titleMn: "", titleEn: "", descMn: "", descEn: "", categoryMn: "", categoryEn: "", author: "", episode: "", duration: "", date: "", mediaUrl: "", imageUrl: "" });
        router.refresh();
    } catch (e) { alert("Create failed"); } 
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      
      {/* Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex bg-slate-100 p-1 rounded-lg overflow-x-auto">
            <TabButton active={activeTab === "course"} onClick={() => setActiveTab("course")} icon={FaBook} label="Courses" />
            <TabButton active={activeTab === "lesson"} onClick={() => setActiveTab("lesson")} icon={FaChalkboardTeacher} label="Lessons" />
            <TabButton active={activeTab === "podcast"} onClick={() => setActiveTab("podcast")} icon={FaPodcast} label="Podcasts" />
            <TabButton active={activeTab === "video"} onClick={() => setActiveTab("video")} icon={FaVideo} label="Videos" />
        </div>
        <button type="button" onClick={() => setIsCreating(true)} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg">
            <FaPlus /> Add Content
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isCreating && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="text-xl font-bold text-slate-800 capitalize">Add New {activeTab}</h3>
                        <button type="button" onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600"><FaTimes /></button>
                    </div>
                    
                    <div className="overflow-y-auto p-6">
                        <form id="createContentForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* --- MEDIA SOURCE --- */}
                            {(activeTab === "video" || activeTab === "podcast" || activeTab === "lesson") && (
                                <div className="col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <h4 className="text-sm font-bold text-blue-600 uppercase mb-3">Media Source</h4>
                                    <div className="flex gap-4 mb-4">
                                        <button type="button" onClick={() => setMediaSourceType("link")} className={`flex-1 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 ${mediaSourceType === "link" ? "bg-white shadow text-blue-600" : "text-slate-500"}`}><FaYoutube /> Link (URL)</button>
                                        <button type="button" onClick={() => setMediaSourceType("file")} className={`flex-1 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 ${mediaSourceType === "file" ? "bg-white shadow text-blue-600" : "text-slate-500"}`}><FaFileVideo /> Upload File</button>
                                    </div>
                                    {mediaSourceType === "link" ? (
                                        <Input label={activeTab === "podcast" ? "Audio URL" : "Video URL / Embed"} value={formData.mediaUrl} onChange={v => setFormData({...formData, mediaUrl: v})} />
                                    ) : (
                                        <div onClick={() => mediaInputRef.current?.click()} className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-slate-100">
                                            {uploadingMedia ? <FaSpinner className="animate-spin text-2xl text-blue-500 mx-auto" /> :
                                             formData.mediaUrl.includes("cloudinary") ? <div className="text-green-600"><FaCheckCircle className="mx-auto text-2xl" /><p className="text-xs mt-1">Uploaded!</p></div> :
                                             <div className="text-slate-400"><FaCloudUploadAlt className="text-3xl mx-auto" /><span>Upload {activeTab} File</span></div>}
                                            <input type="file" ref={mediaInputRef} className="hidden" accept={activeTab === 'podcast' ? "audio/*" : "video/*"} onChange={handleMediaUpload} />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* --- COVER IMAGE --- */}
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-500 mb-2">Cover Image / Thumbnail</label>
                                <div onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-xl p-4 flex items-center justify-center cursor-pointer hover:bg-slate-50 ${uploadingImage && 'opacity-50'}`}>
                                    {uploadingImage ? <FaSpinner className="animate-spin text-2xl text-blue-500" /> : 
                                     formData.imageUrl ? <img src={formData.imageUrl} className="h-32 object-cover rounded" /> : 
                                     <div className="text-center text-slate-400"><FaImage className="text-2xl mx-auto" /><span>Upload Image</span></div>}
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </div>
                            </div>

                            {/* --- DETAILS --- */}
                            <div className="col-span-2 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                                <Input label="Title (MN)" value={formData.titleMn} onChange={v => setFormData({...formData, titleMn: v})} />
                                <Input label="Title (EN)" value={formData.titleEn} onChange={v => setFormData({...formData, titleEn: v})} />
                                {activeTab === "course" && (<><Input label="Category (MN)" value={formData.categoryMn} onChange={v => setFormData({...formData, categoryMn: v})} /><Input label="Category (EN)" value={formData.categoryEn} onChange={v => setFormData({...formData, categoryEn: v})} /></>)}
                                {activeTab === "podcast" && (<Input label="Episode #" type="number" value={formData.episode} onChange={v => setFormData({...formData, episode: v})} />)}
                                {activeTab === "video" && (<Input label="Speaker / Author" value={formData.author} onChange={v => setFormData({...formData, author: v})} />)}
                                <Input label="Duration (e.g. 45 min)" value={formData.duration} onChange={v => setFormData({...formData, duration: v})} />
                                {activeTab !== "lesson" && <Input type="date" label="Date" value={formData.date} onChange={v => setFormData({...formData, date: v})} />}
                            </div>

                            <div className="col-span-2 space-y-4">
                                <TextArea label="Description (MN)" value={formData.descMn} onChange={v => setFormData({...formData, descMn: v})} />
                                <TextArea label="Description (EN)" value={formData.descEn} onChange={v => setFormData({...formData, descEn: v})} />
                            </div>
                        </form>
                    </div>

                    <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                        <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg">Cancel</button>
                        <button form="createContentForm" type="submit" disabled={loading || uploadingImage || uploadingMedia} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50">
                            {loading ? "Saving..." : "Save Content"}
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* --- Data List --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                <tr>
                    <th className="p-4">Media</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Details</th>
                    <th className="p-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {activeList.map((item: any) => (
                    <tr key={item._id || item.id} className="hover:bg-slate-50">
                        <td className="p-4 w-20">
                            <div className="w-12 h-12 bg-slate-100 rounded border overflow-hidden">
                                {item.thumbnail || item.cover ? (<img src={item.thumbnail || item.cover} className="w-full h-full object-cover" />) : (<div className="flex items-center justify-center h-full text-slate-300"><FaImage /></div>)}
                            </div>
                        </td>
                        <td className="p-4"><div className="font-bold text-slate-800">{item.title?.mn || item.title?.en}</div><div className="text-xs text-slate-500">{item.title?.en}</div></td>
                        <td className="p-4 text-sm text-slate-600">{activeTab === "podcast" && `Ep. ${item.ep} • `}{item.duration?.mn || item.duration}</td>
                        <td className="p-4 text-right"><button onClick={() => handleDelete(item.id)} className="p-2 text-red-400 hover:bg-red-50 rounded"><FaTrash /></button></td>
                    </tr>
                ))}
                {activeList.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-slate-400">No content found.</td></tr>}
            </tbody>
        </table>
      </div>
    </div>
  );
}

// Helpers
const TabButton = ({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: React.ComponentType<any>; label: string; }) => (<button type="button" onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-md whitespace-nowrap transition-all ${active ? "bg-white text-blue-600 shadow-sm font-bold" : "text-slate-500 hover:text-slate-700"}`}><Icon /> {label}</button>);
const Input = ({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) => (<div><label className="block text-xs font-bold text-slate-500 mb-1">{label}</label><input type={type} value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} required placeholder={placeholder} className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" /></div>);
const TextArea = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void; }) => (<div><label className="block text-xs font-bold text-slate-500 mb-1">{label}</label><textarea value={value} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)} required rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" /></div>);