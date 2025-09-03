import { StorageManager, Course, UserCourse, DashboardStats } from './storage';

export class CourseManager {
  // Get all available courses
  static getAllCourses(): Course[] {
    return StorageManager.getCourses();
  }

  // Get courses by category
  static getCoursesByCategory(): Record<string, Course[]> {
    const courses = this.getAllCourses();
    return courses.reduce((acc, course) => {
      if (!acc[course.category]) {
        acc[course.category] = [];
      }
      acc[course.category].push(course);
      return acc;
    }, {} as Record<string, Course[]>);
  }

  // Get user's enrolled courses with progress
  static getUserCoursesWithProgress(userId: string): (Course & UserCourse)[] {
    const allCourses = this.getAllCourses();
    const userCourses = StorageManager.getUserCourses(userId);
    
    return userCourses.map(userCourse => {
      const course = allCourses.find(c => c.id === userCourse.courseId);
      if (!course) {
        throw new Error(`Course not found: ${userCourse.courseId}`);
      }
      return { ...course, ...userCourse };
    });
  }

  // Enroll user in a course
  static enrollInCourse(userId: string, courseId: string, options?: {
    semester?: string;
    year?: string;
    status?: 'not_started' | 'in_progress' | 'completed' | 'dropped';
    progress?: number;
  }): UserCourse {
    const course = this.getAllCourses().find(c => c.id === courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // Check if already enrolled
    const existingEnrollment = StorageManager.getUserCourses(userId)
      .find(uc => uc.courseId === courseId);
    
    if (existingEnrollment) {
      throw new Error('Already enrolled in this course');
    }

    const userCourse: UserCourse = {
      id: `uc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      courseId,
      status: options?.status || 'not_started',
      progress: options?.progress || 0,
      semester: (options?.semester || 'Fall') as 'Fall' | 'Spring' | 'Summer',
      year: options?.year || '2024',
      enrolledAt: new Date().toISOString()
    };

    StorageManager.saveUserCourse(userCourse);
    return userCourse;
  }

  // Update course progress
  static updateCourseProgress(
    userId: string,
    courseId: string,
    updates: Partial<Pick<UserCourse, 'status' | 'progress' | 'grade' | 'semester' | 'year' | 'notes'>>
  ): UserCourse {
    const userCourses = StorageManager.getUserCourses(userId);
    const userCourse = userCourses.find(uc => uc.courseId === courseId);
    
    if (!userCourse) {
      throw new Error('User not enrolled in this course');
    }

    // Update fields
    Object.assign(userCourse, updates);

    // Set completion date if completed
    if (updates.status === 'completed' && !userCourse.completedAt) {
      userCourse.completedAt = new Date().toISOString();
    }

    StorageManager.saveUserCourse(userCourse);
    return userCourse;
  }

  // Drop a course
  static dropCourse(userId: string, courseId: string): void {
    StorageManager.deleteUserCourse(userId, courseId);
  }

  // Calculate dashboard statistics
  static calculateDashboardStats(userId: string): DashboardStats {
    const userCourses = StorageManager.getUserCourses(userId);
    const allCourses = this.getAllCourses();

    const totalCourses = userCourses.length;
    const completedCourses = userCourses.filter(uc => uc.status === 'completed').length;
    const inProgressCourses = userCourses.filter(uc => uc.status === 'in_progress').length;

    // Calculate credits earned
    const creditsEarned = userCourses
      .filter(uc => uc.status === 'completed')
      .reduce((total, uc) => {
        const course = allCourses.find(c => c.id === uc.courseId);
        return total + (course?.credits || 0);
      }, 0);

    // Calculate GPA
    const gradedCourses = userCourses.filter(uc => uc.grade && uc.status === 'completed');
    const gpa = gradedCourses.length > 0 
      ? gradedCourses.reduce((total, uc) => {
          const gradePoints = this.getGradePoints(uc.grade!);
          const course = allCourses.find(c => c.id === uc.courseId);
          return total + (gradePoints * (course?.credits || 0));
        }, 0) / gradedCourses.reduce((total, uc) => {
          const course = allCourses.find(c => c.id === uc.courseId);
          return total + (course?.credits || 0);
        }, 0)
      : 0;

    const completionRate = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

    return {
      totalCourses,
      completedCourses,
      inProgressCourses,
      creditsEarned,
      gpa: Math.round(gpa * 100) / 100,
      completionRate
    };
  }

  // Get available courses for enrollment (not yet enrolled)
  static getAvailableCoursesForUser(userId: string): Course[] {
    const allCourses = this.getAllCourses();
    const userCourses = StorageManager.getUserCourses(userId);
    const enrolledCourseIds = userCourses.map(uc => uc.courseId);
    
    return allCourses.filter(course => !enrolledCourseIds.includes(course.id));
  }

  // Check if prerequisites are met
  static arePrerequisitesMet(userId: string, courseId: string): boolean {
    const course = this.getAllCourses().find(c => c.id === courseId);
    if (!course || !course.prerequisites.length) return true;

    const userCourses = StorageManager.getUserCourses(userId);
    const completedCourses = userCourses
      .filter(uc => uc.status === 'completed')
      .map(uc => {
        const c = this.getAllCourses().find(course => course.id === uc.courseId);
        return c?.code;
      })
      .filter(Boolean);

    return course.prerequisites.every(prereq => completedCourses.includes(prereq));
  }

  // Helper method to convert grades to grade points
  private static getGradePoints(grade: string): number {
    const gradeMap: Record<string, number> = {
      'A+': 4.0, 'A': 4.0, 'B+': 3.5, 'B': 3.0, 'B-': 2.5,
      'C+': 2.5, 'C': 2.0, 'D': 1.0, 'F': 0.0
    };
    return gradeMap[grade] || 0.0;
  }

  // Get grade color for UI
  static getGradeColor(grade?: string): string {
    if (!grade) return 'bg-gray-100 text-gray-600';
    
    switch (grade) {
      case 'A+':
      case 'A': return 'bg-green-100 text-green-800';
      case 'B+':
      case 'B':
      case 'B-': return 'bg-blue-100 text-blue-800';
      case 'C+':
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-orange-100 text-orange-800';
      case 'F': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  // Get status color for UI
  static getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'dropped': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  // Get difficulty color for UI
  static getDifficultyColor(difficulty: string): string {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  }
}
