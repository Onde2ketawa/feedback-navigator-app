
import { supabase } from "@/integrations/supabase/client";
import { getIndoBertSentimentPipeline } from "@/utils/indobert-sentiment";

// You can run this with: bun scripts/reanalyze-neutral-feedback-with-bert.ts

async function run() {
  console.log("Fetching all feedback with sentiment = 'neutral'...");
  // Fetch feedback with neutral sentiment (limit to 1000 per batch for safety)
  let { data, error } = await supabase
    .from("customer_feedback")
    .select("id, feedback, sentiment, sentiment_score")
    .eq("sentiment", "neutral")
    .limit(1000); // adjust batch size if needed

  if (error) {
    console.error("❌ Error fetching neutral feedback:", error.message);
    process.exit(1);
    return;
  }
  if (!data || data.length === 0) {
    console.log("✅ No neutral feedback found. Nothing to update.");
    process.exit(0);
  }

  console.log(`Found ${data.length} rows to reanalyze.`);
  // Load model pipeline
  const pipeline = await getIndoBertSentimentPipeline();

  let updated = 0;
  let failed = 0;

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const text = row.feedback?.slice(0, 512) || "";
    if (!text) {
      console.log(`[SKIP] Empty feedback for id ${row.id}`);
      continue;
    }
    try {
      const predictions = await pipeline([text]);
      if (!predictions || !predictions[0]) {
        console.error(`[FAIL] Model did not return predictions for id ${row.id}`);
        failed++;
        continue;
      }
      let { label, score } = predictions[0];
      label = (label ?? "").toLowerCase();
      let sentiment = "neutral";
      if (label === "positive" || label === "pos") sentiment = "positive";
      else if (label === "negative" || label === "neg") sentiment = "negative";
      // IndoBERT: score is 0..1, make negative if negative sentiment
      let sentiment_score = sentiment === "positive" ? score : sentiment === "negative" ? -score : 0;

      // Only update row if result is not neutral or score changed
      if (sentiment !== "neutral" || sentiment_score !== row.sentiment_score) {
        const { error: updateErr } = await supabase
          .from("customer_feedback")
          .update({
            sentiment,
            sentiment_score
          })
          .eq("id", row.id);
        if (updateErr) {
          console.error(`[FAIL] Failed to update row id ${row.id}:`, updateErr.message);
          failed++;
          continue;
        }
        updated++;
        console.log(`[OK] Updated id ${row.id}: "${text}" => ${sentiment} (${sentiment_score.toFixed(2)})`);
      } else {
        console.log(`[SKIP] No change for id ${row.id}`);
      }
    } catch (err: any) {
      console.error(`[ERROR] Model failed for id ${row.id}:`, err.message || err);
      failed++;
    }
  }

  console.log(`\nDone. Updated ${updated} rows. ${failed > 0 ? `${failed} failed.` : ""}`);
  process.exit(0);
}

run();
