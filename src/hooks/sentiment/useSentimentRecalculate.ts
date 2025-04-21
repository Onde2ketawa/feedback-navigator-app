
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useSentimentRecalculate() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<{ processed: number; errors: number } | null>(null);

  // Enhanced recalculate function using database functions for sentiment analysis
  const recalculate = async () => {
    setIsProcessing(true);
    setProgress(0);
    setStats(null);

    try {
      // Get count of feedbacks that need analysis
      const { count } = await supabase
        .from("customer_feedback")
        .select("*", { count: "exact", head: true })
        .not("feedback", "is", null);

      if (!count || count === 0) {
        toast.success("No feedback needs analysis");
        setIsProcessing(false);
        return;
      }

      let processed = 0;
      let errors = 0;
      const batchSize = 50; // Adjust batch size for optimal performance
      let lastProcessedId: string | null = null;

      while (processed + errors < count) {
        try {
          // Use the new RPC function for batch processing
          const { data, error } = await supabase.rpc("analyze_feedback_batch", {
            batch_size: batchSize,
            min_id: lastProcessedId
          });

          if (error) throw new Error(`RPC error: ${error.message}`);
          
          if (!data || data.length === 0) {
            console.log("No more data to process, ending batch processing");
            break;
          }

          const batchResult = data[0];
          processed += batchResult.processed_count;
          lastProcessedId = batchResult.last_processed_id;
          
          setStats({ processed, errors });
          setProgress(Math.round(((processed + errors) / count) * 100));
          
          console.log(`Processed batch: ${batchResult.processed_count} records, last ID: ${lastProcessedId}`);
          
          // If no records were processed in this batch, we're done
          if (batchResult.processed_count === 0) break;
          
        } catch (err: any) {
          console.error("Error during sentiment analysis batch:", err);
          errors++;
          
          // Add small delay before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      toast.success(`Sentiment recalculation complete: ${processed} processed, ${errors} errors`);
      
      // Force a reload to update the dashboard
      window.location.reload();
    } catch (err: any) {
      toast.error(`Recalculation error: ${err.message ?? err}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Fallback to using the edge function if needed
  const recalculateWithEdgeFunction = async () => {
    setIsProcessing(true);
    setProgress(0);
    setStats(null);

    try {
      // Get count of feedbacks that need analysis
      const { count } = await supabase
        .from("customer_feedback")
        .select("*", { count: "exact", head: true })
        .not("feedback", "is", null);

      if (!count || count === 0) {
        toast.success("No feedback needs analysis");
        setIsProcessing(false);
        return;
      }

      let processed = 0;
      let errors = 0;
      const batchSize = 20;
      let retries = 0;
      const maxRetries = 3;

      while (processed + errors < count && retries < maxRetries) {
        try {
          // Call the edge function with enhanced parameters
          const res = await fetch("/api/functions/v1/analyze-feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              batchSize,
              delay: 0.1,
              useKeywordAnalysis: true,
              sentimentOptions: {
                threshold: 0.3,
              }
            }),
          });

          if (!res.ok) {
            throw new Error(`Server responded with status: ${res.status}`);
          }

          const data = await res.json();

          if (data.error) throw new Error(data.error);

          processed += data.processed ?? 0;
          errors += data.errors ?? 0;

          setStats({ processed, errors });
          setProgress(Math.round(((processed + errors) / count) * 100));

          retries = 0;

          if (data.done) break;
        } catch (err: any) {
          console.error("Error during edge function sentiment analysis:", err);
          retries++;
          
          if (retries < maxRetries) {
            toast.warning(`Analysis attempt failed, retrying (${retries}/${maxRetries})...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * retries));
          } else {
            throw err;
          }
        }
      }

      toast.success(`Sentiment recalculation complete: ${processed} processed, ${errors} errors`);
      
      // Force a reload to update the dashboard
      window.location.reload();
    } catch (err: any) {
      toast.error(`Recalculation error: ${err.message ?? err}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return { 
    isProcessing, 
    progress, 
    stats, 
    recalculate, 
    recalculateWithEdgeFunction // Added as fallback
  };
}
