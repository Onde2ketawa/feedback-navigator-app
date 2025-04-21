
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BertSentimentStats, mergeBertSentimentStats } from "./bertSentimentStats";
import { analyzeBertFeedbackBatch } from "./analyzeBertFeedbackBatch";
import { updateBlankFeedbackToNeutral } from "./updateBlankFeedbackToNeutral";
import { useSentimentProgress } from "./useSentimentProgress";
import { updateFeedbackBatch } from "./updateFeedbackBatch";

interface UseBertSentimentRecalculateCoreReturn {
  isProcessing: boolean;
  progress: number;
  stats: BertSentimentStats;
  lastError: Error | null;
  lastMessage: string | null;
  recalculateWithBert: () => Promise<void>;
}

export function useBertSentimentRecalculateCore(): UseBertSentimentRecalculateCoreReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  // State management delegated to custom hook
  const { progress, setProgress, stats, setStats, resetStats } = useSentimentProgress();

  const PAGE_SIZE = 50;

  const recalculateWithBert = useCallback(async () => {
    if (isProcessing) {
      setLastMessage("Processing already in progress");
      return;
    }
    setIsProcessing(true);
    resetStats();
    setLastError(null);
    setLastMessage("Starting sentiment analysis...");

    try {
      setLastMessage("Processing blank feedback...");
      try {
        const blankResult = await updateBlankFeedbackToNeutral();
        setStats((prev) => ({
          ...prev,
          blankProcessed: blankResult.processed,
        }));
      } catch (error) {
        // blank feedback update failed but continue
        console.error("Error updating blank feedback:", error);
      }

      const { count, error: countError } = await supabase
        .from("customer_feedback")
        .select("id", { count: "exact", head: true })
        .or("sentiment.eq.null,sentiment.eq.NEUTRAL,sentiment.eq.neutral")
        .gt("feedback_length", 0);

      if (countError) {
        throw new Error(`Failed to get total count: ${countError.message}`);
      }

      if (!count || count === 0) {
        setLastMessage("No feedback to analyze.");
        setIsProcessing(false);
        return;
      }

      let total = count;
      let processedCount = 0;
      let aggregatedStats: BertSentimentStats = {
        processed: 0,
        errors: 0,
        byLanguage: {},
        byModel: {},
        blankProcessed: stats.blankProcessed,
      };

      setLastMessage(`Found ${total} items to process...`);

      for (let offset = 0; offset < total; offset += PAGE_SIZE) {
        try {
          // Fetch batch with retry logic
          let data = null;
          let error = null;
          let retries = 0;
          const maxRetries = 3;

          while (!data && retries < maxRetries) {
            try {
              const response = await supabase
                .from("customer_feedback")
                .select("id, feedback")
                .or("sentiment.eq.null,sentiment.eq.NEUTRAL,sentiment.eq.neutral")
                .gt("feedback_length", 0)
                .order("id", { ascending: true })
                .range(offset, offset + PAGE_SIZE - 1);

              data = response.data;
              error = response.error;

              if (error) throw error;
              if (!data || data.length === 0) break;
            } catch (err) {
              retries++;
              if (retries >= maxRetries) throw err;
              await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
            }
          }

          if (error) throw new Error(`Failed to fetch feedback batch: ${error.message}`);
          if (!data || data.length === 0) break;

          setLastMessage(`Processing batch ${offset + 1}-${Math.min(offset + PAGE_SIZE, total)} of ${total}`);

          // Perform analysis and update
          const analysisResult = await analyzeBertFeedbackBatch(data);

          // Update database using utility
          const batchErrors = await updateFeedbackBatch(analysisResult.updates);

          // Merge stats and progress
          aggregatedStats = mergeBertSentimentStats(aggregatedStats, {
            processed: analysisResult.processed,
            errors: analysisResult.errors + batchErrors,
            byLanguage: analysisResult.languageStats,
            byModel: analysisResult.modelStats,
            blankProcessed: 0,
          });

          processedCount += data.length;
          setProgress(Math.min(100, Math.round((processedCount / total) * 100)));
          setStats(aggregatedStats);
          setLastMessage(`Processed ${processedCount} / ${total} entries`);

          // Prevent overload
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (batchError: any) {
          setLastMessage(`Error in batch starting at ${offset}: ${batchError.message}`);
          aggregatedStats.errors += PAGE_SIZE;
          continue;
        }
      }

      setLastMessage(`Completed processing. Processed ${aggregatedStats.processed} items with ${aggregatedStats.errors} errors.`);
      setIsProcessing(false);
    } catch (error: any) {
      setLastError(error);
      setLastMessage(`Error: ${error.message}. Try again later or use the keyword-based method.`);
      setIsProcessing(false);
    }
  }, [isProcessing, resetStats, setProgress, setStats, stats.blankProcessed]);

  return {
    isProcessing,
    progress,
    stats,
    lastError,
    lastMessage,
    recalculateWithBert,
  };
}
