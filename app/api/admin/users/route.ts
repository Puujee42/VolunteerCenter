import { NextResponse } from "next/server";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongo/mongodb";

// Security Check Helper
async function checkAdmin() {
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return user;
}

// --- 1. GET ALL USERS ---
export async function GET() {
  try {
    await checkAdmin();

    const client = await clientPromise;
    const db = client.db("volunteer_db");

    // SIMPLIFIED: Just fetch the users. 
    // We do NOT need to join with locations here because 
    // the Frontend (VolunteerMap) handles the translation and matching.
    const users = await db.collection("users")
      .find({})
      .project({
          userId: 1,
          name: 1,
          email: 1,
          imageUrl: 1,
          province: 1, // <--- IMPORTANT: Ensure this is sent
          role: 1,
          "rank.current": 1,
          createdAt: 1
      })
      .toArray();

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, users: [], error: error.message }, { status: 403 });
  }
}

// --- 2. UPDATE USER (PATCH) ---
export async function PATCH(req: Request) {
  try {
    await checkAdmin(); 
    const { userId, name, role } = await req.json();

    const client = await clientPromise;
    const db = client.db("volunteer_db");

    await db.collection("users").updateOne(
      { userId: userId },
      { 
        $set: { 
          name: name,
          role: role, 
          "rank.current": role === 'admin' ? 'Admin' : 'Bronze' 
        } 
      }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

// --- 3. DELETE USER (DELETE) ---
export async function DELETE(req: Request) {
  try {
    // 1. Security Check
    await checkAdmin();
    const { userId } = await req.json(); // This is the Clerk ID (e.g., "user_2p...")

    if (!userId) {
        return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("volunteer_db");

    // --- 2. Delete from Clerk (Authentication) ---
    try {
        const clerk = await clerkClient();
        await clerk.users.deleteUser(userId);
    } catch (clerkErr) {
        // Log warning but continue cleaning up local DB
        console.warn(`Clerk delete warning for ${userId}:`, clerkErr);
    }

    // --- 3. Delete from 'users' Collection ---
    await db.collection("users").deleteOne({ userId: userId });

    // --- 4. Clean up 'events' Collection ---
    // This finds all events where this user is a participant.
    // It removes them from the array ($pull) AND decreases the count ($inc)
    await db.collection("events").updateMany(
        { "participants.userId": userId },
        { 
            $pull: { participants: { userId: userId } },
            $inc: { registered: -1 } // Decrement the registered count by 1
        } as any
    );

    // --- 5. Clean up 'courses' Collection ---
    // Same logic: remove from participants list and decrement count
    // (Assuming courses also track a 'registered' or 'studentsCount' field. 
    // If not, the $inc part will simply create the field or do nothing harmful if strict schema isn't used)
    await db.collection("courses").updateMany(
        { "participants.userId": userId },
        { 
            $pull: { participants: { userId: userId } },
            // If your courses collection uses 'registered' or 'enrolled', use that field name here
            $inc: { registered: -1 } 
        } as any
    );

    // --- 6. Delete User's Reports/History ---
    await db.collection("participation_records").deleteMany({ userId: userId });
    
    // --- 7. Delete Applications ---
    await db.collection("applications").deleteMany({ userId: userId });

    return NextResponse.json({ 
        success: true, 
        message: "User and all associated data (events, counts, history) deleted successfully." 
    });

  } catch (error: any) {
    console.error("Full Delete Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}