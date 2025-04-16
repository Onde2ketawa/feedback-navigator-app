
import { useState, useEffect } from 'react';
import { yoyTrendData as defaultYoyTrendData, ratingDistributionData as defaultRatingDistributionData } from '@/data/ratingsMockData';

export function useRatingAnalyticsData() {
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('2024');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  
  // Use the default data from ratingsMockData.ts
  const [yoyTrendData, setYoyTrendData] = useState(defaultYoyTrendData);
  const [ratingDistributionData, setRatingDistributionData] = useState(defaultRatingDistributionData);

  // In the future, we could add logic here to fetch data based on filters
  useEffect(() => {
    // This is where we would fetch data based on filter changes
    // For now, we just use the mock data
    console.log('Filters changed:', { channelFilter, yearFilter, monthFilter });
    
    // You could add API calls or data manipulation here
    // Example: if(channelFilter !== 'all') { fetchDataForChannel(channelFilter) }
  }, [channelFilter, yearFilter, monthFilter]);

  return {
    channelFilter,
    setChannelFilter,
    yearFilter,
    setYearFilter,
    monthFilter,
    setMonthFilter,
    yoyTrendData,
    ratingDistributionData
  };
}
