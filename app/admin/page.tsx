import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongo/mongodb";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await currentUser();

  // 1. Security Check
  if (!user || user.publicMetadata.role !== "admin") {
    redirect("/"); 
  }

  const client = await clientPromise;
  const db = client.db("volunteer_db");

  // 2. Get General Counts
  const [userCount, eventCount, opportunityCount, volunteerCount] = await Promise.all([
    db.collection("users").countDocuments(),
    db.collection("events").countDocuments(),
    db.collection("opportunities").countDocuments(),
    db.collection("volunteers").countDocuments() 
  ]);

  // 3. --- ANALYTICS: Calculate Signups per Day (Last 7 Days) ---
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const signupsRaw = await db.collection("users").aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo } // Only users from last 7 days
      }
    },
    {
      $group: {
        // Group by Date part only (YYYY-MM-DD)
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } } // Sort by date ascending
  ]).toArray();

  // 4. Format Data for Recharts (Fill in missing days with 0)
  const chartData = [];
  const today = new Date();
  let signupsToday = 0;

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0]; // "2023-10-25"
    
    // Find count in DB result or default to 0
    const found = signupsRaw.find((item: any) => item._id === dateStr);
    const count = found ? found.count : 0;

    // Check if this date is today
    if (i === 0) signupsToday = count;

    chartData.push({
      date: d.toLocaleDateString('en-US', { weekday: 'short' }), // "Mon", "Tue"
      fullDate: dateStr,
      signups: count
    });
  }

  const stats = {
    users: userCount,
    events: eventCount,
    opportunities: opportunityCount,
    applications: volunteerCount,
    signupsToday: signupsToday // Pass this specific number
  };

  return (
    <div className="pt-24 min-h-screen bg-slate-100">
      <AdminDashboardClient 
          user={{ 
              name: user.firstName || "Admin", 
              image: user.imageUrl 
          }} 
          stats={stats}
          chartData={chartData} // Pass chart data
      />
    </div>
  );
}