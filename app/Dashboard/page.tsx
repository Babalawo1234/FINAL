'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { CourseManager } from '@/app/lib/course-manager';
import { AuthManager } from '@/app/lib/auth-new';
import { User, DashboardStats, Course, UserCourse } from '@/app/lib/storage';
import {
  ChartBarIcon,
  BookOpenIcon,
  TrophyIcon,
  ClockIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowRightIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  BellIcon,
  StarIcon,
  AcademicCapIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCourses, setRecentCourses] = useState<(Course & UserCourse)[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<any[]>([]);
  const [academicAlerts, setAcademicAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = AuthManager.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    setUser(currentUser);
    loadDashboardData(currentUser.id);
  }, [router]);

  const loadDashboardData = async (userId: string) => {
    try {
      const dashboardStats = CourseManager.calculateDashboardStats(userId);
      const userCourses = CourseManager.getUserCoursesWithProgress(userId);
      
      setStats(dashboardStats);
      setRecentCourses(userCourses.slice(0, 5));
      
      // Mock data for enhanced features
      setRecentActivity([
        { id: 1, type: 'grade', message: 'Grade updated for CS 301 - B+', time: '2 hours ago' },
        { id: 2, type: 'completion', message: 'Completed CS 201 - Data Structures', time: '1 day ago' },
        { id: 3, type: 'enrollment', message: 'Enrolled in CS 401 - Software Engineering', time: '3 days ago' }
      ]);
      
      setUpcomingDeadlines([
        { id: 1, title: 'Course Registration Deadline', date: '2024-12-15', type: 'registration' },
        { id: 2, title: 'Final Exams Period', date: '2024-12-20', type: 'exam' },
        { id: 3, title: 'Spring Semester Begins', date: '2025-01-20', type: 'semester' }
      ]);
      
      setAcademicAlerts([
        { id: 1, type: 'warning', message: 'Missing prerequisite for CS 401', severity: 'medium' },
        { id: 2, type: 'info', message: 'Eligible for Dean\'s List this semester', severity: 'low' }
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleCourseToggle = async (courseId: string, isCompleted: boolean) => {
    if (!user) return;

    try {
      const status = isCompleted ? 'completed' : 'not_started';
      const progress = isCompleted ? 100 : 0;
      
      let grade: 'A+' | 'A' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'D' | 'F' | undefined;
      if (isCompleted) {
        const gradeInput = prompt('Enter grade for this course (A+, A, B+, B, B-, C+, C, D, F):');
        if (gradeInput && ['A+', 'A', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'].includes(gradeInput)) {
          grade = gradeInput as typeof grade;
        }
      }

      CourseManager.updateCourseProgress(user.id, courseId, { status, progress, grade });
      await loadDashboardData(user.id);
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  const getAcademicStanding = () => {
    const gpa = stats?.gpa || 0;
    if (gpa >= 3.5) return { status: "Dean's List", color: "text-green-600 bg-green-100" };
    if (gpa >= 3.0) return { status: "Good Standing", color: "text-blue-600 bg-blue-100" };
    return { status: "Good Standing", color: "text-blue-600 bg-blue-100" };
  };

  const getDegreeProgress = () => {
    const totalCredits = stats?.creditsEarned || 0;
    const requiredCredits = 120; // Standard bachelor's degree
    return Math.min((totalCredits / requiredCredits) * 100, 100);
  };

  return (
    <div className="w-full space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-blue-100">
              Ready to continue your academic journey? Here's your progress overview.
            </p>
            <div className="mt-4 flex items-center space-x-4">
              <span className="text-sm text-blue-200">
                Department: {user?.department || 'Computer Science'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAcademicStanding().color}`}>
                {getAcademicStanding().status}
              </span>
            </div>
          </div>
          <div className="mt-6 lg:mt-0 grid grid-cols-2 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{stats?.gpa?.toFixed(2) || '0.00'}</div>
              <div className="text-sky-100 text-sm">Cumulative GPA</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{getDegreeProgress().toFixed(0)}%</div>
              <div className="text-sky-100 text-sm">Degree Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Academic Overview Cards */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <BookOpenIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Credits</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.creditsEarned || 0}/120</p>
                <p className="text-xs text-gray-500">Required for graduation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <CheckCircleIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.completedCourses || 0}</p>
                <p className="text-xs text-gray-500">This semester: 4</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <ClockIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.inProgressCourses || 0}</p>
                <p className="text-xs text-gray-500">Current semester</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <TrophyIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Semester GPA</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.gpa?.toFixed(2) || '0.00'}</p>
                <p className="text-xs text-gray-500">Fall 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Academic Alerts */}
      {academicAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BellIcon className="h-5 w-5 mr-2" />
              Academic Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {academicAlerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === 'high' ? 'bg-red-50 border-red-400' :
                  alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                  'bg-blue-50 border-blue-400'
                }`}>
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className={`h-5 w-5 mr-2 ${
                      alert.severity === 'high' ? 'text-red-600' :
                      alert.severity === 'medium' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`} />
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dashboard Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClockIcon className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'grade' ? 'bg-green-100 text-green-600' :
                      activity.type === 'completion' ? 'bg-blue-100 text-blue-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {activity.type === 'grade' ? <StarIcon className="h-4 w-4" /> :
                       activity.type === 'completion' ? <CheckCircleIcon className="h-4 w-4" /> :
                       <PlusIcon className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Semester Summary */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AcademicCapIcon className="h-5 w-5 mr-2" />
                Current Semester Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentCourses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpenIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No courses enrolled for this semester</p>
                  <Button variant="primary" onClick={() => router.push('/dashboard/my-courses')}>
                    Browse Courses
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentCourses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{course.code} - {course.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                            {course.status ? String(course.status).replace('_', ' ') : 'not started'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                            {course.difficulty}
                          </span>
                          <span className="text-xs text-gray-500">{course.credits} credits</span>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={course.status === 'completed'}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCourseToggle(course.id, e.target.checked)}
                          className="h-5 w-5 text-sky-600 rounded border-gray-300 focus:ring-sky-500"
                        />
                        {course.status === 'completed' && course.grade && (
                          <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                            {course.grade}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with Upcoming Deadlines and Quick Actions */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="p-3 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 text-sm">{deadline.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{deadline.date}</p>
                    <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                      deadline.type === 'exam' ? 'bg-red-100 text-red-600' :
                      deadline.type === 'registration' ? 'bg-blue-100 text-blue-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {deadline.type}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PlusIcon className="h-5 w-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  variant="primary" 
                  onClick={() => router.push('/dashboard/my-courses')}
                  className="w-full flex items-center justify-center"
                >
                  <BookOpenIcon className="h-4 w-4 mr-2" />
                  Browse Courses
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/dashboard/progress')}
                  className="w-full flex items-center justify-center"
                >
                  <ChartBarIcon className="h-4 w-4 mr-2" />
                  View Progress
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/dashboard/academic-checksheet')}
                  className="w-full flex items-center justify-center"
                >
                  <TrophyIcon className="h-4 w-4 mr-2" />
                  Academic Checksheet
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Degree Progress Ring */}
          <Card>
            <CardHeader>
              <CardTitle>Degree Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#0ea5e9"
                      strokeWidth="2"
                      strokeDasharray={`${getDegreeProgress()}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">{getDegreeProgress().toFixed(0)}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {stats?.creditsEarned || 0} of 120 credits completed
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
