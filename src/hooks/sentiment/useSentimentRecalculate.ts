
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useSentimentRecalculate() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<{ processed: number; errors: number } | null>(null);

  // Recalculate using direct database function call
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

      // Use the recalculate_sentiment_scores function which is in our types
      const { error } = await supabase.rpc("recalculate_sentiment_scores");
      
      if (error) throw new Error(`RPC error: ${error.message}`);
      
      // Since we can't track progress with this function, we'll just set it to 100%
      setProgress(100);
      setStats({ processed: count, errors: 0 });
      
      toast.success(`Sentiment recalculation complete for ${count} feedback items`);
      
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
    recalculateWithEdgeFunction
  };
}
