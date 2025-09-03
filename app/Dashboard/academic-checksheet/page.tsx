'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { Select } from '@/app/components/ui/Input';
import { CourseManager } from '@/app/lib/course-manager';
import { AuthManager } from '@/app/lib/auth-new';
import { Course, UserCourse, User } from '@/app/lib/storage';
import {
  AcademicCapIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  TrophyIcon,
  BookOpenIcon,
  StarIcon
} from '@heroicons/react/24/outline';

type GradeValue = 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D+' | 'D' | 'F' | '' | undefined;
type AcademicLevel = '100L' | '200L' | '300L' | '400L';

const gradeOptions: { value: string; label: string }[] = [
  { value: '', label: 'Not Taken' },
  { value: 'A', label: 'A (4.0)' },
  { value: 'B+', label: 'B+ (3.5)' },
  { value: 'B', label: 'B (3.0)' },
  { value: 'C+', label: 'C+ (2.5)' },
  { value: 'C', label: 'C (2.0)' },
  { value: 'D+', label: 'D+ (1.5)' },
  { value: 'D', label: 'D (1.0)' },
  { value: 'F', label: 'F (0.0)' }
];

interface ExtendedCourse {
  id: string;
  code: string;
  title: string;
  credits: number;
  description: string;
  level: AcademicLevel;
  grade?: GradeValue;
}

interface AcademicStats {
  overallGPA: number;
  completionPercentage: number;
  totalCreditsEarned: number;
  coursesCompleted: number;
  levelStats: {
    [key in AcademicLevel]: {
      gpa: number;
      completed: number;
      credits: number;
    };
  };
}

