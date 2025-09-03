import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Always return empty array to trigger localStorage fallback
    // No database dependency - everything handled by localStorage
    return NextResponse.json({ userCourses: [] }, { status: 200 });
  } catch (error: any) {
    console.error('Error in user courses API:', error);
    return NextResponse.json({ userCourses: [] }, { status: 200 });
  }
}

// Update user course progress - localStorage only
export async function PUT(request: NextRequest) {
  try {
    const { userId, courseId, status, grade, progress, semester, year } = await request.json();

    if (!userId || !courseId) {
      return NextResponse.json({ error: 'User ID and Course ID required' }, { status: 400 });
    }

    // Return success - actual update handled by frontend localStorage
    const mockResponse = {
      userId,
      courseId,
      status,
      grade,
      progress,
      semester,
      year,
      startedAt: status === 'in_progress' ? new Date().toISOString() : null,
      completedAt: status === 'completed' ? new Date().toISOString() : null
    };

    return NextResponse.json({ userCourse: mockResponse }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating user course:', error);
    return NextResponse.json({ error: 'Failed to update user course' }, { status: 500 });
  }
}
