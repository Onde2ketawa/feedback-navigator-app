
export interface FeedbackRecord {
  id: string;
  feedback: string;
  rating?: number;
}

export interface AnalysisOptions {
  batchSize?: number;
  delay?: number;
  useKeywordAnalysis?: boolean;
  sentimentOptions?: {
    threshold?: number;
  };
}

export interface ProcessingResult {
  done: boolean;
  processed: number;
  errors: number;
}
