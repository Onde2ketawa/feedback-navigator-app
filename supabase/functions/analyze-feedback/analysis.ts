
// Sentiment analysis logic using keywords

import { positiveKeywords, negativeKeywords, neutralKeywords } from "./keywords.ts";

export function analyzeWithKeywords(text: string, threshold = 0.3) {
  if (!text) return { sentiment: "neutral", score: 0 };
  
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
