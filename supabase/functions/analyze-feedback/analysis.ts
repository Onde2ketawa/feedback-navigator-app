// Enhanced sentiment analysis logic using keywords

import { positiveKeywords, negativeKeywords, neutralKeywords } from "./keywords.ts";

/**
 * Analyzes text sentiment based on keyword matching
 * @param text The text to analyze
 * @param threshold The threshold for determining sentiment (default 0.2)
 * @param rating Optional rating to use as proxy when text is empty
 * @returns Object containing sentiment and score
 */
export function analyzeWithKeywords(text: string, threshold = 0.2, rating?: number) {
  // Handle empty or null text - use rating as proxy
  if (!text || text.trim() === '') {
    if (rating !== undefined && rating !== null) {
      return getRatingBasedSentiment(rating);
    }
    return { sentiment: "neutral", score: 0 };
  }
  
  const lowercasedText = text.toLowerCase();
  
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;
  
  // Count keyword occurrences
  for (const keyword of positiveKeywords) {
    if (lowercasedText.includes(keyword)) positiveCount++;
  }
  
  for (const keyword of negativeKeywords) {
    if (lowercasedText.includes(keyword)) negativeCount++;
  }
  
  for (const keyword of neutralKeywords) {
    if (lowercasedText.includes(keyword)) neutralCount++;
  }
  
  const totalKeywords = positiveCount + negativeCount + neutralCount;
  
  // Calculate sentiment score (-1 to 1 scale)
  let score = 0;
  if (totalKeywords > 0) {
    score = (positiveCount - negativeCount) / totalKeywords;
  }
  
  // Determine sentiment category based on score and threshold
  let sentiment = "neutral";
  if (score > threshold) {
    sentiment = "positive";
  } else if (score < -threshold) {
    sentiment = "negative";
  }
  
  return { sentiment, score };
}

/**
 * Convert rating to sentiment when feedback text is empty
 * rating ≥ 4 = positive
 * rating = 3 = neutral  
 * rating ≤ 2 = negative
 */
function getRatingBasedSentiment(rating: number) {
  // Normalize rating to 1-5 scale if needed
  const normalizedRating = Math.max(1, Math.min(5, Math.round(rating)));
  
  if (normalizedRating >= 4) {
    // Positive sentiment: rating 4-5
    // Score between 0.3 and 0.7
    const score = 0.3 + (normalizedRating - 4) * 0.4; // 4->0.3, 5->0.7
    return { sentiment: "positive", score };
  } else if (normalizedRating === 3) {
    // Neutral sentiment: rating 3
    return { sentiment: "neutral", score: 0 };
  } else {
    // Negative sentiment: rating 1-2
    // Score between -0.7 and -0.3
    const score = -0.7 + (normalizedRating - 1) * 0.4; // 1->-0.7, 2->-0.3
    return { sentiment: "negative", score };
  }
}
