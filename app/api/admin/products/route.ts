// /app/api/admin/products/route.ts

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongo/mongodb";
import { ObjectId } from "mongodb";

// Helper for security
async function checkAdmin() {
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

// GET all products
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("volunteer_db");
    const products = await db.collection("products").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST a new product
export async function POST(req: Request) {
  try {
    await checkAdmin();
    const body = await req.json();
    
    const newProduct = {
      ...body,
      createdAt: new Date(),
    };

    const client = await clientPromise;
    const db = client.db("volunteer_db");
    const result = await db.collection("products").insertOne(newProduct);

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message === "Unauthorized" ? 403 : 500 });
  }
}

// PATCH (update) an existing product
export async function PATCH(req: Request) {
  try {
    await checkAdmin();
    const { _id, ...updateData } = await req.json();

    const client = await clientPromise;
    const db = client.db("volunteer_db");

    await db.collection("products").updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a product
export async function DELETE(req: Request) {
  try {
    await checkAdmin();
    const { _id } = await req.json();

    const client = await clientPromise;
    const db = client.db("volunteer_db");

    await db.collection("products").deleteOne({ _id: new ObjectId(_id) });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}