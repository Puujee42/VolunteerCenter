import clientPromise from "@/lib/mongo/mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Use Promise for Next.js 15+ compatibility
) {
  try {
    const { id } = await params; // Await params
    const client = await clientPromise;
    const db = client.db("volunteer_db");

    // NOTE: In your seed, IDs are numbers (1, 2, 3), but URL params are strings.
    // We check both string and number types to be safe.
    const volunteer = await db.collection("volunteers").findOne({
      $or: [
        { id: id },
        { id: parseInt(id) }
      ]
    });

    if (!volunteer) {
      return NextResponse.json({ success: false, message: "Volunteer opportunity not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: volunteer });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}