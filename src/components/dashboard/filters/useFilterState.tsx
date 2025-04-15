
import { useState } from 'react';
import { FeedbackFilter } from '@/hooks/useFeedbackData';
import { useToast } from '@/hooks/use-toast';

export const useFilterState = () => {
  const { toast } = useToast();
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [ratingRange, setRatingRange] = useState<number[]>([1, 5]);
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);

  const handleChannelChange = (value: string) => {
    console.log("Channel changed to:", value);
    setSelectedChannel(value);
  };

  const handleYearChange = (value: string) => {
    console.log("Year changed to:", value);
    setSelectedYear(value);
    // Month will be reset in the useEffect
  };

  const handleMonthChange = (value: string) => {
    console.log("Month changed to:", value);
    setSelectedMonth(value);
  };

  // Reset time filters
  const handleResetTimeFilters = () => {
    setSelectedYear('all');
    setSelectedMonth('all');
    toast({
      title: "Date filters reset",
      description: "Year and month filters have been reset to 'All'",
    });
  };

  // Apply filters with loading state
  const applyFilters = (onFilterChange: (filters: FeedbackFilter) => void) => {
    setIsApplyingFilters(true);
    
    // Prepare filter object
    const filters: FeedbackFilter = {
      channel: selectedChannel === 'all' ? null : selectedChannel,
      year: selectedYear === 'all' ? null : selectedYear,
      month: selectedMonth === 'all' ? null : selectedMonth,
      ratingMin: ratingRange[0],
      ratingMax: ratingRange[1]
    };
    
    console.log("Filters changed:", filters);
    
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

  return {
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
  };
};
