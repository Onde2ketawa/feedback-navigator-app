
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SentimentFilterProps {
  selectedSentiment: string;
  onSentimentChange: (sentiment: string) => void;
  isLoading?: boolean;
}

export const SentimentFilter: React.FC<SentimentFilterProps> = ({
  selectedSentiment,
  onSentimentChange,
  isLoading = false
}) => {
  const sentimentOptions = [
    { value: 'all', label: 'All Sentiments' },
    { value: 'positive', label: 'Positive' },
    { value: 'neutral', label: 'Neutral' },
    { value: 'negative', label: 'Negative' }
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Sentiment</label>
      <Select
        disabled={isLoading}
        value={selectedSentiment}
        onValueChange={onSentimentChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select sentiment" />
        </SelectTrigger>
        <SelectContent>
          {sentimentOptions.map((sentiment) => (
            <SelectItem key={sentiment.value} value={sentiment.value}>
              {sentiment.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
