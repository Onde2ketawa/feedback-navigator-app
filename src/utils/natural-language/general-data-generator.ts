
export const generateGeneralData = (queryType: string, feedbackData: any[]) => {
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
