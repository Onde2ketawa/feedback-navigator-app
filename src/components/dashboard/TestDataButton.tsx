
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { QueryObserverResult } from '@tanstack/react-query';
import { Feedback } from '@/models/feedback';

interface TestDataButtonProps {
  filter: {
    channel: string | null;
    year: string | null;
    month: string | null;
  };
  onDataAdded: () => Promise<QueryObserverResult<Feedback[], Error>>;
}

export const TestDataButton: React.FC<TestDataButtonProps> = ({ filter, onDataAdded }) => {
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();
  
  // Function to seed test data
  const seedTestData = async () => {
    try {
      setIsSeeding(true);
      
      // First, ensure we have the MyHana channel
      let channelId;
      
      // Check if channel exists
      const { data: existingChannel, error: channelQueryError } = await supabase
        .from('channel')
        .select('id')
        .eq('name', 'MyHana')
        .single();
      
      if (channelQueryError && channelQueryError.code !== 'PGRST116') {
        // Error other than "no rows returned"
        throw channelQueryError;
      }
      
      if (existingChannel) {
        channelId = existingChannel.id;
      } else {
        // Create channel if it doesn't exist
        const { data: newChannel, error: createError } = await supabase
          .from('channel')
          .insert({ name: 'MyHana' })
          .select('id')
          .single();
        
        if (createError) throw createError;
        channelId = newChannel.id;
      }
      
      // Create sample data for the selected year
      const year = parseInt(filter.year || '2025');
      
      // Get the first profile available to use as user_id
      // This ensures we have a valid user_id for the foreign key constraint
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (profilesError) throw profilesError;
      
      if (!profiles || profiles.length === 0) {
        throw new Error('No user profiles found. Please create a user account first.');
      }
      
      const userId = profiles[0].id;
      
      // Create a few records for the selected year
      const testData = [
        {
          channel_id: channelId,
          rating: 4,
          submit_date: `${year}-01-15T10:30:00`,
          feedback: `Test feedback for ${year} January`,
          sentiment: 'positive',
          sentiment_score: 0.8,
          user_id: userId // Use the real user id from profiles
        },
        {
          channel_id: channelId,
          rating: 3,
          submit_date: `${year}-02-20T14:45:00`,
          feedback: `Test feedback for ${year} February`,
          sentiment: 'neutral',
          sentiment_score: 0.5,
          user_id: userId // Use the real user id from profiles
        },
        {
          channel_id: channelId,
          rating: 5,
          submit_date: `${year}-${filter.month || '03'}-25T09:15:00`,
          feedback: `Test feedback for ${year} ${filter.month ? 'selected month' : 'March'}`,
          sentiment: 'positive',
          sentiment_score: 0.9,
          user_id: userId // Use the real user id from profiles
        }
      ];
      
      const { error: insertError } = await supabase
        .from('customer_feedback')
        .insert(testData);
      
      if (insertError) throw insertError;
      
      // Refresh data
      const result = await onDataAdded();
      
      toast({
        title: "Test Data Added",
        description: `Added sample feedback for ${year}`,
      });
      
      return result;
    } catch (error) {
      console.error('Error seeding test data:', error);
      toast({
        title: "Error Adding Test Data",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={seedTestData}
      disabled={isSeeding}
    >
      {isSeeding ? 'Adding...' : 'Add Test Data'}
    </Button>
  );
};
