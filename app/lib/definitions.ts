// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// Course Checksheet Application Types

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  fullName: string;
  school: 'School of IT and Computing' | 'School of Engineering' | 'School of Business' | 'School of Sciences' | 'School of Liberal Arts';
  department: 'Information Security & Assurance' | 'Computer Science' | 'Data Science' | 'Software Engineering' | 'Information Systems' | 'Cybersecurity' | 'Mathematics' | 'English' | 'Research';
  degreeType?: string;
  catalog: '2018' | '2022';
  studentId: string;
};

export type Course = {
  id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  department: 'Information Security & Assurance' | 'Computer Science' | 'Data Science' | 'Software Engineering' | 'Information Systems' | 'Cyber Security' | 'Mathematics' | 'English' | 'Research';
  school?: 'School of IT and Computing' | 'School of Engineering' | 'School of Business' | 'School of Sciences' | 'School of Liberal Arts';
  catalog?: '2018' | '2022';
  duration: number; // in weeks
  credits?: number; // credit hours for the course
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  requirements?: string[];
  created_at: string;
  updated_at: string;
};

export type UserCourse = {
  id: string;
  user_id: string;
  course_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number; // percentage 0-100
  grade?: 'A+' | 'A' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'D' | 'E' | 'F' | null;
  semester?: 'Fall' | 'Spring' | null;
  year?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  notes?: string;
};

export type CourseWithProgress = Course & {
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  grade?: 'A+' | 'A' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'D' | 'E' | 'F' | null;
  semester?: 'Fall' | 'Spring' | null;
  year?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  notes?: string;
};

export type CourseCategory = {
  id: string;
  name: string;
  description: string;
  course_count: number;
};

export type DashboardStats = {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  notStartedCourses: number;
  creditsEarned: number;
  completionRate: number;
};

export type CourseForm = {
  id?: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
};

export type UserCourseForm = {
  course_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  notes?: string;
};
