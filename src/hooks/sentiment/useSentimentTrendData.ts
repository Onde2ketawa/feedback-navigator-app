
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
      // First get the date range of available data
      let dateRangeQuery = supabase
        .from('customer_feedback')
        .select('submit_date')
        .order('submit_date', { ascending: true })
        .limit(1);

      if (channelFilter !== 'all') {
        try {
          const { data: channelData } = await supabase
            .from('channel')
            .select('id')
            .eq('name', channelFilter)
            .maybeSingle();
          
          if (channelData) {
            dateRangeQuery = dateRangeQuery.eq('channel_id', channelData.id);
          }
        } catch (err) {
          // If channel lookup fails, try using channelFilter directly as ID
          dateRangeQuery = dateRangeQuery.eq('channel_id', channelFilter);
        }
      }

      const { data: oldestDateData } = await dateRangeQuery;
      const { data: newestDateData } = await supabase
        .from('customer_feedback')
        .select('submit_date')
        .order('submit_date', { ascending: false })
        .limit(1);

      if (!oldestDateData || !newestDateData || oldestDateData.length === 0 || newestDateData.length === 0) {
        return [];
      }

      const minDate = new Date(oldestDateData[0].submit_date);
      const maxDate = new Date(newestDateData[0].submit_date);

      // Now fetch all data within this date range
      let query = supabase
        .from('customer_feedback')
        .select('submit_date, sentiment, channel_id')
        .gte('submit_date', minDate.toISOString())
        .lte('submit_date', maxDate.toISOString())
        .order('submit_date', { ascending: true });

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
          query = query.eq('channel_id', channelFilter);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      
      if (data && data.length > 0) {
        return processSentimentTrendData(data, minDate, maxDate);
      }
      return [];
    } catch (error) {
      console.error('Error fetching sentiment trend data:', error);
      return [];
    }
  };

  const processSentimentTrendData = (
    data: any[],
    minDate: Date,
    maxDate: Date
  ): SentimentTrendMonthYearPoint[] => {
    // Initialize result with all months in the date range
    const result: SentimentTrendMonthYearPoint[] = [];
    
    // Create a map to store counts by year-month
    const countsMap: Record<string, Record<string, { positive: number; neutral: number; negative: number }>> = {};

    // Process each feedback item
    data.forEach(item => {
      if (!item.submit_date) return;
      
      const date = new Date(item.submit_date);
      const year = date.getFullYear().toString();
      const month = getMonthName(date.getMonth());
      
      // Initialize year if not exists
      if (!countsMap[year]) {
        countsMap[year] = {};
      }
      
      // Initialize month if not exists
      if (!countsMap[year][month]) {
        countsMap[year][month] = { positive: 0, neutral: 0, negative: 0 };
      }
      
      // Increment the appropriate sentiment counter
      if (item.sentiment === 'positive') {
        countsMap[year][month].positive++;
      } else if (item.sentiment === 'negative') {
        countsMap[year][month].negative++;
      } else {
        countsMap[year][month].neutral++;
      }
    });

    // Generate all months in the range, even if they have no data
    const currentDate = new Date(minDate);
    const endDate = new Date(maxDate);
    
    while (currentDate <= endDate) {
      const year = currentDate.getFullYear().toString();
      const month = getMonthName(currentDate.getMonth());
      
      result.push({
        month,
        year,
        positive: countsMap[year]?.[month]?.positive || 0,
        neutral: countsMap[year]?.[month]?.neutral || 0,
        negative: countsMap[year]?.[month]?.negative || 0
      });
      
      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return result;
  };

  return {
    sentimentTrendData,
    setSentimentTrendData,
    fetchSentimentTrendData
  };
};
