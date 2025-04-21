
import { supabase } from "@/integrations/supabase/client";

export async function updateBlankFeedbackToNeutral() {
  // Fetch blank feedback data (feedback is null, "", or ".")
  const { data: blankData, error: blankError } = await supabase
    .from("customer_feedback")
    .select("id")
    .or("feedback.is.null,feedback.eq.,feedback.eq.\"\"");

  if (blankError) {
    throw new Error(`Error fetching blank feedback: ${blankError.message}`);
  }

  let processed = 0;

  if (blankData && blankData.length > 0) {
    // Update blank items to neutral sentiment
    const { error: updateBlankError } = await supabase
      .from("customer_feedback")
      .update({
        sentiment: "neutral",
        sentiment_score: 0,
        last_analyzed_at: new Date().toISOString(),
      })
      .or("feedback.is.null,feedback.eq.,feedback.eq.\"\"");

    if (updateBlankError) {
      throw new Error(`Error updating blank feedback: ${updateBlankError.message}`);
    }
    processed = blankData.length;
  }

  return { processed };
}
