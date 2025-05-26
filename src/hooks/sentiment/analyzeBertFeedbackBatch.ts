
import { analyzeMultilingualSentiment } from "@/utils/sentiment/multilingual-sentiment";
import { analyzeSentiment } from "@/utils/sentiment/keyword-sentiment";

interface FeedbackItem {
  id: string;
  feedback: string;
  rating?: number; // Add rating field
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
      // Check if feedback is empty and rating is available
      const hasEmptyFeedback = !item.feedback || item.feedback.trim() === '';
      
      let result;
      try {
        // Pass rating to multilingual sentiment analysis for proxy functionality
        result = await analyzeMultilingualSentiment(item.feedback, item.rating);
      } catch (err) {
        console.error(`Error with multilingual analysis for ${item.id}:`, err);
        // Fall back to basic keyword analysis with rating proxy
        if (hasEmptyFeedback && item.rating !== undefined) {
          // Use rating-based sentiment for empty feedback
          const ratingBasedResult = getRatingBasedSentiment(item.rating);
          result = {
            ...ratingBasedResult,
            language: 'unknown',
            modelUsed: 'FallbackRating'
          };
        } else {
          const fallbackResult = analyzeSentiment(item.feedback);
          result = {
            ...fallbackResult,
            language: 'unknown',
            modelUsed: 'FallbackKeywords'
          };
        }
      }

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
      
      // Even on error, we'll add a default neutral sentiment to keep the process moving
      updates.push({
        id: item.id,
        sentiment: 'neutral',
        sentiment_score: 0,
        language: 'unknown',
        model_used: 'ErrorFallback',
        last_analyzed_at: now,
      });
      
      modelStats['ErrorFallback'] = (modelStats['ErrorFallback'] || 0) + 1;
      languageStats['unknown'] = (languageStats['unknown'] || 0) + 1;
    }
  }

  return { updates, languageStats, modelStats, processed, errors };
}

/**
 * Helper function for rating-based sentiment (duplicate of multilingual-sentiment for fallback)
 */
function getRatingBasedSentiment(rating: number): { sentiment: string; sentiment_score: number } {
  const normalizedRating = Math.max(1, Math.min(5, Math.round(rating)));
  
  if (normalizedRating >= 4) {
    const score = 0.3 + (normalizedRating - 4) * 0.4;
    return { sentiment: 'positive', sentiment_score: score };
  } else if (normalizedRating === 3) {
    return { sentiment: 'neutral', sentiment_score: 0 };
  } else {
    const score = -0.7 + (normalizedRating - 1) * 0.4;
    return { sentiment: 'negative', sentiment_score: score };
  }
}
