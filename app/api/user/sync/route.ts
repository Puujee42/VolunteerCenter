// /app/api/user/sync/route.ts

import clientPromise from "@/lib/mongo/mongodb";
import { NextResponse } from "next/server";
import { clerkClient, currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // --- DEBUGGING STEP ---
    // This will print the exact data your backend is receiving in your terminal.
    console.log("SYNC API RECEIVED BODY:", body);
    // --------------------

    const { 
      fullName, registryNumber, age, province, district, 
      educationLevel, school, partner, program 
    } = body;

    const client = await clientPromise;
    const db = client.db("volunteer_db");
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({ userId: clerkUser.id });
    if (existingUser) {
      return NextResponse.json({ success: true, message: "User already exists" });
    }

    const newUserProfile = {
      userId: clerkUser.id,
      name: clerkUser.username,
      fullName: fullName,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      imageUrl: clerkUser.imageUrl,
      role: 'volunteer',
      
      profileDetails: {
        registryNumber: registryNumber || null,
        // The CORRECT and SAFE logic for handling age
        age: age && age !== "" ? parseInt(age, 10) : null,
        province,
        district,
        educationLevel,
        school,
        partner,
        program
      },
      
      rank: { current: "Bronze", progress: 0, iconName: "FaMedal" },
      strengths: [
        { skill: 'Motivation', value: 30 }, { skill: 'Teamwork', value: 25 },
        { skill: 'Communication', value: 20 }, { skill: 'Leadership', value: 15 },
        { skill: 'Problem Solving', value: 10 },
      ],
      history: [
        { 
          id: `initial-${clerkUser.id}`,
          date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), 
          title: 'Joined the Platform!', 
          description: 'Your volunteer journey begins now. Welcome!', 
          iconName: 'FaFlag', type: 'milestone'
        }
      ],
      recommendations: [
        { 
          title: 'Find your first opportunity', 
          description: 'Check the "Discover" section for new events and jobs.', 
          iconName: 'FaHandsHelping' 
        }
      ],
      createdAt: new Date(),
    };

    await usersCollection.insertOne(newUserProfile);
    const clerk = await clerkClient();
    await clerk.users.updateUser(clerkUser.id, {
        publicMetadata: { role: 'volunteer' }
    });

    return NextResponse.json({ success: true, message: "User synced to MongoDB" });

  } catch (error: any) {
    console.error("Sync Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}