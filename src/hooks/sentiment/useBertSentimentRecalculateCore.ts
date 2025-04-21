
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BertSentimentStats, mergeBertSentimentStats } from "./bertSentimentStats";
import { analyzeBertFeedbackBatch } from "./analyzeBertFeedbackBatch";

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

  const PAGE_SIZE = 100;

  const recalculateWithBert = useCallback(async () => {
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
    setLastMessage(null);

    try {
      // Count total items needing analysis
      const { count, error: countError } = await supabase
        .from("customer_feedback")
        .select("id", { count: "exact", head: true })
        .or("sentiment.eq.null,sentiment.eq.NEUTRAL")
        .gt("feedback_length", 0);

      if (countError) throw new Error(`Failed to get total count: ${countError.message}`);

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
        blankProcessed: 0,
      };

      for (let offset = 0; offset < total; offset += PAGE_SIZE) {
        // Fetch a batch of feedback needing analysis
        const { data, error } = await supabase
          .from("customer_feedback")
          .select("id, feedback")
          .or("sentiment.eq.null,sentiment.eq.NEUTRAL")
          .gt("feedback_length", 0)
          .order("id", { ascending: true })
          .range(offset, offset + PAGE_SIZE - 1);

        if (error) throw new Error(`Failed to fetch feedback batch: ${error.message}`);
        if (!data || data.length === 0) break;

        // Analyze the batch using the helper function
        const analysisResult = await analyzeBertFeedbackBatch(data);
        
        // Update each feedback item individually instead of using upsert
        for (const update of analysisResult.updates) {
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
      }

      setIsProcessing(false);
    } catch (error: any) {
      setLastError(error);
      setLastMessage(error.message);
      setIsProcessing(false);
    }
  }, []);

  return {
    isProcessing,
    progress,
    stats,
    lastError,
    lastMessage,
    recalculateWithBert,
  };
}
