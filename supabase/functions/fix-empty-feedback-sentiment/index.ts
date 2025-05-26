
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for Edge Functions
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

console.log("Edge function fix-empty-feedback-sentiment starting with Supabase URL:", supabaseUrl);

/**
 * Convert rating to sentiment when feedback text is empty
 */
function getRatingBasedSentiment(rating: number): { sentiment: string; score: number } {
  console.log(`Converting rating ${rating} to sentiment`);
  const normalizedRating = Math.max(1, Math.min(5, Math.round(rating)));
  
  if (normalizedRating >= 4) {
    const score = 0.3 + (normalizedRating - 4) * 0.4;
    console.log(`Rating ${normalizedRating} >= 4, returning positive with score ${score}`);
    return { sentiment: "positive", score };
  } else if (normalizedRating === 3) {
    console.log(`Rating ${normalizedRating} = 3, returning neutral`);
    return { sentiment: "neutral", score: 0 };
  } else {
    const score = -0.7 + (normalizedRating - 1) * 0.4;
    console.log(`Rating ${normalizedRating} <= 2, returning negative with score ${score}`);
    return { sentiment: "negative", score };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { batchSize = 50 } = await req.json().catch(() => ({}));
    console.log(`Processing batch of ${batchSize} empty feedback records`);

    let processed = 0;
    let errors = 0;

    // Fetch feedback records with empty/null feedback but with ratings
    const feedbackRes = await fetch(
      `${supabaseUrl}/rest/v1/customer_feedback?select=id,feedback,rating,sentiment&and=(feedback.is.null,rating.not.is.null)&or=(feedback.eq.,rating.not.is.null)&limit=${batchSize}`,
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
    
    const feedbackList: Array<{ id: string; feedback: string | null; rating: number; sentiment: string | null }> = await feedbackRes.json();

    console.log(`Found ${feedbackList.length} empty feedback records to process`);

    if (feedbackList.length === 0) {
      return new Response(
        JSON.stringify({
          done: true,
          processed: 0,
          errors: 0,
          message: "No empty feedback records to process",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    for (const record of feedbackList) {
      try {
        // Only process if feedback is truly empty/null
        const hasEmptyFeedback = !record.feedback || record.feedback.trim() === '';
        
        if (hasEmptyFeedback && record.rating) {
          const { sentiment, score } = getRatingBasedSentiment(record.rating);
          
          // Update record in DB
          const patchRes = await fetch(
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
                sentiment: sentiment,
                sentiment_score: score,
                last_analyzed_at: new Date().toISOString(),
              }),
            }
          );
          
          if (!patchRes.ok) {
            const text = await patchRes.text();
            throw new Error(`Failed to update feedback ${record.id}: ${patchRes.status} ${text}`);
          }
          
          processed++;
          console.log(`Updated feedback ID ${record.id}: rating ${record.rating} -> sentiment ${sentiment} (score: ${score})`);
        }
      } catch (err) {
        errors++;
        console.error(`Error processing feedback ID ${record.id}:`, err);
      }
    }

    return new Response(
      JSON.stringify({
        done: feedbackList.length < batchSize,
        processed,
        errors,
        message: `Fixed ${processed} empty feedback records with rating-based sentiment`
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: error?.message ?? "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
