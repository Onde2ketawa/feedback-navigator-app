
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ChannelOption {
  value: string;
  label: string;
}

interface ChannelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const ChannelSelector: React.FC<ChannelSelectorProps> = ({ value, onChange }) => {
  const [channels, setChannels] = useState<ChannelOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from('channel')
          .select('id, name')
          .order('name');
        
        if (fetchError) {
          throw new Error(`Failed to fetch channels: ${fetchError.message}`);
        }
        
        if (data) {
          const channelOptions: ChannelOption[] = data.map(channel => ({
            value: channel.id,
            label: channel.name
          }));
          setChannels(channelOptions);
          
          // Set default value if none selected and channels are available
          if (!value && channelOptions.length > 0) {
            onChange(channelOptions[0].value);
          }
        }
      } catch (err) {
        console.error('Error fetching channels:', err);
        setError(err instanceof Error ? err.message : 'Failed to load channels');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannels();
  }, [value, onChange]);

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-2 mb-4">
      <Label htmlFor="channel-select">Channel</Label>
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">Loading channels...</span>
        </div>
      ) : (
        <Select value={value} onValueChange={onChange} disabled={isLoading}>
          <SelectTrigger id="channel-select" className="w-full">
            <SelectValue placeholder="Select a channel" />
          </SelectTrigger>
          <SelectContent>
            {channels.length === 0 ? (
              <div className="py-2 px-2 text-sm text-muted-foreground text-center">
                No channels available
              </div>
            ) : (
              channels.map((channel) => (
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
