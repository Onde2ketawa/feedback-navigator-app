
/**
 * Utility analisa sentiment sederhana berdasarkan kata kunci.
 */
const positiveKeywords = [
  "good", "great", "excellent", "happy", "satisfied", "awesome", "fantastic", 
  "perfect", "love", "recommend", "wonderful", "pleased", "impressed", "thank",
  "bagus", "puas", "memuaskan", "mantap", "suka", "terima kasih", "recommend",
  "cepat", "mudah", "helpful", "baik", "senang", "nikmat", "keren", "top"
];
const negativeKeywords = [
  "bad", "poor", "terrible", "horrible", "disappointed", "frustrated", "angry",
  "hate", "worst", "problem", "issue", "failed", "error", "broken", "slow",
  "gagal", "kecewa", "tidak puas", "sulit", "lambat", "error", "bug", "masalah",
  "jelek", "buruk", "tidak bisa", "tidak berfungsi", "komplain", "keluhan"
];
const neutralKeywords = [
  "ok", "okay", "average", "normal", "biasa", "lumayan", "cukup"
];

export function analyzeSentiment(text: string, threshold = 0.3) {
  if (!text) return { sentiment: "neutral", sentiment_score: 0 };
  const lowerText = text.toLowerCase();
  let pos = 0, neg = 0, neu = 0;
  positiveKeywords.forEach((kw) => { if (lowerText.includes(kw)) pos++; });
  negativeKeywords.forEach((kw) => { if (lowerText.includes(kw)) neg++; });
  neutralKeywords.forEach((kw) => { if (lowerText.includes(kw)) neu++; });

  const total = pos + neg + neu;
  let score = 0;
  if (total > 0) {
    score = (pos - neg) / total;
  }
  let sentiment: "positive" | "neutral" | "negative" = "neutral";
  if (score > threshold) sentiment = "positive";
  else if (score < -threshold) sentiment = "negative";

  return { sentiment, sentiment_score: score };
}
