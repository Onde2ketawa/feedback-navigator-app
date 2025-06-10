
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { QueryInput } from '@/components/natural-language/QueryInput';
import { QueryVisualization } from '@/components/natural-language/QueryVisualization';
import { QueryHistoryComponent } from '@/components/natural-language/QueryHistory';
import { HelpSection } from '@/components/natural-language/HelpSection';
import { parseQuery } from '@/utils/natural-language-utils';

interface QueryHistory {
  id: string;
  query: string;
  timestamp: Date;
  resultType: string;
}

interface ParsedQuery {
  chartType: 'pie' | 'bar' | 'line' | 'table' | 'grid';
  xAxis?: string;
  yAxis?: string;
  data: any[];
  title: string;
  filters?: {
    channel?: string;
    sentiment?: string;
    rating?: { min: number; max: number };
    timeframe?: string;
  };
}

const NaturalLanguageQuery = () => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedResult, setParsedResult] = useState<ParsedQuery | null>(null);
  const [queryHistory, setQueryHistory] = useState<QueryHistory[]>([
    {
      id: '1',
      query: 'Show feedback by channel as a pie chart',
      timestamp: new Date(Date.now() - 86400000),
      resultType: 'pie chart'
    },
    {
      id: '2',
      query: 'Display average rating by sentiment in table format',
      timestamp: new Date(Date.now() - 172800000),
      resultType: 'table'
    }
  ]);
  
  const { toast } = useToast();

  // Fetch feedback data
  const { data: feedbackData } = useQuery({
    queryKey: ['feedback-for-nlq'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_feedback')
        .select(`
          *,
          channel:channel_id(name)
        `);
      
      if (error) throw error;
      return data;
    }
  });

  const handleSubmitQuery = async () => {
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a query",
        variant: "destructive"
      });
      return;
    }

    if (!feedbackData) {
      toast({
        title: "Error",
        description: "No data available to query",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const result = await parseQuery(query, feedbackData, supabase);
      setParsedResult(result);
      
      // Add to history
      const newHistoryItem: QueryHistory = {
        id: Date.now().toString(),
        query,
        timestamp: new Date(),
        resultType: result.chartType
      };
      setQueryHistory(prev => [newHistoryItem, ...prev]);
      
      toast({
        title: "Query Processed",
        description: "Your data visualization has been generated successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your query. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader 
        title="Natural Language Query"
        description="Ask questions about your data in plain English and get instant visualizations"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Query Input Section */}
        <div className="lg:col-span-2 space-y-6">
          <QueryInput
            query={query}
            setQuery={setQuery}
            isProcessing={isProcessing}
            hasResult={!!parsedResult}
            onSubmit={handleSubmitQuery}
            hasData={!!feedbackData}
          />

          {/* Results Section */}
          {parsedResult && (
            <QueryVisualization parsedResult={parsedResult} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <QueryHistoryComponent 
            queryHistory={queryHistory}
            onSelectQuery={setQuery}
          />
          <HelpSection onSelectQuery={setQuery} />
        </div>
      </div>
    </div>
  );
};

export default NaturalLanguageQuery;
