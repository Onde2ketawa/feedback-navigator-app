
export interface BertSentimentStats {
  processed: number;
  errors: number;
  byLanguage?: Record<string, number>;
  byModel?: Record<string, number>;
  blankProcessed?: number;
}

export function mergeBertSentimentStats(
  stats: BertSentimentStats,
  add: Partial<BertSentimentStats>
): BertSentimentStats {
  return {
    ...stats,
    processed: (stats.processed || 0) + (add.processed || 0),
    errors: (stats.errors || 0) + (add.errors || 0),
    blankProcessed: (stats.blankProcessed || 0) + (add.blankProcessed || 0),
    byLanguage: {
      ...(stats.byLanguage || {}),
      ...(add.byLanguage || {}),
    },
    byModel: {
      ...(stats.byModel || {}),
      ...(add.byModel || {}),
    },
  };
}
