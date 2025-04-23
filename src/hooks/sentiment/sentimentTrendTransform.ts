
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

  // First, ensure every month-year combination is initialized
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const uniqueYears = new Set<string>();
  
  data.forEach(item => {
    if (!item.submit_date) return;
    const date = new Date(item.submit_date);
    uniqueYears.add(date.getFullYear().toString());
  });
  
  // Initialize all month-year combinations for years found in data
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

  // Add all months for all years with data
  Object.keys(monthYearData).forEach(year => {
    Object.keys(monthYearData[year]).forEach(month => {
      const counts = monthYearData[year][month];
      // Only add months that have data
      if (counts.positive > 0 || counts.neutral > 0 || counts.negative > 0) {
        result.push({
          month,
          year,
          positive: counts.positive,
          neutral: counts.neutral,
          negative: counts.negative
        });
      }
    });
  });

  // Sort by year and month for proper chronological display
  result.sort((a, b) => {
    if (a.year !== b.year) {
      return parseInt(a.year) - parseInt(b.year);
    }
    return getMonthIdx(a.month) - getMonthIdx(b.month);
  });

  console.log("Processed data:", result);
  return result;
}
