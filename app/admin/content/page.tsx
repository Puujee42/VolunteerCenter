import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongo/mongodb";
import ContentManager from "./ContentManager";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== "admin") redirect("/");

  const client = await clientPromise;
  const db = client.db("volunteer_db");

  // Fetch all collections in parallel
  const [courses, lessons, podcasts, videos] = await Promise.all([
    db.collection("courses").find({}).sort({ date: -1 }).toArray(),
    db.collection("lessons").find({}).toArray(),
    db.collection("podcasts").find({}).sort({ ep: -1 }).toArray(),
    db.collection("videos").find({}).sort({ date: -1 }).toArray()
  ]);

  // Serialize IDs
  const serialize = (data: any[]) => data.map(d => ({ ...d, _id: d._id.toString() }));

  return (
    <div className="pt-24 px-8 min-h-screen bg-slate-100 ml-64">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Content Management</h1>
        <p className="text-slate-500">Manage courses, lessons, podcasts, and videos.</p>
      </div>

      <ContentManager 
        courses={serialize(courses)} 
        lessons={serialize(lessons)} 
        podcasts={serialize(podcasts)} 
        videos={serialize(videos)} 
      />
    </div>
  );
}