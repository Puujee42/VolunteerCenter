"use client";

import React, { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FaUserCircle } from "react-icons/fa";

// 1. Translation Map (Cyrillic -> English Keys)
const provinceMapping: Record<string, string> = {
    "Улаанбаатар": "ulaanbaatar",
    "архангай": "arkhangai",
    "баян-өлгий": "bayan-ölgii",
    "баянөлгий": "bayan-ölgii",
    "баянхонгор": "bayankhongor",
    "булган": "bulgan",
    "дархан-уул": "darkhan-uul",
    "дархан": "darkhan-uul",
    "дорнод": "dornod",
    "дорноговь": "dornogovi",
    "дундговь": "dundgovi",
    "говь-алтай": "govi-altai",
    "говьалтай": "govi-altai",
    "говьсүмбэр": "govisümber",
    "хэнтий": "khentii",
    "ховд": "khovd",
    "хөвсгөл": "khövsgöl",
    "орхон": "orkhon",
    "эрдэнэт": "orkhon",
    "өмнөговь": "ömnögovi",
    "өвөрхангай": "övörkhangai",
    "сэлэнгэ": "selenge",
    "сүхбаатар": "sükhbaatar",
    "төв": "töv",
    "увс": "uvs",
    "завхан": "zavkhan"
};

// --- Export Interfaces ---
export interface UserLocation {
    userId?: string;
    name?: string;
    imageUrl?: string;
    email?: string;
    province?: string; 
}

export interface LocationData {
    _id?: string;
    name: string;
    lat: number | string;
    lng: number | string;
}

interface VolunteerMapProps {
    users: UserLocation[]; 
    locations: LocationData[]; 
}

const VolunteerMap: React.FC<VolunteerMapProps> = ({ users = [], locations = [] }) => {
    
    // 2. Aggregate Data
    const usersByProvince = useMemo(() => {
        const tempMap: Record<string, UserLocation[]> = {};
        
        if (!users) return tempMap;

        users.forEach(u => {
            // Debug Log: Check if province exists on the user object
            // console.log("Processing User:", u.name, "Province:", u.province);

            if (u.province && typeof u.province === 'string') {
                const rawInput = u.province.trim().toLowerCase(); 
                
                // Try translation, fallback to raw input
                let standardizedName = provinceMapping[rawInput] || rawInput;

                if(standardizedName) {
                    if (!tempMap[standardizedName]) tempMap[standardizedName] = [];
                    tempMap[standardizedName].push(u);
                }
            }
        });
        return tempMap;
    }, [users]);

    return (
        <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-lg border border-slate-200 z-0 relative">
            
            {/* --- DEBUG BOX: REMOVE THIS AFTER FIXING --- */}
            <div className="absolute top-2 right-2 z-[1000] bg-white/90 p-2 text-xs font-mono border border-red-500 rounded max-h-40 overflow-y-auto hidden">
                <p className="font-bold text-red-600">DEBUG INFO:</p>
                <p>Total Users: {users.length}</p>
                <p>Total Locations: {locations.length}</p>
                <p>Matched Counts:</p>
                <pre>{JSON.stringify(
                    Object.keys(usersByProvince).map(k => `${k}: ${usersByProvince[k].length}`), 
                    null, 2
                )}</pre>
            </div>
            {/* ------------------------------------------- */}

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

                {locations.map((prov, i) => {
                    const lat = Number(prov.lat);
                    const lng = Number(prov.lng);

                    if (isNaN(lat) || isNaN(lng)) return null;

                    // Match logic
                    const normalizedName = prov.name.trim().toLowerCase();
                    const localUsers = usersByProvince[normalizedName] || [];
                    const count = localUsers.length;
                    
                    const hasUsers = count > 0;
                    
                    // Visuals: Blue if > 0, Gray if 0
                    const color = hasUsers ? "#2563eb" : "#94a3b8"; 
                    const radius = hasUsers ? Math.min(Math.max(count * 4, 15), 50) : 8;

                    return (
                        <CircleMarker
                            key={`${prov.name}-${i}`}
                            center={[lat, lng]}
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

                            <Popup minWidth={200} maxWidth={300}>
                                <div className="text-left">
                                    <div className="border-b border-slate-200 pb-2 mb-2">
                                        <h3 className="font-bold text-lg text-slate-800">{prov.name}</h3>
                                        <p className="text-xs text-slate-500 font-semibold uppercase">{count} Volunteers</p>
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
                                        <p className="text-sm text-slate-400 italic">No registered users here.</p>
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