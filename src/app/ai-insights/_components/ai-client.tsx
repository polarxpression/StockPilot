"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { runGenerateRestockAlerts } from "@/lib/actions";
import { sampleHistoricalData, sampleReorderThresholds } from "@/lib/data";
import { Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AiClient() {
  const { toast } = useToast();
  const [historicalData, setHistoricalData] = useState(sampleHistoricalData);
  const [reorderThresholds, setReorderThresholds] = useState(sampleReorderThresholds);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setResult(null);

    const response = await runGenerateRestockAlerts({
      historicalData,
      reorderThresholds,
    });

    setIsLoading(false);

    if (response.success && response.data) {
      setResult(response.data.alerts);
    } else {
      toast({
        variant: "destructive",
        title: "Error Generating Report",
        description:
          response.error || "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Input Data</CardTitle>
          <CardDescription>
            Provide historical usage data and reorder thresholds. Sample data is
            pre-filled.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="historical-data">Historical Usage Data (CSV Format)</Label>
            <Textarea
              id="historical-data"
              value={historicalData}
              onChange={(e) => setHistoricalData(e.target.value)}
              rows={10}
              className="font-mono text-xs"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reorder-thresholds">Reorder Thresholds (CSV Format)</Label>
            <Textarea
              id="reorder-thresholds"
              value={reorderThresholds}
              onChange={(e) => setReorderThresholds(e.target.value)}
              rows={5}
              className="font-mono text-xs"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Report
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Report</CardTitle>
          <CardDescription>
            The analysis of your data will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <h3 className="text-xl font-semibold">Analyzing Data...</h3>
              <p className="text-muted-foreground">
                The AI is processing your inventory patterns.
              </p>
            </div>
          )}
          {!isLoading && result && (
            <pre className="whitespace-pre-wrap rounded-md bg-secondary p-4 text-sm font-mono text-secondary-foreground">
              {result}
            </pre>
          )}
          {!isLoading && !result && (
             <div className="flex flex-col items-center justify-center gap-4 py-12 text-center text-muted-foreground">
                <Sparkles className="h-10 w-10" />
                <h3 className="text-xl font-semibold">Ready to Analyze</h3>
                <p>Click "Generate Report" to get your AI-powered insights.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
