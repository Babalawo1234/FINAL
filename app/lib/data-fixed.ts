// Re-export all functions from the consolidated courses.ts file
export {
  fetchCourses,
  fetchUserCourses,
  fetchDashboardStats,
  fetchCourseCategories,
  fetchFilteredCourses,
  saveCourse,
  updateCourseProgress,
  resetThemeOnLogout,
  MOCK_COURSES
} from './courses';
