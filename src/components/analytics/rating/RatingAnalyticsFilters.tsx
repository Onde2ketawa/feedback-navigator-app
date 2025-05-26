
import React from 'react';
import { FilterControls } from '@/components/analytics/FilterControls';
import { YearFilter } from '@/components/analytics/YearFilter';

interface RatingAnalyticsFiltersProps {
  channelFilter: string;
  setChannelFilter: (value: string) => void;
  yearFilter: string;
  setYearFilter: (value: string) => void;
  monthFilter: string;
  setMonthFilter: (value: string) => void;
  selectedComparisonYears: string[];
  setSelectedComparisonYears: (years: string[]) => void;
}

export const RatingAnalyticsFilters: React.FC<RatingAnalyticsFiltersProps> = ({
  channelFilter,
  setChannelFilter,
  yearFilter,
  setYearFilter,
  monthFilter,
  setMonthFilter,
  selectedComparisonYears,
  setSelectedComparisonYears
}) => {
  return (
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
  );
};
