
import { analyzeWithKeywords } from "./analysis.ts";
import { analyzeWithOpenAI } from "./openai-analyzer.ts";
import type { FeedbackRecord, AnalysisOptions } from "./types.ts";

/**
 * Convert rating to sentiment when feedback text is empty
 */
function getRatingBasedSentiment(rating: number): { sentiment: string; score: number } {
  console.log(`Converting rating ${rating} to sentiment`);
  const normalizedRating = Math.max(1, Math.min(5, Math.round(rating)));
  
  if (normalizedRating >= 4) {
    const score = 0.3 + (normalizedRating - 4) * 0.4;
    console.log(`Rating ${normalizedRating} >= 4, returning positive with score ${score}`);
    return { sentiment: "positive", score };
  } else if (normalizedRating === 3) {
    console.log(`Rating ${normalizedRating} = 3, returning neutral`);
    return { sentiment: "neutral", score: 0 };
  } else {
    const score = -0.7 + (normalizedRating - 1) * 0.4;
    console.log(`Rating ${normalizedRating} <= 2, returning negative with score ${score}`);
    return { sentiment: "negative", score };
  }
}

export async function processFeedbackRecord(
  record: FeedbackRecord,
  options: AnalysisOptions
): Promise<{ sentiment: string; score: number }> {
  const hasEmptyFeedback = !record.feedback || typeof record.feedback !== 'string' || record.feedback.trim() === '';
  
  if (hasEmptyFeedback) {
    console.log(`Processing record ${record.id} with empty feedback, rating: ${record.rating}`);
  } else {
    console.log(`Analyzing feedback ID ${record.id}: "${record.feedback.substring(0, 50)}..."`);
  }

  let sentiment = "neutral";
  let score = 0;
  
  if (options.useKeywordAnalysis) {
    // Use the keyword-based analysis with rating proxy
    const threshold = options.sentimentOptions?.threshold || 0.3;
    const result = analyzeWithKeywords(record.feedback, threshold, record.rating);
    sentiment = result.sentiment;
    score = result.score;
    
    console.log(`Analysis for ${record.id}: sentiment=${sentiment}, score=${score}${hasEmptyFeedback ? ' (from rating)' : ''}`);
  } else {
    // Fall back to OpenAI analysis or rating proxy for empty feedback
    if (hasEmptyFeedback && record.rating !== undefined && record.rating !== null) {
      const ratingResult = getRatingBasedSentiment(record.rating);
      sentiment = ratingResult.sentiment;
      score = ratingResult.score;
      console.log(`Used rating ${record.rating} as proxy: sentiment=${sentiment}, score=${score}`);
    } else if (!hasEmptyFeedback) {
      const aiResult = await analyzeWithOpenAI(record.feedback);
      sentiment = aiResult.sentiment;
      score = aiResult.score;
    }
  }

  return { sentiment, score };
}
