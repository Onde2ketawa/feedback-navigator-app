
/**
 * Enhanced sentiment analysis utility based on keyword matching for multilingual text.
 * Supports English and Indonesian keywords.
 */

export type Sentiment = "positive" | "neutral" | "negative";

// Enhanced keyword lists in English and Indonesian
const positiveKeywords = [
  "good", "great", "excellent", "happy", "satisfied", "awesome", "fantastic", 
  "perfect", "love", "recommend", "wonderful", "pleased", "impressed", "thank",
  "bagus", "puas", "memuaskan", "mantap", "suka", "terima kasih", "recommend",
  "cepat", "mudah", "helpful", "baik", "senang", "nikmat", "keren", "top",
  "sempurna", "luar biasa", "menakjubkan", "recommended", "puas hati"
];

const negativeKeywords = [
  "bad", "poor", "terrible", "horrible", "disappointed", "frustrated", "angry",
  "hate", "worst", "problem", "issue", "failed", "error", "broken", "slow",
  "gagal", "kecewa", "tidak puas", "sulit", "lambat", "error", "bug", "masalah",
  "jelek", "buruk", "tidak bisa", "tidak berfungsi", "komplain", "keluhan",
  "rusak", "mengecewakan", "menyesal", "tidak membantu", "kacau", "blunder"
];

const neutralKeywords = [
  "ok", "okay", "average", "normal", "biasa", "lumayan", "cukup", "standard",
  "biasa saja", "standar", "regular", "tidak ada masalah"
];

/**
 * Analyzes text sentiment based on keyword matching
 * @param text The text to analyze
 * @param threshold The threshold for determining sentiment (default 0.2)
 * @returns Object containing sentiment and sentiment_score
 */
export function analyzeSentiment(text: string, threshold = 0.2): { sentiment: Sentiment; sentiment_score: number } {
  // Handle empty or null text
  if (!text) return { sentiment: "neutral", sentiment_score: 0 };
  
  const lowerText = text.toLowerCase();
  let pos = 0, neg = 0, neu = 0;
  
  // Count keyword matches
  positiveKeywords.forEach((kw) => { if (lowerText.includes(kw)) pos++; });
  negativeKeywords.forEach((kw) => { if (lowerText.includes(kw)) neg++; });
  neutralKeywords.forEach((kw) => { if (lowerText.includes(kw)) neu++; });

  const total = pos + neg + neu;
  let score = 0;
  
  // Calculate sentiment score (-1 to 1 scale)
  if (total > 0) {
    score = (pos - neg) / total;
  }
  
  // Determine sentiment category based on score and threshold
  let sentiment: Sentiment = "neutral";
  if (score > threshold) sentiment = "positive";
  else if (score < -threshold) sentiment = "negative";

  return { sentiment, sentiment_score: score };
}

