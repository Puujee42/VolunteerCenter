import clientPromise from "@/lib/mongo/mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("volunteer_db");
    const collection = db.collection("events");

    // Get ID from URL query (e.g., /api/events?id=future-owner-2022)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // --- SCENARIO 1: Get Single Event ---
    if (id) {
      const event = await collection.findOne({ id: id });
      
      if (!event) {
        return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: event });
    }

    // --- SCENARIO 2: Get All Events ---
    const events = await collection.find({}).sort({ startDate: -1 }).toArray();
    return NextResponse.json({ success: true, data: events });

  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}