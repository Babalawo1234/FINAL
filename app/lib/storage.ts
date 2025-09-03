// Modern localStorage management system
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  school: string;
  department: string;
  degreeType: string;
  catalog: string;
  studentId: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  yearOfStudy?: string;
  expectedGraduation?: string;
  advisor?: string;
  enrollmentStatus?: string;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  category: 'Core' | 'Major' | 'Elective' | 'General';
  department: string;
  school: string;
  credits: 1 | 2 | 3 | 4;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  prerequisites: string[];
  instructor?: string;
  schedule?: string;
}

export interface UserCourse {
  id: string;
  userId: string;
  courseId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'dropped';
  progress: number;
  grade?: 'A+' | 'A' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'D' | 'F';
  semester?: 'Fall' | 'Spring' | 'Summer';
  year?: string;
  enrolledAt?: string;
  completedAt?: string;
  notes?: string;
}

export interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  creditsEarned: number;
  gpa: number;
  completionRate: number;
}

// Storage keys
const STORAGE_KEYS = {
  USERS: 'aun_users',
  CURRENT_USER: 'aun_current_user',
  COURSES: 'aun_courses',
  USER_COURSES: 'aun_user_courses',
  THEME: 'aun_theme',
  SETTINGS: 'aun_settings'
} as const;

// Storage utility class
export class StorageManager {
  // User management
  static getUsers(): User[] {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  }

  static saveUser(user: User): void {
    if (typeof window === 'undefined') return;
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  static getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userData ? JSON.parse(userData) : null;
  }

  static setCurrentUser(user: User | null): void {
    if (typeof window === 'undefined') return;
    if (user) {
      user.lastLogin = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  static findUserByEmail(email: string): User | null {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  // Course management
  static getCourses(): Course[] {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSES) || JSON.stringify(DEFAULT_COURSES));
  }

  static saveCourses(courses: Course[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }

  // User course management
  static getUserCourses(userId: string): UserCourse[] {
    if (typeof window === 'undefined') return [];
    const allUserCourses = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_COURSES) || '{}');
    return allUserCourses[userId] || [];
  }

