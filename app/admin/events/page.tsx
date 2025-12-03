import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongo/mongodb";
import EventsManager from "./EventsManager";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== "admin") {
    redirect("/");
  }

  const client = await clientPromise;
  const db = client.db("volunteer_db");

  // ✅ FIX: Changed "opportunities" to "volunteers"
  const [eventsRaw, volunteersRaw] = await Promise.all([
    db.collection("events").find({}).sort({ startDate: -1 }).toArray(),
    db.collection("volunteers").find({}).sort({ registrationEnd: -1 }).toArray()
  ]);

  const events = eventsRaw.map(doc => ({
    ...doc,
    _id: doc._id.toString()
  }));
  
  const opportunities = volunteersRaw.map(doc => ({
    ...doc,
    _id: doc._id.toString()
  }));

  return (
    <div className="pt-24 px-8 min-h-screen bg-slate-100 ml-64">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Events & Jobs Manager</h1>
        <p className="text-slate-500">Post new activities and manage existing ones.</p>
      </div>

      <EventsManager events={events as any} opportunities={opportunities as any} />
    </div>
  );
}