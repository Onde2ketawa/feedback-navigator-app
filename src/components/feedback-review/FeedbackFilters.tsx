
import React from 'react';
import { FilterContainer } from '@/components/dashboard/filters/FilterContainer';
import { ChannelFilter } from '@/components/dashboard/filters/ChannelFilter';
import { TimeFilter } from '@/components/dashboard/filters/TimeFilter';
import { RatingFilter } from '@/components/dashboard/filters/RatingFilter';
import { useFilterOptions } from '@/hooks/useFilterOptions';

interface FeedbackFiltersProps {
  selectedChannel: string;
  selectedYear: string;
  selectedMonth: string;
  ratingRange: [number, number];
  onChannelChange: (channel: string) => void;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  onRatingChange: (range: [number, number]) => void;
}

export function FeedbackFilters({
  selectedChannel,
  selectedYear,
  selectedMonth,
  ratingRange,
  onChannelChange,
  onYearChange,
  onMonthChange,
  onRatingChange,
}: FeedbackFiltersProps) {
  const {
    availableChannels,
    availableYears,
    availableMonths,
    isLoading: isLoadingOptions,
    fetchMonthsForYear
  } = useFilterOptions();

  React.useEffect(() => {
    if (selectedYear !== 'all') {
      fetchMonthsForYear(selectedYear);
    }
  }, [selectedYear, fetchMonthsForYear]);

  return (
    <FilterContainer>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ChannelFilter
          selectedChannel={selectedChannel}
          onChannelChange={onChannelChange}
          availableChannels={availableChannels}
          isLoading={isLoadingOptions}
        />
        <TimeFilter
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onYearChange={onYearChange}
          onMonthChange={onMonthChange}
          availableYears={availableYears}
          availableMonths={availableMonths}
          isLoading={isLoadingOptions}
        />
        <RatingFilter
          ratingRange={ratingRange}
          onRatingChange={onRatingChange}
          isLoading={isLoadingOptions}
        />
      </div>
    </FilterContainer>
  );
}