export default function AcademicChecksheetPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<ExtendedCourse[]>([]);
  const [stats, setStats] = useState<AcademicStats>({
    overallGPA: 0,
    completionPercentage: 0,
    totalCreditsEarned: 0,
    coursesCompleted: 0,
    levelStats: {
      '100L': { gpa: 0, completed: 0, credits: 0 },
      '200L': { gpa: 0, completed: 0, credits: 0 },
      '300L': { gpa: 0, completed: 0, credits: 0 },
      '400L': { gpa: 0, completed: 0, credits: 0 }
    }
  });
  const [selectedLevel, setSelectedLevel] = useState<AcademicLevel | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadAcademicData();
  }, []);

  const loadAcademicData = () => {
    const user = AuthManager.getCurrentUser();
    if (!user) return;

    setCurrentUser(user);

    // Mock academic courses data
    const mockCourses: ExtendedCourse[] = [
      { id: 'cs101', code: 'CS101', title: 'Introduction to Computer Science', credits: 3, level: '100L', description: 'Basic programming concepts' },
      { id: 'cs102', code: 'CS102', title: 'Programming Fundamentals', credits: 3, level: '100L', description: 'Programming basics' },
      { id: 'math101', code: 'MATH101', title: 'Calculus I', credits: 4, level: '100L', description: 'Differential calculus' },
      { id: 'eng101', code: 'ENG101', title: 'English Composition', credits: 3, level: '100L', description: 'Writing skills' },
      { id: 'cs201', code: 'CS201', title: 'Data Structures', credits: 3, level: '200L', description: 'Data organization' },
      { id: 'cs202', code: 'CS202', title: 'Algorithms', credits: 3, level: '200L', description: 'Algorithm design' },
      { id: 'math201', code: 'MATH201', title: 'Calculus II', credits: 4, level: '200L', description: 'Integral calculus' },
      { id: 'cs301', code: 'CS301', title: 'Database Systems', credits: 3, level: '300L', description: 'Database design' },
      { id: 'cs302', code: 'CS302', title: 'Software Engineering', credits: 3, level: '300L', description: 'Software development' },
      { id: 'cs401', code: 'CS401', title: 'Senior Project', credits: 3, level: '400L', description: 'Capstone project' }
    ];

    // Load saved grades from localStorage
    const savedGrades = JSON.parse(localStorage.getItem(`academicGrades_${user.id}`) || '{}');
    const coursesWithGrades = mockCourses.map(course => ({
      ...course,
      grade: savedGrades[course.id] || ''
    }));

    setCourses(coursesWithGrades);
    calculateStats(coursesWithGrades);
  };

  const calculateStats = (coursesData: ExtendedCourse[]) => {
    const gradePoints: { [key: string]: number } = {
      'A': 4.0, 'B+': 3.5, 'B': 3.0, 'C+': 2.5, 'C': 2.0, 'D+': 1.5, 'D': 1.0, 'F': 0.0
    };

    const completedCourses = coursesData.filter(c => c.grade && c.grade !== '' && c.grade !== undefined) as ExtendedCourse[];
    const totalCredits = completedCourses.reduce((sum, c) => sum + c.credits, 0);
    const totalPoints = completedCourses.reduce((sum, c) => sum + (gradePoints[c.grade!] * c.credits), 0);
    const overallGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;

    const levelStats = {
      '100L': { gpa: 0, completed: 0, credits: 0 },
      '200L': { gpa: 0, completed: 0, credits: 0 },
      '300L': { gpa: 0, completed: 0, credits: 0 },
      '400L': { gpa: 0, completed: 0, credits: 0 }
    };

    Object.keys(levelStats).forEach(level => {
      const levelCourses = completedCourses.filter(c => c.level === level);
      const levelCredits = levelCourses.reduce((sum, c) => sum + c.credits, 0);
      const levelPoints = levelCourses.reduce((sum, c) => sum + (gradePoints[c.grade!] * c.credits), 0);
      
      levelStats[level as AcademicLevel] = {
        gpa: levelCredits > 0 ? levelPoints / levelCredits : 0,
        completed: levelCourses.length,
        credits: levelCredits
      };
    });

    setStats({
      overallGPA,
      completionPercentage: (completedCourses.length / coursesData.length) * 100,
      totalCreditsEarned: totalCredits,
      coursesCompleted: completedCourses.length,
      levelStats
    });
  };

  const updateCourseGrade = (courseId: string, grade: GradeValue) => {
    if (!currentUser) return;

    const updatedCourses = courses.map(course =>
      course.id === courseId ? { ...course, grade } : course
    );

    setCourses(updatedCourses);
    calculateStats(updatedCourses);

    // Save to localStorage
    const grades = updatedCourses.reduce((acc, course) => {
      if (course.grade) acc[course.id] = course.grade;
      return acc;
    }, {} as { [key: string]: GradeValue });

    localStorage.setItem(`academicGrades_${currentUser.id}`, JSON.stringify(grades));
  };

  const resetLevel = (level: AcademicLevel) => {
    if (!currentUser) return;

    const updatedCourses = courses.map(course =>
      course.level === level ? { ...course, grade: '' as GradeValue } : course
    );

    setCourses(updatedCourses);
    calculateStats(updatedCourses);

    const grades = updatedCourses.reduce((acc, course) => {
      if (course.grade) acc[course.id] = course.grade;
      return acc;
    }, {} as { [key: string]: GradeValue });

    localStorage.setItem(`academicGrades_${currentUser.id}`, JSON.stringify(grades));
  };

  const resetAll = () => {
    if (!currentUser) return;

    const updatedCourses = courses.map(course => ({ ...course, grade: '' as GradeValue }));
    setCourses(updatedCourses);
    calculateStats(updatedCourses);
    localStorage.removeItem(`academicGrades_${currentUser.id}`);
  };

  const filteredCourses = selectedLevel === 'all' 
    ? courses 
    : courses.filter(course => course.level === selectedLevel);

  const getGradeColor = (grade: GradeValue) => {
    if (!grade) return 'text-gray-400';
    const gradeValue = parseFloat(grade === 'A' ? '4.0' : 
                                 grade === 'B+' ? '3.5' :
                                 grade === 'B' ? '3.0' :
                                 grade === 'C+' ? '2.5' :
                                 grade === 'C' ? '2.0' :
                                 grade === 'D+' ? '1.5' :
                                 grade === 'D' ? '1.0' : '0.0');
    
    if (gradeValue >= 3.5) return 'text-green-600 dark:text-green-400';
    if (gradeValue >= 3.0) return 'text-blue-600 dark:text-blue-400';
    if (gradeValue >= 2.0) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getStatusIcon = (grade: GradeValue) => {
    if (!grade) return <ClockIcon className="h-5 w-5 text-gray-400" />;
    const gradeValue = parseFloat(grade === 'A' ? '4.0' : 
                                 grade === 'B+' ? '3.5' :
                                 grade === 'B' ? '3.0' :
                                 grade === 'C+' ? '2.5' :
                                 grade === 'C' ? '2.0' :
                                 grade === 'D+' ? '1.5' :
                                 grade === 'D' ? '1.0' : '0.0');
    
    if (gradeValue >= 2.0) return <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />;
    return <XCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />;
  };

  const exportTranscript = () => {
    const transcriptData = {
      studentInfo: {
        name: 'Student Name',
        id: 'STU001',
        program: 'Computer Science',
        date: new Date().toLocaleDateString()
      },
      courses: courses.filter(c => c.grade),
      stats: stats
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Official Academic Transcript</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .student-info { margin-bottom: 20px; }
          .courses-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .courses-table th, .courses-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .courses-table th { background-color: #f2f2f2; }
          .stats { margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>American University of Nigeria</h1>
          <h2>Official Academic Transcript</h2>
        </div>
        <div class="student-info">
          <p><strong>Student Name:</strong> ${transcriptData.studentInfo.name}</p>
          <p><strong>Student ID:</strong> ${transcriptData.studentInfo.id}</p>
          <p><strong>Program:</strong> ${transcriptData.studentInfo.program}</p>
          <p><strong>Date Generated:</strong> ${transcriptData.studentInfo.date}</p>
        </div>
        <table class="courses-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>Credits</th>
              <th>Grade</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            ${transcriptData.courses.map(course => `
              <tr>
                <td>${course.code}</td>
                <td>${course.title}</td>
                <td>${course.credits}</td>
                <td>${course.grade}</td>
                <td>${(course.credits * (course.grade === 'A' ? 4.0 : 
                                        course.grade === 'B+' ? 3.5 :
                                        course.grade === 'B' ? 3.0 :
                                        course.grade === 'C+' ? 2.5 :
                                        course.grade === 'C' ? 2.0 :
                                        course.grade === 'D+' ? 1.5 :
                                        course.grade === 'D' ? 1.0 : 0.0)).toFixed(1)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="stats">
          <p><strong>Total Credits Completed:</strong> ${stats.totalCreditsEarned}</p>
          <p><strong>Cumulative GPA:</strong> ${stats.overallGPA.toFixed(2)}</p>
          <p><strong>Completion Percentage:</strong> ${stats.completionPercentage.toFixed(1)}%</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'academic-transcript.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Academic Checksheet</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your academic progress and course completion</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={exportTranscript}>
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            Export Transcript
          </Button>
          <Button variant="outline" onClick={() => resetAll()}>
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Reset All
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Overall GPA</p>
                <p className="text-2xl font-bold">{stats.overallGPA.toFixed(2)}</p>
              </div>
              <TrophyIcon className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Completion</p>
                <p className="text-2xl font-bold">{stats.completionPercentage.toFixed(0)}%</p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Credits Earned</p>
                <p className="text-2xl font-bold">{stats.totalCreditsEarned}</p>
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
                <p className="text-2xl font-bold">{stats.coursesCompleted}</p>
              </div>
              <StarIcon className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as AcademicLevel | 'all')}
                options={[
                  { value: 'all', label: 'All Levels' },
                  { value: '100L', label: '100 Level' },
                  { value: '200L', label: '200 Level' },
                  { value: '300L', label: '300 Level' },
                  { value: '400L', label: '400 Level' }
                ]}
              />
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                >
                  List
                </button>
              </div>
            </div>
            
            {selectedLevel !== 'all' && (
              <Button 
                variant="outline" 
                onClick={() => resetLevel(selectedLevel as AcademicLevel)}
              >
                Reset {selectedLevel}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Level Statistics */}
      {selectedLevel !== 'all' && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedLevel} Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.levelStats[selectedLevel as AcademicLevel]?.gpa.toFixed(2) || '0.00'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Level GPA</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.levelStats[selectedLevel as AcademicLevel]?.completed || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.levelStats[selectedLevel as AcademicLevel]?.credits || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Credits</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Courses Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AcademicCapIcon className="h-5 w-5 mr-2" />
            Courses {selectedLevel !== 'all' && `- ${selectedLevel}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{course.code}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{course.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {course.credits} credits • {course.level}
                      </p>
                    </div>
                    {getStatusIcon(course.grade)}
                  </div>
                  
                  <div className="space-y-2">
                    <Select
                      value={course.grade || ''}
                      onChange={(e) => updateCourseGrade(course.id, e.target.value as GradeValue)}
                      options={gradeOptions}
                    />
                    {course.grade && (
                      <div className={`text-center font-medium ${getGradeColor(course.grade)}`}>
                        Grade: {course.grade}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Credits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                  {filteredCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{course.code}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{course.title}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {course.credits}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {course.level}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Select
                          value={course.grade || ''}
                          onChange={(e) => updateCourseGrade(course.id, e.target.value as GradeValue)}
                          options={gradeOptions}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(course.grade)}
                          <span className={`ml-2 text-sm ${getGradeColor(course.grade)}`}>
                            {course.grade ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
