import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongo/mongodb";

async function checkAdmin() {
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return user;
}

// ... imports

export async function POST(req: Request) {
  try {
    await checkAdmin();
    const body = await req.json();
    
    // ✅ Receive imageUrl
    const { type, titleMn, titleEn, descMn, descEn, date, locationMn, locationEn, capacity, imageUrl } = body;

    const client = await clientPromise;
    const db = client.db("volunteer_db");

    const newItem = {
      id: crypto.randomUUID(),
      title: { mn: titleMn, en: titleEn },
      description: { mn: descMn, en: descEn },
      location: { mn: locationMn, en: locationEn },
      addedDate: new Date().toISOString().split('T')[0],
      status: 'open',
      imageUrl: imageUrl || "/data.jpg", // ✅ Save the image URL (base64 string)
    };

    if (type === "event") {
      const eventDoc = {
        ...newItem,
        startDate: date,
        deadline: date, 
        registered: 0,
        capacity: parseInt(capacity),
      };
      await db.collection("events").insertOne(eventDoc);
    } else {
      const volDoc = {
        ...newItem,
        registrationStart: new Date().toISOString().split('T')[0],
        registrationEnd: date,
        organization: "VCM", 
        city: locationEn || "Ulaanbaatar", 
        slots: { filled: 0, total: parseInt(capacity) },
        icon: "FaHandsHelping"
      };
      await db.collection("volunteers").insertOne(volDoc);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
export async function DELETE(req: Request) {
  try {
    await checkAdmin();
    const { id, type } = await req.json();

    const client = await clientPromise;
    const db = client.db("volunteer_db");

    // ✅ FIX: Switch collection name
    const collectionName = type === "event" ? "events" : "volunteers";
    
    await db.collection(collectionName).deleteOne({ id: id });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}