
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { UploadForm } from '@/components/upload/UploadForm';
import { UploadFormValues } from '@/components/upload/upload-form-schema';
import { useToast } from '@/hooks/use-toast';
import { SubmitHandler } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';

const Upload: React.FC = () => {
  const { toast } = useToast();

  // Handle form submission
  const onSubmit: SubmitHandler<UploadFormValues> = async (data) => {
    try {
      console.log('Form data with sentiment:', data);
      
      // Here you would typically upload to Supabase
      // Example implementation:
      /*
      const { error } = await supabase
        .from('customer_feedback')
        .insert({
          channel_id: data.channel,
          rating: data.rating,
          feedback: data.feedback,
          submit_date: data.date,
          sentiment: data.sentiment,
          sentiment_score: data.sentiment_score,
          // Add other fields as needed
        });
      
      if (error) throw error;
      */
      
      toast({
        title: "Upload successful",
        description: `Your feedback has been uploaded with sentiment: ${data.sentiment}`,
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred during upload",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Upload Feedback" 
        description="Upload customer feedback files and provide additional information"
      />
      
      <Card>
        <CardContent className="pt-6">
          <UploadForm onSubmit={onSubmit} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Upload;
