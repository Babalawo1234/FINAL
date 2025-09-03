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

// Additional functions specific to this file
import {
  Course,
  CourseWithProgress,
  UserCourse,
  DashboardStats,
  User,
} from './definitions';

// Mock user data with profile fields
const DUMMY_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    fullName: 'John Michael Doe',
    school: 'School of IT and Computing',
    department: 'Information Security & Assurance',
    catalog: '2022',
    studentId: 'AUN2024001',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    fullName: 'Jane Elizabeth Smith',
    school: 'School of IT and Computing',
    department: 'Computer Science',
    catalog: '2022',
    studentId: 'AUN2024002',
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    password: 'password123',
    fullName: 'Robert James Wilson',
    school: 'School of IT and Computing',
    department: 'Data Science',
    catalog: '2022',
    studentId: 'AUN2024003',
  },
];

// Utility function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchCoursesWithProgress(userId: string, department?: string): Promise<CourseWithProgress[]> {
  // This function uses the consolidated fetchUserCourses from courses.ts
  const { fetchUserCourses } = await import('./courses');
  return fetchUserCourses(userId);
}

export async function updateUserProfile(
  userId: string,
  profileData: Partial<Pick<User, 'name' | 'fullName' | 'department' | 'studentId'>>
): Promise<User> {
  await delay(300);
  
  const userIndex = DUMMY_USERS.findIndex(user => user.id === userId);
  if (userIndex >= 0) {
    DUMMY_USERS[userIndex] = { ...DUMMY_USERS[userIndex], ...profileData };
    return DUMMY_USERS[userIndex];
  }
  
  throw new Error('User not found');
}

export async function getUserById(userId: string): Promise<User | null> {
  await delay(300);
  return DUMMY_USERS.find(user => user.id === userId) || null;
}

export { DUMMY_USERS };
