
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChannelOption } from '@/hooks/useFilterOptions';

interface ChannelFilterProps {
  availableChannels: ChannelOption[];
  selectedChannel: string;
  onChannelChange: (value: string) => void;
  isLoading?: boolean;
  error?: Error | null;
}

export const ChannelFilter: React.FC<ChannelFilterProps> = ({ 
  availableChannels, 
  selectedChannel, 
  onChannelChange,
  isLoading = false,
  error = null
}) => {
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>
          Unable to load channels: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Channel</label>
      {isLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <Select 
          value={selectedChannel} 
          onValueChange={onChannelChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Channel" />
          </SelectTrigger>
          <SelectContent>
            {availableChannels.length === 0 ? (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                No channels available
              </div>
            ) : (
              availableChannels.map(channel => (
                <SelectItem key={channel.value} value={channel.value}>
                  {channel.label}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
