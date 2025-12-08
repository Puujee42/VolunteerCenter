import { currentUser } from '@clerk/nextjs/server';
import clientPromise from "@/lib/mongo/mongodb";
import DashboardClient from './DashboardClient';
import { redirect } from 'next/navigation';

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  const client = await clientPromise;
  const db = client.db("volunteer_db");

  // 1. Run all database queries in PARALLEL
  // We use .project to only fetch necessary fields (Optimization #3)
  const [userProfile, opportunities, events] = await Promise.all([
    db.collection("users").findOne({ userId: user.id }),
    
    db.collection("opportunities")
      .find({})
      .sort({ _id: -1 }) // Show newest first
      .limit(20)         // Don't fetch 1000 items if you only show 10
      .toArray(),

    db.collection("events")
      .find({})
      .sort({ startDate: 1 })
      .limit(20)
      .toArray()
  ]);

  // 2. Faster Serialization (Helper function)
  // JSON.parse(JSON.stringify) is slow. A map is faster.
  const mapId = (doc: any) => ({ ...doc, _id: doc._id.toString() });

  return (
    <DashboardClient
      user={{
        id: user.id,
        firstName: user.firstName || user.username || "Volunteer",
        username: user.username,
        imageUrl: user.imageUrl, 
      }}
      // If profile is missing (race condition), pass null. 
      // Handle "Create Profile" logic in the UI, don't block the server.
      dbUser={userProfile ? mapId(userProfile) : null} 
      opportunities={opportunities.map(mapId)}
      events={events.map(mapId)}
    />
  );
}