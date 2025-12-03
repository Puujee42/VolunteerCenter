import { NextResponse } from 'next/server';
import { getVideos } from '@/lib/mongo/data'; // Ensure this path is correct

// Force dynamic to ensure fresh data
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const videos = await getVideos();
    
    // ✅ FIX: Wrap the array in { success: true, data: ... }
    return NextResponse.json({ 
      success: true, 
      data: videos 
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch videos' }, 
      { status: 500 }
    );
  }
}