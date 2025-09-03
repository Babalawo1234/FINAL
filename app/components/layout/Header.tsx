'use client';

import React from 'react';
import { Button } from '../ui/Button';
import {
  Bars3Icon,
  SunIcon,
  MoonIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { StorageManager } from '@/app/lib/storage';
// Removed DarkModeContext import

interface HeaderProps {
  onMenuClick: () => void;
  user: any;
}

export function Header({ onMenuClick, user }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [notifications] = React.useState(3); // Mock notifications

  React.useEffect(() => {
    // Check current dark mode state
    const checkDarkMode = () => {
      const hasDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(hasDark);
    };
    
    checkDarkMode();
    
    // Listen for changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 h-16 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 lg:px-6 h-full w-full">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Bars3Icon className="h-6 w-6" />
          </Button>
          
          <div className="hidden sm:block">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Academic Dashboard
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="relative"
          >
            {isDarkMode ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative"
          >
            <BellIcon className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </Button>

          {/* User avatar */}
          <div className="flex items-center space-x-2">
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0ea5e9&color=fff`}
              alt={user?.name}
              className="h-8 w-8 rounded-full"
            />
            <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
              {user?.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
