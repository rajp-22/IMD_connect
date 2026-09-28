import { NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/data-service';
import { hashPassword } from '@/lib/auth';
import { UserRole } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const { name, email, password, role, department, designation, phone } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Name, email, password, and role are mandatory.' },
        { status: 400 }
      );
    }

    if (!['trainee', 'trainer'].includes(role)) {
      return NextResponse.json(
        { error: 'Public registration is only available for Trainee and Trainer roles.' },
        { status: 400 }
      );
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: 'An official account with this email address already exists.' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await createUser({
      name,
      email,
      passwordHash: hashedPassword,
      role: role as UserRole,
      status: 'pending', // Trainee and Trainer require Admin approval
      department: department || 'Meteorological Operations',
      designation: designation || (role === 'trainer' ? 'Meteorologist / Trainer' : 'Scientific Assistant'),
      phone: phone || '',
    });

    return NextResponse.json({
      success: true,
      message:
        'Registration submitted successfully! Your account is now pending administrative approval by IMD Directorate. You will be able to log in once approved.',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed.' },
      { status: 500 }
    );
  }
}
