
import React, { useState } from 'react';
import { FilterControls } from '@/components/analytics/FilterControls';
import { DeviceDistributionChart } from '@/components/analytics/device/DeviceDistributionChart';
import { DeviceCategoryComparison } from '@/components/analytics/device/DeviceCategoryComparison';
import { DeviceRatingComparison } from '@/components/analytics/device/DeviceRatingComparison';
import { useDeviceAnalyticsData } from '@/hooks/device/useDeviceAnalyticsData';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';

export default function DeviceAnalytics() {
  const [channelFilter, setChannelFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('2025'); // Changed from 'all' to '2025'
  const [monthFilter, setMonthFilter] = useState('all');

  const {
    data,
    isLoading,
    error
  } = useDeviceAnalyticsData(channelFilter, yearFilter, monthFilter);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Device Analytics" 
        description="Analyze feedback patterns across different devices"
      />
      
      <FilterControls
        channelFilter={channelFilter}
        setChannelFilter={setChannelFilter}
        yearFilter={yearFilter}
        setYearFilter={setYearFilter}
        monthFilter={monthFilter}
        setMonthFilter={setMonthFilter}
      />
      
      {isLoading && (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading device analytics...</span>
        </div>
      )}

      {error && (
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md mb-6">
          Failed to load device analytics: {error.message}
        </div>
      )}

      {!isLoading && !error && data && (
        <div className="grid grid-cols-1 gap-6">
          <Card className="p-6 lg:p-8">
            <h2 className="text-xl font-semibold mb-6">Feedback Distribution by Device</h2>
            <DeviceDistributionChart data={data.deviceDistribution} />
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Device Usage by Category</h2>
            <DeviceCategoryComparison data={data.deviceCategoryData} />
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Average Rating by Device</h2>
            <DeviceRatingComparison data={data.deviceRatingData} />
          </Card>
        </div>
      )}
    </div>
  );
}
