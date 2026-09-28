import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getUserById, getTraineeProfile, getTrainerProfile } from '@/lib/data-service';

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  const user = await getUserById(session.id);
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  let profile = null;
  if (user.role === 'trainee') {
    profile = await getTraineeProfile(user._id);
  } else if (user.role === 'trainer') {
    profile = await getTrainerProfile(user._id);
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      department: user.department,
      designation: user.designation,
      avatar: user.avatar,
    },
    profile,
  });
}
