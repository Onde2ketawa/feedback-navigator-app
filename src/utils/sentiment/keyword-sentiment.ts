
export type Sentiment = 'positive' | 'neutral' | 'negative';

interface SentimentResult {
  sentiment: Sentiment;
  sentiment_score: number;
}

export function analyzeSentiment(
  text: string | null | undefined, 
  threshold = 0.3, 
  rating?: number
): SentimentResult {
  // If text is empty or null, use rating as proxy for sentiment
  if (!text || text.trim() === '') {
    if (rating !== undefined && rating !== null) {
      return getRatingBasedSentiment(rating);
    }
    // Fallback to neutral if no text and no rating
    return { sentiment: 'neutral', sentiment_score: 0 };
  }

  const lowercaseText = text.toLowerCase();
  
  // Enhanced keyword lists for Indonesian and English
  const positiveKeywords = [
    // Indonesian positive keywords
    'bagus', 'baik', 'suka', 'senang', 'mantap', 'keren', 'hebat', 'luar biasa',
    'memuaskan', 'sempurna', 'oke', 'ok', 'terima kasih', 'thanks', 'makasih',
    'puas', 'recommended', 'sukses', 'lancar', 'mudah', 'cepat', 'responsive',
    
    // English positive keywords
    'excellent', 'amazing', 'great', 'good', 'love', 'awesome', 'fantastic', 
    'wonderful', 'perfect', 'outstanding', 'brilliant', 'superb', 'nice',
    'satisfied', 'happy', 'pleased', 'impressed', 'recommend', 'helpful'
  ];
  
  const negativeKeywords = [
    // Indonesian negative keywords
    'buruk', 'jelek', 'tidak suka', 'kecewa', 'mengecewakan', 'lambat', 'lelet',
    'rusak', 'error', 'bermasalah', 'sulit', 'ribet', 'susah', 'payah', 'parah',
    'lemot', 'hang', 'lag', 'stuck', 'loading', 'tidak bisa', 'gabisa',
    
    // English negative keywords
    'bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'disappointing', 
    'slow', 'broken', 'useless', 'frustrating', 'annoying', 'confusing',
    'difficult', 'hard', 'impossible', 'crash', 'freeze', 'stuck', 'failed'
  ];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveKeywords.forEach(keyword => {
    if (lowercaseText.includes(keyword)) {
      positiveCount++;
    }
  });
  
  negativeKeywords.forEach(keyword => {
    if (lowercaseText.includes(keyword)) {
      negativeCount++;
    }
  });
  
  const totalKeywords = positiveCount + negativeCount;
  let score = 0;
  
  if (totalKeywords > 0) {
    score = (positiveCount - negativeCount) / totalKeywords;
  }
  
  let sentiment: Sentiment = 'neutral';
  if (score > threshold) {
    sentiment = 'positive';
  } else if (score < -threshold) {
    sentiment = 'negative';
  }
  
  return { sentiment, sentiment_score: score };
}

/**
 * Convert rating to sentiment when feedback text is empty
 * rating ≥ 4 = positive
 * rating = 3 = neutral  
 * rating ≤ 2 = negative
 */
function getRatingBasedSentiment(rating: number): SentimentResult {
  const normalizedRating = Math.max(1, Math.min(5, Math.round(rating)));
  
  if (normalizedRating >= 4) {
    // Positive sentiment: rating 4-5
    const score = 0.3 + (normalizedRating - 4) * 0.4;
    return { sentiment: 'positive', sentiment_score: score };
  } else if (normalizedRating === 3) {
    // Neutral sentiment: rating 3
    return { sentiment: 'neutral', sentiment_score: 0 };
  } else {
    // Negative sentiment: rating 1-2
    const score = -0.7 + (normalizedRating - 1) * 0.4;
    return { sentiment: 'negative', sentiment_score: score };
  }
}
