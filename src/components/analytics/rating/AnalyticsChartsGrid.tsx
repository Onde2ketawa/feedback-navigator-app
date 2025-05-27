
import React from 'react';
import { YearOverYearTrendChart } from '@/components/analytics/YearOverYearTrendChart';
import { RatingDistributionChart } from '@/components/analytics/RatingDistributionChart';
import { CategoryRatingBarChart } from '@/components/analytics/category/CategoryRatingBarChart';
import { YoyTrendDataPoint, RatingDistributionDataPoint, CategoryRatingDataPoint } from '@/hooks/rating/types';

interface AnalyticsChartsGridProps {
  isLoading: boolean;
  yoyTrendData: YoyTrendDataPoint[];
  ratingDistributionData: RatingDistributionDataPoint[];
  categoryRatingData: CategoryRatingDataPoint[];
  channelFilter: string;
  yearFilter: string;
}

export const AnalyticsChartsGrid: React.FC<AnalyticsChartsGridProps> = ({
  isLoading,
  yoyTrendData,
  ratingDistributionData,
  categoryRatingData,
  channelFilter,
  yearFilter
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="animate-pulse bg-gray-200 h-80 rounded-lg"></div>
        <div className="animate-pulse bg-gray-200 h-80 rounded-lg"></div>
        <div className="animate-pulse bg-gray-200 h-80 rounded-lg lg:col-span-2"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <YearOverYearTrendChart data={yoyTrendData} />
      <RatingDistributionChart data={ratingDistributionData} />
      <div className="lg:col-span-2">
        <CategoryRatingBarChart 
          data={categoryRatingData}
          channelFilter={channelFilter}
          yearFilter={yearFilter}
        />
      </div>
    </div>
  );
};
