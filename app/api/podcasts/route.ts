import clientPromise from "@/lib/mongo/mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("volunteer_db");
    const collection = db.collection("podcasts");

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // --- SCENARIO 1: GET SINGLE PODCAST ---
    if (id) {
      const podcast = await collection.findOne({ id: id });
      if (!podcast) {
        return NextResponse.json({ success: false, message: "Podcast not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: podcast });
    }

    // --- SCENARIO 2: GET ALL PODCASTS ---
    const podcasts = await collection.find({}).sort({ ep: -1 }).toArray();
    return NextResponse.json({ success: true, data: podcasts });

  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}