
import { detectLanguage } from './detect-language';
import { analyzeEnglishSentiment } from './english-sentiment';
import { analyzeIndonesianSentiment } from './indonesian-sentiment';

export interface MultilingualSentimentResult {
  sentiment: string;
  sentiment_score: number;
  language: string;
  modelUsed: string;
}

export async function analyzeMultilingualSentiment(
  text: string, 
  rating?: number
): Promise<MultilingualSentimentResult> {
  // Handle empty feedback - use rating as proxy
  if (!text || text.trim() === '') {
    if (rating !== undefined && rating !== null) {
      const ratingResult = getRatingBasedSentiment(rating);
      return {
        ...ratingResult,
        language: 'unknown',
        modelUsed: 'RatingProxy'
      };
    }
    
    // No text and no rating - default to neutral
    return {
      sentiment: 'neutral',
      sentiment_score: 0,
      language: 'unknown',
      modelUsed: 'Default'
    };
  }

  try {
    // Detect language
    const language = detectLanguage(text);
    
    let result;
    let modelUsed;
    
    // Choose appropriate sentiment analyzer based on language
    if (language === 'id') {
      result = await analyzeIndonesianSentiment(text);
      modelUsed = 'IndobertModel';
    } else if (language === 'en') {
      result = await analyzeEnglishSentiment(text);
      modelUsed = 'DistilbertModel';
    } else {
      // Fallback to Indonesian for unknown languages
      result = await analyzeIndonesianSentiment(text);
      modelUsed = 'IndobertModel_Fallback';
    }
    
    return {
      sentiment: result.sentiment,
      sentiment_score: result.sentiment_score,
      language,
      modelUsed
    };
  } catch (error) {
    console.error('Error in multilingual sentiment analysis:', error);
    
    // Fallback: use rating if available, otherwise neutral
    if (rating !== undefined && rating !== null) {
      const ratingResult = getRatingBasedSentiment(rating);
      return {
        ...ratingResult,
        language: 'unknown',
        modelUsed: 'RatingFallback'
      };
    }
    
    return {
      sentiment: 'neutral',
      sentiment_score: 0,
      language: 'unknown',
      modelUsed: 'ErrorFallback'
    };
  }
}

/**
 * Convert rating to sentiment when feedback text is empty
 * rating ≥ 4 = positive
 * rating = 3 = neutral  
 * rating ≤ 2 = negative
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
