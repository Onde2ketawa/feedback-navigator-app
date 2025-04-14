
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { UploadForm } from '@/components/upload/UploadForm';
import { UploadFormValues } from '@/components/upload/upload-form-schema';
import { useToast } from '@/hooks/use-toast';
import { SubmitHandler } from 'react-hook-form';

const Upload: React.FC = () => {
  const { toast } = useToast();

  // Handle form submission
  const onSubmit: SubmitHandler<UploadFormValues> = (data) => {
    // Here you would typically upload to Supabase
    console.log('Form data:', data);
    
    toast({
      title: "Upload successful",
      description: "Your feedback has been uploaded.",
    });
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
