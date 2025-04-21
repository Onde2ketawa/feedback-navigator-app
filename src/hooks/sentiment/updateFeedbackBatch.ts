
import { supabase } from "@/integrations/supabase/client";

interface FeedbackUpdate {
  id: string;
  sentiment: string;
  sentiment_score: number;
  last_analyzed_at: string;
}

export async function updateFeedbackBatch(
  updates: FeedbackUpdate[]
): Promise<number> {
  let batchErrors = 0;
  for (const update of updates) {
    const { error } = await supabase
      .from("customer_feedback")
      .update({
        sentiment: update.sentiment,
        sentiment_score: update.sentiment_score,
        last_analyzed_at: update.last_analyzed_at,
      })
      .eq("id", update.id);
    if (error) batchErrors += 1;
  }
  return batchErrors;
}
