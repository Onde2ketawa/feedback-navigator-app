
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { analyzeIndoBertSentiment } from '@/utils/indobert-sentiment';
import { detectLanguage } from '@/utils/sentiment/detect-language';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface FeedbackAnalyzerProps {
  feedbackText: string;
}

export const FeedbackAnalyzer: React.FC<FeedbackAnalyzerProps> = ({ feedbackText }) => {
  const [result, setResult] = useState<{
    sentiment: string;
    sentiment_score: number;
    language?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const analyzeFeedback = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Detect language first
        const detectedLanguage = detectLanguage(feedbackText);
        
        // Analyze with IndoBERT
        const sentimentResult = await analyzeIndoBertSentiment(feedbackText);
        
        setResult({
          ...sentimentResult,
          language: detectedLanguage
        });
      } catch (err) {
        console.error('Error analyzing feedback:', err);
        setError('Failed to analyze feedback. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (feedbackText) {
      analyzeFeedback();
    }
  }, [feedbackText]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">IndoBERT Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Feedback Text:</h3>
            <p className="text-sm p-3 bg-muted rounded-md">{feedbackText}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Detected Language:</h3>
              {isLoading ? (
                <Skeleton className="h-6 w-20" />
              ) : (
                <Badge variant="outline">
                  {result?.language === 'id' ? 'Indonesian' : 
                   result?.language === 'en' ? 'English' : 'Unknown'}
                </Badge>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Sentiment:</h3>
              {isLoading ? (
                <Skeleton className="h-6 w-24" />
              ) : error ? (
                <Badge variant="destructive">Error</Badge>
              ) : (
                <Badge className={getSentimentColor(result?.sentiment || 'neutral')}>
                  {result?.sentiment?.charAt(0).toUpperCase() + (result?.sentiment?.slice(1) || '')}
                </Badge>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-1">Sentiment Score:</h3>
            {isLoading ? (
              <Skeleton className="h-6 w-16" />
            ) : error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : (
              <p className="text-lg font-bold">
                {result?.sentiment_score.toFixed(2)}
                <span className="ml-2 text-sm text-muted-foreground">
                  (-1.0 to 1.0 scale)
                </span>
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
