'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { CourseManager } from '@/app/lib/course-manager';
import { AuthManager } from '@/app/lib/auth-new';
import { Course, UserCourse, User } from '@/app/lib/storage';
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ChartBarIcon,
  BookOpenIcon,
  TrophyIcon,
  CalendarIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  PlusIcon,
  StarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface DegreeRequirement {
  id: string;
  category: string;
  title: string;
  required: number;
  completed: number;
  courses: string[];
}

interface GradeTrend {
  semester: string;
  gpa: number;
  credits: number;
}

export default function ProgressPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userCourses, setUserCourses] = useState<(Course & UserCourse)[]>([]);
  const [degreeRequirements, setDegreeRequirements] = useState<DegreeRequirement[]>([]);
  const [gradeTrends, setGradeTrends] = useState<GradeTrend[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = AuthManager.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    setCurrentUser(currentUser);
    loadProgressData(currentUser.id);
  }, [router]);

  // Listen for course updates from other components
  useEffect(() => {
    const handleStorageChange = () => {
      if (currentUser) {
        loadProgressData(currentUser.id);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events from course updates
    const handleCourseUpdate = () => {
      if (currentUser) {
        loadProgressData(currentUser.id);
      }
    };

    window.addEventListener('courseUpdated', handleCourseUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('courseUpdated', handleCourseUpdate);
    };
  }, [currentUser]);

  const loadProgressData = (userId: string) => {
    try {
      setLoading(true);
      
      // Get user courses with progress
      const coursesWithProgress = CourseManager.getUserCoursesWithProgress(userId);
      setUserCourses(coursesWithProgress);
      
      // Calculate degree requirements based on actual courses
      setDegreeRequirements([
        {
          id: '1',
          category: 'Core Requirements',
          title: 'Computer Science Core',
          required: 8,
          completed: coursesWithProgress.filter(c => 
            c.category === 'Core' && c.status === 'completed'
          ).length,
          courses: ['CS 101', 'CS 201', 'CS 301', 'CS 401']
        },
        {
          id: '2',
          category: 'Mathematics',
          title: 'Mathematics Requirements',
          required: 4,
          completed: coursesWithProgress.filter(c => 
            c.category === 'Major' && c.status === 'completed'
          ).length,
          courses: ['MATH 101', 'MATH 201', 'STAT 101']
        },
        {
          id: '3',
          category: 'Electives',
          title: 'Technical Electives',
          required: 6,
          completed: coursesWithProgress.filter(c => 
            c.category === 'Elective' && c.status === 'completed'
          ).length,
          courses: ['CS 350', 'CS 450', 'CS 480']
        }
      ]);

      // Calculate grade trends by semester
      const trends = calculateGradeTrends(coursesWithProgress);
      setGradeTrends(trends);
      
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateGradeTrends = (courses: (Course & UserCourse)[]): GradeTrend[] => {
    const semesterMap = new Map<string, { totalPoints: number; totalCredits: number }>();
    
    courses.forEach(course => {
      if (course.status === 'completed' && course.grade) {
        const semesterKey = `${course.semester} ${course.year}`;
        const gradePoints = getGradePoints(course.grade);
        
        if (!semesterMap.has(semesterKey)) {
          semesterMap.set(semesterKey, { totalPoints: 0, totalCredits: 0 });
        }
        
        const semester = semesterMap.get(semesterKey)!;
        semester.totalPoints += gradePoints * course.credits;
        semester.totalCredits += course.credits;
      }
    });

    return Array.from(semesterMap.entries()).map(([semester, data]) => ({
      semester,
      gpa: data.totalCredits > 0 ? data.totalPoints / data.totalCredits : 0,
      credits: data.totalCredits
    }));
  };

  const getGradePoints = (grade: string): number => {
    const gradeMap: Record<string, number> = {
      'A+': 4.0, 'A': 4.0, 'B+': 3.5, 'B': 3.0, 'B-': 2.5,
      'C+': 2.5, 'C': 2.0, 'D': 1.0, 'F': 0.0
    };
    return gradeMap[grade] || 0.0;
  };

  const getOverallStats = () => {
    const totalCourses = userCourses.length;
    const completedCourses = userCourses.filter(c => c.status === 'completed').length;
    const inProgressCourses = userCourses.filter(c => c.status === 'in_progress').length;
    const totalCredits = userCourses
      .filter(c => c.status === 'completed')
      .reduce((sum, c) => sum + c.credits, 0);

    const gradedCourses = userCourses.filter(c => c.status === 'completed' && c.grade);
    const gpa = gradedCourses.length > 0 
      ? gradedCourses.reduce((sum, course) => {
          return sum + (getGradePoints(course.grade!) * course.credits);
        }, 0) / gradedCourses.reduce((sum, course) => {
          return sum + course.credits;
        }, 0)
      : 0;

    const completionRate = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

    return { totalCourses, completedCourses, inProgressCourses, totalCredits, gpa, completionRate };
  };

  const filteredRequirements = selectedCategory === 'all' 
    ? degreeRequirements 
    : degreeRequirements.filter(req => req.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  const stats = getOverallStats();

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Academic Progress</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your degree requirements and academic milestones</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Overall Progress</p>
                <p className="text-2xl font-bold">{stats.completionRate}%</p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Cumulative GPA</p>
                <p className="text-2xl font-bold">{stats.gpa.toFixed(2)}</p>
              </div>
              <TrophyIcon className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Credits Earned</p>
                <p className="text-2xl font-bold">{stats.totalCredits}/120</p>
              </div>
              <BookOpenIcon className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Courses Completed</p>
                <p className="text-2xl font-bold">{stats.completedCourses}/{stats.totalCourses}</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Degree Requirements */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
              Degree Requirements
            </CardTitle>
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-4 w-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="all">All Categories</option>
                <option value="Core Requirements">Core Requirements</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Electives">Electives</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRequirements.map((requirement) => (
              <div key={requirement.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{requirement.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    requirement.completed >= requirement.required
                      ? 'bg-green-100 text-green-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {requirement.completed}/{requirement.required} Complete
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full ${
                      requirement.completed >= requirement.required
                        ? 'bg-green-500'
                        : 'bg-blue-500'
                    }`}
                    style={{
                      width: `${Math.min((requirement.completed / requirement.required) * 100, 100)}%`
                    }}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {requirement.courses.map((courseCode, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                    >
                      {courseCode}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grade Trends */}
      {gradeTrends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ArrowTrendingUpIcon className="h-5 w-5 mr-2" />
              GPA Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {gradeTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{trend.semester}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{trend.credits} credits</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{trend.gpa.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">GPA</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
