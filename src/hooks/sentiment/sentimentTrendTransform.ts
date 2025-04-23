
export interface SentimentTrendMonthYearPoint {
  month: string;      // "Jan", "Feb", ...
  year: string;       // "2024", "2025", ...
  positive: number;
  neutral: number;
  negative: number;
}

// As the SQL returns the exact shape, the transform can simply forward the data
export function processRawSentimentData(data: any[]): SentimentTrendMonthYearPoint[] {
  if (!data || data.length === 0) return [];

  return (data as any[]).map((item) => ({
    month: item.month_short,
    year: String(item.year),
    positive: Number(item.positive_count),
    neutral: Number(item.neutral_count),
    negative: Number(item.negative_count)
  }));
}
