import { NextResponse } from 'next/server';
import { getTrainerLibraryResources, addTrainerLibraryResource } from '@/lib/data-service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const trainerId = searchParams.get('trainerId') || undefined;
    const folder = searchParams.get('folder') || undefined;

    const resources = await getTrainerLibraryResources(trainerId, folder);
    return NextResponse.json({ success: true, resources });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const resource = await addTrainerLibraryResource(body);
    return NextResponse.json({ success: true, resource });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
