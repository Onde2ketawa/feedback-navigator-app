
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { FeedbackAnalyzer } from '@/components/dashboard/FeedbackAnalyzer';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const FeedbackAnalysis: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const feedbackText = location.state?.feedbackText || "No feedback text provided";
  
  const handleBack = () => {
    navigate('/');
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
      
      <div className="mt-6">
        <FeedbackAnalyzer feedbackText={feedbackText} />
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
