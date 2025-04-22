
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { FeedbackAnalyzer } from '@/components/dashboard/FeedbackAnalyzer';

const FeedbackAnalysis: React.FC = () => {
  const feedbackText = "tampilan beranda myhana saya kok beda ya...gk ada tampilan nama.. nomer rekening sama saldo...";
  
  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader 
        title="Feedback Analysis" 
        description="Analyze customer feedback using IndoBERT sentiment model"
      />
      
      <div className="mt-6">
        <FeedbackAnalyzer feedbackText={feedbackText} />
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h2 className="font-medium text-blue-800 mb-2">Analysis Explanation:</h2>
        <p className="text-sm text-blue-700">
          The feedback is about a user interface issue where the user is reporting that their banking app home screen 
          (Myhana) looks different and is missing key information like name, account number, and balance.
          This is likely to be classified as <strong>neutral</strong> or slightly <strong>negative</strong> sentiment
          as it's reporting a problem but without strong negative emotions.
        </p>
      </div>
    </div>
  );
};

export default FeedbackAnalysis;
