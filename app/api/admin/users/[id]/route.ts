import { NextResponse } from 'next/server';
import { updateUserStatus, updateUserRole } from '@/lib/data-service';
import { getSessionUser } from '@/lib/auth';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Admin authorization required' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    let updatedUser = null;

    if (body.status) {
      updatedUser = await updateUserStatus(id, body.status);
    }

    if (body.role) {
      updatedUser = await updateUserRole(id, body.role);
    }

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found or no changes applied' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
