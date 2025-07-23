import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";
import { MLModelPerformance } from "@shared/schema";

export default function MLModelPerformanceCard() {
  const { data: mlPerformance, isLoading } = useQuery<MLModelPerformance>({
    queryKey: ['/api/ml-performance/latest'],
  });
  
  if (isLoading) {
    return (
      <Card className="overflow-hidden flex flex-col">
        <CardHeader className="p-4 border-b border-border">
          <CardTitle className="text-base font-semibold">ML Model Performance</CardTitle>
        </CardHeader>
        <CardContent className="p-4 text-center text-muted-foreground">
          Loading ML model data...
        </CardContent>
      </Card>
    );
  }
  
  if (!mlPerformance) {
    return (
      <Card className="overflow-hidden flex flex-col">
        <CardHeader className="p-4 border-b border-border">
          <CardTitle className="text-base font-semibold">ML Model Performance</CardTitle>
        </CardHeader>
        <CardContent className="p-4 text-center text-muted-foreground">
          No ML model performance data available
        </CardContent>
      </Card>
    );
  }
  
  const mineralAccuracies = mlPerformance.mineralAccuracies as Record<string, number>;
  
  return (
    <Card className="overflow-hidden flex flex-col">
      <CardHeader className="p-4 border-b border-border">
        <CardTitle className="text-base font-semibold">ML Model Performance</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-muted-foreground">Overall Accuracy</div>
            <div className="text-2xl font-semibold">{mlPerformance.accuracy.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Training Status</div>
            <div className="text-secondary font-medium">
              <CheckCircle className="inline h-4 w-4 mr-1" /> Updated
            </div>
          </div>
        </div>
        
        {Object.entries(mineralAccuracies).map(([mineral, accuracy]) => (
          <div key={mineral} className="mb-4">
            <div className="flex justify-between mb-1">
              <div className="text-sm">{mineral}</div>
              <div className="text-sm font-medium">{accuracy}%</div>
            </div>
            <Progress value={accuracy} className="h-2" />
          </div>
        ))}
        
        <Button variant="outline" className="w-full py-2 bg-primary/10 text-primary rounded-md font-medium text-sm">
          View Detailed Analysis
        </Button>
      </CardContent>
    </Card>
  );
}
