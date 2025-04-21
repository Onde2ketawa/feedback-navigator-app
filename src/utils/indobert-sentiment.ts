
import { pipeline, TextClassificationPipeline } from "@huggingface/transformers";
import { Sentiment } from "./sentiment-analysis";

let bertPipeline: TextClassificationPipeline | null = null;
let isLoading = false;
let loadFailCount = 0;
const MAX_LOAD_ATTEMPTS = 3;

/**
 * Loads IndoBERT sentiment analysis pipeline (finalproject/indobertweet-base-sentiment-classification, cached on first use).
 */
export async function getIndoBertSentimentPipeline(): Promise<TextClassificationPipeline> {
  if (bertPipeline) return bertPipeline;
  if (isLoading) {
    // Wait until it's loaded (avoid duplicate loads)
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (bertPipeline) return bertPipeline;
  }
  
  if (loadFailCount >= MAX_LOAD_ATTEMPTS) {
    throw new Error("Failed to load IndoBERT pipeline after multiple attempts. Using fallback instead.");
  }
  
  isLoading = true;

  try {
    // Use the exact model from HuggingFace you requested  
    // Remove the timeout option as it's not supported in the type definition
    const pipe: any = await pipeline(
      "sentiment-analysis",
      "finalproject/indobertweet-base-sentiment-classification"
    );
    bertPipeline = pipe as TextClassificationPipeline;
  } catch (err) {
    console.error("[IndoBERT] Failed to load pipeline:", err);
    loadFailCount++;
    isLoading = false;
    throw err;
  }

  isLoading = false;
  return bertPipeline!;
}

/**
 * Runs IndoBERTweet sentiment analysis prediction on given text.
 * Falls back to a more basic approach if model fails to load.
 */
export async function analyzeIndoBertSentiment(
  text: string
): Promise<{ sentiment: Sentiment; sentiment_score: number }> {
  try {
    if (loadFailCount >= MAX_LOAD_ATTEMPTS) {
      // Skip trying to use the model if we've failed multiple times
      throw new Error("Using fallback due to previous model load failures");
    }
    
    const pipe = await getIndoBertSentimentPipeline();
    // Use batch input to workaround TS pipeline typing
    const predictions = await pipe([text]) as Array<{ label: string; score: number }>;
    if (Array.isArray(predictions) && predictions[0]) {
      const prediction = predictions[0];
      let sentiment: Sentiment = "neutral";
      const label = prediction.label?.toUpperCase?.() || "";
      if (label === "POS" || label === "POSITIVE") sentiment = "positive";
      else if (label === "NEG" || label === "NEGATIVE") sentiment = "negative";
      // IndoBERTweet usually uses score (0..1), we map it as-is to sentiment_score
      if (typeof prediction.score === "number") {
        return {
          sentiment,
          sentiment_score: sentiment === "positive"
            ? prediction.score
            : sentiment === "negative"
            ? -prediction.score
            : 0
        };
      }
    }
    // fallback if response is missing or malformed
    return { sentiment: "neutral", sentiment_score: 0 };
  } catch (err) {
    console.error("[IndoBERT] analyzeIndoBertSentiment error:", err);
    
    // Extract text signals for fallback analysis
    const lowerText = text.toLowerCase();
    let sentiment: Sentiment = "neutral";
    let score = 0;
    
    // Very basic sentiment detection as fallback
    const positiveWords = ["happy", "good", "great", "excellent", "love", "like", "best", "bagus", "baik", "suka"];
    const negativeWords = ["bad", "terrible", "hate", "worst", "poor", "dislike", "jelek", "buruk", "benci"];
    
    let posCount = 0;
    let negCount = 0;
    
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) posCount++;
    });
    
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negCount++;
    });
    
    if (posCount > negCount) {
      sentiment = "positive";
      score = 0.75; // Arbitrary strong positive
    } else if (negCount > posCount) {
      sentiment = "negative";
      score = -0.75; // Arbitrary strong negative
    }
    
    return { 
      sentiment, 
      sentiment_score: sentiment === "positive" ? score : sentiment === "negative" ? score : 0 
    };
  }
}
