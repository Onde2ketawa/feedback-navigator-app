
import { supabase } from "@/integrations/supabase/client";

// This script sets sentiment and sentiment_score to NULL for all customer_feedback rows
async function resetSentiment() {
  const { error, count } = await supabase
    .from("customer_feedback")
    .update({
      sentiment: null,
      sentiment_score: null,
    })
    // Don't add WHERE clause so it updates all rows
    .select("id", { count: 'exact', head: true }); // Just to fetch a count of affected rows (safe, does not return IDs)

  if (error) {
    console.error("❌ Failed to update sentiment columns:", error.message);
    process.exit(1);
  } else {
    console.log(`✅ Sentiment columns reset to NULL for all customer_feedback rows${typeof count === 'number' ? ` (${count} rows affected)` : ''}.`);
    process.exit(0);
  }
}

// Run directly with Node.js or Bun
resetSentiment();
