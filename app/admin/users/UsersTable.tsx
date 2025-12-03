"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaEdit, FaSearch, FaUserShield, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  userId: string;
  name: string;
  email: string;
  rank: { current: string };
  createdAt: string;
  imageUrl?: string;
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
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // --- DELETE HANDLER ---
  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.userId !== userId));
        router.refresh();
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
            role: editingUser.rank.current 
        }),
      });

      if (res.ok) {
        // Update local state
        setUsers(prev => prev.map(u => u.userId === editingUser.userId ? editingUser : u));
        setEditingUser(null); // Close modal
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Header & Search */}
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">All Users ({users.length})</h2>
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
              <th className="p-4 font-semibold">Role/Rank</th>
              <th className="p-4 font-semibold">Joined</th>
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
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden">
                         {/* Replace with Image tag if user.imageUrl exists */}
                         {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.rank.current === 'Admin' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'
                    }`}>
                        {user.rank.current}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button 
                        onClick={() => setEditingUser(user)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit User"
                    >
                        <FaEdit />
                    </button>
                    <button 
                        onClick={() => handleDelete(user.userId)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                    >
                        <FaTrash />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-slate-500">No users found matching "{search}"</div>
        )}
      </div>

      {/* --- EDIT MODAL --- */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
            >
                <h3 className="text-xl font-bold mb-4">Edit User</h3>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                        <input 
                            value={editingUser.name}
                            onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                            className="w-full border p-2 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Rank / Role</label>
                        <select 
                            value={editingUser.rank.current}
                            onChange={(e) => setEditingUser({...editingUser, rank: {...editingUser.rank, current: e.target.value}})}
                            className="w-full border p-2 rounded-lg"
                        >
                            <option value="Bronze">Bronze (Volunteer)</option>
                            <option value="Silver">Silver (Volunteer)</option>
                            <option value="Gold">Gold (Volunteer)</option>
                            <option value="Admin">Admin</option>
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