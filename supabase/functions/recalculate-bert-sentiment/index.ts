
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const bertApiUrl = Deno.env.get("BERT_API_URL");
const bertApiToken = Deno.env.get("BERT_API_TOKEN");

console.log("Edge function starting up with BERT API URL:", bertApiUrl || "Not configured");

// Fallback to use our own sentiment analysis if BERT API is not configured
import { analyzeSentiment } from "./sentiment.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { batchSize = 10, delay = 0.2 } = await req.json().catch(() => ({}));
    console.log(`Processing batch of ${batchSize} with ${delay}s delay between requests.`);
    
    let processed = 0;
    let errors = 0;

    // Fetch records to process (not-yet-analyzed or null sentiment_score) that have non-empty feedback
    const feedbackRes = await fetch(
      `${supabaseUrl}/rest/v1/customer_feedback?select=id,feedback&or=(sentiment_score.is.null,sentiment_score.eq.0)&not.feedback.is.null&limit=${batchSize}`,
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

    const feedbackList = await feedbackRes.json();
    console.log(`Found ${feedbackList.length} feedback items to analyze with sentiment model`);

    if (feedbackList.length === 0) {
      return new Response(
        JSON.stringify({
          done: true,
          processed: 0,
          errors: 0,
          message: "No feedback items found that need sentiment analysis"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    for (const record of feedbackList) {
      try {
        if (!record.feedback || typeof record.feedback !== 'string' || record.feedback.trim() === '') {
          console.log(`Skipping record ${record.id}: Empty feedback`);
          continue;
        }

        console.log(`Analyzing feedback ID ${record.id}: "${record.feedback.substring(0, 50)}..."`);

        let sentimentResult;
        
        // If BERT API is configured, use it
        if (bertApiUrl && bertApiToken) {
          console.log(`Using external BERT API for analysis of ${record.id}`);
          
          // Call the external BERT API with authorization token
          const bertRes = await fetch(bertApiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${bertApiToken}`,
            },
            body: JSON.stringify({ feedback: record.feedback }),
          });
          
          if (!bertRes.ok) {
            console.error(`BERT API error: ${bertRes.status} ${await bertRes.text()}`);
            throw new Error(`BERT API returned ${bertRes.status}`);
          }

          sentimentResult = await bertRes.json();
          console.log(`Got BERT analysis for ID ${record.id}: ${JSON.stringify(sentimentResult)}`);
        } else {
          // Fallback to local sentiment analysis if BERT API is not configured
          console.log(`Using fallback sentiment analysis for ${record.id}`);
          sentimentResult = analyzeSentiment(record.feedback);
        }
        
        const sentiment = sentimentResult.sentiment || "neutral";
        const score = sentimentResult.sentiment_score || 0;

        // Update the feedback record with new sentiment & score
        const updateRes = await fetch(
          `${supabaseUrl}/rest/v1/customer_feedback?id=eq.${record.id}`,
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
            }),
          }
        );
        
        if (!updateRes.ok) {
          console.error(`Failed to update record ${record.id}: ${updateRes.status} ${await updateRes.text()}`);
          throw new Error(`Database update failed with status ${updateRes.status}`);
        }
        
        console.log(`Successfully updated feedback ID ${record.id} with sentiment: ${sentiment}, score: ${score}`);
        processed++;
      } catch (err) {
        console.error(`Error processing feedback ID ${record.id}:`, err);
        errors++;
        // Continue loop even on failure
      }

      // Rate limit
      await new Promise((resolve) => setTimeout(resolve, delay * 1000));
    }

    return new Response(
      JSON.stringify({
        done: feedbackList.length < batchSize,
        processed,
        errors,
        message: processed > 0 ? `Successfully processed ${processed} items` : "No items processed"
      }),
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
