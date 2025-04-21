
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SentimentTrendDataPoint } from './types';

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

export const useSentimentTrendData = (channelFilter: string) => {
  const [sentimentTrendData, setSentimentTrendData] = useState<SentimentTrendMonthYearPoint[]>([]);
  
  const fetchSentimentTrendData = async (): Promise<SentimentTrendMonthYearPoint[]> => {
    try {
      let query = supabase
        .from('customer_feedback')
        .select('submit_date, sentiment, channel_id')
        .order('submit_date', { ascending: true });

      if (channelFilter !== 'all') {
        try {
          const { data: channelData } = await supabase
            .from('channel')
            .select('id')
            .eq('name', channelFilter)
            .single();
          
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
        return processSentimentTrendData(data);
      }
      return [];
    } catch (error) {
      console.error('Error fetching sentiment trend data:', error);
      return [];
    }
  };

  const processSentimentTrendData = (data: any[]): SentimentTrendMonthYearPoint[] => {
    // Group by year and month for enhanced time series split
    // Structure: result[year][monthIdx] = {positive, neutral, negative}
    const grouped: Record<string, Record<number, { positive: number; neutral: number; negative: number }>> = {};
    data.forEach(item => {
      if (!item.submit_date) return;
      const dateObj = new Date(item.submit_date);
      const year = `${dateObj.getFullYear()}`;
      const monthIdx = dateObj.getMonth(); // 0-11

      if (!grouped[year]) {
        grouped[year] = {};
      }
      if (!grouped[year][monthIdx]) {
        grouped[year][monthIdx] = { positive: 0, neutral: 0, negative: 0 };
      }
      if (item.sentiment === 'positive') {
        grouped[year][monthIdx].positive++;
      } else if (item.sentiment === 'negative') {
        grouped[year][monthIdx].negative++;
      } else {
        grouped[year][monthIdx].neutral++;
      }
    });

    // Flatten into array of { month, year, positive, neutral, negative }
    const result: SentimentTrendMonthYearPoint[] = [];
    Object.entries(grouped).forEach(([year, monthsObj]) => {
      for (let m = 0; m < 12; m++) {
        const monthCounts = monthsObj[m] || { positive: 0, neutral: 0, negative: 0 };
        result.push({
          month: MONTHS[m],
          year,
          ...monthCounts,
        });
      }
    });

    // Sorted: year ascending, month ascending
    result.sort((a, b) => (a.year === b.year ? MONTHS.indexOf(a.month) - MONTHS.indexOf(b.month) : Number(a.year) - Number(b.year)));
    return result;
  };

  return {
    sentimentTrendData,
    setSentimentTrendData,
    fetchSentimentTrendData
  };
};
