
/**
 * Enhanced sentiment analysis utility using both classic keywords and IndoBERT model (Huggingface).
 * Supports multilingual analysis with automatic language detection.
 */
import { analyzeIndoBertSentiment } from "./indobert-sentiment";

export type Sentiment = "positive" | "neutral" | "negative";

// POSITIVE KEYWORDS
const positiveKeywords = [
  // Bahasa Indonesia - Baku
  "mudah digunakan",
  "cepat",
  "aman",
  "praktis",
  "fitur lengkap",
  "transaksi lancar",
  "notifikasi real-time",
  "antarmuka intuitif",
  "saldo akurat",
  "layanan responsif",
  // Bahasa Indonesia - Slang
  "keren banget",
  "gampang dipakai",
  "nggak lemot",
  "amanah",
  "fiturnya oke punya",
  "top-up cepet",
  "gak ribet",
  "notifnya nyampe real-time",
  "ui-nya user-friendly",
  "cs-nya ramah",
  // English - Formal
  "user-friendly",
  "fast transaction",
  "secure",
  "reliable",
  "great features",
  "smooth performance",
  "instant notification",
  "easy navigation",
  "good customer support",
  "accurate balance",
  // English - Informal/Slang
  "super easy to use",
  "super fast",
  "no lag",
  "super safe",
  "features are lit",
  "money transfer in a snap",
  "no hassle",
  "notifications are on point",
  "ui is clean",
  "cs is helpful",
  // Category based positive
  "aman",
  "secure",
  "verifikasi dua langkah",
  "2fa",
  "transfer instan",
  "instant transfer",
  "cs ramah",
  "helpful support",
  "aplikasi sering update",
  "frequent updates"
];

// NEGATIVE KEYWORDS
const negativeKeywords = [
  // Bahasa Indonesia - Baku
  "error",
  "lambat",
  "sulit digunakan",
  "tidak aman",
  "aplikasi crash",
  "transaksi gagal",
  "verifikasi lama",
  "biaya tersembunyi",
  "notifikasi telat",
  "layanan tidak responsif",
  // Bahasa Indonesia - Slang
  "lemot banget",
  "error mulu",
  "ribet login",
  "kena charge nggak jelas",
  "notif telat nyampe",
  "cs-nya nyebelin",
  "gampang hang",
  "kreditnya nggak cair-cair",
  "aplikasi nge-freeze",
  "banyak bug",
  // English - Formal
  "glitchy",
  "slow processing",
  "poor security",
  "frequent crashes",
  "transaction failed",
  "hidden fees",
  "unresponsive support",
  "confusing interface",
  "login issues",
  "delayed notifications",
  // English - Informal/Slang
  "so buggy",
  "takes forever to load",
  "keeps crashing",
  "wtf, why so many fees",
  "cs is useless",
  "can’t even log in",
  "money got stuck",
  "worst app ever",
  "notifications mia",
  "ui is a mess",
  // Category based negative
  "penipuan",
  "fraud",
  "gagal bayar",
  "payment failed",
  "respon lambat",
  "slow response",
  "downtime lama",
  "too much maintenance"
];

// NEUTRAL KEYWORDS
const neutralKeywords = [
  // Bahasa Indonesia - Baku
  "standar",
  "biasa saja",
  "cukup memadai",
  "tidak ada masalah",
  "sesuai ekspektasi",
  // Bahasa Indonesia - Slang
  "lumayanlah",
  "nggak jelek, nggak bagus",
  "ya gitulah",
  "standar aja",
  "gak ada masalah sih",
  // English - Formal
  "average",
  "nothing special",
  "works fine",
  "no major issues",
  "meets expectations",
  // English - Informal/Slang
  "it’s okay, i guess",
  "not bad, not great",
  "does the job",
  "meh",
  "no complaints"
];

/**
 * Basic language detection function
 * Returns 'id' for Indonesian, 'en' for English, or 'other'
 */
export function detectLanguage(text: string): 'id' | 'en' | 'other' {
  if (!text) return 'en';
  
  const lowerText = text.toLowerCase();
  
  // Indonesian-specific words
  const idWords = ['yang', 'dengan', 'tidak', 'ini', 'dan', 'di', 'itu', 'untuk', 'adalah', 'ada', 
    'pada', 'juga', 'dari', 'akan', 'bisa', 'dalam', 'oleh', 'saya', 'kamu', 'dia', 'mereka', 
    'nya', 'gak', 'nggak', 'gak bisa', 'ga', 'gimana', 'kenapa', 'banget', 'sih', 'dong', 'mah', 
    'aja', 'deh', 'kok', 'mau', 'udah', 'sudah', 'belum', 'jadi', 'kalo', 'kalau', 'sama', 'buat'];
  
  // Count Indonesian words
  let idWordCount = 0;
  for (const word of idWords) {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const matches = lowerText.match(regex);
    if (matches) {
      idWordCount += matches.length;
    }
  }
  
  const wordCount = lowerText.split(/\s+/).length;
  
  // If more than 10% of words are Indonesian-specific, classify as Indonesian
  if (idWordCount / wordCount > 0.1) {
    return 'id';
  }
  
  // Default to English for now (can be expanded with more sophisticated detection)
  return 'en';
}

/**
 * English-specific sentiment analysis using keywords.
 * Similar to the classic keywords logic but with English-specific handling.
 */
function analyzeEnglishSentiment(text: string, threshold = 0.3): { sentiment: Sentiment; sentiment_score: number } {
  if (!text) return { sentiment: "neutral", sentiment_score: 0 };
  const lowerText = text.toLowerCase();
  let pos = 0, neg = 0, neu = 0;

  // Filter keywords to English only (simplified for this implementation)
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

/**
 * Classic keywords logic (unchanged)
 */
export function analyzeSentiment(text: string, threshold = 0.2): { sentiment: Sentiment; sentiment_score: number } {
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

  let sentiment: Sentiment = "neutral";
  if (score > threshold) sentiment = "positive";
  else if (score < -threshold) sentiment = "negative";

  return { sentiment, sentiment_score: score };
}

/**
 * Multilingual sentiment analysis with automatic language detection
 */
export async function analyzeMultilingualSentiment(text: string): Promise<{ 
  sentiment: Sentiment; 
  sentiment_score: number;
  language: string;
  modelUsed: string;
}> {
  if (!text || text.trim() === '') {
    return { sentiment: "neutral", sentiment_score: 0, language: 'unknown', modelUsed: 'none' };
  }
  
  // Detect language
  const language = detectLanguage(text);
  console.log(`[Sentiment] Detected language: ${language} for text: "${text.substring(0, 50)}..."`);
  
  try {
    if (language === 'id') {
      // Use IndoBERT for Indonesian text
      const result = await analyzeIndoBertSentiment(text);
      return { ...result, language: 'id', modelUsed: 'IndoBERTweet' };
    } else {
      // Use English-specific analyzer for English text
      const result = analyzeEnglishSentiment(text);
      return { ...result, language: 'en', modelUsed: 'EnglishKeywords' };
    }
  } catch (error) {
    console.error("[Sentiment] Error in multilingual analysis:", error);
    
    // Fallback to basic keyword analysis
    const fallbackResult = analyzeSentiment(text);
    return { 
      ...fallbackResult, 
      language: language, 
      modelUsed: 'KeywordsFallback' 
    };
  }
}

/**
 * IndoBERTweet sentiment analysis (async)
 */
export async function analyzeSentimentWithIndoBert(text: string): Promise<{ sentiment: Sentiment; sentiment_score: number }> {
  return await analyzeIndoBertSentiment(text);
}
