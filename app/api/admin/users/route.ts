import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/data-service';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Admin authorization required' }, { status: 403 });
    }

    const users = await getUsers();
    // Exclude password hash from response
    const cleanUsers = users.map((u) => {
      const { passwordHash, ...rest } = u;
      return rest;
    });

    return NextResponse.json({ success: true, users: cleanUsers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
