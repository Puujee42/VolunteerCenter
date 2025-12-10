// /app/api/user/delete/route.ts

import { NextResponse } from "next/server";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongo/mongodb";

export async function POST(req: Request) {
  try {
    // 1. Authenticate the user making the request
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id; // Get the user's own ID from their session

    const client = await clientPromise;
    const db = client.db("volunteer_db");

    // --- Database Cleanup ---

    // 2. Remove user from any events they joined and decrement the count
    await db.collection("events").updateMany(
        { "participants.userId": userId },
        { 
            $pull: { participants: { userId: userId } },
            $inc: { registered: -1 } 
        } as any
    );

    // 3. Remove user from any opportunities they joined and decrement the count
    await db.collection("opportunities").updateMany(
        { "participants.userId": userId },
        { 
            $pull: { participants: { userId: userId } },
            $inc: { "slots.filled": -1 } 
        } as any
    );
    
    // 4. Delete the user's main profile document from your 'users' collection
    await db.collection("users").deleteOne({ userId: userId });

    // --- Clerk Deletion (Do this last) ---
    // 5. Delete the user from Clerk's authentication system
    const clerk = await clerkClient();
    await clerk.users.deleteUser(userId);

    return NextResponse.json({ 
        success: true, 
        message: "Account and all associated data deleted successfully." 
    });

  } catch (error: any) {
    console.error("Account Deletion Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}