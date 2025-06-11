
import { ParsedQuery } from './types';
import { generateVisualizationData } from './data-generator';

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

    // Generate visualization data based on AI-parsed result - now passing supabase client
    const data = await generateVisualizationData(userInput, feedbackData, aiResult, supabase);
    
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
      const data = await generateVisualizationData(lowerInput, feedbackData, undefined, supabase);
      result = {
        chartType: 'pie',
        data,
        title: 'Data Distribution'
      };
    } else if (lowerInput.includes('table')) {
      const data = await generateVisualizationData(lowerInput, feedbackData, undefined, supabase);
      result = {
        chartType: 'table',
        data,
        title: 'Data Table'
      };
    } else if (lowerInput.includes('line chart') || lowerInput.includes('over time')) {
      const data = await generateVisualizationData(lowerInput, feedbackData, undefined, supabase);
      result = {
        chartType: 'line',
        xAxis: 'month',
        yAxis: 'count',
        data,
        title: 'Trend Over Time'
      };
    } else {
      const data = await generateVisualizationData(lowerInput, feedbackData, undefined, supabase);
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
