
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
import { RatingInput } from '@/components/ui/rating-input';

interface RatingFieldProps {
  control: Control<UploadFormValues>;
}

export const RatingField: React.FC<RatingFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="rating"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Rating</FormLabel>
          <FormControl>
            <RatingInput
              value={field.value}
              onChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
