import { Course, Grade, GRADE_POINTS, AcademicProgress, AcademicStats } from '@/types/academic';

export function calculateGPA(courses: Course[]): number {
  const completedCourses = courses.filter(course => course.isCompleted && course.grade);
  
  if (completedCourses.length === 0) return 0;
  
  const totalPoints = completedCourses.reduce((sum, course) => {
    const gradePoints = GRADE_POINTS[course.grade!];
    return sum + (gradePoints * course.credits);
  }, 0);
  
  const totalCredits = completedCourses.reduce((sum, course) => sum + course.credits, 0);
  
  return totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : 0;
}

export function calculateAcademicProgress(courses: Course[]): AcademicProgress {
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
  const completedCredits = courses
    .filter(course => course.isCompleted)
    .reduce((sum, course) => sum + course.credits, 0);
  
  const gpa = calculateGPA(courses);
  const completionPercentage = totalCredits > 0 ? Math.round((completedCredits / totalCredits) * 100) : 0;
  
  const coursesByLevel = courses.reduce((acc, course) => {
    if (!acc[course.level]) {
      acc[course.level] = [];
    }
    acc[course.level].push(course);
    return acc;
  }, {} as { [key: number]: Course[] });

  return {
    totalCredits,
    completedCredits,
    gpa,
    completionPercentage,
    coursesByLevel,
  };
}

export function calculateAcademicStats(courses: Course[]): AcademicStats {
  const totalCourses = courses.length;
  const completedCourses = courses.filter(course => course.isCompleted).length;
  
  const averageGradeByLevel: { [key: number]: number } = {};
  const creditsByLevel: { [key: number]: { total: number; completed: number } } = {};
  
  [100, 200, 300, 400].forEach(level => {
    const levelCourses = courses.filter(course => course.level === level);
    const completedLevelCourses = levelCourses.filter(course => course.isCompleted && course.grade);
    
    // Calculate average grade for this level
    if (completedLevelCourses.length > 0) {
      const totalGradePoints = completedLevelCourses.reduce((sum, course) => {
        return sum + GRADE_POINTS[course.grade!];
      }, 0);
      averageGradeByLevel[level] = Number((totalGradePoints / completedLevelCourses.length).toFixed(2));
    } else {
      averageGradeByLevel[level] = 0;
    }
    
    // Calculate credits for this level
    creditsByLevel[level] = {
      total: levelCourses.reduce((sum, course) => sum + course.credits, 0),
      completed: levelCourses.filter(course => course.isCompleted).reduce((sum, course) => sum + course.credits, 0),
    };
  });
  
  return {
    totalCourses,
    completedCourses,
    averageGradeByLevel,
    creditsByLevel,
  };
}

export function exportTranscript(courses: Course[], studentName: string = 'Student'): string {
  const progress = calculateAcademicProgress(courses);
  const stats = calculateAcademicStats(courses);
  
  let transcript = `ACADEMIC TRANSCRIPT\n`;
  transcript += `Student: ${studentName}\n`;
  transcript += `Generated: ${new Date().toLocaleDateString()}\n\n`;
  
  transcript += `SUMMARY\n`;
  transcript += `Total Credits: ${progress.totalCredits}\n`;
  transcript += `Completed Credits: ${progress.completedCredits}\n`;
  transcript += `Current GPA: ${progress.gpa}\n`;
  transcript += `Progress: ${progress.completionPercentage}%\n\n`;
  
  [100, 200, 300, 400].forEach(level => {
    const levelCourses = courses.filter(course => course.level === level);
    if (levelCourses.length > 0) {
      transcript += `${level} LEVEL COURSES\n`;
      transcript += `${'='.repeat(50)}\n`;
      
      levelCourses.forEach(course => {
        const status = course.isCompleted ? 'COMPLETED' : 'PENDING';
        const grade = course.grade ? ` - Grade: ${course.grade}` : '';
        transcript += `${course.code} - ${course.title} (${course.credits} credits) - ${status}${grade}\n`;
      });
      transcript += '\n';
    }
  });
  
  return transcript;
}
