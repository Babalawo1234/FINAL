'use client';

import { PowerIcon } from '@heroicons/react/24/outline';

export default function SignOutButton() {
  const handleSignOut = () => {
    // Clear session, reset theme to light mode, and redirect to login
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      // Reset theme to light mode on signout
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      window.location.href = '/login';
    }
  };

  return (
    <button 
      onClick={handleSignOut}
      className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-red-500 dark:bg-red-600 p-3 text-sm font-medium text-white hover:bg-red-400 dark:hover:bg-red-500 md:flex-none md:justify-start md:p-2 md:px-3 transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <PowerIcon className="w-6" />
      <div className="hidden md:block">Sign Out</div>
    </button>
  );
}
