import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("volunteer_db");

    // We use .aggregate() instead of .find() to join the collections
    const locationsWithUsers = await db
      .collection("locations")
      .aggregate([
        {
          // 1. Join 'locations' with 'users'
          $lookup: {
            from: "users",              // The collection to join with
            localField: "name",         // The field in 'locations' (e.g., "Ulaanbaatar")
            foreignField: "province",   // The field in 'users' (e.g., "Ulaanbaatar")
            as: "volunteers"            // The new array field containing the matching users
          }
        },
        {
          // 2. Optimization: Only return necessary fields to keep the API fast
          $project: {
            name: 1,
            lat: 1,
            lng: 1,
            // Only keep specific fields from the volunteers array
            "volunteers.name": 1,
            "volunteers.imageUrl": 1,
            "volunteers.email": 1,
            "volunteers.userId": 1
          }
        }
      ])
      .toArray();

    return NextResponse.json({ success: true, locations: locationsWithUsers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}