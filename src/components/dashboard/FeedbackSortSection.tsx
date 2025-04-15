
import React, { useEffect } from 'react';
import { FeedbackFilter } from '@/hooks/useFeedbackData';
import { useFilterOptions } from '@/hooks/useFilterOptions';
import { ChannelFilter } from './filters/ChannelFilter';
import { TimeFilter } from './filters/TimeFilter';
import { RatingFilter } from './filters/RatingFilter';
import { ApplyFiltersButton } from './filters/ApplyFiltersButton';
import { FilterContainer } from './filters/FilterContainer';
import { FilterErrorMessage } from './filters/FilterErrorMessage';
import { LoadingFilterSkeleton } from './filters/LoadingFilterSkeleton';
import { useFilterState } from './filters/useFilterState';
import { Separator } from '@/components/ui/separator';

interface SortSectionProps {
  onFilterChange: (filters: FeedbackFilter) => void;
}

export const FeedbackSortSection: React.FC<SortSectionProps> = ({ onFilterChange }) => {
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
  
  const {
    selectedChannel,
    selectedYear,
    selectedMonth,
    ratingRange,
    isApplyingFilters,
    handleChannelChange,
    handleYearChange,
    handleMonthChange,
    handleResetTimeFilters,
    setRatingRange,
    applyFilters
  } = useFilterState();

  // Logging for debugging
  useEffect(() => {
    console.log('Available years in FeedbackSortSection:', availableYears);
  }, [availableYears]);

  // Fetch months when year changes
  useEffect(() => {
    if (selectedYear !== 'all') {
      console.log("Fetching months for year:", selectedYear);
      fetchMonthsForYear(selectedYear);
    }
  }, [selectedYear, fetchMonthsForYear]);

  // Retry loading if there was an error
  const handleRetry = () => {
    window.location.reload();
  };

  // If there's a critical error that prevents filters from working
  if (error && !isLoading) {
    return (
      <FilterContainer>
        <FilterErrorMessage error={error} onRetry={handleRetry} />
      </FilterContainer>
    );
  }

  if (isLoading) {
    return (
      <FilterContainer>
        <LoadingFilterSkeleton />
      </FilterContainer>
    );
  }

  const handleApplyFilters = () => {
    applyFilters(onFilterChange);
  };

  return (
    <FilterContainer>
      <ChannelFilter 
        availableChannels={availableChannels}
        selectedChannel={selectedChannel}
        onChannelChange={handleChannelChange}
        isLoading={isLoading}
        error={error}
      />

      <Separator className="my-4" />

      <TimeFilter 
        availableYears={availableYears}
        availableMonths={availableMonths}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onYearChange={handleYearChange}
        onMonthChange={handleMonthChange}
        onReset={handleResetTimeFilters}
        isLoading={isLoading}
        isLoadingMonths={isLoadingMonths}
        error={monthsError}
      />

      <Separator className="my-4" />

      <RatingFilter 
        ratingRange={ratingRange}
        onRatingChange={setRatingRange}
        isLoading={isLoading}
        error={error}
      />

      <ApplyFiltersButton 
        onClick={handleApplyFilters}
        isLoading={isApplyingFilters}
      />
    </FilterContainer>
  );
};
