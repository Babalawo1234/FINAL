import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Mock user for localStorage-only authentication
    // In a real app, you'd validate against your user store
    const mockUser = {
      id: `user-${Date.now()}`,
      email: email.toLowerCase(),
      name: email.split('@')[0],
      fullName: `${email.split('@')[0]} User`,
      school: 'School of IT and Computing',
      department: 'Computer Science',
      catalog: '2022',
      studentId: `AUN/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
    };

    return NextResponse.json({ user: mockUser }, { status: 200 });
  } catch (error) {
    console.error('Error authenticating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
