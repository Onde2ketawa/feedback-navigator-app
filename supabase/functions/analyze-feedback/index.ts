
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

console.log("Edge function starting up with Supabase URL:", supabaseUrl);

// Define keyword lists for enhanced sentiment analysis
const positiveKeywords = [
  "good", "great", "excellent", "happy", "satisfied", "awesome", "fantastic", 
  "perfect", "love", "recommend", "wonderful", "pleased", "impressed", "thank",
  "bagus", "puas", "memuaskan", "mantap", "suka", "terima kasih", "recommend",
  "cepat", "mudah", "helpful", "baik", "senang", "nikmat", "keren", "top"
];

const negativeKeywords = [
  "bad", "poor", "terrible", "horrible", "disappointed", "frustrated", "angry",
  "hate", "worst", "problem", "issue", "failed", "error", "broken", "slow",
  "gagal", "kecewa", "tidak puas", "sulit", "lambat", "error", "bug", "masalah",
  "jelek", "buruk", "tidak bisa", "tidak berfungsi", "komplain", "keluhan"
];

const neutralKeywords = [
  "ok", "okay", "average", "normal", "biasa", "lumayan", "cukup"
];

// Function to perform keyword-based sentiment analysis
function analyzeWithKeywords(text: string, threshold = 0.3) {
  if (!text) return { sentiment: "neutral", score: 0 };
  
  const lowercasedText = text.toLowerCase();
  
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;
  
  // Count keyword occurrences
  for (const keyword of positiveKeywords) {
    if (lowercasedText.includes(keyword)) positiveCount++;
  }
  
  for (const keyword of negativeKeywords) {
    if (lowercasedText.includes(keyword)) negativeCount++;
  }
  
  for (const keyword of neutralKeywords) {
    if (lowercasedText.includes(keyword)) neutralCount++;
  }
  
  const totalKeywords = positiveCount + negativeCount + neutralCount;
  
  // Calculate sentiment score (-1 to 1 scale)
  let score = 0;
  if (totalKeywords > 0) {
    score = (positiveCount - negativeCount) / totalKeywords;
  }
  
  // Determine sentiment category based on score and threshold
  let sentiment = "neutral";
  if (score > threshold) {
    sentiment = "positive";
  } else if (score < -threshold) {
    sentiment = "negative";
  }
  
  return { sentiment, score };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error("OPENAI_API_KEY is not set in environment variables");
    }

    const { batchSize = 10, delay = 0.2, useKeywordAnalysis = false, sentimentOptions = {} } = await req.json().catch(() => ({}));
    console.log(`Processing batch of ${batchSize} with ${delay}s delay between requests. Use keywords: ${useKeywordAnalysis}`);
    
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

    if (!feedbackRes.ok) {
      throw new Error(`Failed to fetch feedback: ${feedbackRes.status} ${await feedbackRes.text()}`);
    }

    const feedbackList = await feedbackRes.json();
    console.log(`Found ${feedbackList.length} feedback items to analyze`);

    for (const record of feedbackList) {
      try {
        if (!record.feedback || typeof record.feedback !== 'string' || record.feedback.trim() === '') {
          console.log(`Skipping record ${record.id}: Empty feedback`);
          continue;
        }

        console.log(`Analyzing feedback ID ${record.id}: "${record.feedback.substring(0, 50)}..."`);

        let sentiment = "neutral";
        let score = 0;
        
        if (useKeywordAnalysis) {
          // Use the keyword-based analysis if requested
          const threshold = sentimentOptions.threshold || 0.3;
          const result = analyzeWithKeywords(record.feedback, threshold);
          sentiment = result.sentiment;
          score = result.score;
          
          console.log(`Keyword analysis for ${record.id}: sentiment=${sentiment}, score=${score}`);
        } else {
          // Fall back to OpenAI analysis
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
            model: "gpt-4o-mini", // Use a fast, cost-effective model
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
          
          if (!aiRes.ok) {
            console.error(`OpenAI API error: ${aiRes.status} ${await aiRes.text()}`);
            throw new Error(`OpenAI API returned ${aiRes.status}`);
          }

          const aiJson = await aiRes.json();
          console.log(`Got OpenAI response for ID ${record.id}`);

          // Robust parsing (OpenAI might not ALWAYS return valid JSON!)
          const content = aiJson.choices?.[0]?.message?.content ?? "";
          console.log(`Raw content from OpenAI: "${content}"`);
          
          try {
            // Try to extract JSON, handling cases where it might be in backticks, etc.
            let jsonText = content;
            
            // If we have backticks around JSON, extract just the content
            const jsonMatch = content.match(/```(?:json)?(.*?)```/s);
            if (jsonMatch && jsonMatch[1]) {
              jsonText = jsonMatch[1].trim();
            }
            
            // Handle possible content with markdown or text before/after JSON
            const jsonStartPos = jsonText.indexOf('{');
            const jsonEndPos = jsonText.lastIndexOf('}');
            
            if (jsonStartPos !== -1 && jsonEndPos !== -1 && jsonEndPos > jsonStartPos) {
              jsonText = jsonText.substring(jsonStartPos, jsonEndPos + 1);
            }
            
            console.log(`Extracted JSON: ${jsonText}`);
            const jsonResp = JSON.parse(jsonText);
            
            if (
              ["positive", "neutral", "negative"].includes(jsonResp.sentiment) &&
              typeof jsonResp.score === "number"
            ) {
              sentiment = jsonResp.sentiment;
              score = Math.max(-1, Math.min(1, Number(jsonResp.score)));
              console.log(`Parsed sentiment: ${sentiment}, score: ${score}`);
            } else {
              console.log(`Invalid sentiment data in response: ${JSON.stringify(jsonResp)}`);
            }
          } catch (parseError) {
            console.error(`Failed to parse OpenAI response: ${parseError.message}`, content);
            errors++;
            continue;
          }
        }

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
              last_analyzed_at: new Date().toISOString(),
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
