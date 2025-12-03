import clientPromise from "@/lib/mongo/mongodb";
import { NextResponse } from "next/server";

// Ensure the route is not cached so you always get the latest data
export const dynamic = "force-dynamic";

const DB_NAME = "volunteer_db";
const COLLECTION_NAME = "lessons";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Parse Query Parameters (to check if we need a specific ID)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // ─────────────────────────────────────────────────────────────
    // SCENARIO 1: Fetch a Single Lesson (by custom 'id')
    // ─────────────────────────────────────────────────────────────
    if (id) {
      // Find the lesson where the 'id' field matches (e.g., "lesson-1")
      const lesson = await collection.findOne({ id: id });

      if (!lesson) {
        return NextResponse.json(
          { success: false, message: "Lesson not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: lesson });
    }

    // ─────────────────────────────────────────────────────────────
    // SCENARIO 2: Fetch All Lessons
    // ─────────────────────────────────────────────────────────────
    const lessons = await collection.find({}).toArray();

    return NextResponse.json({ 
      success: true, 
      count: lessons.length, 
      data: lessons 
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}