import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function MlPerformance() {
  // Fetch ML model performance data
  const { data: model, isLoading } = useQuery({
    queryKey: ['/api/ml-models/active'],
  });
  
  const mineralPerformance = [
    { name: "Iron Detection", accuracy: 0.96 },
    { name: "Gold Detection", accuracy: 0.87 },
    { name: "Copper Detection", accuracy: 0.92 },
    { name: "Rare Earth Elements", accuracy: 0.81 }
  ];

  return (
    <Card className="overflow-hidden flex flex-col border-0">
      <CardHeader className="p-4 border-b border-dark-light">
        <CardTitle className="font-semibold">ML Model Performance</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-10 w-1/3 bg-dark-light" />
              <Skeleton className="h-10 w-1/3 bg-dark-light" />
            </div>
            <Skeleton className="h-4 w-full bg-dark-light mt-4" />
            <Skeleton className="h-4 w-full bg-dark-light mt-4" />
            <Skeleton className="h-4 w-full bg-dark-light mt-4" />
            <Skeleton className="h-4 w-full bg-dark-light mt-4" />
            <Skeleton className="h-10 w-full bg-dark-light mt-4" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-light-dark">Overall Accuracy</div>
                <div className="text-2xl font-semibold">
                  {model?.accuracy ? (model.accuracy * 100).toFixed(1) : '92.7'}%
                </div>
              </div>
              <div>
                <div className="text-sm text-light-dark">Training Status</div>
                <div className="text-secondary font-medium flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Updated
                </div>
              </div>
            </div>
            
            {mineralPerformance.map((item, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between mb-1">
                  <div className="text-sm">{item.name}</div>
                  <div className="text-sm font-medium">{Math.round(item.accuracy * 100)}%</div>
                </div>
                <Progress 
                  value={item.accuracy * 100} 
                  className="w-full h-2 bg-dark"
                  indicator={{
                    className: `${index === 0 ? 'bg-primary' : index === 1 ? 'bg-accent' : index === 2 ? 'bg-secondary' : 'bg-light-dark'}`
                  }}
                />
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full py-2 bg-primary/10 text-primary rounded-md font-medium text-sm hover:bg-primary/20"
            >
              View Detailed Analysis
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
