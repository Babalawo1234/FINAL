import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createDefaultUserCourses } from '../seed/route';

// Create new user
export async function POST(request: NextRequest) {
  try {
    const { 
      email, 
      password, 
      name, 
      fullName, 
      school, 
      department, 
      degreeType, 
      catalog 
    } = await request.json();

    if (!email || !password || !name || !fullName || !school || !department || !catalog) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create user object for localStorage
    const user = {
      id: `user-${Date.now()}`,
      email: email.toLowerCase(),
      password: await bcrypt.hash(password, 12),
      name,
      fullName,
      school,
      department,
      catalog,
      studentId: `AUN/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
    };

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// Get user by email
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    try {
      // Try database fetch first
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (user) {
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        return NextResponse.json(userWithoutPassword);
      }
    } catch (dbError) {
      console.log('Database user fetch failed, using localStorage fallback:', dbError);
    }

    // Fallback - user not found
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
