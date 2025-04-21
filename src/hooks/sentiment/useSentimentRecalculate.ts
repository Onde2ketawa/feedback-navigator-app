
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useSentimentRecalculate() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<{ processed: number; errors: number; blankProcessed?: number } | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  // Recalculate using direct database function call
  const recalculate = async () => {
    setIsProcessing(true);
    setProgress(0);
    setStats(null);
    setLastMessage(null);

    try {
      // Get count of all feedback items
      const { count, error: countError } = await supabase
        .from("customer_feedback")
        .select("*", { count: "exact", head: true });

      if (countError) throw new Error(`Count error: ${countError.message}`);
      
      if (!count || count === 0) {
        setLastMessage("No feedback needs analysis");
        toast.success("No feedback needs analysis");
        setIsProcessing(false);
        return;
      }
      
      // Get count of blank feedback
      const { count: blankCount, error: blankCountError } = await supabase
        .from("customer_feedback")
        .select("*", { count: "exact", head: true })
        .or('feedback.is.null,feedback.eq.')
        .or('feedback.eq.,feedback.eq.""');
        
      if (blankCountError) throw new Error(`Error counting blank feedback: ${blankCountError.message}`);

      // Use the recalculate_sentiment_scores function
      const { error } = await supabase.rpc("recalculate_sentiment_scores");
      
      if (error) throw new Error(`RPC error: ${error.message}`);
      
      // For blank feedback, set them as neutral with score 0
      if (blankCount && blankCount > 0) {
        const { error: updateError } = await supabase
          .from("customer_feedback")
          .update({ sentiment: "neutral", sentiment_score: 0 })
          .or('feedback.is.null,feedback.eq.')
          .or('feedback.eq.,feedback.eq.""');
          
        if (updateError) throw new Error(`Error updating blank feedback: ${updateError.message}`);
      }
      
      // Since we can't track progress with this function, we'll just set it to 100%
      setProgress(100);
      const processedCount = count || 0;
      setStats({ 
        processed: processedCount, 
        errors: 0,
        blankProcessed: blankCount || 0
      });
      
      const blankMsg = blankCount && blankCount > 0 ? ` (including ${blankCount} blank items)` : '';
      const message = `Sentiment recalculation complete for ${processedCount} feedback items${blankMsg}`;
      setLastMessage(message);
      toast.success(message);
      
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
    setLastMessage(null);

    try {
      // Get count of feedbacks that need analysis
      const { count, error: countError } = await supabase
        .from("customer_feedback")
        .select("*", { count: "exact", head: true });

      if (countError) throw new Error(`Count error: ${countError.message}`);
      
      if (!count || count === 0) {
        setLastMessage("No feedback needs analysis");
        toast.success("No feedback needs analysis");
        setIsProcessing(false);
        return;
      }

      // Get count of blank feedback
      const { count: blankCount, error: blankCountError } = await supabase
        .from("customer_feedback")
        .select("*", { count: "exact", head: true })
        .or('feedback.is.null,feedback.eq.')
        .or('feedback.eq.,feedback.eq.""');
        
      if (blankCountError) throw new Error(`Error counting blank feedback: ${blankCountError.message}`);

      let processed = 0;
      let blankProcessed = blankCount || 0;
      let errors = 0;
      const batchSize = 20;
      let retries = 0;
      const maxRetries = 3;

      // Update blank feedback first
      if (blankCount && blankCount > 0) {
        const { error: updateError } = await supabase
          .from("customer_feedback")
          .update({ sentiment: "neutral", sentiment_score: 0 })
          .or('feedback.is.null,feedback.eq.')
          .or('feedback.eq.,feedback.eq.""');
          
        if (updateError) throw new Error(`Error updating blank feedback: ${updateError.message}`);
        
        processed += blankCount;
      }

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
                threshold: 0.2,
              },
              skipBlankFeedback: true // Skip blank feedback since we've already processed them
            }),
          });

          if (!res.ok) {
            throw new Error(`Server responded with status: ${res.status}`);
          }

          const data = await res.json();

          if (data.error) throw new Error(data.error);

          processed += data.processed ?? 0;
          errors += data.errors ?? 0;

          setStats({ processed, errors, blankProcessed });
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

      const blankMsg = blankProcessed > 0 ? ` (including ${blankProcessed} blank items)` : '';
      const message = `Sentiment recalculation complete: ${processed} processed${blankMsg}, ${errors} errors`;
      setLastMessage(message);
      toast.success(message);
      
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
    lastMessage,
    recalculate, 
    recalculateWithEdgeFunction
  };
}
