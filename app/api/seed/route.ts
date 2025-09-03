import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

const courses = [
  // Computer Science Courses
  {
    id: 'cs-101-2022',
    code: 'CSC 101',
    title: 'Introduction to Programming',
    description: 'Fundamentals of computer programming using modern languages',
    credits: 3,
    category: 'Core',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    difficulty: 'beginner'
  },
  {
    id: 'cs-102-2022',
    code: 'CSC 102',
    title: 'Data Structures and Algorithms',
    description: 'Study of data structures and algorithmic problem solving',
    credits: 3,
    category: 'Core',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    difficulty: 'intermediate'
  },
  {
    id: 'cs-201-2022',
    code: 'CSC 201',
    title: 'Object-Oriented Programming',
    description: 'Advanced programming concepts and object-oriented design',
    credits: 3,
    category: 'Major',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    difficulty: 'intermediate'
  },
  {
    id: 'cs-301-2022',
    code: 'CSC 301',
    title: 'Database Systems',
    description: 'Design and implementation of database systems',
    credits: 3,
    category: 'Major',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    difficulty: 'intermediate'
  },
  // Information Security & Assurance Courses
  {
    id: 'isa-101-2022',
    code: 'ISA 101',
    title: 'Introduction to Cybersecurity',
    description: 'Fundamentals of cybersecurity and information protection',
    credits: 3,
    category: 'Core',
    department: 'Information Security & Assurance',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    difficulty: 'beginner'
  },
  {
    id: 'isa-201-2022',
    code: 'ISA 201',
    title: 'Network Security',
    description: 'Advanced network security protocols and implementations',
    credits: 3,
    category: 'Major',
    department: 'Information Security & Assurance',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    difficulty: 'advanced'
  },
  // Data Science Courses
  {
    id: 'ds-101-2022',
    code: 'DSC 101',
    title: 'Introduction to Data Science',
    description: 'Fundamentals of data science and analytics',
    credits: 3,
    category: 'Core',
    department: 'Data Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    difficulty: 'beginner'
  },
  {
    id: 'ds-201-2022',
    code: 'DSC 201',
    title: 'Machine Learning',
    description: 'Introduction to machine learning algorithms and applications',
    credits: 3,
    category: 'Major',
    department: 'Data Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    difficulty: 'advanced'
  },
  // Software Engineering Courses
  {
    id: 'se-101-2022',
    code: 'SWE 101',
    title: 'Software Engineering Principles',
    description: 'Fundamentals of software engineering and development lifecycle',
    credits: 3,
    category: 'Core',
    department: 'Software Engineering',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    difficulty: 'intermediate'
  },
  {
    id: 'se-201-2022',
    code: 'SWE 201',
    title: 'Advanced Software Development',
    description: 'Advanced software development methodologies and practices',
    credits: 3,
    category: 'Major',
    department: 'Software Engineering',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    difficulty: 'advanced'
  },
  // Information Systems Courses
  {
    id: 'is-101-2022',
    code: 'IS 101',
    title: 'Business Information Systems',
    description: 'Information systems in business environments',
    credits: 3,
    category: 'Core',
    department: 'Information Systems',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    difficulty: 'beginner'
  },
  {
    id: 'is-201-2022',
    code: 'IS 201',
    title: 'Enterprise Systems',
    description: 'Large-scale enterprise information systems',
    credits: 3,
    category: 'Major',
    department: 'Information Systems',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    difficulty: 'intermediate'
  },
  // Business Courses
  {
    id: 'bus-101-2022',
    code: 'BUS 101',
    title: 'Business Fundamentals',
    description: 'Core principles of business and management',
    credits: 3,
    category: 'Core',
    department: 'Business Administration',
    school: 'School of Business',
    catalog: '2022',
    duration: 16,
    difficulty: 'beginner'
  },
  {
    id: 'bus-201-2022',
    code: 'BUS 201',
    title: 'Strategic Management',
    description: 'Strategic planning and business management',
    credits: 3,
    category: 'Major',
    department: 'Business Administration',
    school: 'School of Business',
    catalog: '2022',
    duration: 16,
    difficulty: 'intermediate'
  },
  // Engineering Courses
  {
    id: 'eng-101-2022',
    code: 'ENG 101',
    title: 'English Composition',
    description: 'Academic writing and communication skills',
    credits: 3,
    category: 'General Education',
    department: 'English',
    school: 'School of Engineering',
    catalog: '2022',
    duration: 16,
    difficulty: 'beginner'
  },
  {
    id: 'eng-201-2022',
    code: 'ENG 201',
    title: 'Engineering Mathematics',
    description: 'Advanced mathematics for engineering applications',
    credits: 4,
    category: 'Core',
    department: 'Engineering',
    school: 'School of Engineering',
    catalog: '2022',
    duration: 16,
    difficulty: 'intermediate'
  },
  {
    id: 'eng-301-2022',
    code: 'ENG 301',
    title: 'Systems Engineering',
    description: 'Complex systems design and engineering principles',
    credits: 3,
    category: 'Major',
    department: 'Engineering',
    school: 'School of Engineering',
    catalog: '2022',
    duration: 16,
    difficulty: 'advanced'
  },
  // Mathematics & General Education
  {
    id: 'math-101-2022',
    code: 'MAT 101',
    title: 'Calculus I',
    description: 'Differential and integral calculus',
    credits: 4,
    category: 'General Education',
    department: 'Mathematics',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    difficulty: 'intermediate'
  }
];

