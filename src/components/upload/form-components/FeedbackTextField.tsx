
import React from 'react';
import { Control } from 'react-hook-form';
import { UploadFormValues } from '../upload-form-schema';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface FeedbackTextFieldProps {
  control: Control<UploadFormValues>;
}

export const FeedbackTextField: React.FC<FeedbackTextFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="feedback"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Feedback (Optional)</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Enter feedback text here..."
              className="resize-none h-32"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
