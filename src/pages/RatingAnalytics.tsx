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
import { RatingTrendData } from '@/hooks/rating/types';

const RatingAnalytics: React.FC = () => {
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
  
  const [selectedComparisonYears, setSelectedComparisonYears] = useState<string[]>(['2024', '2025']);
  
  const fetchComparisonData = useChannelComparisonData(selectedComparisonYears);
  const [channelComparisonData, setChannelComparisonData] = useState<RatingTrendData[]>([]);
  const [isLoadingComparison, setIsLoadingComparison] = useState(false);

  useEffect(() => {
    const getComparisonData = async () => {
      setIsLoadingComparison(true);
      try {
        console.log('Fetching comparison data for years:', selectedComparisonYears);
        const data = await fetchComparisonData();
        console.log('Received comparison data:', data);
        setChannelComparisonData(data);
      } catch (error) {
        console.error('Error fetching comparison data:', error);
      } finally {
        setIsLoadingComparison(false);
      }
    };
    getComparisonData();
  }, [selectedComparisonYears, fetchComparisonData]);

  React.useEffect(() => {
    fetchAverageRating();
  }, [channelFilter, yearFilter, monthFilter, fetchAverageRating]);
  
  const refreshAllData = () => {
    refreshData();
    fetchAverageRating();
    const refreshComparisonData = async () => {
      setIsLoadingComparison(true);
      try {
        const data = await fetchComparisonData();
        setChannelComparisonData(data);
      } catch (error) {
        console.error('Error refreshing comparison data:', error);
      } finally {
        setIsLoadingComparison(false);
      }
    };
    refreshComparisonData();
  };
  
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
          onClick={refreshAllData}
          disabled={isLoading || isLoadingComparison}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading || isLoadingComparison ? 'animate-spin' : ''}`} />
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
          availableYears={['2024', '2025']}
          selectedYears={selectedComparisonYears}
          onChange={setSelectedComparisonYears}
          maxSelections={2}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <AverageRatingCard rating={averageRating} />
      </div>

      <div className="mb-6">
        {isLoadingComparison ? (
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
        ) : channelComparisonData.length === 0 ? (
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
        ) : (
          <RatingTrendChart 
            data={channelComparisonData}
            years={selectedComparisonYears}
            channelFilter={channelFilter}
          />
        )}
      </div>

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
    </div>
  );
};

export default RatingAnalytics;
