
import { useState } from 'react';
import { useFilterOptions } from '@/hooks/useFilterOptions';

export interface UseChannelFilterResult {
  channelFilter: string;
  setChannelFilter: (channelId: string) => void;
  availableChannels: {
    value: string;
    label: string;
  }[];
  isLoading: boolean;
}

export function useChannelFilter() {
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const { availableChannels, isLoading } = useFilterOptions();

  const handleChannelChange = (channelId: string) => {
    console.log("Changing channel filter to:", channelId);
    setChannelFilter(channelId);
  };

  return {
    channelFilter,
    setChannelFilter: handleChannelChange,
    availableChannels,
    isLoading
  };
}
