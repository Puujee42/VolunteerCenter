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

// --- 1. GET USER(S) ---
// This function now handles two cases:
// - /api/admin/users -> Fetches a list of all users (for the main table)
// - /api/admin/users?userId=... -> Fetches all details for ONE user (for the edit form)
export async function GET(req: Request) {
  try {
    await checkAdmin();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const client = await clientPromise;
    const db = client.db("volunteer_db");

    // --- Case 1: Fetch a SINGLE user's FULL details ---
    if (userId) {
      const user = await db.collection("users").findOne({ userId: userId });
      if (!user) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, user });
    }

    // --- Case 2: Fetch ALL users' basic details ---
    const users = await db.collection("users")
      .find({})
      .project({
          userId: 1,
          name: 1,
          email: 1,
          imageUrl: 1,
          province: 1,
          role: 1,
          "rank.current": 1,
          createdAt: 1
      })
      .toArray();

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error("API GET Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 403 });
  }
}

// --- 2. UPDATE USER (PATCH) ---
// Now accepts and updates the full profile.
export async function PATCH(req: Request) {
  try {
    await checkAdmin(); 
    const body = await req.json();
    const { 
      userId, 
      name, 
      role, 
      age, 
      province, 
      district, 
      school, 
      partner, 
      program 
    } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("volunteer_db");
    
    // Find the current rank to avoid overwriting it if the role isn't changing to admin
    const existingUser = await db.collection("users").findOne({ userId: userId }, { projection: { "rank.current": 1 } });
    const currentRank = existingUser?.rank?.current || 'Bronze';

    // Construct the update object with all fields
    const updateDocument = {
      $set: {
        name: name,
        role: role,
        // Update profile details using dot notation for safety
        "profileDetails.age": age,
        "profileDetails.province": province,
        "profileDetails.district": district,
        "profileDetails.school": school,
        "profileDetails.partner": partner,
        "profileDetails.program": program,
        // Update rank based on role
        "rank.current": role === 'admin' ? 'Admin' : currentRank
      }
    };

    await db.collection("users").updateOne(
      { userId: userId },
      updateDocument
    );

    // Also update Clerk's public metadata for role consistency
    const clerk = await clerkClient();
    await clerk.users.updateUser(userId, {
        publicMetadata: { role: role }
    });

    return NextResponse.json({ success: true, message: "User updated successfully." });
  } catch (error: any) {
    console.error("API PATCH Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// --- 3. DELETE USER (DELETE) ---
// This function remains unchanged as it already performs a full cleanup.
export async function DELETE(req: Request) {
  try {
    await checkAdmin();
    const { userId } = await req.json(); 

    if (!userId) {
        return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("volunteer_db");

    // Delete from Clerk
    try {
        await (await clerkClient()).users.deleteUser(userId);
    } catch (clerkErr) {
        console.warn(`Clerk delete warning for ${userId}:`, clerkErr);
    }

    // Delete from MongoDB 'users' Collection
    await db.collection("users").deleteOne({ userId: userId });

    // Clean up event participants
    await db.collection("events").updateMany(
        { "participants.userId": userId },
        { 
            $pull: { participants: { userId: userId } },
            $inc: { registered: -1 }
        } as any
    );

    // Clean up course participants
    await db.collection("courses").updateMany(
        { "participants.userId": userId },
        { 
            $pull: { participants: { userId: userId } },
            $inc: { registered: -1 } 
        } as any
    );

    // Delete User's Reports/History
    await db.collection("participation_records").deleteMany({ userId: userId });
    
    // Delete Applications
    await db.collection("applications").deleteMany({ userId: userId });

    return NextResponse.json({ 
        success: true, 
        message: "User and all associated data deleted successfully." 
    });

  } catch (error: any) {
    console.error("Full Delete Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}