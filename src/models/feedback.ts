
export interface Feedback {
  id: string;
  channel: string;
  rating: number;
  submitDate: string;
  submitTime?: string;
  feedback?: string;
  category?: string;
  subcategory?: string;
  device?: string;
  appVersion?: string;
  language?: string;
  sentiment?: string;
  sentiment_score?: number;
}
