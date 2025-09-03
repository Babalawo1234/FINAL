'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { Input, Select } from '@/app/components/ui/Input';
import { CourseManager } from '@/app/lib/course-manager';
import { AuthManager } from '@/app/lib/auth-new';
import { User, Course, UserCourse } from '@/app/lib/storage';
import { 
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ListBulletIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';

interface SemesterGroup {
  semester: string;
  year: string;
  courses: (Course & UserCourse)[];
  totalCredits: number;
  gpa: number;
}

export default function MyCoursesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userCourses, setUserCourses] = useState<(Course & UserCourse)[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [semesterGroups, setSemesterGroups] = useState<SemesterGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'semester' | 'list'>('semester');
  const [loading, setLoading] = useState(true);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState('Fall');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (userCourses.length > 0) {
      organizeCoursesBySemester();
    }
  }, [userCourses]);

  const loadUserData = () => {
    try {
      const currentUser = AuthManager.getCurrentUser();
      if (!currentUser) {
        setLoading(false);
        return;
      }

      setUser(currentUser);
      
      // Load user courses
      const userCoursesData = CourseManager.getUserCoursesWithProgress(currentUser.id);
      const allCourses = CourseManager.getAllCourses();
      
      const coursesWithDetails = userCoursesData.map(uc => {
        const courseDetails = allCourses.find(c => c.id === uc.courseId);
        return courseDetails ? { ...courseDetails, ...uc } : null;
      }).filter(Boolean) as (Course & UserCourse)[];
      
      setUserCourses(coursesWithDetails);
      
      // Load available courses for enrollment
      const enrolledCourseIds = userCoursesData.map(uc => uc.courseId);
      const available = allCourses.filter(c => !enrolledCourseIds.includes(c.id));
      setAvailableCourses(available);
      
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = () => {
    if (!user || !selectedCourseId) return;

    try {
      const success = CourseManager.enrollInCourse(user.id, selectedCourseId, {
        semester: selectedSemester,
        year: selectedYear,
        status: 'not_started',
        progress: 0
      });

      if (success) {
        loadUserData(); // Reload data
        setShowAddCourseModal(false);
        setSelectedCourseId('');
        setSelectedSemester('Fall');
        setSelectedYear('2024');
        alert('Course added successfully!');
      } else {
        alert('Failed to add course. Please try again.');
      }
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Failed to add course. Please try again.');
    }
  };

  const handleEditCourse = (course: any) => {
    setEditingCourse(course);
    setShowEditModal(true);
  };

  const handleUpdateCourse = () => {
    if (!user || !editingCourse) return;

    try {
      CourseManager.updateCourseProgress(user.id, editingCourse.courseId, {
        status: editingCourse.status,
        grade: editingCourse.grade,
        semester: editingCourse.semester,
        year: editingCourse.year,
        progress: editingCourse.status === 'completed' ? 100 : editingCourse.progress
      });

      loadUserData(); // Reload data to update all components
      setShowEditModal(false);
      setEditingCourse(null);
      alert('Course updated successfully!');
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course. Please try again.');
    }
  };

  const handleRemoveCourse = (courseId: string) => {
    if (!user) return;

    if (confirm('Are you sure you want to remove this course?')) {
      try {
        CourseManager.dropCourse(user.id, courseId);
        loadUserData(); // Reload data
        alert('Course removed successfully!');
      } catch (error) {
        console.error('Error removing course:', error);
        alert('Failed to remove course. Please try again.');
      }
    }
  };

  const organizeCoursesBySemester = () => {
    const groups: { [key: string]: (Course & UserCourse)[] } = {};
    
    userCourses.forEach(course => {
      const key = `${course.semester || 'Fall'} ${course.year || '2024'}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(course);
    });

    const semesterGroups: SemesterGroup[] = Object.entries(groups).map(([key, courses]) => {
      const [semester, year] = key.split(' ');
      const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
      
      // Calculate GPA for completed courses with grades
      const completedWithGrades = courses.filter(c => c.status === 'completed' && c.grade);
      let gpa = 0;
      if (completedWithGrades.length > 0) {
        const totalPoints = completedWithGrades.reduce((sum, c) => {
          const gradePoints = getGradePoints(c.grade || 'F');
          return sum + (gradePoints * c.credits);
        }, 0);
        const totalCreditsWithGrades = completedWithGrades.reduce((sum, c) => sum + c.credits, 0);
        gpa = totalCreditsWithGrades > 0 ? totalPoints / totalCreditsWithGrades : 0;
      }
      
      return {
        semester,
        year,
        courses,
        totalCredits,
        gpa: Math.round(gpa * 100) / 100
      };
    });

    // Sort by year and semester
    semesterGroups.sort((a, b) => {
      if (a.year !== b.year) return parseInt(b.year) - parseInt(a.year);
      const semesterOrder = { 'Spring': 1, 'Summer': 2, 'Fall': 3 };
      return (semesterOrder[b.semester as keyof typeof semesterOrder] || 0) - 
             (semesterOrder[a.semester as keyof typeof semesterOrder] || 0);
    });

    setSemesterGroups(semesterGroups);
  };

  const getGradePoints = (grade: string): number => {
    const gradeMap: { [key: string]: number } = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'F': 0.0
    };
    return gradeMap[grade] || 0;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'not_started': return 'text-gray-600 bg-gray-100';
      case 'dropped': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getGradeColor = (grade: string) => {
    if (['A+', 'A', 'A-'].includes(grade)) return 'text-green-600 bg-green-100';
    if (['B+', 'B', 'B-'].includes(grade)) return 'text-blue-600 bg-blue-100';
    if (['C+', 'C', 'C-'].includes(grade)) return 'text-yellow-600 bg-yellow-100';
    if (['D+', 'D'].includes(grade)) return 'text-orange-600 bg-orange-100';
    if (grade === 'F') return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  const filteredCourses = userCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = semesterFilter === 'all' || 
                           `${course.semester} ${course.year}` === semesterFilter;
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    
    return matchesSearch && matchesSemester && matchesStatus;
  });

  const groupedCourses = viewMode === 'semester' ? semesterGroups : [];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Courses</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your enrolled courses and academic progress</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddCourseModal(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Add Course</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Courses</p>
                <p className="text-2xl font-bold">{userCourses.length}</p>
              </div>
              <BookOpenIcon className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Completed</p>
                <p className="text-2xl font-bold">{userCourses.filter(c => c.status === 'completed').length}</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">In Progress</p>
                <p className="text-2xl font-bold">{userCourses.filter(c => c.status === 'in_progress').length}</p>
              </div>
              <ClockIcon className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Credits</p>
                <p className="text-2xl font-bold">{userCourses.reduce((sum, c) => sum + c.credits, 0)}</p>
              </div>
              <AcademicCapIcon className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and View Toggle */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
              
              <Select
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Semesters' },
                  ...Array.from(new Set(userCourses.map(c => `${c.semester} ${c.year}`))).map(sem => ({
                    value: sem,
                    label: sem
                  }))
                ]}
              />
              
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'in_progress', label: 'In Progress' },
                  { value: 'not_started', label: 'Not Started' },
                  { value: 'dropped', label: 'Dropped' }
                ]}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'semester' ? 'primary' : 'outline'}
                onClick={() => setViewMode('semester')}
              >
                <Squares2X2Icon className="h-4 w-4 mr-2" />
                Semester View
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                onClick={() => setViewMode('list')}
              >
                <ListBulletIcon className="h-4 w-4 mr-2" />
                List View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Course</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course
                </label>
                <Select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  options={[
                    { value: '', label: 'Select a course...' },
                    ...availableCourses.map(course => ({
                      value: course.id,
                      label: `${course.code} - ${course.title}`
                    }))
                  ]}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Semester
                  </label>
                  <Select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    options={[
                      { value: 'Fall', label: 'Fall' },
                      { value: 'Spring', label: 'Spring' },
                      { value: 'Summer', label: 'Summer' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Year
                  </label>
                  <Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    options={[
                      { value: '2023', label: '2023' },
                      { value: '2024', label: '2024' },
                      { value: '2025', label: '2025' },
                      { value: '2026', label: '2026' },
                      { value: '2027', label: '2027' }
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowAddCourseModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleAddCourse}
                disabled={!selectedCourseId}
              >
                Add Course
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditModal && editingCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Edit Course: {editingCourse.code}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <Select
                  value={editingCourse.status}
                  onChange={(e) => setEditingCourse({...editingCourse, status: e.target.value})}
                  options={[
                    { value: 'not_started', label: 'Not Started' },
                    { value: 'in_progress', label: 'In Progress' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'dropped', label: 'Dropped' }
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Grade
                </label>
                <Select
                  value={editingCourse.grade || ''}
                  onChange={(e) => setEditingCourse({...editingCourse, grade: e.target.value})}
                  options={[
                    { value: '', label: 'No Grade' },
                    { value: 'A+', label: 'A+' },
                    { value: 'A', label: 'A' },
                    { value: 'B+', label: 'B+' },
                    { value: 'B', label: 'B' },
                    { value: 'B-', label: 'B-' },
                    { value: 'C+', label: 'C+' },
                    { value: 'C', label: 'C' },
                    { value: 'D', label: 'D' },
                    { value: 'F', label: 'F' }
                  ]}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Semester
                  </label>
                  <Select
                    value={editingCourse.semester}
                    onChange={(e) => setEditingCourse({...editingCourse, semester: e.target.value})}
                    options={[
                      { value: 'Fall', label: 'Fall' },
                      { value: 'Spring', label: 'Spring' },
                      { value: 'Summer', label: 'Summer' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Year
                  </label>
                  <Select
                    value={editingCourse.year}
                    onChange={(e) => setEditingCourse({...editingCourse, year: e.target.value})}
                    options={[
                      { value: '2024', label: '2024' },
                      { value: '2025', label: '2025' },
                      { value: '2026', label: '2026' }
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleUpdateCourse}
              >
                Update Course
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Course Display */}
      {viewMode === 'semester' ? (
        <div className="space-y-6">
          {groupedCourses.map((group) => (
            <div key={`${group.semester}-${group.year}`}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    {group.semester} {group.year}
                  </CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{group.totalCredits} credits</span>
                    <span>GPA: {group.gpa.toFixed(2)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.courses.map((course) => (
                    <div
                      key={course.id}
                      className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {course.code}: {course.title}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                                {course.status === 'in_progress' ? 'In Progress' : 
                                 course.status === 'completed' ? 'Completed' : 
                                 course.status === 'dropped' ? 'Dropped' : 'Not Started'}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <div>
                                <span className="font-medium">Credits:</span> {course.credits}
                              </div>
                              <div>
                                <span className="font-medium">Semester:</span> {course.semester} {course.year}
                              </div>
                              <div>
                                <span className="font-medium">Category:</span> {course.category}
                              </div>
                              {course.grade && (
                                <div>
                                  <span className="font-medium">Grade:</span> 
                                  <span className={`ml-1 font-semibold ${getGradeColor(course.grade)}`}>
                                    {course.grade}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {course.description && (
                              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                                {course.description}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCourse(course)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <PencilIcon className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveCourse(course.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <TrashIcon className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">List view coming soon...</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
