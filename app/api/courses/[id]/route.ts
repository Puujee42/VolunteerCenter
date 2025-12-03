import { NextResponse } from 'next/server';
import { getCourseById } from '@/lib/mongo/data';

export async function GET(
  request: Request,
  // 1. Change the type definition to Promise<{ id: string }>
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 2. Await the params to get the actual ID
    const { id } = await params;

    const course = await getCourseById(id);
    
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}