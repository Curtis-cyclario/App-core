import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRightIcon, Mountain, Gem } from "lucide-react";
import { Detection } from "./ScanInterface";

interface MineralDetectionResultsProps {
  detections: Detection[];
  isLoading?: boolean;
}

export default function MineralDetectionResults({ 
  detections, 
  isLoading = false 
}: MineralDetectionResultsProps) {
  const [showAll, setShowAll] = useState(false);
  
  // Show only first 2 detections unless showAll is true
  const displayDetections = showAll ? detections : detections.slice(0, 2);

  const getIcon = (mineralName: string) => {
    if (mineralName.toLowerCase().includes("iron")) {
      return <Mountain className="text-primary" />;
    } else if (mineralName.toLowerCase().includes("gold")) {
      return <Gem className="text-accent" />;
    } else {
      return <Gem className="text-secondary" />;
    }
  };
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.9) return "text-secondary";
    if (confidence > 0.7) return "text-accent";
    return "text-light-dark";
  };

  return (
    <Card className="border-0 bg-dark-lighter">
      <CardHeader className="pb-0 pt-4 px-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Live Detection</CardTitle>
          <div className="text-xs bg-secondary/20 text-secondary py-1 px-2 rounded-full flex items-center">
            <div className="w-2 h-2 rounded-full bg-secondary mr-1.5"></div>
            Active
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pt-3 pb-2">
        {isLoading ? (
          <div className="py-6 text-center">
            <div className="animate-pulse inline-block w-6 h-6 rounded-full bg-primary/30 mb-2"></div>
            <p className="text-sm text-light-dark">Processing scan...</p>
          </div>
        ) : detections.length === 0 ? (
          <div className="py-6 text-center">
            <div className="text-light-dark mb-2">No minerals detected</div>
            <p className="text-xs text-light-dark">
              Try scanning a different area or adjust the camera
            </p>
          </div>
        ) : (
          <>
            {displayDetections.map((detection, index) => (
              <div 
                key={detection.id}
                className="bg-dark-light rounded-lg p-3 mb-3 flex items-center"
              >
                <div className="rounded-full bg-primary/20 p-2 mr-3">
                  {getIcon(detection.name)}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{detection.name}</div>
                  <div className={`text-sm ${getConfidenceColor(detection.confidence)}`}>
                    Confidence: {Math.round(detection.confidence * 100)}%
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-light-dark hover:text-light">
                  <ChevronRightIcon className="h-5 w-5" />
                </Button>
              </div>
            ))}
            
            {detections.length > 2 && (
              <Button 
                variant="ghost" 
                className="w-full py-2 text-center text-primary font-medium text-sm"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Show Less" : "Show All Detections"}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
