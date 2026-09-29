import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUserRAGDocuments } from '@/lib/rag';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();
    const documents = getUserRAGDocuments(session?.id, session?.role);

    return NextResponse.json({
      success: true,
      documents,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}