export async function POST(request: NextRequest) {
  try {
    console.log('Starting comprehensive database seed...');
    
    // First, seed all courses
    for (const course of courses) {
      await prisma.course.upsert({
        where: { id: course.id },
        update: {},
        create: course,
      });
    }
    
    console.log(`Seeded ${courses.length} courses successfully!`);
    return NextResponse.json({ 
      message: 'Database seeded successfully!',
      coursesCreated: courses.length 
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database', details: error },
      { status: 500 }
    );
  }
}

// Helper function to create default user courses for new users
export async function createDefaultUserCourses(userId: string) {
  try {
    // First ensure courses exist in database
    await seedCoursesIfNeeded();
    
    // Get all available courses
    const allCourses = await prisma.course.findMany();
    
    if (allCourses.length === 0) {
      console.log('No courses found in database, skipping user course creation');
      return false;
    }
    
    // Use actual course IDs from database instead of hardcoded ones
    const availableCourseIds = allCourses.map(course => course.id);
    
    // Create comprehensive default progress for all available courses with varied statuses
    const defaultCourseProgresses = availableCourseIds.map((courseId, index) => {
      // Assign varied statuses based on index
      if (index < 8) {
        // First 8 courses - completed with grades
        const grades = ['A', 'A', 'B+', 'A', 'B+', 'A', 'B', 'A'];
        const semesters = ['Spring', 'Fall', 'Spring', 'Fall', 'Spring', 'Fall', 'Spring', 'Fall'];
        const years = ['2023', '2023', '2024', '2024', '2024', '2024', '2024', '2024'];
        
        return {
          courseId,
          status: 'completed',
          progress: 100,
          semester: semesters[index],
          year: years[index],
          grade: grades[index]
        };
      } else if (index < 12) {
        // Next 4 courses - in progress
        const progresses = [75, 60, 85, 45];
        return {
          courseId,
          status: 'in_progress',
          progress: progresses[index - 8] || 50,
          semester: 'Fall',
          year: '2024',
          grade: null
        };
      } else {
        // Remaining courses - not started
        return {
          courseId,
          status: 'not_started',
          progress: 0,
          semester: null,
          year: null,
          grade: null
        };
      }
    });

    for (const courseProgress of defaultCourseProgresses) {
      await prisma.userCourse.upsert({
        where: {
          userId_courseId: {
            userId,
            courseId: courseProgress.courseId
          }
        },
        update: {},
        create: {
          userId,
          courseId: courseProgress.courseId,
          status: courseProgress.status as 'not_started' | 'in_progress' | 'completed',
          progress: courseProgress.progress,
          semester: courseProgress.semester,
          year: courseProgress.year,
          grade: courseProgress.grade,
          startedAt: courseProgress.status !== 'not_started' ? new Date('2024-01-15') : null,
          completedAt: courseProgress.status === 'completed' ? new Date('2024-05-15') : null
        }
      });
    }

    console.log(`Created default courses for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error creating default user courses:', error);
    return false;
  }
}

// Helper function to seed courses if they don't exist
async function seedCoursesIfNeeded() {
  try {
    const existingCourses = await prisma.course.count();
    
    if (existingCourses === 0) {
      console.log('No courses found, seeding courses...');
      
      // Seed all courses
      for (const course of courses) {
        await prisma.course.upsert({
          where: { id: course.id },
          update: {},
          create: course,
        });
      }
      
      console.log(`Seeded ${courses.length} courses`);
    }
  } catch (error) {
    console.error('Error seeding courses:', error);
  }
}
