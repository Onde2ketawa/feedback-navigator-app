
export const generateGeneralData = (queryType: string, feedbackData: any[], aiResult?: any) => {
  console.log('generateGeneralData called with:', { queryType, dataLength: feedbackData.length, aiResult });

  // Handle app version queries
  if (queryType.includes('app version') || queryType.includes('version') || aiResult?.dataSource === 'app_version') {
    console.log('Processing app version query');
    
    let filteredData = feedbackData;
    
    // Apply channel filter if specified
    if (queryType.includes('LINE Bank') || queryType.includes('Linebank') || aiResult?.filters?.channel === 'LINE Bank') {
      filteredData = feedbackData.filter(item => {
        const channelName = item.channel?.name || item.channel || '';
        const isLineBank = channelName.toLowerCase().includes('line') && channelName.toLowerCase().includes('bank');
        console.log('Channel filtering for app version:', channelName, 'matches LINE Bank:', isLineBank);
        return isLineBank;
      });
      console.log('Filtered data for LINE Bank app versions:', filteredData.length, 'items');
    }
    
    if (filteredData.length === 0) {
      console.log('No data found for app version query');
      return [];
    }
    
    // Group by app version
    const versionCounts: Record<string, number> = {};
    filteredData.forEach(item => {
      const version = item.app_version || item.appVersion || 'Unknown';
      versionCounts[version] = (versionCounts[version] || 0) + 1;
    });
    
    const result = Object.entries(versionCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([version, count]) => ({ 
        name: version,
        version,
        count,
        value: count
      }));
    
    console.log('App version result:', result);
    return result;
  }

  // Handle time-based queries with specific month-year (like "April 2025")
  if ((queryType.includes('time') || queryType.includes('over time') || aiResult?.filters?.timeframe) && 
      (queryType.includes('april') || queryType.includes('April') || aiResult?.filters?.timeframe?.includes('April'))) {
    
    console.log('Processing April 2025 timeframe query');
    
    // Filter data for April 2025 specifically
    let filteredData = feedbackData;
    
    // Apply channel filter if specified
    if (queryType.includes('LINE Bank') || queryType.includes('Linebank') || aiResult?.filters?.channel === 'LINE Bank') {
      filteredData = feedbackData.filter(item => {
        const channelName = item.channel?.name || item.channel || '';
        const isLineBank = channelName.toLowerCase().includes('line') && channelName.toLowerCase().includes('bank');
        console.log('Channel filtering:', channelName, 'matches LINE Bank:', isLineBank);
        return isLineBank;
      });
      console.log('Filtered data for LINE Bank:', filteredData.length, 'items');
    }
    
    // Filter for April 2025
    const aprilData = filteredData.filter(item => {
      if (!item.submit_date) return false;
      const date = new Date(item.submit_date);
      const isApril2025 = date.getMonth() === 3 && date.getFullYear() === 2025; // April is month 3 (0-indexed)
      return isApril2025;
    });
    
    console.log('Filtered data for April 2025:', aprilData.length, 'items');
    
    if (aprilData.length === 0) {
      console.log('No data found for April 2025');
      return [];
    }
    
    // Group by day for daily distribution in April 2025
    const dailyData: Record<string, number> = {};
    aprilData.forEach(item => {
      if (item.submit_date) {
        const date = new Date(item.submit_date);
        const dayKey = `Apr ${date.getDate()}`;
        dailyData[dayKey] = (dailyData[dayKey] || 0) + 1;
      }
    });
    
    const result = Object.entries(dailyData)
      .sort(([a], [b]) => {
        const dayA = parseInt(a.split(' ')[1]);
        const dayB = parseInt(b.split(' ')[1]);
        return dayA - dayB;
      })
      .map(([day, count]) => ({ 
        name: day,
        day,
        count,
        value: count
      }));
    
    console.log('April 2025 daily result:', result);
    return result;
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

  return null;
};
