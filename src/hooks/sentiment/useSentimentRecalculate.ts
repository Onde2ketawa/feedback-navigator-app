
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useSentimentRecalculate() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<{ processed: number; errors: number } | null>(null);

  // We'll always process everything, batch by batch
  const recalculate = async () => {
    setIsProcessing(true);
    setProgress(0);
    setStats(null);

    try {
      // Get count of to-analyze feedbacks
      const { count } = await supabase
        .from("customer_feedback")
        .select("*", { count: "exact", head: true })
        .or("sentiment.is.null,sentiment.eq.unknown")
        .not("feedback", "is", null);

      if (!count || count === 0) {
        toast.success("No feedback needs analysis");
        setIsProcessing(false);
        return;
      }

      let processed = 0;
      let errors = 0;
      const batchSize = 10;

      while (processed + errors < count) {
        const res = await fetch("/functions/v1/analyze-feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ batchSize, delay: 0.2 }),
        });

        const data = await res.json();

        if (data.error) throw new Error(data.error);

        processed += data.processed ?? 0;
        errors += data.errors ?? 0;

        setStats({ processed, errors });
        setProgress(Math.round(((processed + errors) / count) * 100));

        // Short circuit if fewer than batchSize returned
        if (data.done) break;
      }

      toast.success("Sentiment recalculation complete!");
    } catch (err: any) {
      toast.error(`Recalculation error: ${err.message ?? err}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return { isProcessing, progress, stats, recalculate };
}
