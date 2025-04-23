
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

  // Group by month and year
  const monthYearData: Record<string, Record<string, { positive: number; neutral: number; negative: number }>> = {};

  data.forEach(item => {
    if (!item.submit_date) return;

    const date = new Date(item.submit_date);
    const year = date.getFullYear().toString();
    const month = getMonthName(date.getMonth());

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

  // Ensure all years and months in the data are processed
  Object.keys(monthYearData).sort().forEach(year => {
    Object.keys(monthYearData[year]).forEach(month => {
      result.push({
        month,
        year,
        positive: monthYearData[year][month].positive,
        neutral: monthYearData[year][month].neutral,
        negative: monthYearData[year][month].negative
      });
    });
  });

  // Sort by year and month for proper display
  result.sort((a, b) => {
    if (a.year !== b.year) {
      return parseInt(a.year) - parseInt(b.year);
    }
    return getMonthIdx(a.month) - getMonthIdx(b.month);
  });

  return result;
}
