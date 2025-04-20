
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFilterOptions } from '@/hooks/useFilterOptions';

interface ChannelFilterProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const ChannelFilter: React.FC<ChannelFilterProps> = ({ 
  value, 
  onChange,
  disabled = false 
}) => {
  const { availableChannels, isLoading } = useFilterOptions();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium block">Channel</label>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled || isLoading}
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
