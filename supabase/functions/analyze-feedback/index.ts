
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { batchSize = 10, delay = 0.2 } = await req.json().catch(() => ({}));
    let processed = 0;
    let errors = 0;

    // Fetch records to process (not-yet-analyzed or null sentiment)
    const feedbackRes = await fetch(
      `${supabaseUrl}/rest/v1/customer_feedback?select=id,feedback&or=(sentiment.is.null,sentiment.eq.unknown)&feedback=not.is.null&limit=${batchSize}`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );
    const feedbackList = await feedbackRes.json();

    for (const record of feedbackList) {
      try {
        const prompt = [
          {
            role: "system",
            content:
              'Analyze the sentiment of this customer feedback. Respond ONLY with a JSON object containing "sentiment" (positive/neutral/negative) and "score" (-1 to 1). Example: {"sentiment": "positive", "score": 0.8}',
          },
          {
            role: "user",
            content: record.feedback,
          },
        ];
        const body = {
          model: "gpt-4o", // Use the latest, fast model
          messages: prompt,
          temperature: 0.2,
          max_tokens: 50,
        };

        const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAIApiKey}`,
          },
          body: JSON.stringify(body),
        });
        const aiJson = await aiRes.json();

        // Robust parsing (OpenAI might not ALWAYS return valid JSON!)
        let sentiment = "neutral";
        let score = 0;
        const content = aiJson.choices?.[0]?.message?.content ?? "";
        try {
          const jsonResp = JSON.parse(content);
          if (
            ["positive", "neutral", "negative"].includes(jsonResp.sentiment) &&
            typeof jsonResp.score === "number"
          ) {
            sentiment = jsonResp.sentiment;
            score = Math.max(-1, Math.min(1, Number(jsonResp.score)));
          }
        } catch {
          // If not proper JSON, mark as error (or fallback)
          errors++;
          continue;
        }

        // Update the feedback record with new sentiment & score
        await fetch(
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
        processed++;
      } catch (err) {
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
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error?.message ?? "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
