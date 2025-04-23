
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
      // Directly use a SQL query approach to match the manual query result structure
      let query = supabase.rpc('get_sentiment_trend_data');
      
      // Apply channel filter if needed
      if (channelFilter !== 'all') {
        try {
          const { data: channelData } = await supabase
            .from('channel')
            .select('id')
            .eq('name', channelFilter)
            .maybeSingle();
          
          if (channelData) {
            query = supabase.rpc('get_sentiment_trend_data_by_channel', { 
              channel_id_param: channelData.id 
            });
          }
        } catch (err) {
          // If channel lookup fails, try direct query approach
          console.error("Channel lookup failed:", err);
          
          // Fallback to raw SQL query approach
          let { data, error } = await supabase
            .from('customer_feedback')
            .select('submit_date, sentiment')
            .order('submit_date');
          
          if (channelFilter !== 'all') {
            try {
              const { data: channelData } = await supabase
                .from('channel')
                .select('id')
                .eq('name', channelFilter)
                .maybeSingle();
              
              if (channelData) {
                const { data: filteredData, error: filteredError } = await supabase
                  .from('customer_feedback')
                  .select('submit_date, sentiment')
                  .eq('channel_id', channelData.id)
                  .order('submit_date');
                
                if (!filteredError) {
                  data = filteredData;
                }
              }
            } catch (e) {
              console.error("Error in channel filtering fallback:", e);
            }
          }
          
          if (error) {
            console.error("Error fetching data:", error);
            return [];
          }
          
          // Process data manually
          return processRawSentimentData(data || []);
        }
      } else {
        // If no channel filter or "all" is selected, use the default query
        const { data, error } = await supabase
          .from('customer_feedback')
          .select('submit_date, sentiment')
          .order('submit_date');
        
        if (error) {
          console.error("Error fetching all sentiment data:", error);
          return [];
        }
        
        console.log(`Raw data count: ${data?.length || 0} records`);
        return processRawSentimentData(data || []);
      }

      // Execute RPC query if we got here (meaning no fallback)
      const { data, error } = await query;
      
      if (error) {
        console.error("RPC query error:", error);
        // Fallback to direct data processing
        const { data: rawData, error: rawError } = await supabase
          .from('customer_feedback')
          .select('submit_date, sentiment')
          .order('submit_date');
        
        if (rawError) {
          console.error("Fallback query error:", rawError);
          return [];
        }
        
        return processRawSentimentData(rawData || []);
      }
      
      // Transform RPC result into expected format
      if (data && data.length > 0) {
        console.log("RPC data returned:", data.length, "records");
        const result: SentimentTrendMonthYearPoint[] = data.map(item => ({
          month: item.month_short,
          year: item.year.toString(),
          positive: item.positive_count || 0,
          neutral: item.neutral_count || 0,
          negative: item.negative_count || 0
        }));
        
        // Sort by year and month
        result.sort((a, b) => {
          if (a.year !== b.year) {
            return parseInt(a.year) - parseInt(b.year);
          }
          return getMonthIdx(a.month) - getMonthIdx(b.month);
        });
        
        console.log('Transformed RPC data:', result);
        return result;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching sentiment trend data:', error);
      return [];
    }
  };

  // Helper function to process raw sentiment data
  const processRawSentimentData = (data: any[]): SentimentTrendMonthYearPoint[] => {
    if (!data || data.length === 0) return [];
    
    console.log('Processing raw sentiment data, count:', data.length);
    
    // Group by month and year
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
      
      // Case-insensitive sentiment checking
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
    
    // Sort by year and month for proper display
    result.sort((a, b) => {
      if (a.year !== b.year) {
        return parseInt(a.year) - parseInt(b.year);
      }
      return getMonthIdx(a.month) - getMonthIdx(b.month);
    });
    
    console.log('Processed sentiment data range:', 
      result.length > 0 ? 
      `${result[0].month} ${result[0].year} to ${result[result.length-1].month} ${result[result.length-1].year}` : 
      'No data');
    console.log('Total processed records:', result.length);
    
    return result;
  };

  return {
    sentimentTrendData,
    setSentimentTrendData,
    fetchSentimentTrendData
  };
};
