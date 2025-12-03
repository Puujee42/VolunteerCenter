import clientPromise from "@/lib/mongo/mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("volunteer_db");

    // Fetch volunteers, sort by addedDate descending (newest first)
    const volunteers = await db
      .collection("volunteers")
      .find({})
      .sort({ addedDate: -1 })
      .toArray();

    return NextResponse.json({ success: true, data: volunteers });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch volunteers" },
      { status: 500 }
    );
  }
}