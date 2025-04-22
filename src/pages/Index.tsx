
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { analyzeIndoBertSentiment } from '@/utils/indobert-sentiment';

const Index: React.FC = () => {
  const [feedbackText, setFeedbackText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
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
    try {
      const result = await analyzeIndoBertSentiment(feedbackText);
      
      // Navigate to feedback analysis page with the text
      navigate('/feedback-analysis', { 
        state: { feedbackText } 
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          Sentiment Analysis
        </h1>
        
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
      </div>
    </div>
  );
};

export default Index;
