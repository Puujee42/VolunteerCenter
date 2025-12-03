import { NextResponse } from 'next/server';
import { getNews } from '@/lib/mongo/data';

export async function GET() {
  try {
    const news = await getNews();
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}