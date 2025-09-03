'use client';

import React from 'react';
import { Course, Grade } from '@/types/academic';
import { CourseItem } from './CourseItem';

interface CourseLevelSectionProps {
  level: number;
  courses: Course[];
  onToggleCompletion: (courseId: string) => void;
  onGradeChange: (courseId: string, grade: Grade) => void;
  onResetLevel: (level: number) => void;
}

export function CourseLevelSection({ 
  level, 
  courses, 
  onToggleCompletion, 
  onGradeChange, 
  onResetLevel 
}: CourseLevelSectionProps) {
  const completedCourses = courses.filter(course => course.isCompleted).length;
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
  const completedCredits = courses
    .filter(course => course.isCompleted)
    .reduce((sum, course) => sum + course.credits, 0);

  const handleResetLevel = () => {
    if (window.confirm(`Are you sure you want to reset all progress for ${level} level courses?`)) {
      onResetLevel(level);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {level} Level Courses
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {completedCourses} of {courses.length} courses completed • {completedCredits}/{totalCredits} credits
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Progress
              </div>
              <div className="text-lg font-bold text-sky-600 dark:text-sky-400">
                {Math.round((completedCourses / courses.length) * 100)}%
              </div>
            </div>
            
            {completedCourses > 0 && (
              <button
                onClick={handleResetLevel}
                className="px-3 py-1.5 text-sm border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                Reset Level
              </button>
            )}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-sky-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCourses / courses.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-3">
          {courses.map(course => (
            <CourseItem
              key={course.id}
              course={course}
              onToggleCompletion={onToggleCompletion}
              onGradeChange={onGradeChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
