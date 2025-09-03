'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { Input, Select } from '@/app/components/ui/Input';
import { AuthManager } from '@/app/lib/auth-new';
import { CourseManager } from '@/app/lib/course-manager';
import { User, UserCourse, Course } from '@/app/lib/storage';
import { 
  UserIcon, 
  AcademicCapIcon, 
  IdentificationIcon, 
  UserCircleIcon, 
  ChartBarIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  CogIcon,
  ShieldCheckIcon,
  BellIcon,
  EyeIcon,
  DocumentTextIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const departments = [
  'Computer Science',
  'Data Science',
  'Software Engineering',
  'Information Systems',
  'Cybersecurity',
];

interface AcademicSettings {
  emailNotifications: boolean;
  gradeAlerts: boolean;
  deadlineReminders: boolean;
  progressReports: boolean;
  privacyMode: boolean;
}

interface ProfileStats {
  totalCourses: number;
  completedCourses: number;
  totalCredits: number;
  earnedCredits: number;
  currentGPA: number;
  semestersCompleted: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [profileStats, setProfileStats] = useState<ProfileStats>({
    totalCourses: 0,
    completedCourses: 0,
    totalCredits: 0,
    earnedCredits: 0,
    currentGPA: 0,
    semestersCompleted: 0
  });
  
  const [academicSettings, setAcademicSettings] = useState<AcademicSettings>({
    emailNotifications: true,
    gradeAlerts: true,
    deadlineReminders: true,
    progressReports: false,
    privacyMode: false
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    department: '',
    yearOfStudy: '',
    expectedGraduation: '',
    advisor: '',
    enrollmentStatus: 'active'
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      const currentUser = AuthManager.getCurrentUser();
      if (!currentUser) {
        setLoading(false);
        return;
      }

      setUser(currentUser);
      
      // Initialize form data
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        dateOfBirth: currentUser.dateOfBirth || '',
        address: currentUser.address || '',
        department: currentUser.department || '',
        yearOfStudy: currentUser.yearOfStudy || '',
        expectedGraduation: currentUser.expectedGraduation || '',
        advisor: currentUser.advisor || '',
        enrollmentStatus: currentUser.enrollmentStatus || 'active'
      });

      // Load profile statistics
      const userCourses = CourseManager.getUserCoursesWithProgress(currentUser.id);
      const completedCourses = userCourses.filter(c => c.status === 'completed');
      const totalCredits = userCourses.reduce((sum, c) => sum + c.credits, 0);
      const earnedCredits = completedCourses.reduce((sum, c) => sum + c.credits, 0);
      
      // Calculate GPA
      const coursesWithGrades = completedCourses.filter(c => c.grade);
      let gpa = 0;
      if (coursesWithGrades.length > 0) {
        const gradePoints: { [key: string]: number } = {
          'A+': 4.0, 'A': 4.0, 'A-': 3.7,
          'B+': 3.3, 'B': 3.0, 'B-': 2.7,
          'C+': 2.3, 'C': 2.0, 'C-': 1.7,
          'D+': 1.3, 'D': 1.0, 'F': 0.0
        };
        
        const totalPoints = coursesWithGrades.reduce((sum, course) => {
          return sum + (gradePoints[course.grade || 'F'] * course.credits);
        }, 0);
        
        gpa = totalPoints / earnedCredits;
      }

      setProfileStats({
        totalCourses: userCourses.length,
        completedCourses: completedCourses.length,
        totalCredits,
        earnedCredits,
        currentGPA: gpa,
        semestersCompleted: Math.ceil(completedCourses.length / 5) // Assuming 5 courses per semester
      });

      // Load settings from localStorage
      const savedSettings = localStorage.getItem(`profileSettings_${currentUser.id}`);
      if (savedSettings) {
        setAcademicSettings(JSON.parse(savedSettings));
      }

    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!user) return;

    try {
      // Update user data
      const updatedUser = {
        ...user,
        ...formData
      };

      // Save to localStorage (in a real app, this would be an API call)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: User) => u.id === user.id);
      if (userIndex >= 0) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }

      setUser(updatedUser);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const handleCancel = () => {
    if (!user) return;
    
    // Reset form data
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      dateOfBirth: user.dateOfBirth || '',
      address: user.address || '',
      department: user.department || '',
      yearOfStudy: user.yearOfStudy || '',
      expectedGraduation: user.expectedGraduation || '',
      advisor: user.advisor || '',
      enrollmentStatus: user.enrollmentStatus || 'active'
    });
    setIsEditing(false);
  };

  const handleSettingChange = (key: keyof AcademicSettings, value: boolean) => {
    const newSettings = { ...academicSettings, [key]: value };
    setAcademicSettings(newSettings);
    
    if (user) {
      localStorage.setItem(`profileSettings_${user.id}`, JSON.stringify(newSettings));
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <UserIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Not Logged In</h2>
          <p className="text-gray-600 dark:text-gray-400">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your personal information and academic settings</p>
        </div>
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <XMarkIcon className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                <CheckIcon className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Courses</p>
                <p className="text-2xl font-bold">{profileStats.totalCourses}</p>
              </div>
              <AcademicCapIcon className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Completed</p>
                <p className="text-2xl font-bold">{profileStats.completedCourses}</p>
              </div>
              <CheckIcon className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Current GPA</p>
                <p className="text-2xl font-bold">{profileStats.currentGPA.toFixed(2)}</p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Credits Earned</p>
                <p className="text-2xl font-bold">{profileStats.earnedCredits}</p>
              </div>
              <DocumentTextIcon className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'personal', name: 'Personal Info', icon: UserCircleIcon },
            { id: 'academic', name: 'Academic Info', icon: AcademicCapIcon },
            { id: 'settings', name: 'Settings', icon: CogIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'personal' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IdentificationIcon className="h-5 w-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={!isEditing}
              />
              <Input
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={!isEditing}
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
              />
              <Input
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
              />
              <Input
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                disabled={!isEditing}
              />
              <Input
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'academic' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AcademicCapIcon className="h-5 w-5 mr-2" />
              Academic Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                disabled={!isEditing}
                options={departments.map(dept => ({ value: dept, label: dept }))}
              />
              <Input
                label="Year of Study"
                value={formData.yearOfStudy}
                onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                disabled={!isEditing}
              />
              <Input
                label="Expected Graduation"
                value={formData.expectedGraduation}
                onChange={(e) => setFormData({ ...formData, expectedGraduation: e.target.value })}
                disabled={!isEditing}
              />
              <Input
                label="Academic Advisor"
                value={formData.advisor}
                onChange={(e) => setFormData({ ...formData, advisor: e.target.value })}
                disabled={!isEditing}
              />
              <Select
                label="Enrollment Status"
                value={formData.enrollmentStatus}
                onChange={(e) => setFormData({ ...formData, enrollmentStatus: e.target.value })}
                disabled={!isEditing}
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'graduated', label: 'Graduated' },
                  { value: 'suspended', label: 'Suspended' }
                ]}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'settings' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CogIcon className="h-5 w-5 mr-2" />
              Academic Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Notification Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <BellIcon className="h-5 w-5 mr-2" />
                  Notifications
                </h3>
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                    { key: 'gradeAlerts', label: 'Grade Alerts', desc: 'Get notified when grades are posted' },
                    { key: 'deadlineReminders', label: 'Deadline Reminders', desc: 'Receive reminders for upcoming deadlines' },
                    { key: 'progressReports', label: 'Progress Reports', desc: 'Receive weekly progress summaries' }
                  ].map(setting => (
                    <div key={setting.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{setting.label}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{setting.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={academicSettings[setting.key as keyof AcademicSettings]}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSettingChange(setting.key as keyof AcademicSettings, e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 mr-2" />
                  Privacy
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Privacy Mode</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Hide your profile from other students</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={academicSettings.privacyMode}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSettingChange('privacyMode', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
