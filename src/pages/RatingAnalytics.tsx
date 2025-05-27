
import React, { useState, useEffect } from 'react';
import { useRatingAnalyticsData } from '@/hooks/rating/useRatingAnalyticsData';
import { useChannelFilter } from '@/hooks/useChannelFilter';
import { useChannelComparisonData } from '@/hooks/rating/useChannelComparisonData';
import { RatingTrendData } from '@/hooks/rating/types';
import { RatingAnalyticsHeader } from '@/components/analytics/rating/RatingAnalyticsHeader';
import { RatingAnalyticsFilters } from '@/components/analytics/rating/RatingAnalyticsFilters';
import { RatingCardsGrid } from '@/components/analytics/rating/RatingCardsGrid';
import { ComparisonChartSection } from '@/components/analytics/rating/ComparisonChartSection';
import { AnalyticsChartsGrid } from '@/components/analytics/rating/AnalyticsChartsGrid';

const RatingAnalytics: React.FC = () => {
  const {
    channelFilter,
    setChannelFilter,
    availableChannels,
    isLoading: isLoadingChannels
  } = useChannelFilter();

  const {
    yearFilter, 
    setYearFilter,
    monthFilter,
    setMonthFilter,
    isLoading,
    yoyTrendData,
    ratingDistributionData,
    categoryRatingData,
    refreshData
  } = useRatingAnalyticsData();
  
  const [selectedComparisonYears, setSelectedComparisonYears] = useState<string[]>(['2024', '2025']);
  
  const fetchComparisonData = useChannelComparisonData(selectedComparisonYears);
  const [channelComparisonData, setChannelComparisonData] = useState<RatingTrendData[]>([]);
  const [isLoadingComparison, setIsLoadingComparison] = useState(false);

  useEffect(() => {
    const getComparisonData = async () => {
      setIsLoadingComparison(true);
      try {
        console.log('Fetching comparison data for years:', selectedComparisonYears);
        const data = await fetchComparisonData();
        console.log('Received comparison data:', data);
        setChannelComparisonData(data);
      } catch (error) {
        console.error('Error fetching comparison data:', error);
      } finally {
        setIsLoadingComparison(false);
      }
    };
    getComparisonData();
  }, [selectedComparisonYears, fetchComparisonData]);
  
  const refreshAllData = () => {
    refreshData();
    const refreshComparisonData = async () => {
      setIsLoadingComparison(true);
      try {
        const data = await fetchComparisonData();
        setChannelComparisonData(data);
      } catch (error) {
        console.error('Error refreshing comparison data:', error);
      } finally {
        setIsLoadingComparison(false);
      }
    };
    refreshComparisonData();
  };
  
  return (
    <div className="animate-fade-in">
      <RatingAnalyticsHeader 
        onRefresh={refreshAllData}
        isLoading={isLoading || isLoadingComparison}
      />
      
      <RatingAnalyticsFilters
        channelFilter={channelFilter}
        setChannelFilter={setChannelFilter}
        yearFilter={yearFilter}
        setYearFilter={setYearFilter}
        monthFilter={monthFilter}
        setMonthFilter={setMonthFilter}
        selectedComparisonYears={selectedComparisonYears}
        setSelectedComparisonYears={setSelectedComparisonYears}
      />
      
      <RatingCardsGrid averageRating={0} />

      <div className="mb-6">
        <ComparisonChartSection
          isLoading={isLoadingComparison}
          channelComparisonData={channelComparisonData}
          selectedComparisonYears={selectedComparisonYears}
          channelFilter={channelFilter}
        />
      </div>

      <AnalyticsChartsGrid
        isLoading={isLoading}
        yoyTrendData={yoyTrendData}
        ratingDistributionData={ratingDistributionData}
        categoryRatingData={categoryRatingData}
        channelFilter={channelFilter}
        yearFilter={yearFilter}
      />
    </div>
  );
};

export default RatingAnalytics;
