
import { useState, useEffect } from 'react';

// Define the data types
export interface CategoryDataItem {
  name: string;
  value: number;
  color: string;
}

export interface SubcategoryData {
  [key: string]: CategoryDataItem[];
}

export interface CategoryRating {
  name: string;
  rating: number;
}

export function useCategoryAnalyticsData() {
  // Define all the mock data here
  const COLORS = ['#8b5cf6', '#6366f1', '#ec4899', '#f43f5e', '#f97316', '#14b8a6', '#10b981', '#a3e635'];

  const categoryData = [
    { name: 'Technical Issues', value: 35, color: COLORS[0] },
    { name: 'Customer Service', value: 25, color: COLORS[1] },
    { name: 'Product Features', value: 20, color: COLORS[2] },
    { name: 'Usability', value: 15, color: COLORS[3] },
    { name: 'Others', value: 5, color: COLORS[4] },
  ];

  const subcategoryData = {
    'Technical Issues': [
      { name: 'Login Problems', value: 15, color: COLORS[0] },
      { name: 'App Crashes', value: 10, color: COLORS[1] },
      { name: 'Slow Performance', value: 10, color: COLORS[2] },
    ],
    'Customer Service': [
      { name: 'Response Time', value: 12, color: COLORS[0] },
      { name: 'Solution Quality', value: 8, color: COLORS[1] },
      { name: 'Staff Attitude', value: 5, color: COLORS[2] },
    ],
    'Product Features': [
      { name: 'Missing Features', value: 8, color: COLORS[0] },
      { name: 'UI/UX Design', value: 7, color: COLORS[1] },
      { name: 'Accessibility', value: 5, color: COLORS[2] },
    ],
    'Usability': [
      { name: 'Navigation', value: 7, color: COLORS[0] },
      { name: 'Ease of Use', value: 8, color: COLORS[1] },
    ],
    'Others': [
      { name: 'Miscellaneous', value: 5, color: COLORS[0] },
    ],
  };

  const lineRatingByCategory = [
    { name: 'Technical Issues', rating: 3.2 },
    { name: 'Customer Service', rating: 4.1 },
    { name: 'Product Features', rating: 3.8 },
    { name: 'Usability', rating: 3.5 },
    { name: 'Others', rating: 3.9 },
  ];

  const myHanaRatingByCategory = [
    { name: 'Technical Issues', rating: 3.5 },
    { name: 'Customer Service', rating: 4.3 },
    { name: 'Product Features', rating: 4.0 },
    { name: 'Usability', rating: 3.7 },
    { name: 'Others', rating: 4.1 },
  ];

  const [selectedChannel, setSelectedChannel] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Get all available categories from the data
  const availableCategories = categoryData.map(cat => cat.name);

  // Get category ratings based on selected channel
  const categoryRatings = selectedChannel === 'LINE Bank' 
    ? lineRatingByCategory 
    : selectedChannel === 'MyHana' 
    ? myHanaRatingByCategory 
    : lineRatingByCategory.map((item, index) => ({
        name: item.name,
        rating: (item.rating + myHanaRatingByCategory[index].rating) / 2,
      }));

  return {
    categoryData,
    subcategoryData,
    availableCategories,
    categoryRatings,
    selectedChannel,
    setSelectedChannel,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    selectedCategory,
    setSelectedCategory,
  };
}
