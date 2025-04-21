import { pipeline, TextClassificationPipeline } from "@huggingface/transformers";
import { Sentiment } from "./sentiment-analysis";

let bertPipeline: TextClassificationPipeline | null = null;
let isLoading = false;

/**
 * Loads IndoBERT sentiment analysis pipeline (cached on first use).
 * Uses: finalproject/indobertweet-base-sentiment-classification
 */
export async function getIndoBertSentimentPipeline(): Promise<TextClassificationPipeline> {
  if (bertPipeline) return bertPipeline;
  if (isLoading) {
    // Wait until it's loaded (avoid duplicate loads)
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (bertPipeline) return bertPipeline;
  }
  isLoading = true;

  // Fix: Explicitly assign to `any` then cast, to avoid TS2590 union type complexity
  const pipe: any = await pipeline(
    "sentiment-analysis", 
    "finalproject/indobertweet-base-sentiment-classification"
  );
  bertPipeline = pipe as TextClassificationPipeline;

  isLoading = false;
  return bertPipeline;
}

/**
 * Runs IndoBERTTweet sentiment analysis prediction on given text.
 */
export async function analyzeIndoBertSentiment(text: string): Promise<{ sentiment: Sentiment; sentiment_score: number }> {
  const pipeline = await getIndoBertSentimentPipeline();
  const predictions = await pipeline(text);
  // IndoBERTweet labels are (POS, NEG, NEU)
  if (Array.isArray(predictions) && predictions[0]) {
    const prediction = predictions[0];
    let sentiment: Sentiment = "neutral";
    
    // Type guard to ensure we can access label and score
    if ('label' in prediction) {
      const label = prediction.label;
      if (label === "POS") sentiment = "positive";
      else if (label === "NEG") sentiment = "negative";
      
      // IndoBERTweet usually uses score (0..1), we map it as-is to sentiment_score
      if ('score' in prediction) {
        return {
          sentiment,
          sentiment_score: label === "POS" ? prediction.score : label === "NEG" ? -prediction.score : 0
        };
      }
    }
  }
  return { sentiment: "neutral", sentiment_score: 0 };
}
