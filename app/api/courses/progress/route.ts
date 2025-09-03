import { NextRequest, NextResponse } from 'next/server';
import { updateUserCourseProgress } from '@/app/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { userId, courseId, progress, status, grade } = await request.json();

    if (!userId || !courseId || progress === undefined || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
      const userCourse = await updateUserCourseProgress(userId, courseId, progress, status, grade);
      return NextResponse.json({ userCourse }, { status: 200 });
    } catch (dbError: any) {
      console.error('Database update failed:', dbError);
      
      // Return fallback response for localStorage handling
      const fallbackUserCourse = {
        id: `uc-${Date.now()}`,
        user_id: userId,
        course_id: courseId,
        status,
        progress,
        grade: grade || null,
        started_at: status === 'in_progress' ? new Date().toISOString() : null,
        completed_at: status === 'completed' ? new Date().toISOString() : null,
        notes: ''
      };
      
      return NextResponse.json({ userCourse: fallbackUserCourse }, { status: 200 });
    }
  } catch (error: any) {
    console.error('Error updating course progress:', error);
    return NextResponse.json({ error: 'Failed to update course progress' }, { status: 500 });
  }
}
