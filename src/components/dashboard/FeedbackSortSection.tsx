
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FeedbackFilter } from '@/hooks/useFeedbackData';
import { useFilterOptions } from '@/hooks/useFilterOptions';
import { ChannelFilter } from './filters/ChannelFilter';
import { TimeFilter } from './filters/TimeFilter';
import { RatingFilter } from './filters/RatingFilter';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface SortSectionProps {
  onFilterChange: (filters: FeedbackFilter) => void;
}

export const FeedbackSortSection: React.FC<SortSectionProps> = ({ onFilterChange }) => {
  const { toast } = useToast();
  const { 
    availableChannels, 
    availableYears, 
    availableMonths,
    fetchMonthsForYear,
    isLoading,
    isLoadingMonths,
    error,
    monthsError
  } = useFilterOptions();
  
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [ratingRange, setRatingRange] = useState<number[]>([1, 5]);
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);

  // Fetch months when year changes
  useEffect(() => {
    if (selectedYear !== 'all') {
      console.log("Fetching months for year:", selectedYear);
      fetchMonthsForYear(selectedYear);
    }
  }, [selectedYear, fetchMonthsForYear]);

  const handleChannelChange = (value: string) => {
    console.log("Channel changed to:", value);
    setSelectedChannel(value);
  };

  const handleYearChange = (value: string) => {
    console.log("Year changed to:", value);
    setSelectedYear(value);
    setSelectedMonth('all'); // Reset month when year changes
  };

  const handleMonthChange = (value: string) => {
    console.log("Month changed to:", value);
    setSelectedMonth(value);
  };

  // Apply filters with loading state
  const applyFilters = () => {
    setIsApplyingFilters(true);
    
    // Prepare filter object
    const filters: FeedbackFilter = {
      channel: selectedChannel === 'all' ? null : selectedChannel,
      year: selectedYear === 'all' ? null : selectedYear,
      month: selectedMonth === 'all' ? null : selectedMonth,
      ratingMin: ratingRange[0],
      ratingMax: ratingRange[1]
    };
    
    console.log("Applying filters:", filters);
    
    // Apply filters with a small delay to show loading state
    setTimeout(() => {
      onFilterChange(filters);
      setIsApplyingFilters(false);
      
      // Show toast notification
      toast({
        title: "Filters Applied",
        description: "The feedback list has been updated based on your filters."
      });
    }, 300);
  };

  // Retry loading if there was an error
  const handleRetry = () => {
    window.location.reload();
  };

  // If there's a critical error that prevents filters from working
  if (error && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Filter Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex flex-col space-y-2">
              <p>Error loading filters: {error.message}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="self-start" 
                onClick={handleRetry}
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Filter Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Feedback</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ChannelFilter 
          availableChannels={availableChannels}
          selectedChannel={selectedChannel}
          onChannelChange={handleChannelChange}
          isLoading={isLoading}
          error={error}
        />

        <TimeFilter 
          availableYears={availableYears}
          availableMonths={availableMonths}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onYearChange={handleYearChange}
          onMonthChange={handleMonthChange}
          isLoading={isLoading}
          isLoadingMonths={isLoadingMonths}
          error={monthsError}
        />

        <RatingFilter 
          ratingRange={ratingRange}
          onRatingChange={setRatingRange}
          isLoading={isLoading}
          error={error}
        />

        <Button 
          onClick={applyFilters} 
          className="w-full mt-4"
          disabled={isApplyingFilters}
        >
          {isApplyingFilters ? (
            <>
              <Skeleton className="h-4 w-4 rounded-full mr-2" /> 
              Applying...
            </>
          ) : (
            'Apply Filters'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
