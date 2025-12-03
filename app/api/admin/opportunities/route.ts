import clientPromise from "@/lib/mongo/mongodb";
import { NextResponse } from "next/server";

// Force dynamic to ensure we always get the latest data
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("volunteer_db");
    const collection = db.collection("volunteers"); // We fetch from 'volunteers' collection

    // Parse Query Parameters (e.g., /api/opportunities?id=1)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // ─────────────────────────────────────────────────────────────
    // SCENARIO 1: Fetch a Single Opportunity (by custom 'id')
    // ─────────────────────────────────────────────────────────────
    if (id) {
      // We search by string 'id' or number 'id' just to be safe
      const opportunity = await collection.findOne({
        $or: [
          { id: id },
          { id: parseInt(id) }
        ]
      });

      if (!opportunity) {
        return NextResponse.json(
          { success: false, message: "Opportunity not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: opportunity });
    }

    // ─────────────────────────────────────────────────────────────
    // SCENARIO 2: Fetch All Opportunities
    // ─────────────────────────────────────────────────────────────
    // Sort by registrationStart or addedDate descending (newest first)
    const opportunities = await collection
      .find({})
      .sort({ addedDate: -1 }) 
      .toArray();

    return NextResponse.json({ 
      success: true, 
      count: opportunities.length, 
      data: opportunities 
    });

  } catch (error: any) {
    console.error("Opportunities API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}