"use client";

import React, { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FaUserCircle, FaMapMarkerAlt } from "react-icons/fa";

// 1. IMPORT YOUR STATIC FILE
import { mongolianLocations } from "../../app/sign-up/location"; 

// 2. COORDINATE MAPPING (EXACT CYRILLIC KEYS FROM YOUR FILE)
const PROVINCE_COORDS: Record<string, { lat: number, lng: number }> = {
    "Улаанбаатар": { lat: 47.9188, lng: 106.9176 },
    "Архангай": { lat: 47.3796, lng: 101.4603 },
    "Баян-Өлгий": { lat: 48.3975, lng: 90.4265 },
    "Баянхонгор": { lat: 45.3080, lng: 100.1245 },
    "Булган": { lat: 48.8125, lng: 103.5228 },
    "Говь-Алтай": { lat: 45.5000, lng: 96.2500 },
    "Говьсүмбэр": { lat: 46.3000, lng: 108.4000 },
    "Дархан-Уул": { lat: 49.4867, lng: 105.9228 },
    "Дорноговь": { lat: 44.2000, lng: 110.1000 },
    "Дорнод": { lat: 48.0717, lng: 114.5290 },
    "Дундговь": { lat: 45.7667, lng: 106.2833 },
    "Завхан": { lat: 48.1000, lng: 96.5000 },
    "Орхон": { lat: 49.0333, lng: 104.1500 },
    "Өвөрхангай": { lat: 45.7500, lng: 102.7500 },
    "Өмнөговь": { lat: 43.0000, lng: 104.2500 },
    "Сүхбаатар": { lat: 46.1000, lng: 113.5000 },
    "Сэлэнгэ": { lat: 49.6000, lng: 106.2500 },
    "Төв": { lat: 47.7000, lng: 106.9000 },
    "Увс": { lat: 49.5000, lng: 93.0000 },
    "Ховд": { lat: 47.5000, lng: 92.5000 },
    "Хөвсгөл": { lat: 50.5000, lng: 100.0000 },
    "Хэнтий": { lat: 48.0000, lng: 110.0000 }
};

// --- Interfaces ---
export interface UserLocation {
    userId?: string;
    name?: string;
    imageUrl?: string;
    email?: string;
    province?: string; 
}

interface VolunteerMapProps {
    users: UserLocation[]; 
}

const VolunteerMap: React.FC<VolunteerMapProps> = ({ users = [] }) => {
    
    // 3. Aggregate Users by Province
    const usersByProvince = useMemo(() => {
        const tempMap: Record<string, UserLocation[]> = {};
        if (!users) return tempMap;

        users.forEach(u => {
            if (typeof u.province === 'string') {
                // Normalize names (trim whitespace) to ensure matching
                const pName = u.province.trim(); 
                
                if(pName) {
                    if (!tempMap[pName]) tempMap[pName] = [];
                    tempMap[pName].push(u);
                }
            }
        });
        return tempMap;
    }, [users]);

    return (
        <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-lg border border-slate-200 z-0 relative">
            <MapContainer 
                center={[46.8625, 103.8467]} 
                zoom={5} 
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {/* 4. Iterate over your STATIC file */}
                {mongolianLocations.map((prov, i) => {
                    // Look up coordinates using the Cyrillic name
                    const coords = PROVINCE_COORDS[prov.name];

                    // If coordinates missing, skip (safety check)
                    if (!coords) return null;

                    // Match users directly by Cyrillic name
                    const localUsers = usersByProvince[prov.name] || [];
                    const count = localUsers.length;
                    
                    // Logic: Blue if users exist, Gray if 0
                    const hasUsers = count > 0;
                    const color = hasUsers ? "#2563eb" : "#94a3b8"; 
                    const radius = hasUsers ? Math.min(Math.max(count * 4, 15), 50) : 8;

                    return (
                        <CircleMarker
                            key={`${prov.name}-${i}`}
                            center={[coords.lat, coords.lng]}
                            pathOptions={{ 
                                fillColor: color, 
                                color: hasUsers ? "#1e40af" : "#64748b",
                                weight: 2,
                                opacity: 1,
                                fillOpacity: 0.7 
                            }}
                            radius={radius}
                        >
                            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                                <span className="font-bold text-slate-800">{prov.name} ({count})</span>
                            </Tooltip>

                            <Popup minWidth={250} maxWidth={300}>
                                <div className="text-left">
                                    <div className="border-b border-slate-200 pb-2 mb-2 flex justify-between items-center">
                                        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-red-500"/>
                                            {prov.name}
                                        </h3>
                                        <span className="text-xs bg-slate-100 px-2 py-1 rounded font-bold text-slate-600">
                                            {count} Vols
                                        </span>
                                    </div>
                                    
                                    {hasUsers ? (
                                        <div className="max-h-[150px] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                                            {localUsers.map((user, index) => (
                                                <div key={index} className="flex items-center gap-3 p-1 hover:bg-slate-50 rounded transition">
                                                    {user.imageUrl ? (
                                                        <img src={user.imageUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-slate-200"/>
                                                    ) : (
                                                        <FaUserCircle className="w-8 h-8 text-slate-300" />
                                                    )}
                                                    <div className="overflow-hidden">
                                                        <p className="text-sm font-bold text-slate-700 truncate w-full">{user.name || "User"}</p>
                                                        <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-400 italic">No active volunteers here yet.</p>
                                    )}
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default VolunteerMap;