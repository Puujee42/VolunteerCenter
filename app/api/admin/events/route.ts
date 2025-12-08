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

// ─────────────────────────────────────────────────────────────
// CREATE (POST)
// ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    await checkAdmin();
    const body = await req.json();
    
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
      imageUrl: imageUrl || "/data.jpg", 
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

// ─────────────────────────────────────────────────────────────
// EDIT (PUT) - ✅ NEW FUNCTION
// ─────────────────────────────────────────────────────────────
export async function PUT(req: Request) {
  try {
    await checkAdmin();
    const body = await req.json();

    // Destructure all possible fields
    const { 
      id, 
      type, 
      titleMn, titleEn, 
      descMn, descEn, 
      date, 
      locationMn, locationEn, 
      capacity, 
      imageUrl 
    } = body;

    if (!id || !type) {
      return NextResponse.json({ error: "ID and Type are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("volunteer_db");

    // 1. Prepare Base Update Object (Fields common to both)
    // We use dot notation ("title.mn") to update specific nested fields 
    // without overwriting the rest of the object.
    const updateData: any = {
      "title.mn": titleMn,
      "title.en": titleEn,
      "description.mn": descMn,
      "description.en": descEn,
      "location.mn": locationMn,
      "location.en": locationEn,
    };

    // Only update image if a new one is provided
    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    // 2. Add Type-Specific Fields
    if (type === "event") {
      updateData.startDate = date;
      updateData.deadline = date; // Assuming deadline matches start date based on POST logic
      updateData.capacity = parseInt(capacity);
      
      await db.collection("events").updateOne(
        { id: id },
        { $set: updateData }
      );

    } else {
      // Volunteer Logic
      updateData.registrationEnd = date;
      updateData.city = locationEn; // Sync legacy 'city' field
      updateData["slots.total"] = parseInt(capacity); // Dot notation for nested slot update

      await db.collection("volunteers").updateOne(
        { id: id },
        { $set: updateData }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────────
export async function DELETE(req: Request) {
  try {
    await checkAdmin();
    const { id, type } = await req.json();

    const client = await clientPromise;
    const db = client.db("volunteer_db");

    const collectionName = type === "event" ? "events" : "volunteers";
    
    await db.collection(collectionName).deleteOne({ id: id });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}