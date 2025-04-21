
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useBertSentimentRecalculate() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<{ processed: number; errors: number; blankProcessed?: number } | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  // Recalculate using BERT model via edge function
  const recalculateWithBert = async () => {
    setIsProcessing(true);
    setProgress(0);
    setStats({ processed: 0, errors: 0, blankProcessed: 0 });
    setLastError(null);
    setLastMessage(null);

    try {
      let count = 0;
      try {
        const countResult = await supabase
          .from("customer_feedback")
          .select("*", { count: "exact", head: true });
        if (countResult.error) throw countResult.error;
        count = countResult.count || 0;
      } catch (err: any) {
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
      let blankProcessed = 0;
      let errors = 0;
      const batchSize = 10;
      let retries = 0;
      const maxRetries = 3;
      let done = false;

      toast.info(`Starting sentiment analysis with BERT model for ${count} items...`);

      while (!done && retries < maxRetries) {
        try {
          // 30 second timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000);

          // Directly call the edge function
          const { data, error } = await supabase.functions.invoke("recalculate-bert-sentiment", {
            body: { batchSize, delay: 0.3, includeBlanks: true }
          });

          clearTimeout(timeoutId);

          if (error) {
            setLastError(typeof error === "object" ? (error.toString ? error.toString() : JSON.stringify(error)) : String(error));
            if (String(error).includes("aborted")) throw new Error("Request timed out.");
            throw new Error(error || "Unknown error occurred");
          }

          // New: check for blankProcessed in response
          if (!data) {
            setLastError("No response data received from server");
            throw new Error("No response data received from server");
          }

          // Read processed, errors, blankProcessed
          processed += (data as any).processed ?? 0;
          blankProcessed += (data as any).blankProcessed ?? 0;
          errors += (data as any).errors ?? 0;

          setStats({ processed, errors, blankProcessed });

          if (count > 0) {
            setProgress(Math.min(100, Math.round(((processed + errors) / count) * 100)));
          }

          if (typeof (data as any).message === "string") setLastMessage((data as any).message);
          retries = 0;

          if ((data as any).done) {
            done = true;
            break;
          }
        } catch (err: any) {
          setLastError(err?.message ?? String(err));
          retries++;
          if (retries < maxRetries) {
            toast.warning(`Analysis attempt failed, retrying (${retries}/${maxRetries})...`, { duration: 3000 });
            await new Promise(resolve => setTimeout(resolve, 1000 * retries));
          } else {
            throw err;
          }
        }
      }

      if (processed > 0 || errors > 0) {
        let blankMsg = blankProcessed > 0 ? ` (including ${blankProcessed} blank items)` : '';
        toast.success(`BERT sentiment recalculation complete: ${processed} processed${blankMsg}, ${errors} errors`);
      } else if (done) {
        const message = lastMessage || "No feedback was processed. There might be no items that need analysis.";
        toast.info(message);
      } else {
        toast.warning("Process completed but no feedback was processed");
      }

      if (processed > 0) {
        window.location.reload();
      }
    } catch (err: any) {
      setLastError(err?.message ?? String(err));
      let displayErrorMessage = err?.message ?? String(err);
      if (err.name === "AxiosError" && err.message === "Network Error") displayErrorMessage = "Network connection error.";
      else if (err.message && err.message.includes("Failed to fetch")) displayErrorMessage = "Could not connect to the server.";
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
