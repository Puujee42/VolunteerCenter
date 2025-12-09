import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongo/mongodb";
import { ObjectId } from "mongodb";

// --- Helper: Check Permissions ---
async function checkPermission() {
  const user = await currentUser();
  const role = user?.publicMetadata?.role as string | undefined;
  
  if (!user || (role !== "admin" && role !== "manager")) {
    throw new Error("Unauthorized: You do not have permission to submit reports.");
  }
  return user;
}

export async function POST(req: Request) {
  try {
    // 1. Authenticate and Authorize
    const adminUser = await checkPermission();

    // 2. Parse Data
    const body = await req.json();
    const { eventId, reports } = body;

    if (!eventId || !reports || !Array.isArray(reports)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("volunteer_db");

    // 3. Process each report in parallel
    const updatePromises = reports.map(async (report: any) => {
      // Skip if status is not submitted (though frontend filters this, safety first)
      // Actually, frontend sends all reports to be saved, so we process all.

      const { userId, hours, rating, feedback } = report;
      const hoursValue = Number(hours) || 0;
      const ratingValue = Number(rating) || 5;

      // --- A. Create a detailed Participation Record (Standalone Collection) ---
      // This is good for analytics later (e.g. "Show all volunteering done in 2025")
      await db.collection("participation_records").insertOne({
        userId: userId,
        eventId: eventId,
        adminId: adminUser.id, // Who approved this
        hours: hoursValue,
        rating: ratingValue,
        feedback: feedback,
        date: new Date(),
        type: "event"
      });

      // --- B. Update the User's Profile ---
      // 1. Increment total hours
      // 2. Add points (Assume 1 hour = 100 points, or whatever logic you prefer)
      // 3. Push to their local history array
      
      const pointsEarned = hoursValue * 10; // Example: 10 points per hour

      await db.collection("users").updateOne(
        { userId: userId },
        {
          $inc: {
            "profileDetails.volunteeredHours": hoursValue, // Increment total hours
            "rank.points": pointsEarned // Add points for ranking
          },
          $push: {
            history: {
              eventId: eventId,
              eventName: "Event Participation", // You might want to fetch event title to store here
              date: new Date(),
              hours: hoursValue,
              rating: ratingValue,
              feedback: feedback
            } as any
          }
        }
      );
    });

    // Wait for all updates to finish
    await Promise.all(updatePromises);

    // 4. Update Event Status (Optional)
    // Mark the event as "Reported" or "Closed" so it doesn't show up in pending lists
    await db.collection("events").updateOne(
        { _id: new ObjectId(eventId) },
        { $set: { status: 'ended', reportSubmitted: true } }
    );

    return NextResponse.json({ success: true, message: "Reports submitted successfully" });

  } catch (error: any) {
    console.error("Report Submission Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: error.message === "Unauthorized" ? 403 : 500 }
    );
  }
}