import { getProgramById } from "@/lib/mongo/data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  // 1. Change type to Promise
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    // 2. Await params before destructuring
    const { id } = await params; 

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Program ID is required" },
        { status: 400 }
      );
    }

    // Fetch the specific program
    const program = await getProgramById(id);

    if (!program) {
      return NextResponse.json(
        { success: false, error: "Program not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: program });
  } catch (e: any) {
    // 3. We can't access params.id directly in the catch block reliably if await failed, 
    // but usually the error is later. Safest to just log generic error or 'unknown id'.
    console.error(`Failed to fetch program:`, e);
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}