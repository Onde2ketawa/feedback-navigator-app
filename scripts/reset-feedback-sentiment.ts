
import { supabase } from "@/integrations/supabase/client";

// Script to set sentiment and sentiment_score to NULL for all feedback
async function resetSentiment() {
  const { error } = await supabase
    .from("customer_feedback")
    .update({
      sentiment: null,
      sentiment_score: null,
    })
    .neq("sentiment", null)
    .neq("sentiment_score", null);

  if (error) {
    console.error("Failed to update sentiment columns:", error.message);
  } else {
    console.log("Sentiment columns reset to NULL for all rows.");
  }
}

// You can run this function directly if running as node script.
resetSentiment();
