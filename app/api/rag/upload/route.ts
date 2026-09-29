import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ingestDocument } from '@/lib/rag';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in to upload documents.' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const courseId = formData.get('courseId') as string | undefined;
    const lessonId = formData.get('lessonId') as string | undefined;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded. Please select a valid PDF file.' },
        { status: 400 }
      );
    }

    // Validate file type
    const fileName = file.name || 'uploaded_document.pdf';
    if (!fileName.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF documents (.pdf) are supported for knowledge indexing.' },
        { status: 400 }
      );
    }

    // Convert to Node Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Ingest through RAG pipeline
    const document = await ingestDocument({
      buffer,
      originalFileName: fileName,
      uploadedBy: session.id,
      uploaderRole: session.role,
      uploaderName: session.name,
      courseId,
      lessonId,
    });

    return NextResponse.json({
      success: true,
      message: 'Document successfully processed and indexed into MeghSetu RAG.',
      document,
    });
  } catch (error: any) {
    console.error('Document ingestion error:', error);
    return NextResponse.json(
      { error: error?.message || 'Unable to process this document. Please try again.', stack: error?.stack, details: error?.toString() },
      { status: 500 }
    );
  }
}
