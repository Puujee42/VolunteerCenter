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

  // 1. Fetch User Profile (Retry logic for race conditions)
  let userProfile = null;
  for (let i = 0; i < 3; i++) {
    userProfile = await db.collection("users").findOne({ userId: user.id });
    if (userProfile) break; 
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // 2. ✅ FETCH OPPORTUNITIES AND EVENTS
  const opportunities = await db.collection("opportunities").find({}).toArray();
  const events = await db.collection("events").find({}).toArray(); 

  // 3. Serialize Data (Convert MongoDB IDs to strings)
  const serializedProfile = userProfile ? JSON.parse(JSON.stringify(userProfile)) : null;
  const serializedOpportunities = JSON.parse(JSON.stringify(opportunities));
  const serializedEvents = JSON.parse(JSON.stringify(events)); 

  const simpleUser = {
    id: user.id,
    firstName: user.firstName || user.username || "Volunteer",
    username: user.username,
    imageUrl: user.imageUrl, 
  };

  return (
    <DashboardClient
      user={simpleUser}
      dbUser={serializedProfile}
      opportunities={serializedOpportunities} // Pass Jobs
      events={serializedEvents}               // Pass Events
    />
  );
}