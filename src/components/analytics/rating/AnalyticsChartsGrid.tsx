
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { YearOverYearTrendChart } from '@/components/analytics/YearOverYearTrendChart';
import { MonthlyRatingTrendChart } from '@/components/analytics/MonthlyRatingTrendChart';
import { RatingDistributionChart } from '@/components/analytics/RatingDistributionChart';
import { CategoryRatingBarChart } from '@/components/analytics/category/CategoryRatingBarChart';
import { YoyTrendDataPoint, MonthlyRatingDataPoint } from '@/hooks/rating/types';

interface AnalyticsChartsGridProps {
  isLoading: boolean;
  yoyTrendData: YoyTrendDataPoint[];
  monthlyRatingData: MonthlyRatingDataPoint[];
  ratingDistributionData: Array<{
    rating: string;
    count: number;
    color: string;
  }>;
  categoryRatingData: any[];
  channelFilter: string;
  yearFilter: string;
}

export const AnalyticsChartsGrid: React.FC<AnalyticsChartsGridProps> = ({
  isLoading,
  yoyTrendData,
  monthlyRatingData,
  ratingDistributionData,
  categoryRatingData,
  channelFilter,
  yearFilter
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {isLoading ? (
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Year-over-Year Rating Trend</CardTitle>
            <CardDescription>Loading data...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <Skeleton className="h-full w-full" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <YearOverYearTrendChart 
          data={yoyTrendData} 
          channelFilter={channelFilter} 
          yearFilter={yearFilter} 
        />
      )}
      
      {isLoading ? (
        <Skeleton className="h-[400px] w-full" />
      ) : (
        <MonthlyRatingTrendChart data={monthlyRatingData} />
      )}
      
      {isLoading ? (
        <Skeleton className="h-[400px] w-full" />
      ) : (
        <RatingDistributionChart data={ratingDistributionData} />
      )}
      
      {isLoading ? (
        <Skeleton className="h-[400px] w-full" />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Category Ratings</CardTitle>
            <CardDescription>
              Average rating by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryRatingBarChart categoryRatings={categoryRatingData} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
