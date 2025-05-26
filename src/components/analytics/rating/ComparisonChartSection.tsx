
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { RatingTrendChart } from '@/components/analytics/rating/RatingTrendChart';
import { RatingTrendData } from '@/hooks/rating/types';

interface ComparisonChartSectionProps {
  isLoading: boolean;
  channelComparisonData: RatingTrendData[];
  selectedComparisonYears: string[];
  channelFilter: string;
}

export const ComparisonChartSection: React.FC<ComparisonChartSectionProps> = ({
  isLoading,
  channelComparisonData,
  selectedComparisonYears,
  channelFilter
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Annual Rating Comparison</CardTitle>
          <CardDescription>Loading data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (channelComparisonData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Annual Rating Comparison</CardTitle>
          <CardDescription>No data available for the selected years</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            Try selecting different years or check if data exists
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <RatingTrendChart 
      data={channelComparisonData}
      years={selectedComparisonYears}
      channelFilter={channelFilter}
    />
  );
};
