'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AuthManager } from '@/app/lib/auth-new';
import { initializeDefaultData } from '@/app/lib/storage';

interface LayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Initialize default data
    initializeDefaultData();

    // Check authentication
    const currentUser = AuthManager.getCurrentUser();
    if (!currentUser && !pathname.includes('/login')) {
      router.push('/login');
      return;
    }

    setUser(currentUser);
  }, [pathname, router]);

  const handleLogout = () => {
    AuthManager.logout();
    router.push('/login');
  };

  // Don't render layout for login page
  if (pathname.includes('/login')) {
    return <>{children}</>;
  }

  // Don't render if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        user={user}
      />
      
      <div className="flex-1 lg:ml-64 transition-all duration-300 ease-in-out flex flex-col">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
        />
        
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
