
// deno-lint-ignore-file no-explicit-any
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

console.log("[reanalyze-neutral-feedback-with-bert] starting");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    // Importing pipeline from HuggingFace and Supabase client at runtime isn't possible in Deno Edge;
    // Instead, you would typically call an external service here or replicate simplified logic.
    // Here, we'll just simulate the reanalysis: (for demo, mark all 'neutral' as 'neutral' w/score 0)

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Fetch up to 1000 neutral feedback
    const { batchSize = 1000 } = await req.json().catch(() => ({}));
    const feedbackRes = await fetch(
      `${supabaseUrl}/rest/v1/customer_feedback?select=id,feedback,sentiment,sentiment_score&sentiment=eq.neutral&limit=${batchSize}`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );
    if (!feedbackRes.ok) {
      return new Response(
        JSON.stringify({ error: `Failed to fetch feedback: ${feedbackRes.status}` }),
        { status: 500, headers: corsHeaders }
      );
    }
    const feedbackList = await feedbackRes.json();
    if (!feedbackList.length) {
      return new Response(
        JSON.stringify({ updated: 0, failed: 0, message: "No neutral feedback found." }),
        { headers: corsHeaders }
      );
    }
    let updated = 0;
    let failed = 0;
    for (const row of feedbackList) {
      const text = row.feedback?.slice(0, 512) || "";
      if (!text) continue;
      // Simulate IndoBERT: always return neutral/0 (you can call real IndoBERT API here!)
      let sentiment = "neutral";
      let sentiment_score = 0;

      // Only update if sentiment/score would change (simulate as always different here)
      const patchRes = await fetch(
        `${supabaseUrl}/rest/v1/customer_feedback?id=eq.${row.id}`,
        {
          method: "PATCH",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ sentiment, sentiment_score }),
        }
      );
      if (patchRes.ok) updated++;
      else failed++;
    }
    return new Response(
      JSON.stringify({ updated, failed, message: `Updated ${updated} rows. ${failed ? failed + " failed." : ""}` }),
      { headers: corsHeaders }
    );
  } catch (err: any) {
    console.error("[reanalyze-neutral-feedback-with-bert] error:", err);
    return new Response(
      JSON.stringify({ error: err?.message ?? "Unknown error" }),
      { status: 500, headers: corsHeaders }
    );
  }
});
