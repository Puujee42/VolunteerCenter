import { currentUser } from '@clerk/nextjs/server';
import clientPromise from "@/lib/mongo/mongodb";
import DashboardClient from './DashboardClient';
import { redirect } from 'next/navigation';

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let user;

  try {
    // 1. Safe Authentication Check
    user = await currentUser();
  } catch (err) {
    // If Clerk throws an error (like 404), force a logout/redirect
    console.error("Clerk Auth Error:", err);
    redirect('/sign-in');
  }

  // If not logged in, redirect
  if (!user) {
    redirect('/sign-in');
  }

  const client = await clientPromise;
  const db = client.db("volunteer_db");

  // 2. Fetch User from MongoDB with Retry Logic
  // Sometimes Mongo is slow to index the new user after registration
  let userProfile = null;
  for (let i = 0; i < 3; i++) {
    userProfile = await db.collection("users").findOne({ userId: user.id });
    if (userProfile) break; 
    await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
  }
  
  const opportunities = await db.collection("opportunities").find({}).toArray();

  // 3. Serialization
  const serializedProfile = userProfile ? JSON.parse(JSON.stringify(userProfile)) : null;
  const serializedOpportunities = JSON.parse(JSON.stringify(opportunities));

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
      opportunities={serializedOpportunities}
    />
  );
}