import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CameraIcon, RefreshCcw, SettingsIcon, ZapIcon } from "lucide-react";
import Webcam from "react-webcam";
import { useCamera } from "@/hooks/useCamera";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export interface Detection {
  id: string;
  name: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface ScanInterfaceProps {
  onScan?: (imageData: string) => void;
  className?: string;
}

export default function ScanInterface({ onScan, className }: ScanInterfaceProps) {
  const webcamRef = useRef<Webcam>(null);
  const { hasCamera, cameraError } = useCamera();
  const { coords } = useGeolocation();
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [autoScanEnabled, setAutoScanEnabled] = useState(false);
  const [autoScanInterval, setAutoScanInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Simulate ML processing with progress
  useEffect(() => {
    if (isScanning) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setScanProgress(Math.min(progress, 95)); // Cap at 95% until completion
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 100);
      
      return () => clearInterval(interval);
    } else {
      setScanProgress(0);
    }
  }, [isScanning]);
  
  // Auto-scan feature
  useEffect(() => {
    if (autoScanEnabled) {
      const interval = setInterval(() => {
        if (!isScanning) {
          handleCapture();
        }
      }, 10000); // Auto scan every 10 seconds
      
      setAutoScanInterval(interval);
      
      return () => {
        if (autoScanInterval) {
          clearInterval(autoScanInterval);
        }
      };
    } else if (autoScanInterval) {
      clearInterval(autoScanInterval);
      setAutoScanInterval(null);
    }
  }, [autoScanEnabled, isScanning]);
  
  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (autoScanInterval) {
        clearInterval(autoScanInterval);
      }
    };
  }, []);

  const handleCapture = async () => {
    if (!webcamRef.current) return;
    
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      toast({
        title: "Camera error",
        description: "Could not capture image from camera",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    
    try {
      // If onScan callback is provided, use it
      if (onScan) {
        onScan(imageSrc);
      } else {
        // Simulate ML detection (we would normally call detectMinerals here)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate detection results
        const newDetections: Detection[] = [
          {
            id: `detection-${Date.now()}-1`,
            name: "Iron Ore",
            confidence: 0.94,
            boundingBox: {
              x: 30,
              y: 40,
              width: 20,
              height: 15
            }
          },
          {
            id: `detection-${Date.now()}-2`,
            name: "Quartz",
            confidence: 0.86,
            boundingBox: {
              x: 60,
              y: 30,
              width: 18,
              height: 12
            }
          }
        ];
        
        setDetections(newDetections);
        
        toast({
          title: "Scan complete",
          description: `Detected ${newDetections.length} minerals in the sample`,
        });
      }
      
      // Complete the progress
      setScanProgress(100);
    } catch (error) {
      toast({
        title: "Detection failed",
        description: "Could not process the image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        setIsScanning(false);
        setScanProgress(0);
      }, 500);
    }
  };

  const toggleAutoScan = () => {
    setAutoScanEnabled(!autoScanEnabled);
    
    toast({
      title: !autoScanEnabled ? "Auto-scan enabled" : "Auto-scan disabled",
      description: !autoScanEnabled 
        ? "The scanner will automatically capture samples every 10 seconds" 
        : "Automatic scanning has been turned off",
    });
  };

  if (cameraError) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-red-500 mb-2">Camera access error</div>
            <p className="text-sm text-muted-foreground">
              Please allow camera access to use the scanning feature
            </p>
            <Button 
              className="mt-4" 
              variant="outline"
              onClick={() => window.location.reload()}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Retry Camera Access
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("camera-view bg-black w-full relative rounded-md overflow-hidden", className)} style={{aspectRatio: '4/3'}}>
      {hasCamera ? (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: "environment"
          }}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted/20 aspect-video">
          <div className="text-center p-4">
            <CameraIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Camera not available</p>
          </div>
        </div>
      )}
      
      {/* Scan overlay effect */}
      {isScanning && (
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-primary/10 animate-pulse">
          <div className="absolute inset-x-0 top-0">
            <Progress value={scanProgress} className="h-1 rounded-none bg-primary/20" />
          </div>
        </div>
      )}
      
      {/* Detection overlays */}
      {detections.map(detection => (
        <div 
          key={detection.id}
          className="absolute border-2 border-primary rounded-md flex items-end justify-start"
          style={{
            top: `${detection.boundingBox?.y || 0}%`,
            left: `${detection.boundingBox?.x || 0}%`,
            width: `${detection.boundingBox?.width || 20}%`,
            height: `${detection.boundingBox?.height || 15}%`,
            boxShadow: '0 0 0 1px rgba(255,255,255,0.2)'
          }}
        >
          <div className="bg-primary text-white text-xs px-1 py-0.5 rounded-sm m-1">
            {detection.name} ({(detection.confidence * 100).toFixed(0)}%)
          </div>
        </div>
      ))}
      
      {/* Controls overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-white text-black border-0 rounded-full h-12 w-12 shadow-lg"
            onClick={handleCapture}
            disabled={isScanning || !hasCamera}
          >
            <CameraIcon className="h-6 w-6" />
          </Button>
          
          <div className="text-white text-center">
            <div className="text-sm font-medium">
              {isScanning 
                ? `Scanning... ${scanProgress.toFixed(0)}%` 
                : autoScanEnabled 
                  ? "Auto-scanning enabled" 
                  : "Ready to scan"}
            </div>
            <div className="text-xs text-white/70">ML-powered detection</div>
          </div>
          
          <Button 
            variant="outline" 
            size="icon"
            className={cn(
              "rounded-full h-10 w-10 border-0 shadow-lg",
              autoScanEnabled ? "bg-primary text-primary-foreground" : "bg-black/50 text-white"
            )}
            onClick={toggleAutoScan}
          >
            <ZapIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
