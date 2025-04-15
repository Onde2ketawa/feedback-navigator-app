
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ChannelOption } from '@/hooks/useFilterOptions';

interface ChannelFilterProps {
  availableChannels: ChannelOption[];
  selectedChannel: string;
  onChannelChange: (value: string) => void;
}

export const ChannelFilter: React.FC<ChannelFilterProps> = ({ 
  availableChannels, 
  selectedChannel, 
  onChannelChange 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Channel</label>
      <Select 
        value={selectedChannel} 
        onValueChange={onChannelChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Channel" />
        </SelectTrigger>
        <SelectContent>
          {availableChannels.map(channel => (
            <SelectItem key={channel.value} value={channel.value}>
              {channel.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
