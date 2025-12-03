"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSave, FaGlobe, FaShieldAlt, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

// ✅ ENSURE THIS EXPORT DEFAULT EXISTS
export default function SettingsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Settings State
  const [settings, setSettings] = useState({
    siteName: "",
    supportEmail: "",
    maintenanceMode: false,
    allowRegistration: true,
    announcementBar: ""
  });

  // Fetch on mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        const json = await res.json();
        if (json.success) {
          setSettings(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  // Save Handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: "Settings saved successfully!" });
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error("Failed to save");
      }
    } catch (err) {
      setMessage({ type: 'error', text: "Error saving settings." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Feedback Message */}
      {message && (
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
        >
            {message.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
            <span className="font-bold">{message.text}</span>
        </motion.div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* General Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                <FaGlobe className="text-blue-600" />
                <h3 className="font-bold text-slate-800">General Information</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                    label="Application Name" 
                    value={settings.siteName} 
                    onChange={(v: string) => setSettings({...settings, siteName: v})}
                    placeholder="e.g. Volunteer Center"
                />
                <Input 
                    label="Support Email" 
                    value={settings.supportEmail} 
                    onChange={(v: string) => setSettings({...settings, supportEmail: v})}
                    type="email"
                    placeholder="admin@example.com"
                />
                <div className="col-span-1 md:col-span-2">
                    <Input 
                        label="Global Announcement (Banner)" 
                        value={settings.announcementBar} 
                        onChange={(v: string) => setSettings({...settings, announcementBar: v})}
                        placeholder="e.g. System maintenance scheduled..."
                    />
                </div>
            </div>
        </div>

        {/* System Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                <FaShieldAlt className="text-purple-600" />
                <h3 className="font-bold text-slate-800">System Controls</h3>
            </div>
            <div className="p-6 space-y-6">
                
                {/* Registration Toggle */}
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-slate-800">Allow New Registrations</h4>
                        <p className="text-sm text-slate-500">If disabled, new users cannot sign up.</p>
                    </div>
                    <Toggle 
                        enabled={settings.allowRegistration} 
                        onChange={(v: boolean) => setSettings({...settings, allowRegistration: v})} 
                    />
                </div>

                <hr className="border-slate-100" />

                {/* Maintenance Toggle */}
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-slate-800">Maintenance Mode</h4>
                        <p className="text-sm text-slate-500">Show a maintenance page to all non-admin users.</p>
                    </div>
                    <Toggle 
                        enabled={settings.maintenanceMode} 
                        onChange={(v: boolean) => setSettings({...settings, maintenanceMode: v})} 
                        danger
                    />
                </div>

            </div>
        </div>

        <div className="flex justify-end">
            <button 
                type="submit" 
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 disabled:opacity-50"
            >
                {saving ? "Saving..." : <><FaSave /> Save Changes</>}
            </button>
        </div>

      </form>
    </div>
  );
}

// --- Helper Components ---

const Input = ({ label, value, onChange, type="text", placeholder }: any) => (
    <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
        <input 
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
    </div>
);

const Toggle = ({ enabled, onChange, danger = false }: any) => (
    <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            enabled ? (danger ? 'bg-red-500 focus:ring-red-500' : 'bg-green-500 focus:ring-green-500') : 'bg-slate-300 focus:ring-slate-500'
        }`}
    >
        <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                enabled ? 'translate-x-7' : 'translate-x-1'
            }`}
        />
    </button>
);