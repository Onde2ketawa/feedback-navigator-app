
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UseChannelFilterResult {
  channelFilter: string;
  setChannelFilter: (channelId: string) => void;
}

export function useChannelFilter() {
  const [channelFilter, setChannelFilter] = useState<string>('all');

  const handleChannelChange = (channelId: string) => {
    console.log("Changing channel filter to:", channelId);
    setChannelFilter(channelId);
  };

  return {
    channelFilter,
    setChannelFilter: handleChannelChange
  };
}
