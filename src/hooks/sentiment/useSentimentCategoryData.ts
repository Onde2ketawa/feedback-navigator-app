
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SentimentCategoryDataPoint } from './types';

export const useSentimentCategoryData = () => {
  const [sentimentCategoryData, setSentimentCategoryData] = useState<SentimentCategoryDataPoint[]>([]);

  const fetchSentimentCategoryData = async (
    channelFilter: string,
    yearFilter: string,
    monthFilter: string
  ): Promise<SentimentCategoryDataPoint[]> => {
    try {
      console.log("Fetching sentiment category data with filters:", { channelFilter, yearFilter, monthFilter });
      
      // Build the base query joining customer_feedback with categories to get category names
      let query = supabase
        .from('customer_feedback')
        .select(`
          sentiment_score,
          category,
          channel_id,
          submit_date,
          categories:category (
            name
          )
        `);

      // Apply channel filter if not 'all'
      if (channelFilter !== 'all') {
        query = query.eq('channel_id', channelFilter);
      }

      // Apply year filter if not 'all'
      if (yearFilter !== 'all') {
        const year = parseInt(yearFilter);
        query = query.gte('submit_date', `${year}-01-01`);
        query = query.lt('submit_date', `${year + 1}-01-01`);
      }

      // Apply month filter if not 'all'
      if (monthFilter !== 'all') {
        const month = parseInt(monthFilter);
        const year = yearFilter !== 'all' ? parseInt(yearFilter) : new Date().getFullYear();
        const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        const endDate = month === 12 
          ? `${year + 1}-01-01` 
          : `${year}-${(month + 1).toString().padStart(2, '0')}-01`;
        
        query = query.gte('submit_date', startDate);
        query = query.lt('submit_date', endDate);
      }

      // Only get records with sentiment scores and categories
      query = query.not('sentiment_score', 'is', null);
      query = query.not('category', 'is', null);

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        console.log("Sentiment category raw data:", data);
        return processSentimentCategoryData(data);
      }

      return [];
    } catch (error) {
      console.error('Error fetching sentiment category data:', error);
      return [];
    }
  };

  const processSentimentCategoryData = (data: any[]): SentimentCategoryDataPoint[] => {
    // Group by category and calculate average sentiment score
    const categoryScores: Record<string, { total: number; count: number; name: string }> = {};

    data.forEach(item => {
      if (!item.sentiment_score || !item.category) return;

      // Use category name from the joined categories table, fallback to category field
      const categoryName = item.categories?.name || item.category || 'Uncategorized';
      const score = typeof item.sentiment_score === 'number' ? item.sentiment_score : parseFloat(item.sentiment_score);

      if (isNaN(score)) return;

      if (!categoryScores[categoryName]) {
        categoryScores[categoryName] = { total: 0, count: 0, name: categoryName };
      }

      categoryScores[categoryName].total += score;
      categoryScores[categoryName].count += 1;
    });

    // Convert to array format with average sentiment scores
    const result = Object.values(categoryScores).map(category => ({
      name: category.name,
      sentiment_score: Number((category.total / category.count).toFixed(3))
    }));

    console.log("Processed sentiment category data:", result);
    return result;
  };

  return {
    sentimentCategoryData,
    setSentimentCategoryData,
    fetchSentimentCategoryData
  };
};
