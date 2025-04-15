
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
    fetchMonthsForYear
  } = useFilterOptions();
  
  const [availableMonths, setAvailableMonths] = useState<MonthOption[]>([
    { value: 'all', label: 'All Months' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ]);

  // Reset month when year changes
  useEffect(() => {
    if (yearFilter !== 'all') {
      fetchMonthsForYear(yearFilter);
    } else {
      setMonthFilter('all');
    }
  }, [yearFilter, fetchMonthsForYear, setMonthFilter]);

  // Handle year change
  const handleYearChange = (value: string) => {
    setYearFilter(value);
    if (value === 'all') {
      setMonthFilter('all'); // Reset month when "all years" selected
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div>
        <label className="text-sm font-medium block mb-2">Channel</label>
        <Select value={channelFilter} onValueChange={setChannelFilter}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select channel" />
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
        <Select value={yearFilter} onValueChange={handleYearChange}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select year" />
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
          disabled={yearFilter === 'all'}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder={yearFilter === 'all' ? 'Select Year First' : 'Select month'} />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            {availableMonths.map(month => (
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
