
import { useState } from 'react';
import { CategoryAnalyticsState } from './types';

export function useCategoryAnalyticsState() {
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  return {
    selectedChannel,
    setSelectedChannel,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    selectedCategory,
    setSelectedCategory,
    availableCategories,
    setAvailableCategories
  };
}
