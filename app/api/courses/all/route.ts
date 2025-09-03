import { NextRequest, NextResponse } from 'next/server';
import { getAllCourses } from '@/app/lib/db';

export async function GET() {
  try {
    const courses = await getAllCourses();
    return NextResponse.json({ courses }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    
    // Fallback courses if database fails
    const fallbackCourses = [
      {
        id: 'cs101',
        code: 'CS 101',
        title: 'Introduction to Computer Science',
        credits: 3,
        description: 'Fundamental concepts of computer science including programming basics, algorithms, and problem-solving techniques.',
        category: 'Core',
        department: 'Computer Science',
        duration: 15,
        difficulty: 'Beginner',
        requirements: []
      },
      {
        id: 'cs102',
        code: 'CS 102',
        title: 'Programming Fundamentals',
        credits: 4,
        description: 'Introduction to programming using Python. Covers variables, control structures, functions, and basic data structures.',
        category: 'Core',
        department: 'Computer Science',
        duration: 16,
        difficulty: 'Beginner',
        requirements: ['CS 101']
      }
    ];
    
    return NextResponse.json({ courses: fallbackCourses }, { status: 200 });
  }
}
