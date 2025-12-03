import { NextResponse } from 'next/server';
import { clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  // REPLACE THIS WITH YOUR ACTUAL USER ID FROM CLERK
  const myUserId = "user_36KqcfyqyGTP1fOKH9MKClMNivi"; 

  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(myUserId, {
      publicMetadata: {
        role: "admin"
      }
    });
    return NextResponse.json({ success: true, message: "User is now Admin" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message });
  }
}