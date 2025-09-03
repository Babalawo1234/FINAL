'use client';

import React from 'react';
import { Course, Grade, GRADE_POINTS } from '@/types/academic';
import { cn } from '@/app/lib/utils';

interface CourseItemProps {
  course: Course;
  onToggleCompletion: (courseId: string) => void;
  onGradeChange: (courseId: string, grade: Grade) => void;
}

export function CourseItem({ course, onToggleCompletion, onGradeChange }: CourseItemProps) {
  const handleCheckboxChange = () => {
    onToggleCompletion(course.id);
  };

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const grade = e.target.value as Grade;
    onGradeChange(course.id, grade);
  };

  return (
    <div className={cn(
      'flex items-center justify-between p-4 border rounded-lg transition-all duration-200',
      course.isCompleted 
        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
    )}>
      <div className="flex items-center space-x-4 flex-1">
        <input
          type="checkbox"
          id={`course-${course.id}`}
          checked={course.isCompleted}
          onChange={handleCheckboxChange}
          className="h-5 w-5 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
        />
        
        <div className="flex-1 min-w-0">
          <label 
            htmlFor={`course-${course.id}`}
            className={cn(
              'block cursor-pointer',
              course.isCompleted && 'line-through text-gray-500 dark:text-gray-400'
            )}
          >
            <div className="font-semibold text-gray-900 dark:text-white">
              {course.code}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
              {course.title}
            </div>
          </label>
        </div>
        
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {course.credits} {course.credits === 1 ? 'credit' : 'credits'}
        </div>
      </div>

      {course.isCompleted && (
        <div className="ml-4 w-24">
          <select
            value={course.grade || ''}
            onChange={handleGradeChange}
            className="text-sm w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="">Grade</option>
            {Object.keys(GRADE_POINTS).map(grade => (
              <option key={grade} value={grade}>
                {grade} ({GRADE_POINTS[grade as Grade]})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
