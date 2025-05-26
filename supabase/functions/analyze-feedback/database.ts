
import { supabaseUrl, supabaseKey } from "./config.ts";
import type { FeedbackRecord } from "./types.ts";

export async function fetchFeedbackBatch(batchSize: number): Promise<FeedbackRecord[]> {
  const feedbackRes = await fetch(
    `${supabaseUrl}/rest/v1/customer_feedback?select=id,feedback,rating&or=(sentiment.is.null,sentiment.eq.unknown)&limit=${batchSize}`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    }
  );

  if (!feedbackRes.ok) {
    throw new Error(`Failed to fetch feedback: ${feedbackRes.status} ${await feedbackRes.text()}`);
  }

  return await feedbackRes.json();
}

export async function updateFeedbackSentiment(
  recordId: string,
  sentiment: string,
  score: number
): Promise<void> {
  const updateRes = await fetch(
    `${supabaseUrl}/rest/v1/customer_feedback?id=eq.${recordId}`,
    {
      method: "PATCH",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        sentiment,
        sentiment_score: score,
        last_analyzed_at: new Date().toISOString(),
      }),
    }
  );
  
  if (!updateRes.ok) {
    throw new Error(`Database update failed with status ${updateRes.status}`);
  }
}
