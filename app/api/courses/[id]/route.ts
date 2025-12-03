import { NextResponse } from 'next/server';
import { getCourseById } from '@/lib/mongo/data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const course = await getCourseById(params.id);
    
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}