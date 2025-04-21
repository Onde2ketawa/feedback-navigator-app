
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Database, Cpu, Brain, AlertCircle, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SentimentRecalculationCardProps {
  selectedMethod: "database" | "edge" | "bert";
  setSelectedMethod: (v: "database" | "edge" | "bert") => void;
  onRecalculate: () => void;
  isProcessing: boolean;
  progress: number;
  stats?: { processed: number; errors: number; blankProcessed?: number } | null;
  lastError?: string | null;
  lastMessage?: string | null;
}

export const SentimentRecalculationCard: React.FC<SentimentRecalculationCardProps> = ({
  selectedMethod,
  setSelectedMethod,
  onRecalculate,
  isProcessing,
  progress,
  stats,
  lastError,
  lastMessage
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
        <Tabs value={selectedMethod} onValueChange={(v) => setSelectedMethod(v as "database" | "edge" | "bert")}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="database">
              <Database className="h-4 w-4 mr-2" />
              Database
            </TabsTrigger>
            <TabsTrigger value="edge">
              <Cpu className="h-4 w-4 mr-2" />
              Edge Function
            </TabsTrigger>
            <TabsTrigger value="bert">
              <Brain className="h-4 w-4 mr-2" />
              BERT Model
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
          <TabsContent value="bert">
            <p className="text-sm text-muted-foreground mb-4">
              Uses BERT machine learning model via external API for high-accuracy multilingual sentiment analysis.
              Best for nuanced sentiment but requires external API setup.
              <br />
              <span className="font-medium text-blue-600">Note: Blank feedback will be marked as neutral with score 0.</span>
            </p>
          </TabsContent>
        </Tabs>
        <Button onClick={onRecalculate} disabled={isProcessing} className="w-full">
          <RefreshCw className={`h-4 w-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
          {isProcessing ? "Processing..." : `Recalculate with ${selectedMethod === "database" ? "Database" : selectedMethod === "edge" ? "Edge Function" : "BERT"}`}
        </Button>
        
        {/* Always show processed/errors box for monitoring */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-green-800 font-medium">Processed</p>
            <p className="text-2xl font-bold">{stats ? stats.processed : 0}</p>
            {stats?.blankProcessed ? (
              <p className="text-sm text-green-600">Including {stats.blankProcessed} blank items</p>
            ) : null}
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <p className="text-red-800 font-medium">Errors</p>
            <p className="text-2xl font-bold">{stats ? stats.errors : 0}</p>
          </div>
        </div>
      </div>
      
      {isProcessing && (
        <div className="space-y-2 mt-4">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Analyzing sentiment...</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}
      
      {lastMessage && !isProcessing && (
        <div className="mt-3 px-3 py-2 rounded bg-blue-50 text-blue-700 text-xs border border-blue-200 flex items-start gap-2">
          <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>{lastMessage}</p>
        </div>
      )}
      
      {lastError && (
        <div className="mt-3 px-3 py-2 rounded bg-red-100 text-red-700 text-xs border border-red-200 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span><strong>Error:</strong> {lastError}</span>
        </div>
      )}
    </CardContent>
  </Card>
);
