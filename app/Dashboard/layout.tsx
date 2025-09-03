'use client';

import React, { useEffect } from 'react';
import { Layout } from '@/app/components/layout/Layout';

export default function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  useEffect(() => {
    // Simple dark mode implementation using localStorage and system preference
    const initializeDarkMode = () => {
      const savedMode = localStorage.getItem('darkMode');
      const prefersDark = savedMode === 'true' || 
        (savedMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      if (prefersDark) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    };

    initializeDarkMode();
  }, []);

  return <Layout>{children}</Layout>;
}
