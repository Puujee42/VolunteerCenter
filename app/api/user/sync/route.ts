import clientPromise from "@/lib/mongo/mongodb";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    // 1. Verify the user is authenticated via Clerk
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // 2. Get data sent from the frontend
    const body = await req.json();
    const { age, province, district, program } = body;

    const client = await clientPromise;
    const db = client.db("volunteer_db");
    const usersCollection = db.collection("users");

    // 3. Check if user already exists to prevent duplicates
    const existingUser = await usersCollection.findOne({ userId: clerkUser.id });
    if (existingUser) {
      return NextResponse.json({ success: true, message: "User already exists" });
    }

    // 4. Create the NEW USER Object with Default Dashboard Data
    // This structure matches what your Dashboard expects
    const newUserProfile = {
      userId: clerkUser.id,
      name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || clerkUser.username || "Volunteer",
      email: clerkUser.emailAddresses[0]?.emailAddress,
      // Custom Fields from Sign Up
      profileDetails: {
        age: parseInt(age),
        province,
        district,
        program
      },
      // --- DEFAULT DASHBOARD DATA ---
      rank: {
        current: "Bronze",
        progress: 0,
        iconName: "FaMedal" 
      },
      strengths: [
        { skill: 'Motivation', value: 100 },
        { skill: 'Teamwork', value: 50 },
      ],
      history: [
        { 
          date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), 
          title: 'Joined Platform', 
          description: 'Account successfully created.', 
          iconName: 'FaFlag' 
        }
      ],
      activities: [], // Empty initially
      recommendations: [
        { 
          title: 'Complete your Profile', 
          description: 'Add more details to get better recommendations.', 
          iconName: 'FaUser' 
        }
      ],
      createdAt: new Date(),
    };

    // 5. Insert into MongoDB
    await usersCollection.insertOne(newUserProfile);

    return NextResponse.json({ success: true, message: "User synced to MongoDB" });

  } catch (error: any) {
    console.error("Sync Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}