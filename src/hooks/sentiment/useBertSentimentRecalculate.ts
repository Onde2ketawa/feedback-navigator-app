
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
      const { count, error: countError } = await supabase
        .from("customer_feedback")
        .select("*", { count: "exact", head: true })
        .not("feedback", "is", null)
        .or("sentiment_score.is.null,sentiment_score.eq.0")
        .throwOnError();

      if (countError) {
        // Fix: Use type assertion to handle the error object properly
        const errorMessage = typeof countError === 'object' ? 
          (countError as any).error || countError.toString() : 
          String(countError);
        throw new Error(`Error counting feedback: ${errorMessage}`);
      }

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

      toast.info(`Starting sentiment analysis with BERT model for ${count} items...`);

      while (!done && retries < maxRetries) {
        try {
          console.log("Calling edge function with batch size:", batchSize);
          
          // Create an abort controller for the timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
          
          const { data, error } = await supabase.functions.invoke("recalculate-bert-sentiment", {
            body: { 
              batchSize,
              delay: 0.3
            }
            // Note: Removed the signal property as it's not supported in FunctionInvokeOptions
          });
          
          clearTimeout(timeoutId);

          console.log("Edge function response:", data, error);

          if (error) {
            // Fix: Handle error object properly with type safety
            const errorString = typeof error === 'object' && error !== null ? 
              error.toString() : String(error);
              
            if (errorString.includes("aborted")) {
              throw new Error("Request timed out. The server may be busy. Try again later.");
            }
            throw new Error(errorString || "Unknown error occurred");
          }
          
          // Check if data is null or undefined
          if (!data) {
            throw new Error("No response data received from server");
          }
          
          // Handle the case where there's a message but no processing happened
          if (data.message && data.processed === 0) {
            toast.info(data.message);
            if (data.done) {
              done = true;
              break;
            }
          }
          
          // Update progress counters
          processed += data.processed ?? 0;
          errors += data.errors ?? 0;

          setStats({ processed, errors });
          
          // Calculate progress based on estimated total
          if (count > 0) {
            const newProgress = Math.min(100, Math.round((processed + errors) / count * 100));
            setProgress(newProgress);
            console.log(`Progress updated: ${newProgress}% (${processed}/${count})`);
          }
          
          retries = 0;
          
          // Check if processing is complete
          if (data.done) {
            done = true;
            break;
          }
        } catch (err: any) {
          console.error("Error during BERT sentiment analysis:", err);
          retries++;
          
          if (retries < maxRetries) {
            toast.warning(`Analysis attempt failed, retrying (${retries}/${maxRetries})...`, {
              duration: 3000
            });
            await new Promise(resolve => setTimeout(resolve, 1000 * retries));
          } else {
            throw err;
          }
        }
      }

      if (processed > 0 || errors > 0) {
        toast.success(`BERT sentiment recalculation complete: ${processed} processed, ${errors} errors`);
      } else if (done) {
        toast.info("No feedback was processed. There might be no items that need analysis.");
      } else {
        toast.warning("Process completed but no feedback was processed");
      }
      
      // Only reload if we actually processed something
      if (processed > 0) {
        window.location.reload();
      }
    } catch (err: any) {
      console.error("Full BERT recalculation error:", err);
      
      // Provide more helpful error messages for common network issues
      let errorMessage = err.message ?? err;
      if (err.name === "AxiosError" && err.message === "Network Error") {
        errorMessage = "Network connection error. Please check your internet connection and try again.";
      } else if (err.message && err.message.includes("Failed to fetch")) {
        errorMessage = "Could not connect to the server. The service might be temporarily unavailable.";
      }
      
      toast.error(`BERT recalculation error: ${errorMessage}`);
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
