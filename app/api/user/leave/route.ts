// /app/api/user/leave/route.ts

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongo/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    // 1. Authenticate the user
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get the item ID and type from the request
    const { itemId, type } = await req.json();
    if (!itemId || !type) {
      return NextResponse.json({ success: false, error: "Missing itemId or type" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("volunteer_db");

    // 3. Remove the activity from the user's personal history array
    // The `$pull` operator removes an element from an array that matches a condition.
    const updateResult = await db.collection("users").updateOne(
      { userId: user.id },
      { $pull: { history: { id: itemId } as any } }
    );

    // If nothing was removed, it means the item wasn't in their history
    if (updateResult.modifiedCount === 0) {
       return NextResponse.json({ success: false, error: "Item not found in user history" }, { status: 404 });
    }

    // 4. Free up a spot in the original event or opportunity collection
    // The `$inc` operator with a negative value decrements the count.
    if (type === 'event') {
        await db.collection("events").updateOne(
            { _id: new ObjectId(itemId) },
            { $inc: { registered: -1 } }
        );
    } else { // Assumes 'opportunity'
        await db.collection("opportunities").updateOne(
            { _id: new ObjectId(itemId) },
            { $inc: { "slots.filled": -1 } }
        );
    }

    return NextResponse.json({ success: true, itemId });

  } catch (e: any) {
    console.error("Leave API Error:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}