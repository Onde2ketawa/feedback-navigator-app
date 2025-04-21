
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useBertSentimentRecalculate() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<{ processed: number; errors: number } | null>(null);

  // Recalculate using BERT model via edge function
  const recalculateWithBert = async () => {
    setIsProcessing(true);
    setProgress(0);
    setStats(null);

    try {
      // Get count of feedbacks that need analysis
      const { count } = await supabase
        .from("customer_feedback")
        .select("*", { count: "exact", head: true })
        .not("feedback", "is", null)
        .or("sentiment_score.is.null,sentiment_score.eq.0");

      if (!count || count === 0) {
        toast.success("No feedback needs analysis");
        setIsProcessing(false);
        return;
      }

      let processed = 0;
      let errors = 0;
      const batchSize = 10;
      let retries = 0;
      const maxRetries = 3;
      let done = false;

      toast.info("Starting sentiment analysis with BERT model...");

      while (!done && retries < maxRetries) {
        try {
          // Call the edge function
          const { data, error } = await supabase.functions.invoke("recalculate-bert-sentiment", {
            body: { 
              batchSize,
              delay: 0.3
            }
          });

          if (error) throw new Error(error.message);
          
          if (data.message && data.processed === 0) {
            toast.info(data.message);
            done = true;
            break;
          }
          
          processed += data.processed ?? 0;
          errors += data.errors ?? 0;

          setStats({ processed, errors });
          
          // Calculate progress based on estimated total
          if (count > 0) {
            setProgress(Math.round((processed + errors) / count * 100));
          }
          
          retries = 0;
          
          if (data.done) {
            done = true;
            break;
          }
        } catch (err: any) {
          console.error("Error during BERT sentiment analysis:", err);
          retries++;
          
          if (retries < maxRetries) {
            toast.warning(`Analysis attempt failed, retrying (${retries}/${maxRetries})...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * retries));
          } else {
            throw err;
          }
        }
      }

      toast.success(`BERT sentiment recalculation complete: ${processed} processed, ${errors} errors`);
      
      // Force a reload to update the dashboard
      if (processed > 0) {
        window.location.reload();
      }
    } catch (err: any) {
      toast.error(`BERT recalculation error: ${err.message ?? err}`);
      console.error("Full BERT recalculation error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return { 
    isProcessing, 
    progress, 
    stats, 
    recalculateWithBert
  };
}
