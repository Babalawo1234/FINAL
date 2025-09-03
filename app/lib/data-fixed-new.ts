// Re-export all functions from the consolidated courses.ts file
// Database integration is ready but using mock data until DB connection is fixed
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

// Database functions are available in ./db.ts when ready to switch
// import { createUserInDB, getUserByEmail, updateUserCourseProgress } from './db';
