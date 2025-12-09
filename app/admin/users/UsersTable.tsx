"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaEdit, FaSearch, FaUserTag, FaCrown, FaClipboardList } from "react-icons/fa";
import { useRouter } from "next/navigation";

// 1. FIXED INTERFACE
interface User {
  _id: string;
  userId: string;
  name: string;
  email: string;
  // Fixed typo: changed 'currenta' to 'current' to match the rest of your code
  rank: { current: string };
  // Role = System Permissions
  role: "volunteer" | "manager" | "admin"; 
  createdAt: string;
  updatedAt?: string; // Made optional just in case
  imageUrl?: string;
  bio?: string;
}

export default function UsersTable({ initialUsers }: { initialUsers: User[] }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Filter Logic
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  // --- UPDATE HANDLER ---
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            userId: editingUser.userId,
            name: editingUser.name,
            rank: editingUser.rank.current,
            role: editingUser.role 
        }),
      });

      if (res.ok) {
        setUsers(prev => prev.map(u => u.userId === editingUser.userId ? editingUser : u));
        setEditingUser(null);
        router.refresh();
      } else {
        alert("Failed to update user");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE HANDLER ---
  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setLoading(true);
    try {
        const res = await fetch("/api/admin/users", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
        });
        if(res.ok) {
            setUsers((prev) => prev.filter((u) => u.userId !== userId));
            router.refresh();
        } else {
            alert("Failed to delete");
        }
    } catch(err) { console.error(err) }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">User Management</h2>
        <div className="relative w-full md:w-64">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm uppercase">
              <th className="p-4 font-semibold">User</th>
              <th className="p-4 font-semibold">System Role</th>
              <th className="p-4 font-semibold">Volunteer Rank</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <AnimatePresence>
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.userId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {user.imageUrl ? (
                          <img src={user.imageUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover bg-slate-200"/>
                      ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                             {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                          </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  
                  {/* SYSTEM ROLE COLUMN */}
                  <td className="p-4">
                    {user.role === 'admin' && (
                        <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-purple-100 text-purple-700 rounded-full w-fit">
                            <FaCrown /> Admin
                        </span>
                    )}
                    {user.role === 'manager' && (
                        <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-orange-100 text-orange-700 rounded-full w-fit">
                            <FaClipboardList /> Event Manager
                        </span>
                    )}
                    {(!user.role || user.role === 'volunteer') && (
                        <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-full w-fit">
                            <FaUserTag /> Volunteer
                        </span>
                    )}
                  </td>

                  {/* RANK COLUMN */}
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold border border-slate-200">
                        {user.rank?.current || "Bronze"}
                    </span>
                  </td>

                  <td className="p-4 text-right flex justify-end gap-2">
                    <button 
                        onClick={() => setEditingUser(user)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <FaEdit />
                    </button>
                    <button 
                        onClick={() => handleDelete(user.userId)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <FaTrash />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* --- EDIT MODAL --- */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
            >
                <h3 className="text-xl font-bold mb-4">Edit User Permissions</h3>
                <form onSubmit={handleUpdate} className="space-y-4">
                    
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                        <input 
                            value={editingUser.name}
                            onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                            className="w-full border p-2 rounded-lg"
                        />
                    </div>

                    {/* Role Selector (Permissions) */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <label className="block text-sm font-bold text-slate-700 mb-2">System Role (Permissions)</label>
                        <select 
                            value={editingUser.role || 'volunteer'}
                            onChange={(e) => setEditingUser({...editingUser, role: e.target.value as any})}
                            className="w-full border p-2 rounded-lg bg-white"
                        >
                            <option value="volunteer">Volunteer (Default)</option>
                            <option value="manager">Event Manager (Can Start/End/Report)</option>
                            <option value="admin">Admin (Full Access)</option>
                        </select>
                        <p className="text-xs text-slate-500 mt-2">
                            * <strong>Event Managers</strong> can view attendee lists and submit grades/reports for events.
                        </p>
                    </div>

                    {/* Rank Selector (Gamification) */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Volunteer Rank</label>
                        <select 
                            value={editingUser.rank?.current || "Bronze"}
                            onChange={(e) => setEditingUser({
                                ...editingUser, 
                                rank: { ...editingUser.rank, current: e.target.value }
                            })}
                            className="w-full border p-2 rounded-lg"
                        >
                            <option value="Bronze">Bronze</option>
                            <option value="Silver">Silver</option>
                            <option value="Gold">Gold</option>
                            <option value="Platinum">Platinum</option>
                        </select>
                    </div>

                    <div className="flex gap-3 justify-end mt-6">
                        <button 
                            type="button"
                            onClick={() => setEditingUser(null)}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
      )}
    </div>
  );
}