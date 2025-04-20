
export interface SentimentTrendDataPoint {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}

export interface SentimentDistributionDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface SentimentCategoryDataPoint {
  name: string;
  sentiment_score: number;
  count: number;
}
