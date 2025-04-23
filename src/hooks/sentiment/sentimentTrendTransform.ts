
import { getMonthIdx, getMonthName, MONTHS } from './sentimentMonthUtils';

export interface SentimentTrendMonthYearPoint {
  month: string;      // "Jan", "Feb", ...
  year: string;       // "2024", "2025", ...
  positive: number;
  neutral: number;
  negative: number;
}

/**
 * Processes an array of raw feedback sentiment data objects into monthly/yearly aggregates.
 */
export function processRawSentimentData(data: any[]): SentimentTrendMonthYearPoint[] {
  if (!data || data.length === 0) return [];

  console.log("Processing raw data:", data.length, "items");
  
  // Group by month and year
  const monthYearData: Record<string, Record<string, { positive: number; neutral: number; negative: number }>> = {};

  // First, process all data to find unique years
  const uniqueYears = new Set<string>();
  
  data.forEach(item => {
    if (!item.submit_date) return;
    const date = new Date(item.submit_date);
    uniqueYears.add(date.getFullYear().toString());
  });
  
  console.log("Unique years found in data:", Array.from(uniqueYears));
  
  // Initialize all possible month-year combinations
  uniqueYears.forEach(year => {
    monthYearData[year] = {};
    MONTHS.forEach(month => {
      monthYearData[year][month] = { positive: 0, neutral: 0, negative: 0 };
    });
  });

  // Now count the actual data
  data.forEach(item => {
    if (!item.submit_date) return;

    const date = new Date(item.submit_date);
    const year = date.getFullYear().toString();
    const month = getMonthName(date.getMonth());

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

  // Add all months for all years
  Object.keys(monthYearData).forEach(year => {
    MONTHS.forEach(month => {
      const counts = monthYearData[year][month];
      // Include all months regardless of whether they have data
      result.push({
        month,
        year,
        positive: counts.positive,
        neutral: counts.neutral,
        negative: counts.negative
      });
    });
  });

  // Sort by year and month for proper chronological display
  result.sort((a, b) => {
    if (a.year !== b.year) {
      return parseInt(a.year) - parseInt(b.year);
    }
    return getMonthIdx(a.month) - getMonthIdx(b.month);
  });

  console.log("Processed data points:", result.length);
  console.log("First few processed data points:", result.slice(0, 5));
  console.log("Last few processed data points:", result.slice(-5));
  
  return result;
}
