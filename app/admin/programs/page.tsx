import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongo/mongodb";
import ProgramsManager from "./ProgramsManager";

export const dynamic = "force-dynamic";

export default async function AdminProgramsPage() {
  // 1. Admin Authorization Check
  const user = await currentUser();
  
  if (!user || user.publicMetadata.role !== "admin") {
    return redirect("/");
  }

  // 2. Fetch Programs from DB
  const client = await clientPromise;
  const db = client.db("volunteer_db");
  
  const rawPrograms = await db
    .collection("programs")
    .find({})
    .sort({ addedAt: -1 }) // Newest first
    .toArray();

  // 3. Serialize Data (Convert ObjectId to string & ensure structure)
  const programs = rawPrograms.map((p) => ({
    ...p,
    _id: p._id.toString(),
    id: p.id,
    // Default empty objects if fields are missing in legacy data
    focus: p.focus || { mn: [], en: [] },
    title: p.title || { mn: "", en: "" },
    description: p.description || { mn: "", en: "" },
  }));

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800">Programs Dashboard</h1>
        <p className="text-slate-500">Create and edit your core impact programs.</p>
      </div>
      
      {/* Pass data to Client Component */}
      <ProgramsManager programs={JSON.parse(JSON.stringify(programs))} />
    </div>
  );
}