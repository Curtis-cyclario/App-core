import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, Gem, Mountain } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatConfidence } from "@/lib/utils";
import { Detection } from "@shared/schema";

interface MobileDetectionResultsProps {
  sessionId?: number;
  latestDetections?: Detection[];
}

export default function MobileDetectionResults({ sessionId, latestDetections }: MobileDetectionResultsProps) {
  const [showAll, setShowAll] = useState(false);
  const [displayDetections, setDisplayDetections] = useState<Detection[]>([]);
  
  // Fetch all detections for the current session
  const { data: allDetections } = useQuery<Detection[]>({
    queryKey: ['/api/detections', { sessionId }],
    enabled: !!sessionId,
  });
  
  // Update displayed detections when latest come in
  useEffect(() => {
    if (latestDetections && latestDetections.length > 0) {
      setDisplayDetections(prev => {
        // Add new detections at the beginning
        const newDetections = [...latestDetections, ...prev];
        // Only keep the most recent 5 for the initial view
        return newDetections.slice(0, 5);
      });
    }
  }, [latestDetections]);
  
  // Update displayed detections when all detections are fetched
  useEffect(() => {
    if (showAll && allDetections) {
      setDisplayDetections(allDetections);
    } else if (allDetections) {
      setDisplayDetections(allDetections.slice(0, 3));
    }
  }, [showAll, allDetections]);

  const getIcon = (mineralName: string) => {
    if (mineralName.toLowerCase().includes('iron')) {
      return <Mountain className="text-primary" />;
    }
    return <Gem className="text-accent" />;
  };
  
  return (
    <div className="p-4 bg-card">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Live Detection</h2>
        <Badge variant="outline" className="bg-secondary/20 text-secondary py-1 px-2">
          <Check className="h-3 w-3 mr-1" /> Active
        </Badge>
      </div>
      
      {/* Detection List */}
      {displayDetections.length > 0 ? (
        <>
          {displayDetections.map((detection) => {
            const confidence = formatConfidence(detection.confidence);
            
            return (
              <div key={detection.id} className="bg-muted rounded-lg p-3 mb-3 flex items-center">
                <div className="rounded-full bg-primary/20 p-2 mr-3">
                  {getIcon(detection.mineral?.name || '')}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{detection.mineral?.name}</div>
                  <div className={`text-sm ${confidence.color}`}>
                    Confidence: {confidence.value}
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            );
          })}
          
          <Button 
            variant="ghost" 
            className="w-full py-2 text-center text-primary font-medium text-sm"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : "Show All Detections"}
          </Button>
        </>
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          <Gem className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No detections yet. Scan to detect minerals.</p>
        </div>
      )}
    </div>
  );
}
