import { NextResponse } from 'next/server';
import { getPodcasts } from '@/lib/mongo/data'; // Ensure this path matches your file structure

// Force dynamic to ensure fresh data
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const podcasts = await getPodcasts();
    
    // ✅ FIX: Wrap the array in { success: true, data: ... }
    return NextResponse.json({ 
      success: true, 
      data: podcasts 
    });

  } catch (error: any) {
    console.error("Podcast API Error:", error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch podcasts' }, 
      { status: 500 }
    );
  }
}