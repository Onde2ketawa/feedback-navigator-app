
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFilterOptions, MonthOption } from '@/hooks/useFilterOptions';

interface FilterControlsProps {
  channelFilter: string;
  setChannelFilter: (value: string) => void;
  yearFilter: string;
  setYearFilter: (value: string) => void;
  monthFilter: string;
  setMonthFilter: (value: string) => void;
}

export function FilterControls({
  channelFilter,
  setChannelFilter,
  yearFilter,
  setYearFilter,
  monthFilter,
  setMonthFilter
}: FilterControlsProps) {
  const { 
    availableChannels,
    availableYears,
    availableMonths,
    fetchMonthsForYear,
    isLoading,
    isLoadingMonths
  } = useFilterOptions();

  // Default months to ensure the dropdown is never empty
  const defaultMonths: MonthOption[] = [
    { value: 'all', label: 'All Months' },
    { value: '1', label: 'Jan' },
    { value: '2', label: 'Feb' },
    { value: '3', label: 'Mar' },
    { value: '4', label: 'Apr' },
    { value: '5', label: 'May' },
    { value: '6', label: 'Jun' },
    { value: '7', label: 'Jul' },
    { value: '8', label: 'Aug' },
    { value: '9', label: 'Sep' },
    { value: '10', label: 'Oct' },
    { value: '11', label: 'Nov' },
    { value: '12', label: 'Dec' }
  ];

  // Use local state for months to ensure we always have a fallback
  const [displayMonths, setDisplayMonths] = useState<MonthOption[]>(defaultMonths);

  // Debug to see what months are available
  console.log("FilterControls: Available months from hook:", availableMonths);
  console.log("FilterControls: Display months used in render:", displayMonths);

  // Fetch months when year changes
  useEffect(() => {
    if (yearFilter !== 'all') {
      console.log("FilterControls: Fetching months for year:", yearFilter);
      fetchMonthsForYear(yearFilter);
      // Reset month when year changes
      setMonthFilter('all');
    } else {
      // When "all years" is selected, we should still see all months
      fetchMonthsForYear('all');
    }
  }, [yearFilter, fetchMonthsForYear, setMonthFilter]);

  // Update display months whenever availableMonths changes
  useEffect(() => {
    if (availableMonths.length > 1) {
      setDisplayMonths(availableMonths);
    } else {
      // Fallback to default months if the API returns only "All Months" or empty
      setDisplayMonths(defaultMonths);
    }
  }, [availableMonths]);

  // Handle year change
  const handleYearChange = (value: string) => {
    console.log("FilterControls: Year changed to:", value);
    setYearFilter(value);
    if (value === 'all') {
      setMonthFilter('all'); // Reset month when "all years" selected
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div>
        <label className="text-sm font-medium block mb-2">Channel</label>
        <Select value={channelFilter} onValueChange={setChannelFilter} disabled={isLoading}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder={isLoading ? "Loading channels..." : "Select channel"} />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            {availableChannels.map(channel => (
              <SelectItem key={channel.value} value={channel.value}>
                {channel.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="text-sm font-medium block mb-2">Year</label>
        <Select value={yearFilter} onValueChange={handleYearChange} disabled={isLoading}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder={isLoading ? "Loading years..." : "Select year"} />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            {availableYears.map(year => (
              <SelectItem key={year} value={year}>
                {year === 'all' ? 'All Years' : year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="text-sm font-medium block mb-2">Month</label>
        <Select 
          value={monthFilter} 
          onValueChange={setMonthFilter}
          disabled={isLoading || isLoadingMonths}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            {displayMonths.map(month => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
