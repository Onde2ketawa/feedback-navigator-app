
interface ParsedQuery {
  chartType: 'pie' | 'bar' | 'line' | 'table' | 'grid';
  xAxis?: string;
  yAxis?: string;
  data: any[];
  title: string;
  filters?: {
    channel?: string;
    sentiment?: string;
    rating?: { min: number; max: number };
    timeframe?: string;
  };
}

export const generateVisualizationData = (queryType: string, feedbackData: any[], aiResult?: any) => {
  if (!feedbackData || feedbackData.length === 0) {
    console.log('No feedback data available');
    return [];
  }

  console.log('Generating visualization data for:', queryType, 'with AI result:', aiResult);
  console.log('Feedback data sample:', feedbackData.slice(0, 3));
  
  // Handle channel-specific category queries (like "category trends for LINE Bank")
  if ((queryType.includes('category') || queryType.includes('kategori') || queryType.includes('trends')) && 
      (queryType.includes('linebank') || queryType.includes('Linebank') || queryType.includes('LINE Bank') || 
       aiResult?.filters?.channel === 'Linebank' || aiResult?.filters?.channel === 'LINE Bank')) {
    
    console.log('Processing category query for LINE Bank');
    
    // Filter data for LINE Bank if specified
    let filteredData = feedbackData;
    if (queryType.includes('linebank') || queryType.includes('Linebank') || queryType.includes('LINE Bank') || 
        aiResult?.filters?.channel === 'Linebank' || aiResult?.filters?.channel === 'LINE Bank') {
      filteredData = feedbackData.filter(item => {
        const channelName = item.channel?.name || item.channel || '';
        // More flexible matching for LINE Bank vs Linebank
        const channelMatch = channelName.toLowerCase().includes('line') && channelName.toLowerCase().includes('bank');
        console.log('Channel check for item:', item.channel, 'channel name:', channelName, 'matches:', channelMatch);
        return channelMatch;
      });
      console.log('Filtered data for LINE Bank:', filteredData.length, 'items');
    }
    
    if (filteredData.length === 0) {
      console.log('No data found for LINE Bank channel');
      return [];
    }
    
    const categoryCounts: Record<string, number> = {};
    filteredData.forEach(item => {
      const category = item.category || 'Uncategorized';
      console.log('Processing category:', category);
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    console.log('Category counts:', categoryCounts);
    
    const result = Object.entries(categoryCounts).map(([name, count]) => ({ 
      name, 
      count,
      value: count // For compatibility with different chart types
    }));
    
    console.log('Final category result:', result);
    return result;
  }

  // Handle general category queries
  if (queryType.includes('category') || queryType.includes('kategori')) {
    const categoryCounts: Record<string, number> = {};
    feedbackData.forEach(item => {
      const category = item.category || 'Uncategorized';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    return Object.entries(categoryCounts).map(([name, count]) => ({ 
      name, 
      count,
      value: count
    }));
  }

  if (queryType.includes('channel')) {
    const channelCounts: Record<string, number> = {};
    feedbackData.forEach(item => {
      const channelName = item.channel?.name || item.channel || 'Unknown';
      channelCounts[channelName] = (channelCounts[channelName] || 0) + 1;
    });
    return Object.entries(channelCounts).map(([name, value]) => ({ name, value }));
  }

  if (queryType.includes('sentiment')) {
    if (queryType.includes('rating')) {
      const sentimentRatings: Record<string, { total: number; count: number }> = {};
      feedbackData.forEach(item => {
        const sentiment = item.sentiment || 'neutral';
        if (!sentimentRatings[sentiment]) {
          sentimentRatings[sentiment] = { total: 0, count: 0 };
        }
        sentimentRatings[sentiment].total += item.rating || 0;
        sentimentRatings[sentiment].count += 1;
      });
      return Object.entries(sentimentRatings).map(([sentiment, data]) => ({
        sentiment,
        average_rating: data.count > 0 ? (data.total / data.count).toFixed(2) : '0'
      }));
    } else {
      const sentimentCounts: Record<string, number> = {};
      feedbackData.forEach(item => {
        const sentiment = item.sentiment || 'neutral';
        sentimentCounts[sentiment] = (sentimentCounts[sentiment] || 0) + 1;
      });
      return Object.entries(sentimentCounts).map(([name, value]) => ({ name, value }));
    }
  }

  if (queryType.includes('rating') && queryType.includes('distribution')) {
    const ratingCounts: Record<number, number> = {};
    feedbackData.forEach(item => {
      const rating = item.rating || 0;
      ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
    });
    return Object.entries(ratingCounts).map(([rating, count]) => ({ 
      rating: `${rating} stars`, 
      count 
    }));
  }

  if (queryType.includes('time') || queryType.includes('over time')) {
    const monthCounts: Record<string, number> = {};
    feedbackData.forEach(item => {
      if (item.submit_date) {
        const month = new Date(item.submit_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        monthCounts[month] = (monthCounts[month] || 0) + 1;
      }
    });
    return Object.entries(monthCounts).map(([month, count]) => ({ month, count }));
  }

  if (queryType.includes('device')) {
    const deviceCounts: Record<string, number> = {};
    feedbackData.forEach(item => {
      const device = item.device || 'Unknown';
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });
    return Object.entries(deviceCounts).map(([name, value]) => ({ name, value }));
  }

  // Default fallback
  console.log('No specific query type matched, returning empty array');
  return [];
};

export const parseQuery = async (userInput: string, feedbackData: any[], supabase: any): Promise<ParsedQuery> => {
  try {
    console.log('Sending query to OpenAI:', userInput);
    
    // Call the Supabase edge function correctly
    const { data: aiResult, error: functionError } = await supabase.functions.invoke('parse-natural-language-query', {
      body: { query: userInput },
    });

    if (functionError) {
      console.error('Supabase function error:', functionError);
      throw new Error(`Function error: ${functionError.message}`);
    }

    console.log('OpenAI parsed result:', aiResult);

    if (aiResult.error) {
      console.warn('OpenAI returned error:', aiResult.error);
    }

    if (!feedbackData) {
      throw new Error('No data available');
    }

    // Generate visualization data based on AI-parsed result
    const data = generateVisualizationData(userInput, feedbackData, aiResult);
    
    const result: ParsedQuery = {
      chartType: aiResult.chartType || 'bar',
      xAxis: aiResult.xAxis,
      yAxis: aiResult.yAxis,
      data,
      title: aiResult.title || 'Data Visualization',
      filters: aiResult.filters
    };

    console.log('Final parsed result:', result);
    return result;

  } catch (error) {
    console.error('Error parsing query:', error);
    
    // Fallback to original logic if OpenAI fails
    if (!feedbackData) {
      throw new Error('No data available');
    }

    const lowerInput = userInput.toLowerCase();
    let result: ParsedQuery;
    
    if (lowerInput.includes('pie chart') || lowerInput.includes('pie')) {
      const data = generateVisualizationData(lowerInput, feedbackData);
      result = {
        chartType: 'pie',
        data,
        title: 'Data Distribution'
      };
    } else if (lowerInput.includes('table')) {
      const data = generateVisualizationData(lowerInput, feedbackData);
      result = {
        chartType: 'table',
        data,
        title: 'Data Table'
      };
    } else if (lowerInput.includes('line chart') || lowerInput.includes('over time')) {
      const data = generateVisualizationData(lowerInput, feedbackData);
      result = {
        chartType: 'line',
        xAxis: 'month',
        yAxis: 'count',
        data,
        title: 'Trend Over Time'
      };
    } else {
      const data = generateVisualizationData(lowerInput, feedbackData);
      result = {
        chartType: 'bar',
        xAxis: 'category',
        yAxis: 'count',
        data,
        title: 'Data Distribution'
      };
    }
    
    return result;
  }
};
