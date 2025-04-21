
import { useState } from "react";
import { BertSentimentStats } from "./bertSentimentStats";

interface UseSentimentProgress {
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  stats: BertSentimentStats;
  setStats: React.Dispatch<React.SetStateAction<BertSentimentStats>>;
  resetStats: () => void;
}

export function useSentimentProgress(): UseSentimentProgress {
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<BertSentimentStats>({
    processed: 0,
    errors: 0,
    byLanguage: {},
    byModel: {},
    blankProcessed: 0,
  });

  function resetStats() {
    setProgress(0);
    setStats({
      processed: 0,
      errors: 0,
      byLanguage: {},
      byModel: {},
      blankProcessed: 0,
    });
  }

  return { progress, setProgress, stats, setStats, resetStats };
}
