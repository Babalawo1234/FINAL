import { useState, useCallback, useMemo } from 'react';
import { Course, Grade, SAMPLE_COURSES } from '@/types/academic';
import { calculateAcademicProgress, calculateAcademicStats } from '@/app/lib/academic-utils';

export function useAcademicData() {
  const [courses, setCourses] = useState<Course[]>(SAMPLE_COURSES);

  const toggleCourseCompletion = useCallback((courseId: string) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, isCompleted: !course.isCompleted, grade: !course.isCompleted ? undefined : course.grade }
        : course
    ));
  }, []);

  const updateCourseGrade = useCallback((courseId: string, grade: Grade) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, grade, isCompleted: true }
        : course
    ));
  }, []);

  const resetAllProgress = useCallback(() => {
    setCourses(prev => prev.map(course => ({
      ...course,
      isCompleted: false,
      grade: undefined,
    })));
  }, []);

  const resetLevelProgress = useCallback((level: number) => {
    setCourses(prev => prev.map(course => 
      course.level === level 
        ? { ...course, isCompleted: false, grade: undefined }
        : course
    ));
  }, []);

  const progress = useMemo(() => calculateAcademicProgress(courses), [courses]);
  const stats = useMemo(() => calculateAcademicStats(courses), [courses]);

  return {
    courses,
    progress,
    stats,
    toggleCourseCompletion,
    updateCourseGrade,
    resetAllProgress,
    resetLevelProgress,
  };
}
