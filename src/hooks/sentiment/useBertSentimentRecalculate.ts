
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { analyzeIndoBertSentiment } from "@/utils/indobert-sentiment";
import { analyzeMultilingualSentiment } from "@/utils/sentiment-analysis";

export function useBertSentimentRecalculate() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<{
    processed: number;
    errors: number;
    byLanguage?: Record<string, number>;
    byModel?: Record<string, number>;
  } | null>(null);
  const [lastError, setLastError] = useState<Error | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const recalculateWithBert = async () => {
    setIsProcessing(true);
    setProgress(0);
    setStats(null);
    setLastError(null);
    setLastMessage(null);

    let processed = 0;
    let errors = 0;
    const languageStats: Record<string, number> = {};
    const modelStats: Record<string, number> = {};
    const batchSize = 10;

    try {
      // Get count of feedback items
      const { count, error: countError } = await supabase
        .from("customer_feedback")
        .select("*", { count: "exact", head: true })
        .not("feedback", "is", null)
        .not("feedback", "eq", "");

      if (countError) {
        throw new Error(`Count error: ${countError.message}`);
      }

      if (!count || count === 0) {
        setLastMessage("No feedback needs analysis");
        toast.success("No feedback needs analysis");
        setIsProcessing(false);
        return;
      }

      // Process blank feedback separately
      const { data: blankData, error: blankError } = await supabase
        .from("customer_feedback")
        .select("id")
        .or("feedback.is.null,feedback.eq.,feedback.eq.\"\"");

      if (blankError) {
        throw new Error(`Error fetching blank feedback: ${blankError.message}`);
      }

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

        processed += blankData.length;
        languageStats["blank"] = (languageStats["blank"] || 0) + blankData.length;
        modelStats["none"] = (modelStats["none"] || 0) + blankData.length;
      }

      // Process remaining items with text in batches
      let offset = 0;
      while (true) {
        // Fetch batch of feedback to analyze
        const { data: feedbackBatch, error: batchError } = await supabase
          .from("customer_feedback")
          .select("id, feedback")
          .not("feedback", "is", null)
          .not("feedback", "eq", "")
          .range(offset, offset + batchSize - 1);

        if (batchError) {
          throw new Error(`Error fetching feedback batch: ${batchError.message}`);
        }

        if (!feedbackBatch || feedbackBatch.length === 0) {
          break;
        }

        // Process each feedback in batch
        const updates: Array<{
          id: string;
          sentiment: string;
          sentiment_score: number;
          language?: string;
          model_used?: string;
          last_analyzed_at: string;
        }> = [];

        for (const item of feedbackBatch) {
          try {
            if (!item.feedback) continue;
            
            // Use multilingual sentiment analysis
            const result = await analyzeMultilingualSentiment(item.feedback);
            
            updates.push({
              id: item.id,
              sentiment: result.sentiment,
              sentiment_score: result.sentiment_score,
              language: result.language,
              model_used: result.modelUsed,
              last_analyzed_at: new Date().toISOString(),
            });
            
            // Update stats
            languageStats[result.language] = (languageStats[result.language] || 0) + 1;
            modelStats[result.modelUsed] = (modelStats[result.modelUsed] || 0) + 1;
            
            processed++;
          } catch (err) {
            console.error(`Error analyzing feedback ${item.id}:`, err);
            errors++;
          }
        }

        // Batch update to database
        if (updates.length > 0) {
          for (const update of updates) {
            const { error: updateError } = await supabase
              .from("customer_feedback")
              .update({
                sentiment: update.sentiment,
                sentiment_score: update.sentiment_score,
                // Only add these columns if they exist in the database schema
                // language: update.language,
                // model_used: update.model_used,
                last_analyzed_at: update.last_analyzed_at,
              })
              .eq("id", update.id);

            if (updateError) {
              console.error(`Error updating feedback ${update.id}:`, updateError);
              errors++;
            }
          }
        }

        // Update progress
        if (count) {
          setProgress(Math.round(((processed + errors) / count) * 100));
        }
        
        // Update stats
        setStats({
          processed,
          errors,
          byLanguage: languageStats,
          byModel: modelStats,
        });

        offset += batchSize;
      }

      let languageSummary = Object.entries(languageStats)
        .map(([lang, count]) => `${lang}: ${count}`)
        .join(", ");
      
      const message = `Analysis complete: ${processed} processed (${languageSummary}), ${errors} errors`;
      setLastMessage(message);
      toast.success(message);
      
      // Force a reload to update the dashboard
      window.location.reload();
    } catch (err: any) {
      console.error("Error in recalculateWithBert:", err);
      setLastError(err);
      toast.error(`Analysis error: ${err.message ?? err}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    progress,
    stats,
    lastError,
    lastMessage,
    recalculateWithBert,
  };
}
