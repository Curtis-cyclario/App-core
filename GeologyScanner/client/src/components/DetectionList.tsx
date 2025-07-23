import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gem, MoreVertical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function DetectionList() {
  // Fetch recent mineral detections
  const { data: minerals, isLoading } = useQuery({
    queryKey: ['/api/minerals'],
  });
  
  // Placeholder detections for demonstration
  const placeholderDetections = [
    { id: 1, name: "Iron Deposit", location: "Ridge Exploration", confidence: 0.94 },
    { id: 2, name: "Gold Trace", location: "Creek Bed", confidence: 0.76 },
    { id: 3, name: "Copper Ore", location: "Mountain Ridge", confidence: 0.91 },
    { id: 4, name: "Silver Deposit", location: "Canyon Wall", confidence: 0.82 }
  ];
  
  const getIconColorClass = (mineralName: string) => {
    if (mineralName.toLowerCase().includes("iron")) return "text-primary";
    if (mineralName.toLowerCase().includes("gold")) return "text-accent";
    if (mineralName.toLowerCase().includes("copper")) return "text-secondary";
    return "text-light-dark";
  };
  
  const getBgColorClass = (mineralName: string) => {
    if (mineralName.toLowerCase().includes("iron")) return "bg-primary/20";
    if (mineralName.toLowerCase().includes("gold")) return "bg-accent/20";
    if (mineralName.toLowerCase().includes("copper")) return "bg-secondary/20";
    return "bg-dark-light";
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full border-0">
      <CardHeader className="p-4 border-b border-dark-light">
        <CardTitle className="font-semibold">Recent Mineral Detections</CardTitle>
      </CardHeader>
      <div className="overflow-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            <Skeleton className="h-16 w-full bg-dark-light" />
            <Skeleton className="h-16 w-full bg-dark-light" />
            <Skeleton className="h-16 w-full bg-dark-light" />
          </div>
        ) : (
          (minerals || placeholderDetections).map((detection) => (
            <div key={detection.id} className="p-3 border-b border-dark-light flex items-center">
              <div className={`${getBgColorClass(detection.name)} p-2 rounded-lg mr-3`}>
                <Gem className={getIconColorClass(detection.name)} />
              </div>
              <div className="flex-1">
                <div className="font-medium">{detection.name}</div>
                <div className="flex justify-between text-xs text-light-dark">
                  <span>{detection.location}</span>
                  <span>Confidence: {Math.round(detection.confidence * 100)}%</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-light-dark hover:text-light">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
