export type Sentiment = 'positive' | 'neutral' | 'negative';

export function analyzeSentiment(text: string | null | undefined, threshold = 0.3, rating?: number): { sentiment: Sentiment; sentiment_score: number } {
  // If text is empty or null, use rating as proxy for sentiment
  if (!text || text.trim() === '') {
    if (rating !== undefined && rating !== null) {
      return getRatingBasedSentiment(rating);
    }
    // Fallback to neutral if no text and no rating
    return { sentiment: 'neutral', sentiment_score: 0 };
  }

  const lowercaseText = text.toLowerCase();
  
  // Simple keyword-based sentiment analysis
  const positiveKeywords = [
    'bagus', 'baik', 'suka', 'senang', 'mantap', 'keren', 'hebat', 'luar biasa',
    'memuaskan', 'sempurna', 'excellent', 'amazing', 'great', 'good', 'love',
    'awesome', 'fantastic', 'wonderful', 'perfect', 'outstanding', 'brilliant'
  ];
  
  const negativeKeywords = [
    'buruk', 'jelek', 'tidak suka', 'kecewa', 'mengecewakan', 'lambat', 'lelet',
    'rusak', 'error', 'bad', 'terrible', 'awful', 'hate', 'worst', 'horrible',
    'disappointing', 'slow', 'broken', 'useless', 'frustrating', 'annoying'
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
function getRatingBasedSentiment(rating: number): { sentiment: Sentiment; sentiment_score: number } {
  // Normalize rating to 1-5 scale if needed
  const normalizedRating = Math.max(1, Math.min(5, Math.round(rating)));
  
  if (normalizedRating >= 4) {
    // Positive sentiment: rating 4-5
    // Score between 0.5 and 1.0
    const score = 0.3 + (normalizedRating - 4) * 0.4; // 4->0.3, 5->0.7
    return { sentiment: 'positive', sentiment_score: score };
  } else if (normalizedRating === 3) {
    // Neutral sentiment: rating 3
    return { sentiment: 'neutral', sentiment_score: 0 };
  } else {
    // Negative sentiment: rating 1-2
    // Score between -1.0 and -0.5
    const score = -0.7 + (normalizedRating - 1) * 0.4; // 1->-0.7, 2->-0.3
    return { sentiment: 'negative', sentiment_score: score };
  }
}
