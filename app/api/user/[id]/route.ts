import clientPromise from "@/lib/mongo/mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  // 1. Update type to Promise
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 2. Await params to get the ID
    const { id } = await params;
    const userId = id; 

    const client = await clientPromise;
    const db = client.db("volunteer_db");
    
    // Fetch the user profile by userId
    const user = await db.collection("users").findOne({ userId: userId });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}