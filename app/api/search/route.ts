import { NextResponse } from 'next/server';
import { searchKnowledgeBase } from '@/lib/data-service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ success: true, results: [] });
    }

    const results = await searchKnowledgeBase(query);
    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
