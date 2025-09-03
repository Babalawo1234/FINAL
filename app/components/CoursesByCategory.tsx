'use client';

import { CourseWithProgress } from '@/app/lib/definitions';
import { CheckCircleIcon, ClockIcon, AcademicCapIcon, BookOpenIcon, LightBulbIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface CoursesByCategoryProps {
  coursesByCategory: Record<string, CourseWithProgress[]>;
  onUpdateProgress: (courseId: string, newStatus: 'not_started' | 'in_progress' | 'completed', grade?: string, semester?: string, year?: string) => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    case 'in_progress':
      return <ClockIcon className="h-5 w-5 text-blue-500" />;
    default:
      return <BookOpenIcon className="h-5 w-5 text-gray-400" />;
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Core':
      return <AcademicCapIcon className="h-5 w-5 text-indigo-600" />;
    case 'Major':
      return <LightBulbIcon className="h-5 w-5 text-purple-600" />;
    case 'Free Elective':
      return <UserGroupIcon className="h-5 w-5 text-green-600" />;
    case 'General Education':
      return <BookOpenIcon className="h-5 w-5 text-blue-600" />;
    default:
      return <BookOpenIcon className="h-5 w-5 text-gray-600" />;
  }
};

export default function CoursesByCategory({ coursesByCategory, onUpdateProgress }: CoursesByCategoryProps) {
  // Define the order of categories
  const categoryOrder = ['Core', 'Major', 'Free Elective', 'General Education'];
  
  // Convert the coursesByCategory object into an array of entries
  const categoryEntries = Object.entries(coursesByCategory);

  if (categoryEntries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No courses found.</p>
      </div>
    );
  }

  const getGradeColor = (grade?: string) => {
    if (!grade) return 'text-gray-500 bg-gray-100';
    switch (grade) {
      case 'A+':
      case 'A': return 'text-green-700 bg-green-100';
      case 'B+':
      case 'B':
      case 'B-': return 'text-blue-700 bg-blue-100';
      case 'C+':
      case 'C': return 'text-yellow-700 bg-yellow-100';
      case 'D':
      case 'E':
      case 'F': return 'text-red-700 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      {categoryEntries.map(([category, categoryCourses]) => (
        <div key={category} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex items-center space-x-2">
            {getCategoryIcon(category)}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{category} Courses</h2>
            <span className="ml-auto bg-white dark:bg-gray-600 px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
              {categoryCourses.length} courses
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Credits</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Semester</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {categoryCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {course.code} - {course.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{course.description}</div>
                      {course.requirements && course.requirements.length > 0 && (
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Requires: {course.requirements.join(', ')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {course.credits} credits
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(course.status)}`}>
                        {course.status ? String(course.status).replace('_', ' ') : 'not started'}
                      </span>
                      {course.status === 'in_progress' && (
                        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {course.grade ? (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(course.grade)}`}>
                          {course.grade}
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-sm">No Grade</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {course.status === 'not_started' && (
                        <button
                          onClick={() => {
                            const semester = prompt('Select semester (Fall/Spring):');
                            const year = prompt('Enter year (2022-2027):');
                            if (semester && year) {
                              onUpdateProgress(course.id, 'in_progress', undefined, semester, year);
                            }
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-all duration-200 transform hover:scale-105"
                        >
                          Start Course
                        </button>
                      )}
                      
                      {course.status === 'in_progress' && (
                        <button
                          onClick={() => {
                            const grade = prompt('Enter grade (A+, A, B+, B, B-, C+, C, D, E, F):');
                            if (grade) {
                              onUpdateProgress(course.id, 'completed', grade, course.semester || undefined, course.year || undefined);
                            }
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-all duration-200 transform hover:scale-105"
                        >
                          Mark Completed
                        </button>
                      )}
                      
                      {course.status === 'completed' && (
                        <span className="text-green-600 dark:text-green-400 text-xs font-medium flex items-center">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Completed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {course.semester && course.year ? (
                        <div className="space-y-1">
                          <select
                            value={course.semester}
                            onChange={(e) => {
                              const newSemester = e.target.value;
                              onUpdateProgress(course.id, course.status, course.grade || undefined, newSemester, course.year || undefined);
                            }}
                            className="block w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                          >
                            <option value="Fall">Fall</option>
                            <option value="Spring">Spring</option>
                          </select>
                          <select
                            value={course.year}
                            onChange={(e) => {
                              const newYear = e.target.value;
                              onUpdateProgress(course.id, course.status, course.grade || undefined, course.semester || undefined, newYear);
                            }}
                            className="block w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                          >
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                          </select>
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-xs">Not set</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
