'use client';

import React from 'react';
import { AcademicStats } from '@/types/academic';

interface StatisticsPanelProps {
  stats: AcademicStats;
}

export function StatisticsPanel({ stats }: StatisticsPanelProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Statistics by Level</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[100, 200, 300, 400].map(level => {
            const levelStats = stats.creditsByLevel[level];
            const avgGrade = stats.averageGradeByLevel[level];
            const completionRate = levelStats.total > 0 
              ? Math.round((levelStats.completed / levelStats.total) * 100) 
              : 0;

            return (
              <div 
                key={level}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  {level} Level
                </h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Credits:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {levelStats.completed}/{levelStats.total}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Completion:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {completionRate}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Avg Grade:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {avgGrade > 0 ? avgGrade.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                </div>
                
                {/* Mini Progress Bar */}
                <div className="mt-3">
                  <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-1.5">
                    <div 
                      className="bg-sky-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
