'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { Input, Select } from '@/app/components/ui/Input';
import { AuthManager } from '@/app/lib/auth-new';
import { User } from '@/app/lib/storage';
import { DataExportManager } from '@/app/lib/data-export';
import { 
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  GlobeAltIcon,
  KeyIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  gradeAlerts: boolean;
  deadlineReminders: boolean;
  weeklyReports: boolean;
  dataCollection: boolean;
  analytics: boolean;
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'system',
    language: 'en',
    timezone: 'UTC',
    emailNotifications: true,
    pushNotifications: true,
    gradeAlerts: true,
    deadlineReminders: true,
    weeklyReports: false,
    dataCollection: true,
    analytics: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = () => {
    try {
      const currentUser = AuthManager.getCurrentUser();
      if (!currentUser) {
        setLoading(false);
        return;
      }

      setUser(currentUser);
      
      // Load settings from localStorage
      const savedSettings = localStorage.getItem(`appSettings_${currentUser.id}`);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: keyof AppSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    if (user) {
      localStorage.setItem(`appSettings_${user.id}`, JSON.stringify(newSettings));
    }
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      const defaultSettings: AppSettings = {
        theme: 'system',
        language: 'en',
        timezone: 'UTC',
        emailNotifications: true,
        pushNotifications: true,
        gradeAlerts: true,
        deadlineReminders: true,
        weeklyReports: false,
        dataCollection: true,
        analytics: false
      };
      setSettings(defaultSettings);
      
      if (user) {
        localStorage.setItem(`appSettings_${user.id}`, JSON.stringify(defaultSettings));
      }
      
      alert('Settings reset to default values');
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      if (confirm('This will permanently delete all your data. Type "DELETE" to confirm.')) {
        // In a real app, this would call an API to delete the account
        alert('Account deletion is not implemented in this demo');
      }
    }
  };

  const handleExportJSON = () => {
    DataExportManager.downloadAsJSON();
  };

  const handleExportCSV = () => {
    DataExportManager.downloadAsCSV();
  };

  const handleGenerateTranscript = () => {
    DataExportManager.generateTranscript();
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        const success = DataExportManager.importUserData(jsonData);
        if (success) {
          alert('Data imported successfully!');
          window.location.reload();
        } else {
          alert('Failed to import data. Please check the file format.');
        }
      } catch (error) {
        alert('Invalid file format.');
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <CogIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Not Logged In</h2>
          <p className="text-gray-600 dark:text-gray-400">Please log in to access settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your application preferences and account settings</p>
      </div>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle>
            <PaintBrushIcon className="h-5 w-5 mr-2 text-purple-600 inline" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <Select
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'system', label: 'System' }
                ]}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <Select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Spanish' },
                  { value: 'fr', label: 'French' },
                  { value: 'de', label: 'German' }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timezone
              </label>
              <Select
                value={settings.timezone}
                onChange={(e) => handleSettingChange('timezone', e.target.value)}
                options={[
                  { value: 'UTC', label: 'UTC' },
                  { value: 'America/New_York', label: 'Eastern Time' },
                  { value: 'America/Chicago', label: 'Central Time' },
                  { value: 'America/Denver', label: 'Mountain Time' },
                  { value: 'America/Los_Angeles', label: 'Pacific Time' }
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>
            <BellIcon className="h-5 w-5 mr-2 text-blue-600 inline" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
              { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive browser push notifications' },
              { key: 'gradeAlerts', label: 'Grade Alerts', desc: 'Get notified when grades are posted' },
              { key: 'deadlineReminders', label: 'Deadline Reminders', desc: 'Receive reminders for upcoming deadlines' },
              { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Receive weekly progress summaries' }
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
                    checked={settings[setting.key as keyof AppSettings] as boolean}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSettingChange(setting.key as keyof AppSettings, e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>
            <ShieldCheckIcon className="h-5 w-5 mr-2 text-green-600 inline" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { key: 'dataCollection', label: 'Data Collection', desc: 'Allow collection of usage data to improve the app' },
              { key: 'analytics', label: 'Analytics', desc: 'Share anonymous analytics data' }
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
                    checked={settings[setting.key as keyof AppSettings] as boolean}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSettingChange(setting.key as keyof AppSettings, e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>
            <DocumentArrowDownIcon className="h-5 w-5 mr-2 text-blue-600 inline" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Export as JSON</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Download all your data in JSON format</p>
                <Button variant="outline" onClick={handleExportJSON} className="w-full">
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
              </div>

              <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Export as CSV</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Download course data in CSV format</p>
                <Button variant="outline" onClick={handleExportCSV} className="w-full">
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>

              <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Generate Transcript</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Create official academic transcript</p>
                <Button variant="primary" onClick={handleGenerateTranscript} className="w-full">
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Transcript
                </Button>
              </div>
            </div>

            <div className="p-4 border border-blue-200 dark:border-blue-600 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Import Data</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">Import academic data from JSON file</p>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Management */}
      <Card>
        <CardHeader>
          <CardTitle>
            <KeyIcon className="h-5 w-5 mr-2 text-red-600 inline" />
            Account Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Reset Settings</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Reset all settings to their default values</p>
              </div>
              <Button variant="outline" onClick={handleResetSettings}>
                Reset
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-600 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div>
                <h3 className="font-medium text-red-900 dark:text-red-300">Delete Account</h3>
                <p className="text-sm text-red-600 dark:text-red-400">Permanently delete your account and all data</p>
              </div>
              <Button variant="danger" onClick={handleDeleteAccount}>
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
