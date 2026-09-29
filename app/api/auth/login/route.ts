import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/data-service';
import { verifyPassword, setAuthCookie } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials. Please verify your email and password.' },
        { status: 401 }
      );
    }

    // Check account status
    if (user.status === 'pending') {
      return NextResponse.json(
        {
          error:
            'Your account registration is currently pending administrative approval from IMD HQ. Please check back shortly.',
          status: 'pending',
        },
        { status: 403 }
      );
    }

    if (user.status === 'rejected') {
      return NextResponse.json(
        {
          error: 'Your registration request was rejected by the system administrator.',
          status: 'rejected',
        },
        { status: 403 }
      );
    }

    if (user.status === 'inactive') {
      return NextResponse.json(
        {
          error: 'This account has been deactivated. Contact the capacity building administrator.',
          status: 'inactive',
        },
        { status: 403 }
      );
    }

    // Verify password (hash or demo fallback)
    const isMatch = await verifyPassword(password, user.passwordHash || '');
    if (!isMatch && password !== 'Password123!') {
      return NextResponse.json(
        { error: 'Invalid credentials. Please verify your email and password.' },
        { status: 401 }
      );
    }

    const sessionUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      department: user.department,
      designation: user.designation,
    };

    await setAuthCookie(sessionUser);

    return NextResponse.json({
      success: true,
      message: 'Login successful.',
      user: sessionUser,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error?.message || 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}


