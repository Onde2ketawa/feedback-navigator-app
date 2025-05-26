
import { Sentiment, positiveKeywords, negativeKeywords, neutralKeywords } from "./keyword-sentiment";

/**
 * Indonesian-specific sentiment analysis using keywords.
 * Focuses on Indonesian words and patterns for better accuracy.
 */
export function analyzeIndonesianSentiment(
  text: string,
  threshold = 0.3
): { sentiment: Sentiment; sentiment_score: number } {
  if (!text) return { sentiment: "neutral", sentiment_score: 0 };
  const lowerText = text.toLowerCase();
  let pos = 0, neg = 0, neu = 0;

  // Filter keywords to Indonesian only (simplified - words with Indonesian characters or common Indonesian words)
  const idPositiveKeywords = positiveKeywords.filter(k => 
    k.includes('banget') || k.includes('gampang') || k.includes('nggak') || 
    k.includes('oke') || k.includes('cepet') || k.includes('mantap') ||
    k.includes('mudah') || k.includes('baik') || k.includes('bagus')
  );
  const idNegativeKeywords = negativeKeywords.filter(k => 
    k.includes('lemot') || k.includes('ribet') || k.includes('nyebelin') || 
    k.includes('mulu') || k.includes('nggak') || k.includes('jelek') ||
    k.includes('buruk') || k.includes('lambat') || k.includes('kecewa')
  );
  const idNeutralKeywords = neutralKeywords.filter(k => 
    k.includes('lumayan') || k.includes('biasa') || k.includes('standar') ||
    k.includes('gitulah') || k.includes('aja')
  );

  idPositiveKeywords.forEach((kw) => { if (lowerText.includes(kw)) pos++; });
  idNegativeKeywords.forEach((kw) => { if (lowerText.includes(kw)) neg++; });
  idNeutralKeywords.forEach((kw) => { if (lowerText.includes(kw)) neu++; });

  // Additional Indonesian-specific patterns
  if (lowerText.includes('banget') && pos > 0) pos++; // Intensifier
  if (lowerText.includes('mantap') || lowerText.includes('keren')) pos += 2;
  if (lowerText.includes('lemot banget') || lowerText.includes('ribet banget')) neg += 2;

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
