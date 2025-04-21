
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
        return processSentimentTrendData(data);
      }
      return [];
    } catch (error) {
      console.error('Error fetching sentiment trend data:', error);
      return [];
    }
  };

  // Produce ALL months present from min to max date, inclusive, for each year.
  const processSentimentTrendData = (data: any[]): SentimentTrendMonthYearPoint[] => {
    if (!data || data.length === 0) return [];
    
    // Find min and max dates
    let minDate = null, maxDate = null;
    data.forEach(item => {
      if (!item.submit_date) return;
      const d = new Date(item.submit_date);
      if (!minDate || d < minDate) minDate = d;
      if (!maxDate || d > maxDate) maxDate = d;
    });
    if (!minDate || !maxDate) return [];

    // Make a set of years present in the data
    const yearsSet = new Set<string>();
    data.forEach(item => {
      if (!item.submit_date) return;
      const year = new Date(item.submit_date).getFullYear().toString();
      yearsSet.add(year);
    });
    const years = Array.from(yearsSet).sort();

    // Group sentiment counts by year and month index (0-11)
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

    // Build result: for each year, from Jan to Dec IF year fully inside min-max, otherwise partial for first/last year
    const result: SentimentTrendMonthYearPoint[] = [];

    years.forEach(year => {
      // For first and last year, restrict months based on min/max dates
      let minMonth = 0, maxMonth = 11;
      if (year === minDate.getFullYear().toString()) minMonth = minDate.getMonth();
      if (year === maxDate.getFullYear().toString()) maxMonth = maxDate.getMonth();

      for (let m = minMonth; m <= maxMonth; m++) {
        const monthCounts = grouped[year]?.[m] || { positive: 0, neutral: 0, negative: 0 };
        result.push({
          month: getMonthName(m),
          year,
          ...monthCounts,
        });
      }
    });

    // Sort by year ascending then month index ascending
    result.sort((a, b) => {
      if (a.year !== b.year) return Number(a.year) - Number(b.year);
      return getMonthIdx(a.month) - getMonthIdx(b.month);
    });

    return result;
  };

  return {
    sentimentTrendData,
    setSentimentTrendData,
    fetchSentimentTrendData
  };
};

