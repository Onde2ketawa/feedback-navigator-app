
import { supabase } from '@/integrations/supabase/client';
import { ChannelOption } from '@/hooks/useFilterOptions';

/**
 * Fetches unique channels from the database
 */
export const fetchChannels = async (): Promise<ChannelOption[]> => {
  try {
    const { data, error } = await supabase
      .from('channel')
      .select('name')
      .order('name');
    
    if (error) {
      console.error('Error fetching channels:', error);
      throw new Error(`Failed to fetch channels: ${error.message}`);
    }
    
    return [
      { value: 'all', label: 'All Channels' },
      ...(data?.map(c => ({ value: c.name, label: c.name })) || [])
    ];
  } catch (err) {
    console.error('Error in fetchChannels:', err);
    throw err;
  }
};
