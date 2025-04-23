
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
 * Ensures all months from Jan 2024 to Mar 2025 are included in the output.
 */
export function processRawSentimentData(data: any[]): SentimentTrendMonthYearPoint[] {
  if (!data || data.length === 0) return [];

  console.log("Processing raw sentiment data:", data.length, "items");
  
  // Group by month and year
  const monthYearData: Record<string, Record<string, { positive: number; neutral: number; negative: number }>> = {};

  // First, ensure all required years and months are initialized
  // We want to cover Jan 2024 to Mar 2025 irrespective of data
  const requiredYears = ["2024", "2025"];
  
  // Initialize all possible month-year combinations
  requiredYears.forEach(year => {
    monthYearData[year] = {};
    
    // For 2024, include all 12 months
    if (year === "2024") {
      MONTHS.forEach(month => {
        monthYearData[year][month] = { positive: 0, neutral: 0, negative: 0 };
      });
    }
    // For 2025, include Jan-Mar
    else if (year === "2025") {
      ["Jan", "Feb", "Mar"].forEach(month => {
        monthYearData[year][month] = { positive: 0, neutral: 0, negative: 0 };
      });
    }
  });

  console.log("Initialized month-year data structure:", monthYearData);

  // Now count the actual data
  data.forEach(item => {
    if (!item.submit_date) return;

    const date = new Date(item.submit_date);
    const year = date.getFullYear().toString();
    const month = getMonthName(date.getMonth());

    // Initialize the year and month if they don't exist yet
    if (!monthYearData[year]) {
      monthYearData[year] = {};
    }
    
    if (!monthYearData[year][month]) {
      monthYearData[year][month] = { positive: 0, neutral: 0, negative: 0 };
    }

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

  // Process data for all initialized month-year combinations
  Object.keys(monthYearData).forEach(year => {
    Object.keys(monthYearData[year]).forEach(month => {
      const counts = monthYearData[year][month];
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
