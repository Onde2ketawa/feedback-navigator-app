
import { useState } from 'react';
import { FeedbackFilter } from '@/hooks/useFeedbackData';

export const useFeedbackFilters = () => {
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [ratingRange, setRatingRange] = useState<[number, number]>([1, 5]);

  const handleChannelChange = (channel: string) => {
    setSelectedChannel(channel);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    // Reset month when year changes
    if (year === 'all') {
      setSelectedMonth('all');
    }
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Reset subcategory when category changes
    if (category === 'all') {
      setSelectedSubcategory('all');
    }
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
  };

  const handleSentimentChange = (sentiment: string) => {
    setSelectedSentiment(sentiment);
  };

  const applyFilters = (onFilterChange: (filters: FeedbackFilter) => void) => {
    const filters: FeedbackFilter = {
      channel: selectedChannel === 'all' ? null : selectedChannel,
      year: selectedYear === 'all' ? null : selectedYear,
      month: selectedMonth === 'all' ? null : selectedMonth,
      category: selectedCategory === 'all' ? null : selectedCategory,
      subcategory: selectedSubcategory === 'all' ? null : selectedSubcategory,
      sentiment: selectedSentiment === 'all' ? null : selectedSentiment,
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
    selectedSentiment,
    ratingRange,
    handleChannelChange,
    handleYearChange,
    handleMonthChange,
    handleCategoryChange,
    handleSubcategoryChange,
    handleSentimentChange,
    setRatingRange,
    applyFilters
  };
};
