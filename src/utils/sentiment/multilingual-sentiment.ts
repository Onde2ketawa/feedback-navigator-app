import { detectLanguage } from './language-detector';
import { analyzeSentiment as analyzeIndonesianSentiment } from './indonesian-sentiment';
import { analyzeSentiment as analyzeEnglishSentiment } from './english-sentiment';

export async function analyzeMultilingualSentiment(
  text: string, 
  rating?: number
): Promise<{ sentiment: string; sentiment_score: number; modelUsed: string }> {
  try {
    // If text is empty or null, use rating as proxy for sentiment
    if (!text || text.trim() === '') {
      if (rating !== undefined && rating !== null) {
        const result = getRatingBasedSentiment(rating);
        return {
          sentiment: result.sentiment,
          sentiment_score: result.sentiment_score,
          modelUsed: 'rating-proxy'
        };
      }
      // Fallback to neutral if no text and no rating
      return { sentiment: 'neutral', sentiment_score: 0, modelUsed: 'default-neutral' };
    }

    const detectedLanguage = detectLanguage(text);
    
    let result: { sentiment: string; sentiment_score: number };
    let modelUsed = '';

    if (detectedLanguage === 'id') {
      // Indonesian text - use keyword analysis
      result = analyzeIndonesianSentiment(text);
      modelUsed = 'indonesian-keywords';
    } else {
      // English or other languages - use English sentiment analysis
      result = analyzeEnglishSentiment(text);
      modelUsed = 'english-keywords';
    }

    return {
      sentiment: result.sentiment,
      sentiment_score: result.sentiment_score,
      modelUsed
    };
  } catch (error) {
    console.error('Error in multilingual sentiment analysis:', error);
    
    // Fallback: try to use rating if available
    if (rating !== undefined && rating !== null) {
      const result = getRatingBasedSentiment(rating);
      return {
        sentiment: result.sentiment,
        sentiment_score: result.sentiment_score,
        modelUsed: 'rating-fallback'
      };
    }
    
    // Final fallback
    return { sentiment: 'neutral', sentiment_score: 0, modelUsed: 'error-fallback' };
  }
}

/**
 * Convert rating to sentiment when feedback text is empty
 * rating ≥ 4 = positive
 * rating = 3 = neutral  
 * rating ≤ 2 = negative
 */
function getRatingBasedSentiment(rating: number): { sentiment: string; sentiment_score: number } {
  // Normalize rating to 1-5 scale if needed
  const normalizedRating = Math.max(1, Math.min(5, Math.round(rating)));
  
  if (normalizedRating >= 4) {
    // Positive sentiment: rating 4-5
    // Score between 0.3 and 0.7
    const score = 0.3 + (normalizedRating - 4) * 0.4; // 4->0.3, 5->0.7
    return { sentiment: 'positive', sentiment_score: score };
  } else if (normalizedRating === 3) {
    // Neutral sentiment: rating 3
    return { sentiment: 'neutral', sentiment_score: 0 };
  } else {
    // Negative sentiment: rating 1-2
    // Score between -0.7 and -0.3
    const score = -0.7 + (normalizedRating - 1) * 0.4; // 1->-0.7, 2->-0.3
    return { sentiment: 'negative', sentiment_score: score };
  }
}
