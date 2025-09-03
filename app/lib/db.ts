import { prisma } from './prisma';
import { User, Course, UserCourse } from '@/app/lib/definitions';

// Database functions for users
export async function createUserInDB(userData: Omit<User, 'id'>): Promise<User> {
  const user = await prisma.user.create({
    data: {
      email: userData.email,
      name: userData.name,
      fullName: userData.fullName,
      password: userData.password,
      studentId: userData.studentId,
      school: userData.school,
      department: userData.department,
      catalog: userData.catalog,
    },
  });
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    fullName: user.fullName,
    password: user.password,
    studentId: user.studentId,
    school: user.school as any,
    department: user.department as any,
    catalog: user.catalog as any,
  };
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    fullName: user.fullName,
    password: user.password,
    studentId: user.studentId,
    school: user.school as any,
    department: user.department as any,
    catalog: user.catalog as any,
  };
}

// Database functions for courses
export async function createCourseInDB(courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course> {
  const course = await prisma.course.create({
    data: {
      code: courseData.code,
      title: courseData.title,
      description: courseData.description,
      category: courseData.category,
      department: courseData.department,
      school: courseData.school,
      catalog: courseData.catalog,
      duration: courseData.duration,
      credits: courseData.credits,
      difficulty: courseData.difficulty,
      requirements: courseData.requirements || [],
    },
  });
  
  return {
    id: course.id,
    code: course.code,
    title: course.title,
    description: course.description,
    category: course.category,
    department: course.department as any,
    school: course.school as any,
    catalog: course.catalog as any,
    duration: course.duration,
    credits: course.credits || undefined,
    difficulty: course.difficulty as any,
    requirements: course.requirements,
    created_at: course.createdAt.toISOString(),
    updated_at: course.updatedAt.toISOString(),
  };
}

export async function getAllCourses(): Promise<Course[]> {
  const courses = await prisma.course.findMany();
  
  return courses.map(course => ({
    id: course.id,
    code: course.code,
    title: course.title,
    description: course.description,
    category: course.category,
    department: course.department as any,
    school: course.school as any,
    catalog: course.catalog as any,
    duration: course.duration,
    credits: course.credits || undefined,
    difficulty: course.difficulty as any,
    requirements: course.requirements,
    created_at: course.createdAt.toISOString(),
    updated_at: course.updatedAt.toISOString(),
  }));
}

// Database functions for user courses
export async function updateUserCourseProgress(
  userId: string,
  courseId: string,
  progress: number,
  status: 'not_started' | 'in_progress' | 'completed',
  grade?: string
): Promise<UserCourse> {
  const userCourse = await prisma.userCourse.upsert({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    update: {
      status,
      progress,
      grade,
      startedAt: status === 'in_progress' ? new Date() : undefined,
      completedAt: status === 'completed' ? new Date() : undefined,
    },
    create: {
      userId,
      courseId,
      status,
      progress,
      grade,
      startedAt: status === 'in_progress' ? new Date() : undefined,
      completedAt: status === 'completed' ? new Date() : undefined,
    },
  });
  
  return {
    id: userCourse.id,
    user_id: userCourse.userId,
    course_id: userCourse.courseId,
    status: userCourse.status as any,
    progress: userCourse.progress,
    grade: userCourse.grade as any,
    started_at: userCourse.startedAt?.toISOString() || null,
    completed_at: userCourse.completedAt?.toISOString() || null,
    notes: userCourse.notes || '',
  };
}

export async function getUserCoursesFromDB(userId: string): Promise<UserCourse[]> {
  const userCourses = await prisma.userCourse.findMany({
    where: { userId },
    include: { course: true },
  });
  
  return userCourses.map(uc => ({
    id: uc.id,
    user_id: uc.userId,
    course_id: uc.courseId,
    status: uc.status as any,
    progress: uc.progress,
    grade: uc.grade as any,
    started_at: uc.startedAt?.toISOString() || null,
    completed_at: uc.completedAt?.toISOString() || null,
    notes: uc.notes || '',
  }));
}
