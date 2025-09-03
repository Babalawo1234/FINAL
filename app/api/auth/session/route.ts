import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, getUserCoursesFromDB } from '@/app/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    try {
      // Get user from database
      const user = await getUserByEmail(email);
      
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Get user's course progress and grades
      const userCourses = await getUserCoursesFromDB(user.id);

      return NextResponse.json({ 
        user, 
        userCourses,
        message: 'Session restored from database'
      }, { status: 200 });
      
    } catch (dbError: any) {
      console.error('Database session restore failed:', dbError);
      return NextResponse.json({ 
        error: 'Database not available',
        fallback: true 
      }, { status: 503 });
    }
  } catch (error: any) {
    console.error('Session restore error:', error);
    return NextResponse.json({ error: 'Failed to restore session' }, { status: 500 });
  }
}
