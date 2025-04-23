
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SentimentTrendMonthYearPoint {
  month: string;      // "Jan", "Feb", ...
  year: string;       // "2024", "2025", ...
  positive: number;
  neutral: number;
  negative: number;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function getMonthIdx(month: string) {
  return MONTHS.indexOf(month);
}

function getMonthName(idx: number) {
  return MONTHS[idx] || "";
}

export const useSentimentTrendData = (channelFilter: string) => {
  const [sentimentTrendData, setSentimentTrendData] = useState<SentimentTrendMonthYearPoint[]>([]);
  
  const fetchSentimentTrendData = async (): Promise<SentimentTrendMonthYearPoint[]> => {
    try {
      // Use direct query to get monthly sentiment counts grouped by month and year
      let query = supabase
        .from('customer_feedback')
        .select(`
          submit_date,
          sentiment
        `);
      
      // Don't filter by date range - get all data to ensure we capture Apr 2024-Mar 2025

      if (channelFilter !== 'all') {
        try {
          const { data: channelData } = await supabase
            .from('channel')
            .select('id')
            .eq('name', channelFilter)
            .maybeSingle();
          
          if (channelData) {
            query = query.eq('channel_id', channelData.id);
          }
        } catch (err) {
          // If channel lookup fails, try using channelFilter directly as ID
          query = query.eq('channel_id', channelFilter);
        }
      }

      const { data, error } = await query;
      
      console.log('Raw sentiment data count:', data?.length || 0);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Process data to group by month and year
        const monthYearData: Record<string, Record<string, { positive: number; neutral: number; negative: number }>> = {};
        
        data.forEach(item => {
          if (!item.submit_date) return;
          
          const date = new Date(item.submit_date);
          const year = date.getFullYear().toString();
          const month = getMonthName(date.getMonth());
          
          if (!monthYearData[year]) {
            monthYearData[year] = {};
          }
          
          if (!monthYearData[year][month]) {
            monthYearData[year][month] = { positive: 0, neutral: 0, negative: 0 };
          }
          
          // Lowercase the sentiment value for case-insensitive comparison
          const sentiment = item.sentiment ? item.sentiment.toLowerCase() : 'neutral';
          
          if (sentiment === 'positive') {
            monthYearData[year][month].positive++;
          } else if (sentiment === 'negative') {
            monthYearData[year][month].negative++;
          } else {
            monthYearData[year][month].neutral++;
          }
        });
        
        // Convert to array format required by the chart
        const result: SentimentTrendMonthYearPoint[] = [];
        
        // Ensure all years and months in the data are processed
        Object.keys(monthYearData).sort().forEach(year => {
          Object.keys(monthYearData[year]).forEach(month => {
            result.push({
              month,
              year,
              positive: monthYearData[year][month].positive,
              neutral: monthYearData[year][month].neutral,
              negative: monthYearData[year][month].negative
            });
          });
        });
        
        // Sort by year and month
        result.sort((a, b) => {
          if (a.year !== b.year) {
            return parseInt(a.year) - parseInt(b.year);
          }
          return getMonthIdx(a.month) - getMonthIdx(b.month);
        });
        
        console.log('Processed Sentiment Trend Data:', result);
        console.log('Data years range:', 
          result.length > 0 ? 
          `${result[0].month} ${result[0].year} to ${result[result.length-1].month} ${result[result.length-1].year}` : 
          'No data');
        
        return result;
      }
      return [];
    } catch (error) {
      console.error('Error fetching sentiment trend data:', error);
      return [];
    }
  };

  return {
    sentimentTrendData,
    setSentimentTrendData,
    fetchSentimentTrendData
  };
};
