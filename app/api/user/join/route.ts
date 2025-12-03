import clientPromise from "@/lib/mongo/mongodb";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { item, type } = await req.json(); 
    
    const client = await clientPromise;
    const db = client.db("volunteer_db");

    // 1. Determine Collection & Fields
    let collectionName = "opportunities";
    let updateField: Record<string, number> = { "slots.filled": 1 };
    let iconName = "FaHandsHelping";
    let descriptionText = "Committed to help.";

    if (type === 'event') {
        collectionName = "events";
        updateField = { "registered": 1 };
        iconName = "FaCalendarAlt";
        descriptionText = "Registered for event.";
    }

    // 2. Create Participant Info object
    const participantInfo = {
        userId: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || "Volunteer",
        imageUrl: user.imageUrl,
        joinedAt: new Date()
    };

    // 3. Update User History
    const titleText = item.title?.en || item.title?.mn || item.title || "Activity";
    const newHistoryItem = {
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      title: `${type === 'event' ? 'Registered' : 'Joined'}: ${titleText}`,
      description: `${descriptionText} (+5 Rank Points)`,
      iconName: iconName
    };

    await db.collection("users").updateOne(
      { userId: user.id },
      { 
        $push: { history: { $each: [newHistoryItem], $position: 0 } as any },
        $inc: { "rank.progress": 5 } 
      } 
    );

    // 4. Update the Event/Opportunity (Count + Participants List)
    await db.collection(collectionName).updateOne(
      { id: item.id },
      { 
        $inc: updateField,
        // Push the user info into a 'participants' array
        $push: { participants: participantInfo } as any
      }
    );

    return NextResponse.json({ success: true, newHistoryItem });

  } catch (error: any) {
    console.error("Join API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}