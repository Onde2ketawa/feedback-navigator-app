
import { supabase } from '@/integrations/supabase/client';
import { ChannelOption } from '@/hooks/useFilterOptions';

export const fetchChannels = async (): Promise<ChannelOption[]> => {
  try {
    // First, let's get all unique channel_id values from customer_feedback
    const { data: feedbackData, error: feedbackError } = await supabase
      .from('customer_feedback')
      .select('channel_id');
    
    if (feedbackError) {
      console.error('Error fetching channel IDs:', feedbackError);
      throw new Error(`Failed to fetch channel IDs: ${feedbackError.message}`);
    }

    // Extract unique channel_ids
    const uniqueChannelIds = Array.from(
      new Set(feedbackData.map(item => item.channel_id))
    ).filter(Boolean); // Remove any null/undefined values
    
    if (uniqueChannelIds.length === 0) {
      return [{ value: 'all', label: 'All Channels' }];
    }

    // Now fetch the channel details for these IDs
    const { data: channelData, error: channelError } = await supabase
      .from('channel')
      .select('id, name')
      .in('id', uniqueChannelIds);

    if (channelError) {
      console.error('Error fetching channel details:', channelError);
      throw new Error(`Failed to fetch channel details: ${channelError.message}`);
    }

    // Map the channel data to the format we need
    const channels = channelData.map(channel => ({
      value: channel.id,
      label: channel.name
    }));

    return [
      { value: 'all', label: 'All Channels' },
      ...channels
    ];
  } catch (err) {
    console.error('Error in fetchChannels:', err);
    throw err;
  }
};
