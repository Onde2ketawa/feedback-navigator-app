
import { Sentiment, positiveKeywords, negativeKeywords, neutralKeywords } from "./keyword-sentiment";

/**
 * English-specific sentiment analysis using keywords.
 * Similar to the classic keywords logic but with English-specific handling.
 */
export function analyzeEnglishSentiment(
  text: string,
  threshold = 0.3
): { sentiment: Sentiment; sentiment_score: number } {
  if (!text) return { sentiment: "neutral", sentiment_score: 0 };
  const lowerText = text.toLowerCase();
  let pos = 0, neg = 0, neu = 0;

  // Filter keywords to English only (simplified)
  const enPositiveKeywords = positiveKeywords.filter(k => !k.match(/[áàãâéèêíìîóòõôúùûçñ]/i));
  const enNegativeKeywords = negativeKeywords.filter(k => !k.match(/[áàãâéèêíìîóòõôúùûçñ]/i));
  const enNeutralKeywords = neutralKeywords.filter(k => !k.match(/[áàãâéèêíìîóòõôúùûçñ]/i));

  enPositiveKeywords.forEach((kw) => { if (lowerText.includes(kw)) pos++; });
  enNegativeKeywords.forEach((kw) => { if (lowerText.includes(kw)) neg++; });
  enNeutralKeywords.forEach((kw) => { if (lowerText.includes(kw)) neu++; });

  // Additional English-specific patterns
  if (lowerText.includes('!') && pos > 0) pos++;
  if (lowerText.match(/\bvery\s+(?:good|nice|great)\b/i)) pos += 2;
  if (lowerText.match(/\bawful\b|\bterrible\b|\bworst\b/i)) neg += 2;

  const total = pos + neg + neu;
  let score = 0;
  if (total > 0) {
    score = (pos - neg) / total;
  }

  let sentiment: Sentiment = "neutral";
  if (score > threshold) sentiment = "positive";
  else if (score < -threshold) sentiment = "negative";

  return { sentiment, sentiment_score: score };
}
