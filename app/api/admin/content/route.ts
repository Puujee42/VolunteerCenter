import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongo/mongodb";

async function checkAdmin() {
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

export async function POST(req: Request) {
  try {
    await checkAdmin();
    const body = await req.json();
    const { type, ...data } = body;

    const client = await clientPromise;
    const db = client.db("volunteer_db");

    const newId = crypto.randomUUID();
    const today = new Date().toISOString().split("T")[0];

    let collection = "";
    let doc = {};

    // Map common fields
    const common = {
      id: newId,
      addedAt: new Date(),
    };

    switch (type) {
      case "course":
        collection = "courses";
        doc = {
          ...common,
          title: { mn: data.titleMn, en: data.titleEn },
          description: { mn: data.descMn, en: data.descEn },
          category: { mn: data.categoryMn, en: data.categoryEn },
          date: data.date || today,
          duration: { mn: data.duration, en: data.duration }, // Simplified
          thumbnail: data.imageUrl || "/data.jpg",
        };
        break;

      case "lesson":
        collection = "lessons";
        doc = {
          ...common,
          title: { mn: data.titleMn, en: data.titleEn },
          content: { mn: data.descMn, en: data.descEn }, // Lessons use 'content' for desc
          duration: { mn: data.duration, en: data.duration },
          videoUrl: data.mediaUrl, // YouTube link
        };
        break;

      case "podcast":
        collection = "podcasts";
        doc = {
          ...common,
          title: { mn: data.titleMn, en: data.titleEn },
          description: { mn: data.descMn, en: data.descEn },
          ep: parseInt(data.episode || "1"),
          duration: data.duration,
          date: data.date || today,
          cover: data.imageUrl || "/data.jpg",
          audioSrc: data.mediaUrl,
        };
        break;

      case "video":
        collection = "videos";
        doc = {
          ...common,
          title: { mn: data.titleMn, en: data.titleEn },
          description: { mn: data.descMn, en: data.descEn },
          speaker: data.author,
          date: data.date || today,
          duration: data.duration,
          thumbnail: data.imageUrl || "/data.jpg",
          videoSrc: data.mediaUrl,
        };
        break;
    }

    await db.collection(collection).insertOne(doc);
    return NextResponse.json({ success: true });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await checkAdmin();
    const { id, type } = await req.json();
    
    const client = await clientPromise;
    const db = client.db("volunteer_db");

    // Map type to collection name
    const collectionMap: any = {
        course: "courses",
        lesson: "lessons",
        podcast: "podcasts",
        video: "videos"
    };

    await db.collection(collectionMap[type]).deleteOne({ id: id });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}