import { NextRequest, NextResponse } from 'next/server';
import { createUserInDB } from '@/app/lib/db';
import { validateEmail } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, fullName, school, department, catalog } = await request.json();

    // Validation
    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    try {
      // Generate student ID
      const { prisma } = await import('@/app/lib/prisma');
      const userCount = await prisma.user.count();
      const studentId = `AUN/${new Date().getFullYear()}/${String(userCount + 1).padStart(3, '0')}`;

      // Create user in database
      const newUser = await createUserInDB({
        name,
        email: email.toLowerCase(),
        password,
        fullName,
        school,
        department,
        catalog,
        studentId,
      });

      return NextResponse.json({ user: newUser }, { status: 201 });
    } catch (dbError: any) {
      console.error('Database error, falling back to mock data:', dbError);
      
      // Fallback: Create user with mock data structure
      const studentId = `AUN/${new Date().getFullYear()}/${String(Date.now()).slice(-3)}`;
      const newUser = {
        id: Date.now().toString(),
        name,
        email: email.toLowerCase(),
        password,
        fullName,
        school,
        department,
        catalog,
        studentId,
      };

      return NextResponse.json({ user: newUser }, { status: 201 });
    }
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create user' }, { status: 500 });
  }
}
