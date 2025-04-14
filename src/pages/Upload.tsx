
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/ui/page-header';
import { FileUpload } from '@/components/ui/file-upload';
import { RatingInput } from '@/components/ui/rating-input';
import {
  Form,
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
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// Form schema
const uploadFormSchema = z.object({
  channel: z.string({
    required_error: "Please select a channel",
  }),
  rating: z.number({
    required_error: "Please provide a rating",
  }).min(1, "Rating must be between 1 and 5").max(5),
  submitDate: z.date({
    required_error: "Please select a date",
  }),
  feedback: z.string().optional(),
});

type UploadFormValues = z.infer<typeof uploadFormSchema>;

const Upload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
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
  const onSubmit: SubmitHandler<UploadFormValues> = (data) => {
    if (files.length === 0) {
      toast({
        title: "No file selected",
        description: "Please upload at least one file.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically upload to Supabase
    console.log('Form data:', data);
    console.log('Files:', files);
    
    toast({
      title: "Upload successful",
      description: "Your feedback has been uploaded.",
    });
    
    // Reset the form
    form.reset();
    setFiles([]);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Upload Feedback" 
        description="Upload customer feedback files and provide additional information"
      />
      
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="channel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
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

              <FormField
                control={form.control}
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

              <FormField
                control={form.control}
                name="submitDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Submit Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
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

              <div className="space-y-2">
                <FormLabel>Upload File</FormLabel>
                <FileUpload onFilesAccepted={setFiles} />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit">Submit Feedback</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Upload;
