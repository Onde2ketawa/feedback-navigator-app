
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, supabaseUrl } from "./config.ts";
import { fetchFeedbackBatch, updateFeedbackSentiment } from "./database.ts";
import { processFeedbackRecord } from "./sentiment-processor.ts";
import type { AnalysisOptions, ProcessingResult } from "./types.ts";

console.log("Edge function starting up with Supabase URL:", supabaseUrl);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const options: AnalysisOptions = await req.json().catch(() => ({
      batchSize: 10,
      delay: 0.2,
      useKeywordAnalysis: true,
      sentimentOptions: {}
    }));

    console.log(`Processing batch of ${options.batchSize} with ${options.delay}s delay between requests. Use keywords: ${options.useKeywordAnalysis}`);
    
    let processed = 0;
    let errors = 0;

    // Fetch records to process
    const feedbackList = await fetchFeedbackBatch(options.batchSize || 10);
    console.log(`Found ${feedbackList.length} feedback items to analyze`);

    for (const record of feedbackList) {
      try {
        const { sentiment, score } = await processFeedbackRecord(record, options);

        // Update the feedback record with new sentiment & score
        await updateFeedbackSentiment(record.id, sentiment, score);
        
        console.log(`Successfully updated feedback ID ${record.id} with sentiment: ${sentiment}, score: ${score}`);
        processed++;
      } catch (err) {
        console.error(`Error processing feedback ID ${record.id}:`, err);
        errors++;
        // Continue loop even on failure
      }

      // Rate limit
      await new Promise((resolve) => setTimeout(resolve, (options.delay || 0.2) * 1000));
    }

    const result: ProcessingResult = {
      done: feedbackList.length < (options.batchSize || 10),
      processed,
      errors,
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: error?.message ?? "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
