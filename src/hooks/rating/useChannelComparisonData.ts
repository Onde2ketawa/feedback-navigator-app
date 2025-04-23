
import { useMemo } from 'react';
import { Feedback } from '@/models/feedback';

interface ChannelRatingsByMonth {
  month: string;
  [key: string]: string | number; // Dynamic keys for year-channel combinations
}

export function useChannelComparisonData(
  feedbackData: Feedback[] | undefined,
  selectedYears: string[]
) {
  return useMemo(() => {
    if (!feedbackData || feedbackData.length === 0 || selectedYears.length === 0) {
      return [];
    }

    const monthlyData: Record<string, any> = {};
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Initialize structure
    for (let i = 0; i < 12; i++) {
      const month = monthNames[i];
      monthlyData[month] = { month };
      
      selectedYears.forEach(year => {
        monthlyData[month][`myHana-${year}`] = 0;
        monthlyData[month][`lineBank-${year}`] = 0;
      });
    }

    // Process feedback data
    feedbackData.forEach(item => {
      // Extract month name and year from submitDate (YYYY-MM-DD)
      if (!item.submitDate) return;
      
      const date = new Date(item.submitDate);
      const monthIndex = date.getMonth();
      const monthName = monthNames[monthIndex];
      const year = date.getFullYear().toString();
      
      // Skip if not in selected years
      if (!selectedYears.includes(year)) return;
      
      // Separate by channel
      if (item.channel === "MyHana") {
        if (!monthlyData[monthName][`myHana-${year}`]) {
          monthlyData[monthName][`myHana-${year}`] = { sum: item.rating, count: 1 };
        } else if (typeof monthlyData[monthName][`myHana-${year}`] === 'object') {
          monthlyData[monthName][`myHana-${year}`].sum += item.rating;
          monthlyData[monthName][`myHana-${year}`].count += 1;
        } else {
          monthlyData[monthName][`myHana-${year}`] = { sum: item.rating, count: 1 };
        }
      }
      else if (item.channel === "LINE Bank") {
        if (!monthlyData[monthName][`lineBank-${year}`]) {
          monthlyData[monthName][`lineBank-${year}`] = { sum: item.rating, count: 1 };
        } else if (typeof monthlyData[monthName][`lineBank-${year}`] === 'object') {
          monthlyData[monthName][`lineBank-${year}`].sum += item.rating;
          monthlyData[monthName][`lineBank-${year}`].count += 1;
        } else {
          monthlyData[monthName][`lineBank-${year}`] = { sum: item.rating, count: 1 };
        }
      }
    });

    // Calculate averages
    monthNames.forEach(month => {
      selectedYears.forEach(year => {
        // MyHana average
        if (typeof monthlyData[month][`myHana-${year}`] === 'object') {
          const { sum, count } = monthlyData[month][`myHana-${year}`];
          monthlyData[month][`myHana-${year}`] = count > 0 ? sum / count : 0;
        }
        
        // LINE Bank average
        if (typeof monthlyData[month][`lineBank-${year}`] === 'object') {
          const { sum, count } = monthlyData[month][`lineBank-${year}`];
          monthlyData[month][`lineBank-${year}`] = count > 0 ? sum / count : 0;
        }
      });
    });

    return monthNames.map(month => monthlyData[month]) as ChannelRatingsByMonth[];
  }, [feedbackData, selectedYears]);
}
