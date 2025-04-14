
import * as z from 'zod';

// Form schema
export const uploadFormSchema = z.object({
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

export type UploadFormValues = z.infer<typeof uploadFormSchema>;
