import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongo/mongodb";
import UsersTable from "./UsersTable";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  // 1. Security Check
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== "admin") {
    redirect("/");
  }

  // 2. Fetch Users
  const client = await clientPromise;
  const db = client.db("volunteer_db");
  const usersRaw = await db.collection("users").find({}).sort({ createdAt: -1 }).toArray();

  // 3. Serialize Data (Convert ObjectId to string)
  const users = usersRaw.map(u => ({
    _id: u._id.toString(),
    userId: u.userId,
    name: u.name,
    role: u.role || 'volunteer', // Add role with a fallback
    email: u.email,
    rank: u.rank || { current: "Bronze" }, // Fallback if missing
    createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
    imageUrl: u.imageUrl
  }));

  return (
    <div className="min-h-screen bg-slate-100 flex">
        {/* Simple Sidebar Placeholder or keep context */}
        {/* Note: In a real app, use a Layout.tsx for the sidebar. 
            For now, we assume this loads inside the /admin layout structure or standalone */}
        
        <main className="flex-1 p-8 pt-24 ml-64"> {/* Added ml-64 to account for fixed sidebar from layout */}
            <div className="mb-6 flex items-center gap-4">
                <h1 className="text-3xl font-bold text-slate-800">Manage Users</h1>
            </div>

            <UsersTable initialUsers={users} />
        </main>
    </div>
  );
}