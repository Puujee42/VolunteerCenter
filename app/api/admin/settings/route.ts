import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongo/mongodb";

// Security Check
async function checkAdmin() {
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return user;
}

// --- GET SETTINGS ---
export async function GET() {
  try {
    await checkAdmin();
    const client = await clientPromise;
    const db = client.db("volunteer_db");

    // Fetch the document with id "global_settings"
    const settings = await db.collection("settings").findOne({ _id: "global_settings" as any });

    // Default values if nothing exists yet
    const defaults = {
      siteName: "Volunteer Center",
      supportEmail: "support@volunteer.mn",
      maintenanceMode: false,
      allowRegistration: true,
      announcementBar: ""
    };

    return NextResponse.json({ 
      success: true, 
      data: settings || defaults 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

// --- SAVE SETTINGS ---
export async function POST(req: Request) {
  try {
    await checkAdmin();
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("volunteer_db");

    // Upsert (Update if exists, Insert if not)
    await db.collection("settings").updateOne(
      { _id: "global_settings" as any },
      { $set: body },
      { upsert: true }
    );

    return NextResponse.json({ success: true });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}