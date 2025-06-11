
import { generateCategoryData } from './category-data-generator';
import { generateGeneralData } from './general-data-generator';

export const generateVisualizationData = async (queryType: string, feedbackData: any[], aiResult?: any, supabase?: any) => {
  if (!feedbackData || feedbackData.length === 0) {
    console.log('No feedback data available');
    return [];
  }

  console.log('Generating visualization data for:', queryType, 'with AI result:', aiResult);
  console.log('Feedback data sample:', feedbackData.slice(0, 3));
  
  // Handle app version queries with channel filtering
  if ((queryType.includes('app version') || queryType.includes('version') || aiResult?.dataSource === 'app_version') && 
      (queryType.includes('LINE Bank') || queryType.includes('Linebank') || aiResult?.filters?.channel === 'LINE Bank')) {
    console.log('Processing app version + LINE Bank query:', aiResult?.filters);
    
    let filteredData = feedbackData;
    
    // Apply channel filter for LINE Bank
    filteredData = feedbackData.filter(item => {
      const channelName = item.channel?.name || item.channel || '';
      const isLineBank = channelName.toLowerCase().includes('line') && channelName.toLowerCase().includes('bank');
      return isLineBank;
    });
    console.log('Filtered data for LINE Bank app versions:', filteredData.length, 'items');
    
    if (filteredData.length === 0) {
      console.log('No data found for LINE Bank app versions');
      return [];
    }
    
    // Group by app version
    const versionData: Record<string, number> = {};
    filteredData.forEach(item => {
      const version = item.app_version || item.appVersion || 'Unknown';
      versionData[version] = (versionData[version] || 0) + 1;
    });
    
    const result = Object.entries(versionData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([version, count]) => ({ 
        name: version,
        version,
        count,
        value: count
      }));
    
    console.log('App version + LINE Bank result:', result);
    return result;
  }
  
  // Handle specific timeframe queries (like "April 2025") with channel filtering
  if (aiResult?.filters?.timeframe && aiResult?.filters?.channel) {
    console.log('Processing timeframe + channel query:', aiResult.filters);
    
    let filteredData = feedbackData;
    
    // Apply channel filter
    if (aiResult.filters.channel === 'LINE Bank') {
      filteredData = feedbackData.filter(item => {
        const channelName = item.channel?.name || item.channel || '';
        const isLineBank = channelName.toLowerCase().includes('line') && channelName.toLowerCase().includes('bank');
        return isLineBank;
      });
      console.log('Filtered data for LINE Bank:', filteredData.length, 'items');
    }
    
    // Apply timeframe filter for April 2025
    if (aiResult.filters.timeframe.includes('April 2025')) {
      filteredData = filteredData.filter(item => {
        if (!item.submit_date) return false;
        const date = new Date(item.submit_date);
        return date.getMonth() === 3 && date.getFullYear() === 2025; // April is month 3 (0-indexed)
      });
      console.log('Filtered data for April 2025:', filteredData.length, 'items');
    }
    
    if (filteredData.length === 0) {
      console.log('No data found for the specified criteria');
      return [];
    }
    
    // Group by day for daily distribution
    const dailyData: Record<string, number> = {};
    filteredData.forEach(item => {
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
    
    console.log('Timeframe + channel result:', result);
    return result;
  }
  
  // Try category data generation first
  const categoryData = await generateCategoryData(queryType, feedbackData, aiResult, supabase);
  if (categoryData !== null) {
    return categoryData;
  }

  // Try general data generation
  const generalData = generateGeneralData(queryType, feedbackData, aiResult);
  if (generalData !== null) {
    return generalData;
  }

  // Default fallback
  console.log('No specific query type matched, returning empty array');
  return [];
};
