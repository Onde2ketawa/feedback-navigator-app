
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ChannelSelectProps {
  control: Control<UploadFormValues>;
}

export const ChannelSelect: React.FC<ChannelSelectProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="channel"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Channel</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a channel" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="LINE Bank">LINE Bank</SelectItem>
              <SelectItem value="MyHana">MyHana</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
