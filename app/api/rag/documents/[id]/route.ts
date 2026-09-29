import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getRAGDocumentById, deleteRAGDocument } from '@/lib/rag';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doc = getRAGDocumentById(id);
    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, document: doc });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const success = deleteRAGDocument(id, session.id, session.role);

    if (!success) {
      return NextResponse.json(
        { error: 'Document not found or permission denied.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
