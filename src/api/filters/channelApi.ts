
import { supabase } from '@/integrations/supabase/client';
import { ChannelOption } from '@/hooks/useFilterOptions';

export const fetchChannels = async (): Promise<ChannelOption[]> => {
  try {
    const { data: channels, error } = await supabase
      .from('customer_feedback')
      .select('channel:channel_id(id, name)')
      .distinct();
    
    if (error) {
      console.error('Error fetching channels:', error);
      throw new Error(`Failed to fetch channels: ${error.message}`);
    }

    const uniqueChannels = channels
      .filter(item => item.channel) // Remove null values
      .map(item => ({
        value: item.channel.id,
        label: item.channel.name
      }));

    return [
      { value: 'all', label: 'All Channels' },
      ...uniqueChannels
    ];
  } catch (err) {
    console.error('Error in fetchChannels:', err);
    throw err;
  }
};
