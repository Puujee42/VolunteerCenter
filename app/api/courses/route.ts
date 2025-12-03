import clientPromise from "@/lib/mongo/mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) { // Add 'request' parameter
  try {
    const client = await clientPromise;
    const db = client.db("volunteer_db");
    const collection = db.collection("courses");

    // Check for an ID in the URL (e.g., /api/courses?id=skill-based)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // --- IF an ID is provided, get ONE course ---
    if (id) {
      const course = await collection.findOne({ id: id });
      if (!course) {
        return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: course });
    }

    // --- IF NO ID, get ALL courses (your existing logic) ---
    const courses = await collection.find({}).sort({ date: 1 }).toArray();
    return NextResponse.json({ success: true, data: courses });

  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}