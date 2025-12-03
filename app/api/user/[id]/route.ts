import clientPromise from "@/lib/mongo/mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id; // Get "user-1" from URL
    const client = await clientPromise;
    const db = client.db("volunteer_db");
    
    // Fetch the user profile by userId (not _id)
    const user = await db.collection("users").findOne({ userId: userId });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}