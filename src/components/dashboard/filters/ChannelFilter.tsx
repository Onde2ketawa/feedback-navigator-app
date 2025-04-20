
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChannelOption } from '@/hooks/useFilterOptions';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

interface ChannelFilterProps {
  availableChannels: ChannelOption[];
  selectedChannel: string;
  onChannelChange: (value: string) => void;
  isLoading?: boolean;
  error?: Error | null;
  disabled?: boolean;
}

export const ChannelFilter: React.FC<ChannelFilterProps> = ({ 
  availableChannels,
  selectedChannel,
  onChannelChange,
  isLoading = false,
  error = null,
  disabled = false
}) => {
  // Show skeleton when loading
  if (isLoading) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium block">Channel</label>
        <Skeleton className="h-10 w-full rounded-md animate-pulse" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium block">Channel</label>
        <div className="text-destructive flex items-center gap-2 text-sm border border-destructive p-2 rounded">
          <AlertCircle size={16} />
          <span>Unable to load channels: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium block">Channel</label>
      <Select
        value={selectedChannel}
        onValueChange={onChannelChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Select channel" />
        </SelectTrigger>
        <SelectContent>
          {availableChannels.map(channel => (
            <SelectItem 
              key={channel.value} 
              value={channel.value}
            >
              {channel.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
