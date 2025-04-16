
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { FilterControls } from '@/components/analytics/FilterControls';
import { YearOverYearTrendChart } from '@/components/analytics/YearOverYearTrendChart';
import { MonthlyRatingTrendChart } from '@/components/analytics/MonthlyRatingTrendChart';
import { RatingDistributionChart } from '@/components/analytics/RatingDistributionChart';
import { useRatingAnalyticsData } from '@/hooks/rating/useRatingAnalyticsData';

const RatingAnalytics: React.FC = () => {
  const {
    channelFilter,
    setChannelFilter,
    yearFilter, 
    setYearFilter,
    monthFilter,
    setMonthFilter,
    yoyTrendData,
    ratingDistributionData
  } = useRatingAnalyticsData();
  
  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Rating Analytics" 
        description="Analyze rating trends and distributions over time"
      />
      
      <FilterControls
        channelFilter={channelFilter}
        setChannelFilter={setChannelFilter}
        yearFilter={yearFilter}
        setYearFilter={setYearFilter}
        monthFilter={monthFilter}
        setMonthFilter={setMonthFilter}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* YoY Rating Trend */}
        <YearOverYearTrendChart 
          data={yoyTrendData} 
          channelFilter={channelFilter} 
          yearFilter={yearFilter} 
        />
        
        {/* Monthly Rating Trend */}
        <MonthlyRatingTrendChart />
        
        {/* Rating Distribution */}
        <RatingDistributionChart data={ratingDistributionData} />
      </div>
    </div>
  );
};

export default RatingAnalytics;
