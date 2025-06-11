
export const generateCategoryData = async (queryType: string, feedbackData: any[], aiResult?: any, supabase?: any) => {
  // Handle monthly category trends for specific channel (like "Promo trends for LINE Bank monthly")
  if ((queryType.includes('monthly') || queryType.includes('month')) && 
      (queryType.includes('category') || queryType.includes('kategori') || queryType.includes('trends') || queryType.includes('promo')) &&
      (queryType.includes('linebank') || queryType.includes('Linebank') || queryType.includes('LINE Bank') || 
       aiResult?.filters?.channel === 'Linebank' || aiResult?.filters?.channel === 'LINE Bank')) {
    
    console.log('Processing monthly category trends for LINE Bank');
    
    // Filter data for LINE Bank
    let filteredData = feedbackData.filter(item => {
      const channelName = item.channel?.name || item.channel || '';
      const channelMatch = channelName.toLowerCase().includes('line') && channelName.toLowerCase().includes('bank');
      return channelMatch;
    });
    
    console.log('Filtered data for LINE Bank:', filteredData.length, 'items');
    
    // Further filter by category if specified (like "Promo")
    if (queryType.includes('promo') || queryType.includes('Promo') || aiResult?.filters?.category) {
      const categoryFilter = aiResult?.filters?.category || 'promo';
      
      // First get category ID if we have supabase client
      if (supabase) {
        const { data: categoriesData, error } = await supabase
          .from('categories')
          .select('id, name')
          .ilike('name', `%${categoryFilter}%`);
        
        if (!error && categoriesData && categoriesData.length > 0) {
          const categoryIds = categoriesData.map(cat => cat.id);
          filteredData = filteredData.filter(item => 
            categoryIds.includes(item.category)
          );
          console.log('Filtered data by category:', filteredData.length, 'items');
        }
      }
    }
    
    if (filteredData.length === 0) {
      console.log('No data found for the specified criteria');
      return [];
    }
    
    // Group by month-year
    const monthlyData: Record<string, number> = {};
    filteredData.forEach(item => {
      if (item.submit_date) {
        const date = new Date(item.submit_date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        monthlyData[monthLabel] = (monthlyData[monthLabel] || 0) + 1;
      }
    });
    
    const result = Object.entries(monthlyData)
      .sort(([a], [b]) => {
        const dateA = new Date(a + '-01');
        const dateB = new Date(b + '-01');
        return dateA.getTime() - dateB.getTime();
      })
      .map(([month, count]) => ({
        month,
        count,
        value: count
      }));
    
    console.log('Monthly category trend result:', result);
    return result;
  }
  
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
      const categoryId = item.category;
      if (categoryId) {
        categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
      } else {
        categoryCounts['Uncategorized'] = (categoryCounts['Uncategorized'] || 0) + 1;
      }
    });
    
    console.log('Category counts by ID:', categoryCounts);
    
    // Fetch category names from the categories table
    if (supabase && Object.keys(categoryCounts).length > 0) {
      const categoryIds = Object.keys(categoryCounts).filter(id => id !== 'Uncategorized');
      
      if (categoryIds.length > 0) {
        const { data: categoriesData, error } = await supabase
          .from('categories')
          .select('id, name')
          .in('id', categoryIds);
        
        if (!error && categoriesData) {
          const categoryNameMap: Record<string, string> = {};
          categoriesData.forEach(cat => {
            categoryNameMap[cat.id] = cat.name;
          });
          
          // Map category IDs to names
          const result = Object.entries(categoryCounts).map(([categoryId, count]) => ({
            name: categoryNameMap[categoryId] || categoryId || 'Uncategorized',
            count,
            value: count
          }));
          
          console.log('Final category result with names:', result);
          return result;
        }
      }
    }
    
    // Fallback if no supabase client or category lookup fails
    const result = Object.entries(categoryCounts).map(([categoryId, count]) => ({ 
      name: categoryId || 'Uncategorized', 
      count,
      value: count
    }));
    
    console.log('Final category result (fallback):', result);
    return result;
  }

  // Handle general category queries
  if (queryType.includes('category') || queryType.includes('kategori')) {
    const categoryCounts: Record<string, number> = {};
    feedbackData.forEach(item => {
      const categoryId = item.category;
      if (categoryId) {
        categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
      } else {
        categoryCounts['Uncategorized'] = (categoryCounts['Uncategorized'] || 0) + 1;
      }
    });
    
    // Fetch category names from the categories table
    if (supabase && Object.keys(categoryCounts).length > 0) {
      const categoryIds = Object.keys(categoryCounts).filter(id => id !== 'Uncategorized');
      
      if (categoryIds.length > 0) {
        const { data: categoriesData, error } = await supabase
          .from('categories')
          .select('id, name')
          .in('id', categoryIds);
        
        if (!error && categoriesData) {
          const categoryNameMap: Record<string, string> = {};
          categoriesData.forEach(cat => {
            categoryNameMap[cat.id] = cat.name;
          });
          
          return Object.entries(categoryCounts).map(([categoryId, count]) => ({
            name: categoryNameMap[categoryId] || categoryId || 'Uncategorized',
            count,
            value: count
          }));
        }
      }
    }
    
    // Fallback
    return Object.entries(categoryCounts).map(([categoryId, count]) => ({ 
      name: categoryId || 'Uncategorized', 
      count,
      value: count
    }));
  }

  return null;
};
