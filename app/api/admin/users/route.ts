import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
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
    await checkAdmin();
    const { userId } = await req.json();

    const client = await clientPromise;
    const db = client.db("volunteer_db");

    await db.collection("users").deleteOne({ userId: userId });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}