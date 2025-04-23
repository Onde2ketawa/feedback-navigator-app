
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { FilterControls } from '@/components/analytics/FilterControls';
import { YearOverYearTrendChart } from '@/components/analytics/YearOverYearTrendChart';
import { MonthlyRatingTrendChart } from '@/components/analytics/MonthlyRatingTrendChart';
import { RatingDistributionChart } from '@/components/analytics/RatingDistributionChart';
import { useRatingAnalyticsData } from '@/hooks/rating/useRatingAnalyticsData';
import { CategoryRatingBarChart } from '@/components/analytics/category/CategoryRatingBarChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { AverageRatingCard } from '@/components/analytics/rating/AverageRatingCard';
import { useAverageRating } from '@/hooks/rating/useAverageRating';
import { useChannelFilter } from '@/hooks/useChannelFilter';
import { RatingTrendChart } from '@/components/analytics/rating/RatingTrendChart';
import { YearFilter } from '@/components/analytics/YearFilter';
import { useChannelComparisonData } from '@/hooks/rating/useChannelComparisonData';
import { useFeedbackData } from '@/hooks/useFeedbackData';

const RatingAnalytics: React.FC = () => {
  // Get channel filter from useChannelFilter hook
  const {
    channelFilter,
    setChannelFilter,
    availableChannels,
    isLoading: isLoadingChannels
  } = useChannelFilter();

  const {
    yearFilter, 
    setYearFilter,
    monthFilter,
    setMonthFilter,
    isLoading,
    yoyTrendData,
    ratingDistributionData,
    monthlyRatingData,
    categoryRatingData,
    refreshData
  } = useRatingAnalyticsData();

  const { 
    averageRating, 
    fetchAverageRating 
  } = useAverageRating(channelFilter, yearFilter, monthFilter);
  
  // Year comparison feature
  const [selectedComparisonYears, setSelectedComparisonYears] = useState<string[]>(['2023', '2024']);
  const availableYears = ['2020', '2021', '2022', '2023', '2024'];

  // Get all feedback data for channel comparison chart
  const { data: feedbackData } = useFeedbackData({ 
    channel: null,
    year: null,
    month: null,
    ratingMin: 1,
    ratingMax: 5
  });

  // Process data for channel comparison chart
  const channelComparisonData = useChannelComparisonData(feedbackData, selectedComparisonYears);

  React.useEffect(() => {
    fetchAverageRating();
  }, [channelFilter, yearFilter, monthFilter, fetchAverageRating]);
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center">
        <PageHeader 
          title="Rating Analytics" 
          description="Analyze rating trends and distributions over time"
        />
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => {
            refreshData();
            fetchAverageRating();
          }}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <FilterControls
          channelFilter={channelFilter}
          setChannelFilter={setChannelFilter}
          yearFilter={yearFilter}
          setYearFilter={setYearFilter}
          monthFilter={monthFilter}
          setMonthFilter={setMonthFilter}
        />
        
        <YearFilter 
          availableYears={availableYears}
          selectedYears={selectedComparisonYears}
          onChange={setSelectedComparisonYears}
          maxSelections={3}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <AverageRatingCard rating={averageRating} />
      </div>

      {/* Channel Comparison Chart */}
      <div className="mb-6">
        <RatingTrendChart 
          data={channelComparisonData}
          years={selectedComparisonYears}
          channelFilter={channelFilter}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* YoY Rating Trend */}
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
        
        {/* Monthly Rating Trend */}
        {isLoading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : (
          <MonthlyRatingTrendChart data={monthlyRatingData} />
        )}
        
        {/* Rating Distribution */}
        {isLoading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : (
          <RatingDistributionChart data={ratingDistributionData} />
        )}
        
        {/* Category Rating */}
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
    </div>
  );
};

export default RatingAnalytics;
