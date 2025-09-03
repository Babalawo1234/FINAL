'use client';

import Link from 'next/link';
import { Button } from '@/app/components/ui/Button';
import { 
  AcademicCapIcon, 
  ChartBarIcon, 
  BookOpenIcon, 
  UserGroupIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-sky-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">AcademicHub</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Academic Journey
            <span className="block text-sky-600">Simplified</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Track your courses, monitor progress, and achieve your academic goals with our comprehensive dashboard platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button variant="primary" className="text-lg px-8 py-3">
                Start Your Journey
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="text-lg px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <ChartBarIcon className="h-12 w-12 text-sky-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
            <p className="text-gray-600">Monitor your academic progress with detailed analytics and GPA calculations.</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <BookOpenIcon className="h-12 w-12 text-sky-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Course Management</h3>
            <p className="text-gray-600">Organize your courses, assignments, and academic schedule in one place.</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <UserGroupIcon className="h-12 w-12 text-sky-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Academic Planning</h3>
            <p className="text-gray-600">Plan your academic path with course recommendations and degree requirements.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <AcademicCapIcon className="h-6 w-6 text-sky-400" />
            <span className="ml-2 text-lg font-semibold">AcademicHub</span>
          </div>
          <p className="text-gray-400">© 2024 AcademicHub. Empowering students worldwide.</p>
        </div>
      </footer>
    </div>
  );
}