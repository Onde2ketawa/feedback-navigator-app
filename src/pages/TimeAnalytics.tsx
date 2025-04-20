
import React, { useState, useEffect } from 'react';
import { FilterControls } from '@/components/analytics/FilterControls';
import { TimeDistributionChart } from '@/components/analytics/time/TimeDistributionChart';
import { CategoryTimeDistribution } from '@/components/analytics/time/CategoryTimeDistribution';
import { DeviceTimeDistribution } from '@/components/analytics/time/DeviceTimeDistribution'; 
import { HourlyDistributionChart } from '@/components/analytics/time/HourlyDistributionChart';
import { useTimeAnalyticsData } from '@/hooks/time/useTimeAnalyticsData';

export default function TimeAnalytics() {
  // Filter state
  const [channelFilter, setChannelFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');

  // Get time analytics data
  const { 
    monthlyDistribution,
    dailyDistribution,
    hourlyDistribution,
    categoryTimeData,
    deviceTimeData,
    isLoading,
    error
  } = useTimeAnalyticsData(channelFilter, yearFilter, monthFilter);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Time Analytics</h1>
      
      {/* Filter Controls */}
      <FilterControls
        channelFilter={channelFilter}
        setChannelFilter={setChannelFilter}
        yearFilter={yearFilter}
        setYearFilter={setYearFilter}
        monthFilter={monthFilter}
        setMonthFilter={setMonthFilter}
      />
      
      {/* Loading and Error States */}
      {isLoading && (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading time analytics...</span>
        </div>
      )}

      {error && (
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md mb-6">
          Failed to load time analytics: {error.message}
        </div>
      )}

      {!isLoading && !error && (
        <div className="space-y-8">
          {/* Monthly Distribution */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-medium mb-4">Monthly Feedback Distribution</h2>
            <TimeDistributionChart 
              data={monthlyDistribution} 
              timeUnit="month" 
            />
          </div>
          
          {/* Daily Distribution when a month is selected */}
          {monthFilter !== 'all' && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-medium mb-4">Daily Feedback Distribution</h2>
              <TimeDistributionChart 
                data={dailyDistribution} 
                timeUnit="day" 
              />
            </div>
          )}
          
          {/* Hourly Distribution */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-medium mb-4">Hourly Feedback Distribution</h2>
            <HourlyDistributionChart data={hourlyDistribution} />
          </div>
          
          {/* Category Distribution by Time */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-medium mb-4">Category Distribution by Time</h2>
            <CategoryTimeDistribution data={categoryTimeData} />
          </div>
          
          {/* Device Distribution by Time */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-medium mb-4">Device Distribution by Time</h2>
            <DeviceTimeDistribution data={deviceTimeData} />
          </div>
        </div>
      )}
    </div>
  );
}
