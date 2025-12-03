import { NextResponse } from 'next/server';
import { getCourses } from '@/lib/mongo/data';

export async function GET() {
  try {
    const courses = await getCourses();
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}