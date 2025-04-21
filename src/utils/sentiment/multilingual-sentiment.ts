
import { analyzeIndoBertSentiment } from "../indobert-sentiment";
import { analyzeEnglishSentiment } from "./english-sentiment";
import { detectLanguage } from "./detect-language";
import { analyzeSentiment, Sentiment } from "./keyword-sentiment";

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
 * IndoBERTweet sentiment analysis (async, English fallback)
 */
export async function analyzeSentimentWithIndoBert(text: string): Promise<{
  sentiment: Sentiment;
  sentiment_score: number;
}> {
  return await analyzeIndoBertSentiment(text);
}
