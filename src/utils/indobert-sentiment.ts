
import { pipeline, PipelineType, SentimentClassificationPipeline } from "@huggingface/transformers";

let bertPipeline: SentimentClassificationPipeline | null = null;
let isLoading = false;

/**
 * Loads IndoBERT sentiment analysis pipeline (cached on first use).
 * Uses: finalproject/indobertweet-base-sentiment-classification
 */
export async function getIndoBertSentimentPipeline(): Promise<SentimentClassificationPipeline> {
  if (bertPipeline) return bertPipeline;
  if (isLoading) {
    // Wait until it's loaded (avoid duplicate loads)
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (bertPipeline) return bertPipeline;
  }
  isLoading = true;
  bertPipeline = await pipeline(
    "sentiment-analysis" as PipelineType, 
    "finalproject/indobertweet-base-sentiment-classification", 
    { quantized: false }
  ) as SentimentClassificationPipeline;
  isLoading = false;
  return bertPipeline;
}

/**
 * Runs IndoBERTTweet sentiment analysis prediction on given text.
 */
export async function analyzeIndoBertSentiment(text: string) {
  const pipeline = await getIndoBertSentimentPipeline();
  const predictions = await pipeline(text);
  // IndoBERTweet labels are (POS, NEG, NEU)
  if (Array.isArray(predictions) && predictions[0]) {
    const label = predictions[0].label;
    let sentiment: "positive" | "neutral" | "negative" = "neutral";
    if (label === "POS") sentiment = "positive";
    else if (label === "NEG") sentiment = "negative";
    // IndoBERTweet usually uses score (0..1), we map it as-is to sentiment_score
    return {
      sentiment,
      sentiment_score: label === "POS" ? predictions[0].score : label === "NEG" ? -predictions[0].score : 0
    };
  }
  return { sentiment: "neutral", sentiment_score: 0 };
}