  static saveUserCourse(userCourse: UserCourse): void {
    if (typeof window === 'undefined') return;
    const allUserCourses = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_COURSES) || '{}');
    
    if (!allUserCourses[userCourse.userId]) {
      allUserCourses[userCourse.userId] = [];
    }
    
    const userCourses = allUserCourses[userCourse.userId];
    const existingIndex = userCourses.findIndex((uc: UserCourse) => uc.id === userCourse.id);
    
    if (existingIndex >= 0) {
      userCourses[existingIndex] = userCourse;
    } else {
      userCourses.push(userCourse);
    }
    
    localStorage.setItem(STORAGE_KEYS.USER_COURSES, JSON.stringify(allUserCourses));
  }

  static deleteUserCourse(userId: string, courseId: string): void {
    if (typeof window === 'undefined') return;
    const allUserCourses = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_COURSES) || '{}');
    
    if (allUserCourses[userId]) {
      allUserCourses[userId] = allUserCourses[userId].filter((uc: UserCourse) => uc.courseId !== courseId);
      localStorage.setItem(STORAGE_KEYS.USER_COURSES, JSON.stringify(allUserCourses));
    }
  }

  // Theme management
  static getTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light';
    return localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark' || 'light';
  }

  static setTheme(theme: 'light' | 'dark'): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // Clear all data
  static clearAllData(): void {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

// Default courses data
export const DEFAULT_COURSES: Course[] = [
  // Core Computer Science Courses
  {
    id: 'cs-101',
    code: 'CSC 101',
    title: 'Introduction to Computer Science',
    description: 'Fundamentals of computer science, programming concepts, and problem-solving techniques.',
    category: 'Core',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    credits: 3,
    difficulty: 'Beginner',
    duration: 16,
    prerequisites: [],
    instructor: 'Dr. Johnson',
    schedule: 'MWF 9:00-10:00'
  },
  {
    id: 'cs-102',
    code: 'CSC 102',
    title: 'Data Structures and Algorithms',
    description: 'Advanced data structures, algorithm design, and complexity analysis.',
    category: 'Core',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    credits: 4,
    difficulty: 'Intermediate',
    duration: 16,
    prerequisites: ['CSC 101'],
    instructor: 'Prof. Smith',
    schedule: 'TTh 11:00-12:30'
  },
  {
    id: 'cs-201',
    code: 'CSC 201',
    title: 'Web Development',
    description: 'Modern web development with HTML, CSS, JavaScript, and frameworks.',
    category: 'Major',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    credits: 3,
    difficulty: 'Intermediate',
    duration: 16,
    prerequisites: ['CSC 101'],
    instructor: 'Dr. Wilson',
    schedule: 'MWF 2:00-3:00'
  },
  {
    id: 'cs-202',
    code: 'CSC 202',
    title: 'Database Systems',
    description: 'Database design, SQL, normalization, and database management systems.',
    category: 'Major',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    credits: 4,
    difficulty: 'Intermediate',
    duration: 16,
    prerequisites: ['CSC 102'],
    instructor: 'Dr. Brown',
    schedule: 'TTh 2:00-3:30'
  },
  {
    id: 'cs-301',
    code: 'CSC 301',
    title: 'Software Engineering',
    description: 'Software development lifecycle, project management, and team collaboration.',
    category: 'Major',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    credits: 4,
    difficulty: 'Advanced',
    duration: 16,
    prerequisites: ['CSC 102', 'CSC 201'],
    instructor: 'Prof. Davis',
    schedule: 'MWF 10:00-11:00'
  },
  {
    id: 'cs-302',
    code: 'CSC 302',
    title: 'Operating Systems',
    description: 'Operating system concepts, processes, memory management, and file systems.',
    category: 'Major',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    credits: 4,
    difficulty: 'Advanced',
    duration: 16,
    prerequisites: ['CSC 102'],
    instructor: 'Dr. Taylor',
    schedule: 'TTh 9:00-10:30'
  },
  {
    id: 'cs-401',
    code: 'CSC 401',
    title: 'Machine Learning',
    description: 'Introduction to machine learning algorithms, neural networks, and AI applications.',
    category: 'Major',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    credits: 4,
    difficulty: 'Advanced',
    duration: 16,
    prerequisites: ['CSC 102', 'MTH 201', 'STA 201'],
    instructor: 'Dr. Anderson',
    schedule: 'MWF 1:00-2:00'
  },
  // Mathematics Courses
  {
    id: 'mth-201',
    code: 'MTH 201',
    title: 'Calculus I',
    description: 'Differential and integral calculus with applications.',
    category: 'Core',
    department: 'Mathematics',
    school: 'School of Sciences',
    credits: 4,
    difficulty: 'Intermediate',
    duration: 16,
    prerequisites: [],
    instructor: 'Prof. Martinez',
    schedule: 'MWF 11:00-12:00'
  },
  {
    id: 'sta-201',
    code: 'STA 201',
    title: 'Statistics',
    description: 'Descriptive and inferential statistics with practical applications.',
    category: 'Core',
    department: 'Mathematics',
    school: 'School of Sciences',
    credits: 3,
    difficulty: 'Intermediate',
    duration: 16,
    prerequisites: ['MTH 201'],
    instructor: 'Dr. Lee',
    schedule: 'TTh 1:00-2:30'
  },
  // General Education
  {
    id: 'eng-101',
    code: 'ENG 101',
    title: 'Technical Writing',
    description: 'Professional and technical communication skills.',
    category: 'General',
    department: 'English',
    school: 'School of Liberal Arts',
    credits: 2,
    difficulty: 'Beginner',
    duration: 16,
    prerequisites: [],
    instructor: 'Prof. Johnson',
    schedule: 'MW 3:00-4:00'
  },
  {
    id: 'phy-101',
    code: 'PHY 101',
    title: 'Physics I',
    description: 'Mechanics, waves, and thermodynamics.',
    category: 'Core',
    department: 'Physics',
    school: 'School of Sciences',
    credits: 3,
    difficulty: 'Intermediate',
    duration: 16,
    prerequisites: ['MTH 201'],
    instructor: 'Dr. Wilson',
    schedule: 'MWF 8:00-9:00'
  },
  // Electives
  {
    id: 'art-101',
    code: 'ART 101',
    title: 'Digital Design',
    description: 'Introduction to digital art and design principles.',
    category: 'Elective',
    department: 'Art',
    school: 'School of Liberal Arts',
    credits: 2,
    difficulty: 'Beginner',
    duration: 16,
    prerequisites: [],
    instructor: 'Prof. Garcia',
    schedule: 'TTh 3:00-4:30'
  },
  {
    id: 'bus-101',
    code: 'BUS 101',
    title: 'Business Fundamentals',
    description: 'Basic principles of business and entrepreneurship.',
    category: 'Elective',
    department: 'Business',
    school: 'School of Business',
    credits: 3,
    difficulty: 'Beginner',
    duration: 16,
    prerequisites: [],
    instructor: 'Dr. Thompson',
    schedule: 'MW 4:00-5:30'
  }
];

// Initialize default data if not exists
export function initializeDefaultData(): void {
  if (typeof window === 'undefined') return;
  
  // Initialize courses if not exists
  if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
    StorageManager.saveCourses(DEFAULT_COURSES);
  }
  
  // Initialize theme if not exists
  if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
    StorageManager.setTheme('light');
  }
}
