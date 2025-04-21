
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BertSentimentStats, mergeBertSentimentStats } from "./bertSentimentStats";
import { analyzeBertFeedbackBatch } from "./analyzeBertFeedbackBatch";
import { updateBlankFeedbackToNeutral } from "./updateBlankFeedbackToNeutral";

interface UpdateResult {
  processed: number;
  errors: number;
}

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
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<BertSentimentStats>({
    processed: 0,
    errors: 0,
    byLanguage: {},
    byModel: {},
    blankProcessed: 0,
  });
  const [lastError, setLastError] = useState<Error | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const PAGE_SIZE = 50; // Reduced from 100 to minimize potential timeout issues

  const recalculateWithBert = useCallback(async () => {
    if (isProcessing) {
      setLastMessage("Processing already in progress");
      return;
    }
    
    setIsProcessing(true);
    setProgress(0);
    setStats({
      processed: 0,
      errors: 0,
      byLanguage: {},
      byModel: {},
      blankProcessed: 0,
    });
    setLastError(null);
    setLastMessage("Starting sentiment analysis...");

    try {
      // First, update blank feedback to neutral
      setLastMessage("Processing blank feedback...");
      try {
        const blankResult = await updateBlankFeedbackToNeutral();
        setStats(prev => ({
          ...prev,
          blankProcessed: blankResult.processed
        }));
      } catch (error) {
        console.error("Error updating blank feedback:", error);
        // Continue with the rest of the process even if this part fails
      }

      // Count total items needing analysis (only non-blank feedback)
      const { count, error: countError } = await supabase
        .from("customer_feedback")
        .select("id", { count: "exact", head: true })
        .or("sentiment.eq.null,sentiment.eq.NEUTRAL,sentiment.eq.neutral")
        .gt("feedback_length", 0);

      if (countError) {
        console.error("Count error:", countError);
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
          // Fetch a batch of feedback needing analysis with retry logic
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
              console.error(`Fetch attempt ${retries} failed:`, err);
              if (retries >= maxRetries) throw err;
              await new Promise(resolve => setTimeout(resolve, 1000 * retries)); // Exponential backoff
            }
          }

          if (error) throw new Error(`Failed to fetch feedback batch: ${error.message}`);
          if (!data || data.length === 0) break;

          setLastMessage(`Processing batch ${offset + 1}-${Math.min(offset + PAGE_SIZE, total)} of ${total}`);

          // Use the keyword-based sentiment analysis instead of BERT due to connection issues
          const analysisResult = await analyzeBertFeedbackBatch(data);
          
          // Update each feedback item individually
          for (const update of analysisResult.updates) {
            try {
              const { error: updateError } = await supabase
                .from("customer_feedback")
                .update({
                  sentiment: update.sentiment,
                  sentiment_score: update.sentiment_score,
                  last_analyzed_at: update.last_analyzed_at
                })
                .eq("id", update.id);

              if (updateError) {
                console.error(`Failed to update feedback ${update.id}: ${updateError.message}`);
                aggregatedStats.errors += 1;
              }
            } catch (updateErr) {
              console.error(`Error updating feedback ${update.id}:`, updateErr);
              aggregatedStats.errors += 1;
            }
          }

          // Merge stats and progress
          aggregatedStats = mergeBertSentimentStats(aggregatedStats, {
            processed: analysisResult.processed,
            errors: analysisResult.errors,
            byLanguage: analysisResult.languageStats,
            byModel: analysisResult.modelStats,
            blankProcessed: 0,
          });

          processedCount += data.length;
          setProgress(Math.min(100, Math.round((processedCount / total) * 100)));
          setStats(aggregatedStats);
          setLastMessage(`Processed ${processedCount} / ${total} entries`);
          
          // Add a small delay between batches to prevent overloading the connection
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (batchError) {
          console.error("Batch processing error:", batchError);
          setLastMessage(`Error in batch starting at ${offset}: ${batchError.message}`);
          aggregatedStats.errors += PAGE_SIZE;
          continue; // Try the next batch instead of stopping completely
        }
      }

      setLastMessage(`Completed processing. Processed ${aggregatedStats.processed} items with ${aggregatedStats.errors} errors.`);
      setIsProcessing(false);
    } catch (error: any) {
      console.error("Error in recalculateWithBert:", error);
      setLastError(error);
      setLastMessage(`Error: ${error.message}. Try again later or use the keyword-based method.`);
      setIsProcessing(false);
    }
  }, [isProcessing, stats.blankProcessed]);

  return {
    isProcessing,
    progress,
    stats,
    lastError,
    lastMessage,
    recalculateWithBert,
  };
}
