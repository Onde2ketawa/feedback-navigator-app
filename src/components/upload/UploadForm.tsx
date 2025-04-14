
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { uploadFormSchema, UploadFormValues } from './upload-form-schema';
import { ChannelSelect } from './form-components/ChannelSelect';
import { RatingField } from './form-components/RatingField';
import { DatePickerField } from './form-components/DatePickerField';
import { FeedbackTextField } from './form-components/FeedbackTextField';
import { FileUploadSection } from './form-components/FileUploadSection';

interface UploadFormProps {
  onSubmit: SubmitHandler<UploadFormValues>;
}

export const UploadForm: React.FC<UploadFormProps> = ({ onSubmit }) => {
  const { toast } = useToast();

  // Initialize the form
  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      channel: '',
      rating: 0,
      feedback: '',
    },
  });

  // Handle form submission
  const handleSubmit: SubmitHandler<UploadFormValues> = (data, e) => {
    // Get file upload state from the FileUploadSection component
    const fileInput = document.querySelector('input[type="file"]');
    const files = fileInput ? Array.from((fileInput as HTMLInputElement).files || []) : [];
    
    if (files.length === 0) {
      toast({
        title: "No file selected",
        description: "Please upload at least one file.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(data);
    
    // Reset the form
    form.reset();
    if (fileInput) {
      (fileInput as HTMLInputElement).value = '';
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <ChannelSelect control={form.control} />
        <RatingField control={form.control} />
        <DatePickerField control={form.control} />
        <FeedbackTextField control={form.control} />
        <FileUploadSection />

        <div className="flex justify-end pt-4">
          <Button type="submit">Submit Feedback</Button>
        </div>
      </form>
    </Form>
  );
};
