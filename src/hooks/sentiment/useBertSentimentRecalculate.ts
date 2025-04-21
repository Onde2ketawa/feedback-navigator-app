
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useBertSentimentRecalculate() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<{ processed: number; errors: number } | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  // Recalculate using BERT model via edge function
  const recalculateWithBert = async () => {
    setIsProcessing(true);
    setProgress(0);
    setStats({ processed: 0, errors: 0 });
    setLastError(null);
    setLastMessage(null);

    try {
      // Get count of feedbacks that need analysis
      let count = 0;
      try {
        const countResult = await supabase
          .from("customer_feedback")
          .select("*", { count: "exact", head: true })
          .not("feedback", "is", null);
          
        if (countResult.error) {
          throw countResult.error;
        }
        
        count = countResult.count || 0;
      } catch (err: any) {
        console.error("Error getting feedback count:", err);
        toast.error(`Failed to get feedback count: ${err?.message || String(err)}`);
        setLastError(err?.message || String(err));
        setIsProcessing(false);
        return;
      }

      if (count === 0) {
        toast.info("No feedback needs analysis");
        setLastMessage("No feedback needs analysis");
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
          });

          clearTimeout(timeoutId);

          console.log("Edge function response:", data, error);

          if (error) {
            const errorMessage = typeof error === 'object' && error !== null 
              ? (error.toString ? error.toString() : JSON.stringify(error))
              : String(error);
              
            setLastError(errorMessage);

            if (errorMessage.includes("aborted")) {
              throw new Error("Request timed out. The server may be busy. Try again later.");
            }
            throw new Error(errorMessage || "Unknown error occurred");
          }

          // Check if data is null or undefined
          if (!data) {
            setLastError("No response data received from server");
            throw new Error("No response data received from server");
          }

          // Handle the case where there's a message but no processing happened
          if ((data as any).message) {
            setLastMessage((data as any).message);
            
            if ((data as any).processed === 0) {
              toast.info((data as any).message);
              if ((data as any).done) {
                done = true;
                break;
              }
            }
          }

          // Update progress counters
          processed += (data as any).processed ?? 0;
          errors += (data as any).errors ?? 0;

          setStats({ processed, errors });

          // Calculate progress based on estimated total
          if (count > 0) {
            const newProgress = Math.min(100, Math.round(((processed + errors) / count) * 100));
            setProgress(newProgress);
            console.log(`Progress updated: ${newProgress}% (${processed}/${count})`);
          }

          retries = 0;

          // Check if processing is complete
          if ((data as any).done) {
            done = true;
            break;
          }
        } catch (err: any) {
          console.error("Error during BERT sentiment analysis:", err);
          const errorMessage = err?.message ?? String(err);
          setLastError(errorMessage);
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
        const message = lastMessage || "No feedback was processed. There might be no items that need analysis.";
        toast.info(message);
      } else {
        toast.warning("Process completed but no feedback was processed");
      }

      // Only reload if we actually processed something
      if (processed > 0) {
        window.location.reload();
      }
    } catch (err: any) {
      console.error("Full BERT recalculation error:", err);
      const errorMessage = err?.message ?? String(err);
      setLastError(errorMessage);

      // Provide more helpful error messages for common network issues
      let displayErrorMessage = errorMessage;
      if (err.name === "AxiosError" && err.message === "Network Error") {
        displayErrorMessage = "Network connection error. Please check your internet connection and try again.";
      } else if (err.message && err.message.includes("Failed to fetch")) {
        displayErrorMessage = "Could not connect to the server. The service might be temporarily unavailable.";
      }

      toast.error(`BERT recalculation error: ${displayErrorMessage}`);
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
    recalculateWithBert
  };
}
