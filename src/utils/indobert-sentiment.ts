
import { pipeline, TextClassificationPipeline } from "@huggingface/transformers";
import { Sentiment } from "./sentiment-analysis";

let bertPipeline: TextClassificationPipeline | null = null;
let isLoading = false;

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
  isLoading = true;

  try {
    // Use the exact model from HuggingFace you requested  
    const pipe: any = await pipeline(
      "sentiment-analysis",
      "finalproject/indobertweet-base-sentiment-classification"
    );
    bertPipeline = pipe as TextClassificationPipeline;
  } catch (err) {
    console.error("[IndoBERT] Failed to load pipeline:", err);
    isLoading = false;
    throw err;
  }

  isLoading = false;
  return bertPipeline!;
}

/**
 * Runs IndoBERTweet sentiment analysis prediction on given text.
 */
export async function analyzeIndoBertSentiment(
  text: string
): Promise<{ sentiment: Sentiment; sentiment_score: number }> {
  try {
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
    return { sentiment: "neutral", sentiment_score: 0 };
  }
}
