import { Camera, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useCallback } from "react";
import { useWebcam } from "@/hooks/use-webcam";
import { mineralDetector } from "@/lib/ml-model";
import { Detection, InsertDetection } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface MobileScanInterfaceProps {
  scanSessionId: number;
  onDetectionsFound: (detections: Detection[]) => void;
}

export default function MobileScanInterface({ scanSessionId, onDetectionsFound }: MobileScanInterfaceProps) {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [detectionOverlays, setDetectionOverlays] = useState<Array<{ top: number; left: number; width: number; height: number }>>([]);
  const webcamRef = useRef<HTMLVideoElement>(null);
  const { videoStream, startCamera, stopCamera, takePhoto } = useWebcam(webcamRef);
  
  // Get minerals for reference
  const { data: minerals } = useQuery({
    queryKey: ['/api/minerals'],
  });

  // Handle scan button click
  const handleScan = useCallback(async () => {
    if (!videoStream || !webcamRef.current) {
      toast({
        title: "Camera not ready",
        description: "Please make sure camera access is granted",
        variant: "destructive"
      });
      return;
    }
    
    setIsScanning(true);
    
    try {
      // Take a photo from the webcam
      const photoCanvas = takePhoto();
      
      if (!photoCanvas) {
        throw new Error("Failed to capture photo");
      }
      
      // Demo: Create random detection overlays
      const overlays = [];
      for (let i = 0; i < 2; i++) {
        overlays.push({
          top: Math.floor(30 + Math.random() * 40) + '%',
          left: Math.floor(20 + Math.random() * 50) + '%',
          width: Math.floor(10 + Math.random() * 20) + '%',
          height: Math.floor(10 + Math.random() * 15) + '%'
        });
      }
      setDetectionOverlays(overlays);
      
      // Detect minerals in the photo
      // For demo - simulate detections
      const detections = mineralDetector.simulateDetection(scanSessionId);
      
      // Save detections to the server
      const savedDetections = await Promise.all(
        detections.map(async (detection: InsertDetection) => {
          const response = await apiRequest('POST', '/api/detections', detection);
          return await response.json();
        })
      );
      
      // Pass detections up to parent
      onDetectionsFound(savedDetections);
      
      toast({
        title: "Scan complete",
        description: `Found ${savedDetections.length} mineral${savedDetections.length !== 1 ? 's' : ''}`,
      });
    } catch (error) {
      console.error('Scanning error:', error);
      toast({
        title: "Scanning failed",
        description: "There was an error during scanning. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  }, [videoStream, webcamRef, scanSessionId, takePhoto, onDetectionsFound, toast]);
  
  // Start camera when component mounts
  useState(() => {
    startCamera();
    return () => stopCamera();
  });
  
  return (
    <div className="camera-view bg-black w-full relative">
      <video 
        ref={webcamRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      
      {videoStream && <div className="scan-overlay"></div>}
      
      {/* Detection Overlays */}
      {detectionOverlays.map((overlay, index) => (
        <div 
          key={index}
          className="detection-overlay"
          style={{
            top: overlay.top,
            left: overlay.left,
            width: overlay.width,
            height: overlay.height
          }}
        ></div>
      ))}
      
      {/* Controls Overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex justify-between items-center">
          <Button
            size="icon"
            variant="secondary"
            className="bg-white rounded-full p-3 h-12 w-12"
            onClick={handleScan}
            disabled={isScanning || !videoStream}
          >
            <Camera className="text-black text-xl" />
          </Button>
          
          <div className="text-white text-center">
            <div className="text-sm font-medium">Scanning Mode</div>
            <div className="text-xs text-muted-foreground">Mineral Detection</div>
          </div>
          
          <Button
            size="icon"
            variant="outline"
            className="bg-muted rounded-full p-3 h-12 w-12"
          >
            <Settings className="text-muted-foreground text-xl" />
          </Button>
        </div>
      </div>
      
      {/* Loading overlay when scanning */}
      {isScanning && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="scanning-indicator text-lg mb-2">Scanning</div>
            <div className="text-sm">Analyzing minerals...</div>
          </div>
        </div>
      )}
      
      {/* No camera message */}
      {!videoStream && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="text-white text-center p-4">
            <div className="text-lg mb-2">Camera Access Required</div>
            <div className="text-sm mb-4">Please allow camera access to use the scanning feature</div>
            <Button onClick={startCamera}>Enable Camera</Button>
          </div>
        </div>
      )}
    </div>
  );
}
