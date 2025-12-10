"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaEdit, FaSearch, FaUserTag, FaCrown, FaClipboardList, FaSpinner, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Assumes location file is at /app/sign-up/location.ts
// If you moved it to a central /lib or /data folder, adjust this path.
import { mongolianLocations } from "../../sign-up/location";

// Updated User Type
type User = {
  _id: string;
  userId: string;
  fullName?: string; // This is the user's full name (e.g., "John Doe")
  name: string;      // This is the unique username
  email: string;
  rank: { current: string };
  role: "volunteer" | "manager" | "admin";
  createdAt: string;
  imageUrl?: string;
  profileDetails?: {
    age: number;
    province: string;
    district: string;
    school: string;
    partner: string;
    program: string;
  };
};

// These can be moved to a shared file
const partnersList = [
    "Volunteer Center Mongolia", "Хүүхэд, гэр бүлийн хөгжил, хамгааллын ерөнхий газар", "Өмнөговь аймгийн Гэр бүл, Хүүхэд, Залуучуудын хөгжлийн газар", "GOOD NEIGHBORS Mongolia", "Монголын Улаан Загалмай Нийгэмлэг", "Дэлхийн Зөн Монгол", "ADRA Mongolia", "Дэлхийн Банк", "Peace Corps Mongolia", "Бусад / Хувь хүн"
];
const programsList = ["AND", "EDU", "V", "Одоогоор мэдэхгүй"];


export default function UsersTable({ initialUsers }: { initialUsers: User[] }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredUsers = users.filter(
    (u) =>
      (u.fullName || u.name)?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenEdit = async (userId: string) => {
    setIsModalLoading(true);
    setEditingUser({} as User);
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setEditingUser(data.user);
      } else {
        alert("Failed to fetch user details.");
        setEditingUser(null);
      }
    } catch (error) {
      console.error(error);
      setEditingUser(null);
    } finally {
      setIsModalLoading(false);
    }
  };

  const districts = useMemo(() => {
    const provinceName = editingUser?.profileDetails?.province;
    if (!provinceName) return [];
    const province = mongolianLocations.find(p => p.name === provinceName);
    return province ? province.districts : [];
  }, [editingUser?.profileDetails?.province]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: editingUser.userId,
            name: editingUser.name,           // Username
            fullName: editingUser.fullName,   // Full Name
            role: editingUser.role,
            ...editingUser.profileDetails
        }),
      });

      if (res.ok) {
        setUsers(prev => prev.map(u => u.userId === editingUser.userId ? { ...u, name: editingUser.name, fullName: editingUser.fullName, role: editingUser.role } : u));
        setEditingUser(null);
        router.refresh();
      } else {
        alert("Failed to update user");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure? This will delete the user and all their records permanently.")) return;
    setIsSubmitting(true);
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
            alert("Failed to delete user.");
        }
    } catch(err) { console.error(err) }
    finally { setIsSubmitting(false); }
  };

  const handleProfileChange = (field: keyof NonNullable<User['profileDetails']>, value: any) => {
    if (!editingUser) return;
    setEditingUser(prev => {
        if (!prev) return null;
        const currentDetails = prev.profileDetails || {
            age: 0, province: '', district: '', school: '', partner: '', program: ''
        };
        return {
            ...prev,
            profileDetails: {
                ...currentDetails,
                [field]: value,
            }
        };
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">User Management</h2>
        <div className="relative w-full md:w-64">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search users..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
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
                <motion.tr key={user.userId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={user.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} className="w-10 h-10 rounded-full object-cover bg-slate-200"/>
                      <div>
                        {/* --- UPDATED: Show Full Name --- */}
                        <p className="font-bold text-slate-800">{user.fullName || user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {user.role === 'admin' && <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-purple-100 text-purple-700 rounded-full w-fit"><FaCrown /> Admin</span>}
                    {user.role === 'manager' && <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-orange-100 text-orange-700 rounded-full w-fit"><FaClipboardList /> Manager</span>}
                    {(!user.role || user.role === 'volunteer') && <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-full w-fit"><FaUserTag /> Volunteer</span>}
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold border border-slate-200">{user.rank?.current || "N/A"}</span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button onClick={() => handleOpenEdit(user.userId)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><FaEdit /></button>
                    <button onClick={() => handleDelete(user.userId)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><FaTrash /></button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar">
                {isModalLoading ? (
                  <div className="flex flex-col items-center justify-center h-64">
                    <FaSpinner className="animate-spin text-3xl text-blue-500"/>
                    <p className="mt-4 text-slate-500">Loading User Details...</p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold mb-6">Edit User: {editingUser.fullName || editingUser.name}</h3>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        
                        {/* --- UPDATED: Full Name & Username --- */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                            <input value={editingUser.fullName || ''} onChange={(e) => setEditingUser({...editingUser, fullName: e.target.value})} className="w-full border p-2 rounded-lg"/>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Username (Login ID)</label>
                            <input value={editingUser.name || ''} onChange={(e) => setEditingUser({...editingUser, name: e.target.value})} className="w-full border p-2 rounded-lg bg-slate-50"/>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Age</label>
                            <input type="number" value={editingUser.profileDetails?.age || ''} onChange={(e) => handleProfileChange('age', parseInt(e.target.value))} className="w-full border p-2 rounded-lg"/>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Program</label>
                            <select value={editingUser.profileDetails?.program || ''} onChange={(e) => handleProfileChange('program', e.target.value)} className="w-full border p-2 rounded-lg bg-white">
                                {programsList.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                          </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">School / University</label>
                            <input value={editingUser.profileDetails?.school || ''} onChange={(e) => handleProfileChange('school', e.target.value)} className="w-full border p-2 rounded-lg"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Province</label>
                            <select value={editingUser.profileDetails?.province || ''} onChange={(e) => { handleProfileChange('province', e.target.value); handleProfileChange('district', ''); }} className="w-full border p-2 rounded-lg bg-white">
                                {mongolianLocations.map((p: { id: string; name: string }) => <option key={p.id} value={p.name}>{p.name}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">District</label>
                            <select disabled={!editingUser.profileDetails?.province} value={editingUser.profileDetails?.district || ''} onChange={(e) => handleProfileChange('district', e.target.value)} className="w-full border p-2 rounded-lg bg-white disabled:bg-slate-100">
                                {districts.map((d: string) => <option key={d} value={d}>{d}</option>)}
                            </select>
                          </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Affiliated Organization</label>
                            <select value={editingUser.profileDetails?.partner || ''} onChange={(e) => handleProfileChange('partner', e.target.value)} className="w-full border p-2 rounded-lg bg-white">
                                {partnersList.map((p: string) => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-6">
                            <label className="block text-sm font-bold text-slate-700 mb-2">System Role (Permissions)</label>
                            <select value={editingUser.role || 'volunteer'} onChange={(e) => setEditingUser({...editingUser, role: e.target.value as any})} className="w-full border p-2 rounded-lg bg-white">
                                <option value="volunteer">Volunteer (Default)</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin (Full Access)</option>
                            </select>
                        </div>
                        <div className="flex gap-3 justify-end mt-6 pt-4 border-t">
                            <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50">
                                {isSubmitting ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                  </>
                )}
            </motion.div>
        </div>
      )}
    </div>
  );
}