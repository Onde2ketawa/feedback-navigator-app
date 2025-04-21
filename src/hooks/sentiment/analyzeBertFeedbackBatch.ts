
import { analyzeMultilingualSentiment } from "@/utils/sentiment-analysis";

interface FeedbackItem {
  id: string;
  feedback: string;
}

export interface BertAnalysisResult {
  updates: Array<{
    id: string;
    sentiment: string;
    sentiment_score: number;
    language?: string;
    model_used?: string;
    last_analyzed_at: string;
  }>;
  languageStats: Record<string, number>;
  modelStats: Record<string, number>;
  processed: number;
  errors: number;
}

export async function analyzeBertFeedbackBatch(
  feedbackBatch: FeedbackItem[]
): Promise<BertAnalysisResult> {
  const updates: BertAnalysisResult["updates"] = [];
  let processed = 0;
  let errors = 0;
  const languageStats: Record<string, number> = {};
  const modelStats: Record<string, number> = {};
  const now = new Date().toISOString();

  for (const item of feedbackBatch) {
    try {
      if (!item.feedback) continue;

      const result = await analyzeMultilingualSentiment(item.feedback);

      updates.push({
        id: item.id,
        sentiment: result.sentiment,
        sentiment_score: result.sentiment_score,
        language: result.language,
        model_used: result.modelUsed,
        last_analyzed_at: now,
      });

      languageStats[result.language] = (languageStats[result.language] || 0) + 1;
      modelStats[result.modelUsed] = (modelStats[result.modelUsed] || 0) + 1;
      processed++;
    } catch (err) {
      console.error(`Error analyzing feedback ${item.id}:`, err);
      errors++;
    }
  }

  return { updates, languageStats, modelStats, processed, errors };
}
