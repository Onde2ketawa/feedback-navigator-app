import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { FeedbackAnalyzer } from '@/components/dashboard/FeedbackAnalyzer';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { analyzeIndoBertSentiment } from '@/utils/indobert-sentiment';

const FeedbackAnalysis: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [feedbackText, setFeedbackText] = useState(location.state?.feedbackText || '');

  // IndoBERT Sentiment States
  const [sentimentText, setSentimentText] = useState('');
  const [sentimentLoading, setSentimentLoading] = useState(false);
  const [sentimentResult, setSentimentResult] = useState<any>(null);

  // Deprecated/Legacy analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleBack = () => {
    navigate('/');
  };

  // IndoBERT Sentiment Analysis submit
  const handleSentimentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sentimentText.trim()) {
      toast({
        title: "Error",
        description: "Please enter feedback text",
        variant: "destructive"
      });
      return;
    }
    setSentimentLoading(true);
    try {
      const result = await analyzeIndoBertSentiment(sentimentText);
      setSentimentResult(result);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to analyze sentiment",
        variant: "destructive"
      });
      setSentimentResult(null);
    } finally {
      setSentimentLoading(false);
    }
  };

  // Deprecated/Legacy submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      toast({
        title: "Error",
        description: "Please enter feedback text",
        variant: "destructive"
      });
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(feedbackText);
    setIsAnalyzing(false);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <PageHeader 
          title="Feedback Analysis" 
          description="Analyze customer feedback using IndoBERT sentiment model"
        />
        <Button variant="outline" onClick={handleBack}>
          Back to Home
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Sentiment Analytics Section */}
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSentimentSubmit} className="space-y-4">
              <div>
                <label htmlFor="sentiment-feedback" className="block text-sm font-medium mb-2">
                  Enter your feedback (IndoBERT)
                </label>
                <Textarea
                  id="sentiment-feedback"
                  placeholder="Masukkan opini atau masukan Anda di sini..."
                  value={sentimentText}
                  onChange={(e) => setSentimentText(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
              <Button 
                type="submit"
                disabled={sentimentLoading || !sentimentText.trim()}
                className="w-full"
              >
                {sentimentLoading ? 'Analyzing...' : 'Analyze Sentiment'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {sentimentResult && (
          <Card>
            <CardHeader>
              <CardTitle>IndoBERT Sentiment Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div className="mb-2">
                  <span className="font-semibold">Feedback:</span> {sentimentText}
                </div>
                <div>
                  <span className="font-semibold">Result:</span>{' '}
                  <span className="inline-block rounded px-2 py-1 bg-muted text-primary">
                    {sentimentResult?.sentiment || "unknown"}
                  </span>
                  {typeof sentimentResult?.sentiment_score === 'number' && (
                    <span className="ml-3 text-xs text-muted-foreground">Score: {sentimentResult.sentiment_score.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Legacy Analysis Section (Optional, could be removed) */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Old Free Text Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="feedback" className="block text-sm font-medium mb-2">
                  Enter your feedback
                </label>
                <Textarea
                  id="feedback"
                  placeholder="Type your feedback here..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isAnalyzing || !feedbackText.trim()}
                className="w-full"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Sentiment'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {analysisResult && (
          <FeedbackAnalyzer feedbackText={analysisResult} />
        )} */}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h2 className="font-medium text-blue-800 mb-2">Analysis Explanation:</h2>
        <p className="text-sm text-blue-700">
          This feedback is analyzed using the IndoBERT sentiment model, which is specifically trained
          for Indonesian language text. The model evaluates the emotional tone and assigns a sentiment
          score between -1 (very negative) and 1 (very positive).
        </p>
      </div>
    </div>
  );
};

export default FeedbackAnalysis;
