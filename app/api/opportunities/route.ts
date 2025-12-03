import clientPromise from "@/lib/mongo/mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("volunteer_db");
    
    const opportunities = await db.collection("opportunities").find({}).toArray();

    return NextResponse.json({ success: true, data: opportunities });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}