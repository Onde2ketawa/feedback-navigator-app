
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { analyzeBertFeedbackBatch } from "./analyzeBertFeedbackBatch";
import { updateBlankFeedbackToNeutral } from "./updateBlankFeedbackToNeutral";
import { mergeBertSentimentStats, BertSentimentStats } from "./bertSentimentStats";

export function useBertSentimentRecalculate() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<BertSentimentStats | null>(null);
  const [lastError, setLastError] = useState<Error | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const recalculateWithBert = async () => {
    setIsProcessing(true);
    setProgress(0);
    setStats(null);
    setLastError(null);
    setLastMessage(null);

    let totalProcessed = 0;
    let totalErrors = 0;
    let blankProcessed = 0;
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

      // Process blank feedback
      try {
        const { processed } = await updateBlankFeedbackToNeutral();
        blankProcessed = processed;
        if (processed > 0) {
          languageStats["blank"] = (languageStats["blank"] || 0) + processed;
          modelStats["none"] = (modelStats["none"] || 0) + processed;
          totalProcessed += processed;
        }
      } catch (err) {
        throw new Error("Error updating blank feedback: " + (err instanceof Error ? err.message : String(err)));
      }

      // Process remaining items with text in batches
      let offset = 0;
      while (true) {
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

        const batchResult = await analyzeBertFeedbackBatch(feedbackBatch);

        // Batch update to database
        for (const update of batchResult.updates) {
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
            totalErrors++;
          }
        }

        // Merge stats
        for (const [lang, val] of Object.entries(batchResult.languageStats)) {
          languageStats[lang] = (languageStats[lang] || 0) + val;
        }
        for (const [model, val] of Object.entries(batchResult.modelStats)) {
          modelStats[model] = (modelStats[model] || 0) + val;
        }
        totalProcessed += batchResult.processed;
        totalErrors += batchResult.errors;

        // Update progress
        if (count) {
          setProgress(Math.round(((totalProcessed + totalErrors) / count) * 100));
        }

        // Update stats
        setStats({
          processed: totalProcessed,
          errors: totalErrors,
          byLanguage: { ...languageStats },
          byModel: { ...modelStats },
          blankProcessed,
        });

        offset += batchSize;
      }

      let languageSummary = Object.entries(languageStats)
        .map(([lang, cnt]) => `${lang}: ${cnt}`)
        .join(", ");

      const message = `Analysis complete: ${totalProcessed} processed (${languageSummary}), ${totalErrors} errors`;
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
