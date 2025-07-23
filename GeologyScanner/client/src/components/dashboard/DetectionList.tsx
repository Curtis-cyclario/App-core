import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Detection } from "@shared/schema";
import { Gem, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatConfidence } from "@/lib/utils";

interface DetectionListProps {
  limit?: number;
}

export default function DetectionList({ limit = 4 }: DetectionListProps) {
  const { data: detections, isLoading } = useQuery<Detection[]>({
    queryKey: ['/api/detections'],
  });

  return (
    <Card className="overflow-hidden flex flex-col">
      <CardHeader className="p-4 border-b border-border">
        <CardTitle className="text-base font-semibold">Recent Mineral Detections</CardTitle>
      </CardHeader>
      
      <div className="overflow-auto flex-grow" style={{ maxHeight: '240px' }}>
        {isLoading ? (
          <div className="p-4 text-center text-muted-foreground">Loading detections...</div>
        ) : !detections || detections.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No detections found</div>
        ) : (
          detections.slice(0, limit).map((detection) => {
            const confidence = formatConfidence(detection.confidence);
            
            return (
              <div key={detection.id} className="p-3 border-b border-border flex items-center">
                <div className={`bg-${detection.mineral?.name === 'Iron Ore' ? 'primary' : detection.mineral?.name === 'Gold' ? 'accent' : 'secondary'}/20 p-2 rounded-lg mr-3`}>
                  <Gem className={`text-${detection.mineral?.name === 'Iron Ore' ? 'primary' : detection.mineral?.name === 'Gold' ? 'accent' : 'secondary'}`} />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{detection.mineral?.name || 'Unknown'}</div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Session #{detection.sessionId}</span>
                    <span className={confidence.color}>Confidence: {confidence.value}</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Show on Map</DropdownMenuItem>
                    <DropdownMenuItem>Export Data</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
