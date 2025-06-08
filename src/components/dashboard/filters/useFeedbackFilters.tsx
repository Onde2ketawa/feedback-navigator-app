
import { useState } from 'react';
import { FeedbackFilter } from '@/hooks/useFeedbackData';

export const useFeedbackFilters = () => {
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [ratingRange, setRatingRange] = useState<[number, number]>([1, 5]);

  const handleChannelChange = (value: string) => {
    setSelectedChannel(value);
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    if (value === 'all') {
      setSelectedMonth('all');
    }
  };

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (value === 'all') {
      setSelectedSubcategory('all');
    }
  };

  const handleSubcategoryChange = (value: string) => {
    setSelectedSubcategory(value);
  };

  const applyFilters = (onFilterChange: (filters: FeedbackFilter) => void) => {
    const filters: FeedbackFilter = {
      channel: selectedChannel === 'all' ? null : selectedChannel,
      year: selectedYear === 'all' ? null : selectedYear,
      month: selectedMonth === 'all' ? null : selectedMonth,
      category: selectedCategory === 'all' ? null : selectedCategory,
      subcategory: selectedSubcategory === 'all' ? null : selectedSubcategory,
      ratingMin: ratingRange[0],
      ratingMax: ratingRange[1]
    };
    
    onFilterChange(filters);
  };

  return {
    selectedChannel,
    selectedYear,
    selectedMonth,
    selectedCategory,
    selectedSubcategory,
    ratingRange,
    handleChannelChange,
    handleYearChange,
    handleMonthChange,
    handleCategoryChange,
    handleSubcategoryChange,
    setRatingRange,
    applyFilters
  };
};
