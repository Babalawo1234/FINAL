'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthManager } from '@/app/lib/auth-new';
import { Button } from '@/app/components/ui/Button';
import { Input, Select } from '@/app/components/ui/Input';
import { Card } from '@/app/components/ui/Card';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    fullName: '',
    school: '',
    department: '',
    degreeType: '',
    catalog: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const result = await AuthManager.register(formData);
        if (result.success) {
          router.push('/dashboard');
        } else {
          setError(result.error || 'Registration failed');
        }
      } else {
        const result = await AuthManager.login(formData.email, formData.password);
        if (result.success) {
          router.push('/dashboard');
        } else {
          setError(result.error || 'Login failed');
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const schoolOptions = [
    'School of IT and Computing',
    'School of Engineering',
    'School of Business',
    'School of Sciences',
    'School of Liberal Arts'
  ];

  const departmentOptions: Record<string, string[]> = {
    'School of IT and Computing': [
      'Computer Science',
      'Information Systems',
      'Information Security & Assurance',
      'Data Science',
      'Software Engineering'
    ],
    'School of Engineering': [
      'Computer Engineering',
      'Software Engineering',
      'Electrical Engineering'
    ],
    'School of Business': [
      'Business Administration',
      'Information Systems',
      'Management'
    ],
    'School of Sciences': [
      'Mathematics',
      'Physics',
      'Chemistry',
      'Statistics'
    ],
    'School of Liberal Arts': [
      'English',
      'Communication',
      'Art',
      'History'
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4 shadow-lg">
            <AcademicCapIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isSignUp ? 'Join AUN Portal' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isSignUp ? 'Create your academic account' : 'Sign in to your account'}
          </p>
        </div>

        {/* Form */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              placeholder="your.email@aun.edu.ng"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              error={error && error.includes('email') ? error : undefined}
            />

            {/* Sign up fields */}
            {isSignUp && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Display Name"
                    placeholder="John"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                  <Input
                    label="Full Name"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    required
                  />
                </div>

                <Select
                  label="School"
                  value={formData.school}
                  onChange={(e) => {
                    handleInputChange('school', e.target.value);
                    handleInputChange('department', ''); // Reset department
                  }}
                  required
                >
                  <option value="">Select School</option>
                  {schoolOptions.map(school => (
                    <option key={school} value={school}>{school}</option>
                  ))}
                </Select>

                {formData.school && (
                  <Select
                    label="Department"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    required
                  >
                    <option value="">Select Department</option>
                    {departmentOptions[formData.school]?.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </Select>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Degree Type"
                    value={formData.degreeType}
                    onChange={(e) => handleInputChange('degreeType', e.target.value)}
                    required
                  >
                    <option value="">Select Degree</option>
                    <option value="Bachelor of Science">Bachelor of Science</option>
                    <option value="Bachelor of Arts">Bachelor of Arts</option>
                    <option value="Bachelor of Engineering">Bachelor of Engineering</option>
                    <option value="Bachelor of Business Administration">Bachelor of Business Administration</option>
                  </Select>

                  <Select
                    label="Catalog Year"
                    value={formData.catalog}
                    onChange={(e) => handleInputChange('catalog', e.target.value)}
                    required
                  >
                    <option value="">Select Catalog</option>
                    <option value="2022">2022 Catalog</option>
                    <option value="2023">2023 Catalog</option>
                    <option value="2024">2024 Catalog</option>
                  </Select>
                </div>
              </>
            )}

            {/* Password */}
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
            />

            {/* Error message */}
            {error && !error.includes('email') && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>

            {/* Toggle mode */}
            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setFormData({
                    email: '',
                    password: '',
                    name: '',
                    fullName: '',
                    school: '',
                    department: '',
                    degreeType: '',
                    catalog: ''
                  });
                }}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
