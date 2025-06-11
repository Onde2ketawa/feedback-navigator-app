
import { generateCategoryData } from './category-data-generator';
import { generateGeneralData } from './general-data-generator';

export const generateVisualizationData = async (queryType: string, feedbackData: any[], aiResult?: any, supabase?: any) => {
  if (!feedbackData || feedbackData.length === 0) {
    console.log('No feedback data available');
    return [];
  }

  console.log('Generating visualization data for:', queryType, 'with AI result:', aiResult);
  console.log('Feedback data sample:', feedbackData.slice(0, 3));
  
  // Try category data generation first
  const categoryData = await generateCategoryData(queryType, feedbackData, aiResult, supabase);
  if (categoryData !== null) {
    return categoryData;
  }

  // Try general data generation
  const generalData = generateGeneralData(queryType, feedbackData);
  if (generalData !== null) {
    return generalData;
  }

  // Default fallback
  console.log('No specific query type matched, returning empty array');
  return [];
};
