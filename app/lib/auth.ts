// Database-integrated authentication for course checksheet app
import { User } from './definitions';

// Dummy users for demonstration
const DUMMY_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@aun.edu.ng',
    password: 'password123',
    fullName: 'John Michael Doe',
    school: 'School of IT and Computing',
    department: 'Information Security & Assurance',
    catalog: '2022',
    studentId: 'AUN/2024/001',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@aun.edu.ng',
    password: 'password123',
    fullName: 'Jane Elizabeth Smith',
    school: 'School of IT and Computing',
    department: 'Computer Science',
    catalog: '2022',
    studentId: 'AUN/2024/002',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@aun.edu.ng',
    password: 'password123',
    fullName: 'Michael Robert Johnson',
    school: 'School of IT and Computing',
    department: 'Data Science',
    catalog: '2018',
    studentId: 'AUN/2024/003',
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@aun.edu.ng',
    password: 'password123',
    fullName: 'Sarah Anne Wilson',
    school: 'School of IT and Computing',
    department: 'Information Security & Assurance',
    catalog: '2018',
    studentId: 'AUN/2024/004',
  }
];

export async function loginUser(email: string, password: string): Promise<User | null> {
  try {
    if (typeof window !== 'undefined') {
      // Check localStorage for existing users
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const user = existingUsers.find((u: User) => 
        u.email === email.toLowerCase() && u.password === password
      );
      
      if (user) {
        // Set as current user
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
      } else {
        throw new Error('Invalid email or password');
      }
    }
    
    throw new Error('Login failed');
  } catch (error) {
    console.error('Error in loginUser:', error);
    throw error;
  }
}

export async function createUser(
  email: string, 
  password: string, 
  name: string, 
  fullName: string, 
  school: 'School of IT and Computing' | 'School of Engineering' | 'School of Business', 
  department: 'Information Security & Assurance' | 'Computer Science' | 'Data Science' | 'Software Engineering' | 'Information Systems' | 'Cybersecurity', 
  degreeType: string,
  catalog: '2018' | '2022'
): Promise<User | null> {
  try {
    // Create user locally in localStorage
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: email.toLowerCase(),
      password, // In real app, this should be hashed
      name,
      fullName,
      school,
      department,
      catalog,
      studentId: `AUN/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
    };
    
    // Store user in persistent localStorage
    if (typeof window !== 'undefined') {
      // Save to users registry
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user already exists
      const userExists = existingUsers.find((u: User) => u.email === email.toLowerCase());
      if (userExists) {
        throw new Error('User with this email already exists');
      }
      
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));
      
      // Set as current user
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      // Initialize empty user courses for this user
      const userCoursesData = JSON.parse(localStorage.getItem('userCourses') || '{}');
      userCoursesData[newUser.id] = [];
      localStorage.setItem('userCourses', JSON.stringify(userCoursesData));
    }
    
    return newUser;
  } catch (error) {
    console.error('Error in createUser:', error);
    throw error;
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Session management using localStorage (client-side only)
export const sessionManager = {
  setUser(user: User) {
    if (typeof window !== 'undefined') {
      console.log('[Session] Setting user:', { id: user.id, email: user.email });
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Set default theme to light when user logs in
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  },

  getUser(): User | null {
    if (typeof window === 'undefined') {
      console.log('[Session] Running on server, returning null');
      return null;
    }
    
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) {
      console.log('[Session] No user found in localStorage');
      return null;
    }
    
    try {
      const user = JSON.parse(userJson);
      console.log('[Session] Retrieved user:', { id: user?.id, email: user?.email });
      return user;
    } catch (error) {
      console.error('[Session] Error parsing user from localStorage:', error);
      return null;
    }
  },

  clearUser() {
    if (typeof window !== 'undefined') {
      console.log('[Session] Clearing user session');
      localStorage.removeItem('currentUser');
      // Reset theme to light when user logs out
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
};
