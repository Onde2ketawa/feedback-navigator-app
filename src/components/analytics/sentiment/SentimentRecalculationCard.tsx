
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Database, Cpu } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SentimentRecalculationCardProps {
  selectedMethod: "database" | "edge";
  setSelectedMethod: (v: "database" | "edge") => void;
  onRecalculate: () => void;
  isProcessing: boolean;
  progress: number;
  stats?: { processed: number; errors: number };
}

export const SentimentRecalculationCard: React.FC<SentimentRecalculationCardProps> = ({
  selectedMethod,
  setSelectedMethod,
  onRecalculate,
  isProcessing,
  progress,
  stats,
}) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>Recalculate Sentiment</CardTitle>
      <CardDescription>
        Choose analysis method and recalculate sentiment scores for all feedback
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <Tabs value={selectedMethod} onValueChange={(v) => setSelectedMethod(v as "database" | "edge")}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="database">
              <Database className="h-4 w-4 mr-2" />
              Database Function
            </TabsTrigger>
            <TabsTrigger value="edge">
              <Cpu className="h-4 w-4 mr-2" />
              Edge Function
            </TabsTrigger>
          </TabsList>
          <TabsContent value="database">
            <p className="text-sm text-muted-foreground mb-4">
              Uses PostgreSQL database functions for fast keyword-based sentiment analysis.
              Processes in efficient batches directly in the database.
            </p>
          </TabsContent>
          <TabsContent value="edge">
            <p className="text-sm text-muted-foreground mb-4">
              Uses Edge Function with keyword analysis and optional OpenAI integration.
              Better for complex sentiment analysis but slower processing.
            </p>
          </TabsContent>
        </Tabs>
        <Button onClick={onRecalculate} disabled={isProcessing} className="w-full">
          <RefreshCw className={`h-4 w-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
          {isProcessing ? "Processing..." : "Recalculate Sentiment"}
        </Button>
      </div>
      {isProcessing && (
        <div className="space-y-2 mt-4">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Analyzing sentiment...</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} />
          {stats && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-green-800 font-medium">Processed</p>
                <p className="text-2xl font-bold">{stats.processed}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-red-800 font-medium">Errors</p>
                <p className="text-2xl font-bold">{stats.errors}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </CardContent>
  </Card>
);
