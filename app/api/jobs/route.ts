import { NextResponse } from 'next/server';
import { getJobOpenings } from '@/lib/mongo/data';

export async function GET() {
  try {
    const jobs = await getJobOpenings();
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}