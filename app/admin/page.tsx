import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongo/mongodb";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminPage() {
  const user = await currentUser();

  // 1. Security Check
  if (!user || user.publicMetadata.role !== "admin") {
    redirect("/");
  }

  const client = await clientPromise;
  const db = client.db("volunteer_db");

  // 2. Fetch Stats (Your existing logic)
  const usersCount = await db.collection("users").countDocuments();
  const eventsCount = await db.collection("events").countDocuments({ status: "open" });
  const opportunitiesCount = await db.collection("volunteers").countDocuments();
  const applicationsCount = await db.collection("applications").countDocuments();

  // Chart Data Logic (Simplified for brevity)
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const signupsToday = await db.collection("users").countDocuments({
    createdAt: { $gte: startOfDay }
  });

  // 3. --- NEW: FETCH ALL USERS FOR THE MAP ---
  // We need to fetch the users and map them to plain objects to pass to the client
  const allUsersRaw = await db.collection("users").find({}, {
    projection: {
        userId: 1,
        name: 1,
        imageUrl: 1, 
        email: 1,
        province: 1 
    }
  }).toArray();

  // Serialize MongoDB objects (convert _id to string or just map necessary fields)
  const allUsers = allUsersRaw.map((u: any) => ({
    userId: u.userId,
    name: u.name,
    imageUrl: u.imageUrl,
    email: u.email,
    province: u.province || "" // Ensure province exists
  }));

  // 4. Mock Chart Data (Replace with your real aggregation if you have it)
  const chartData = [
    { date: "Mon", signups: 10 },
    { date: "Tue", signups: 15 },
    { date: "Wed", signups: 8 },
    { date: "Thu", signups: 20 },
    { date: "Fri", signups: 12 },
    { date: "Sat", signups: 5 },
    { date: "Sun", signups: 9 },
  ];

  // 5. Render Client Component
  return (
    <div className="pt-24 min-h-screen bg-slate-100">
      <AdminDashboardClient 
        user={{ 
          name: user.firstName || "Admin", 
          image: user.imageUrl 
        }}
        stats={{
          users: usersCount,
          events: eventsCount,
          opportunities: opportunitiesCount,
          applications: applicationsCount,
          signupsToday: signupsToday
        }}
        chartData={chartData}
        allUsers={allUsers} // <--- FIX: PASS THE USERS HERE
      />
    </div>
  );
}