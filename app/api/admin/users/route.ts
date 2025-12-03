import { NextResponse } from "next/server";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongo/mongodb";

// Security Check Helper
async function checkAdmin() {
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return user;
}

// --- UPDATE USER (PATCH) ---
export async function PATCH(req: Request) {
  try {
    await checkAdmin(); // Ensure requester is admin
    const { userId, name, role } = await req.json();

    const client = await clientPromise;
    const db = client.db("volunteer_db");

    // 1. Update in MongoDB
    await db.collection("users").updateOne(
      { userId: userId },
      { 
        $set: { 
          name: name,
          "rank.current": role // Assuming we map Role to Rank for simplicity, or add a specific role field
        } 
      }
    );

    // 2. Optional: Sync Role to Clerk Metadata (if you want this user to be an admin too)
    // if (role === 'admin') { ...clerk logic... }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

// --- DELETE USER (DELETE) ---
export async function DELETE(req: Request) {
  try {
    await checkAdmin(); // Ensure requester is admin
    const { userId } = await req.json();

    const client = await clientPromise;
    const db = client.db("volunteer_db");

    // 1. Delete from MongoDB
    await db.collection("users").deleteOne({ userId: userId });

    // 2. Delete from Clerk (Optional - strictly requires Clerk Backend API)
    // try {
    //   await clerkClient.users.deleteUser(userId);
    // } catch (e) {
    //   console.log("Could not delete from Clerk, likely purely a DB delete.");
    // }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}