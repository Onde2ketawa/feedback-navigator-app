
import React, { useMemo, useState } from "react";
import { analyzeMultilingualSentiment } from "@/utils/sentiment/multilingual-sentiment";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Row format: adjust to fit your feedback csv columns!
interface FeedbackRow {
  feedback: string;
  [key: string]: any;
}

interface CsvSentimentPreviewProps {
  rows: FeedbackRow[];
  feedbackField?: string; // default is "feedback"
}

export const CsvSentimentPreview: React.FC<CsvSentimentPreviewProps> = ({
  rows,
  feedbackField = "feedback"
}) => {
  const [results, setResults] = useState<
    { sentiment: string; sentiment_score: number; modelUsed: string }[]
  >([]);

  React.useEffect(() => {
    if (!rows || rows.length === 0) {
      setResults([]);
      return;
    }
    let unmounted = false;
    // Just preview the first 10 rows for speed
    const previewRows = rows.slice(0, 10);
    Promise.all(
      previewRows.map((row) =>
        analyzeMultilingualSentiment(row[feedbackField] || "")
      )
    ).then((sentiments) => {
      if (!unmounted) setResults(sentiments);
    });
    return () => {
      unmounted = true;
    };
  }, [rows, feedbackField]);

  if (!rows || rows.length === 0) return null;

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Sentiment Calculation Preview (First 10 Rows)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded">
            <thead>
              <tr>
                <th className="px-2 py-1 border-b">#</th>
                <th className="px-2 py-1 border-b">Feedback</th>
                <th className="px-2 py-1 border-b">Calculated Sentiment</th>
                <th className="px-2 py-1 border-b">Score</th>
                <th className="px-2 py-1 border-b">Model Used</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 10).map((row, idx) => (
                <tr key={idx}>
                  <td className="px-2 py-1">{idx + 1}</td>
                  <td className="px-2 py-1 max-w-xs truncate" title={row[feedbackField]}>
                    {row[feedbackField]}
                  </td>
                  <td className="px-2 py-1">
                    {
                      results[idx]
                        ? results[idx].sentiment.charAt(0).toUpperCase() + results[idx].sentiment.slice(1)
                        : <Skeleton className="h-4 w-16" />
                    }
                  </td>
                  <td className="px-2 py-1">
                    {
                      results[idx]
                        ? results[idx].sentiment_score.toFixed(2)
                        : <Skeleton className="h-4 w-10" />
                    }
                  </td>
                  <td className="px-2 py-1">
                    {
                      results[idx]
                        ? results[idx].modelUsed
                        : <Skeleton className="h-4 w-24" />
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-xs text-muted-foreground mt-2">
            <span>
              Showing sentiment results for the first 10 rows only. Full calculation will apply after upload.
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

