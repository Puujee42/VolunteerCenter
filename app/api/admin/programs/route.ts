// app/api/admin/programs/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongo/mongodb";

// --- Helper: Check Admin Role ---
async function checkAdmin() {
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== "admin") {
    throw new Error("Unauthorized: User is not an admin.");
  }
}

// --- POST: Create New Program ---
export async function POST(req: Request) {
  try {
    // 1. Auth Check
    await checkAdmin();
    
    // 2. Parse Body
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("volunteer_db");

    // 3. Construct ID
    // If user provides a custom slug (e.g. "edu-2025"), use it. Otherwise, generate one.
    const newId = body.id || `prog-${Date.now()}`;

    // 4. Construct Document
    const doc = {
      id: newId,
      category: body.category || "education", // education, volunteering, environment, etc.
      status: body.status || "active",        // active, upcoming, completed
      
      // Visuals
      icon: body.icon || "FaLightbulb",       // React Icon name
      color: body.color || "blue",            // blue, green, red, etc.
      imageUrl: body.imageUrl || "",          // Cover image URL

      // Bilingual Text
      title: { 
        mn: body.titleMn, 
        en: body.titleEn 
      },
      description: { 
        mn: body.descMn, 
        en: body.descEn 
      },
      content: { 
        mn: body.contentMn || body.descMn,    // Long description (optional)
        en: body.contentEn || body.descEn 
      },

      // Focus Areas (Assumes comma-separated string input from frontend form)
      // Example input: "Math, Science, IT" -> Output: ["Math", "Science", "IT"]
      focus: {
        mn: body.focusMn ? body.focusMn.split(",").map((s: string) => s.trim()) : [],
        en: body.focusEn ? body.focusEn.split(",").map((s: string) => s.trim()) : []
      },

      // Stats (Optional - expects an array of objects if sent, or empty)
      // You can expand this logic if you have a specific UI for adding stats
      stats: body.stats || [], 

      addedAt: new Date(),
    };

    // 5. Insert to DB
    await db.collection("programs").insertOne(doc);

    return NextResponse.json({ success: true, id: newId });

  } catch (error: any) {
    console.error("Admin Program Create Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- DELETE: Remove Program ---
export async function DELETE(req: Request) {
  try {
    await checkAdmin();
    
    const { id } = await req.json();
    
    if (!id) {
        return NextResponse.json({ error: "Program ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("volunteer_db");

    const result = await db.collection("programs").deleteOne({ id: id });

    if (result.deletedCount === 0) {
        return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- PUT: Update Program (Optional but recommended) ---
export async function PUT(req: Request) {
    try {
      await checkAdmin();
      const body = await req.json();
      const { id, ...updateData } = body;
  
      if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  
      const client = await clientPromise;
      const db = client.db("volunteer_db");
  
      // Construct update object similar to POST, but only with provided fields
      const updateDoc: any = {};
      
      if(updateData.category) updateDoc.category = updateData.category;
      if(updateData.status) updateDoc.status = updateData.status;
      if(updateData.icon) updateDoc.icon = updateData.icon;
      if(updateData.color) updateDoc.color = updateData.color;
      if(updateData.imageUrl) updateDoc.imageUrl = updateData.imageUrl;
  
      // Handle Bilingual updates deeply
      if(updateData.titleMn) updateDoc["title.mn"] = updateData.titleMn;
      if(updateData.titleEn) updateDoc["title.en"] = updateData.titleEn;
      if(updateData.descMn) updateDoc["description.mn"] = updateData.descMn;
      if(updateData.descEn) updateDoc["description.en"] = updateData.descEn;
      if(updateData.contentMn) updateDoc["content.mn"] = updateData.contentMn;
      if(updateData.contentEn) updateDoc["content.en"] = updateData.contentEn;
  
      // Handle Array updates
      if(updateData.focusMn) updateDoc["focus.mn"] = updateData.focusMn.split(",").map((s: string) => s.trim());
      if(updateData.focusEn) updateDoc["focus.en"] = updateData.focusEn.split(",").map((s: string) => s.trim());
  
      await db.collection("programs").updateOne(
        { id: id },
        { $set: updateDoc }
      );
  
      return NextResponse.json({ success: true });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }