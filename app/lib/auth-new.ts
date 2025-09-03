import { StorageManager, User } from './storage';
import bcrypt from 'bcryptjs';

export class AuthManager {
  static async register(userData: {
    email: string;
    password: string;
    name: string;
    fullName: string;
    school: string;
    department: string;
    degreeType: string;
    catalog: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Check if user already exists
      const existingUser = StorageManager.findUserByEmail(userData.email);
      if (existingUser) {
        return { success: false, error: 'User with this email already exists' };
      }

      // Validate email domain
      if (!userData.email.endsWith('@aun.edu.ng')) {
        return { success: false, error: 'Email must be a valid AUN email address' };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        name: userData.name,
        fullName: userData.fullName,
        school: userData.school,
        department: userData.department,
        degreeType: userData.degreeType,
        catalog: userData.catalog,
        studentId: this.generateStudentId(),
        createdAt: new Date().toISOString(),
        avatar: this.generateAvatar(userData.name)
      };

      // Save user
      StorageManager.saveUser(newUser);
      StorageManager.setCurrentUser(newUser);

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  }

  static async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const user = StorageManager.findUserByEmail(email);
      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Update last login
      user.lastLogin = new Date().toISOString();
      StorageManager.saveUser(user);
      StorageManager.setCurrentUser(user);

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }

  static logout(): void {
    try {
      // Clear current user session
      StorageManager.setCurrentUser(null);
      
      // Clear any cached data
      const currentUser = StorageManager.getCurrentUser();
      if (currentUser) {
        // Clear user-specific cached data
        localStorage.removeItem(`dashboardStats_${currentUser.id}`);
        localStorage.removeItem(`recentActivity_${currentUser.id}`);
        localStorage.removeItem(`appSettings_${currentUser.id}`);
      }
      
      // Clear session storage
      sessionStorage.clear();
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if there's an error
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }

  static getCurrentUser(): User | null {
    return StorageManager.getCurrentUser();
  }

  static isAuthenticated(): boolean {
    return StorageManager.getCurrentUser() !== null;
  }

  private static generateStudentId(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `AUN/${year}/${random}`;
  }

  private static generateAvatar(name: string): string {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=4f46e5&color=fff&size=128`;
  }
}

// Session management hook
export function useAuth() {
  const user = AuthManager.getCurrentUser();
  const isAuthenticated = AuthManager.isAuthenticated();

  return {
    user,
    isAuthenticated,
    login: AuthManager.login,
    register: AuthManager.register,
    logout: AuthManager.logout
  };
}
