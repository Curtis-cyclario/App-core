import { useState, useRef, useCallback, useEffect } from "react";
import { Camera, Zap, Target, Sparkles, Play, Square, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Webcam from "react-webcam";
import { cn } from "@/lib/utils";

interface Detection {
  id: string;
  name: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  properties?: {
    hardness?: number;
    density?: number;
    color?: string;
    luster?: string;
  };
}

interface EnhancedScanInterfaceProps {
  onScan?: (imageData: string) => void;
  onDetection?: (detection: Detection) => void;
  isProcessing?: boolean;
  className?: string;
}

export default function EnhancedScanInterface({ 
  onScan, 
  onDetection, 
  isProcessing = false, 
  className 
}: EnhancedScanInterfaceProps) {
  const webcamRef = useRef<Webcam>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentDetections, setCurrentDetections] = useState<Detection[]>([]);
  const [autoScanEnabled, setAutoScanEnabled] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [cameraReady, setCameraReady] = useState(false);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: facingMode
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoScanEnabled && cameraReady && !isProcessing) {
      interval = setInterval(() => {
        captureImage();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [autoScanEnabled, cameraReady, isProcessing]);

  const captureImage = useCallback(() => {
    if (!webcamRef.current || isProcessing) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc && onScan) {
      setIsScanning(true);
      setScanProgress(0);
      
      // Simulate scanning progress
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setIsScanning(false);
            return 100;
          }
          return prev + 5;
        });
      }, 50);

      onScan(imageSrc);
    }
  }, [onScan, isProcessing]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-400";
    if (confidence >= 0.6) return "text-yellow-400";
    return "text-red-400";
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.9) return "Excellent";
    if (confidence >= 0.8) return "Very Good";
    if (confidence >= 0.7) return "Good";
    if (confidence >= 0.6) return "Fair";
    return "Low";
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Enhanced Camera Interface */}
      <Card className="scan-interface-enhanced overflow-hidden">
        <CardContent className="p-0 relative">
          <div className="relative aspect-[4/3] bg-black rounded-3xl overflow-hidden">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full h-full object-cover"
              onUserMedia={() => setCameraReady(true)}
              onUserMediaError={() => setCameraReady(false)}
            />
            
            {/* Scanning Overlay */}
            {(isScanning || isProcessing) && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="scan-overlay"></div>
                <div className="relative z-10 text-center text-white">
                  <div className="scan-pulse">
                    <Target className="h-16 w-16 mx-auto mb-4" />
                  </div>
                  <p className="text-lg font-semibold">Analyzing Sample</p>
                  <Progress value={scanProgress} className="w-48 mt-2 bg-white/20" />
                </div>
              </div>
            )}

            {/* Detection Overlays */}
            {currentDetections.map((detection) => (
              detection.boundingBox && (
                <div
                  key={detection.id}
                  className="detection-overlay absolute border-2 border-emerald-400"
                  style={{
                    left: `${detection.boundingBox.x}%`,
                    top: `${detection.boundingBox.y}%`,
                    width: `${detection.boundingBox.width}%`,
                    height: `${detection.boundingBox.height}%`,
                  }}
                >
                  <div className="absolute -top-8 left-0 bg-emerald-400 text-black px-2 py-1 rounded text-xs font-semibold">
                    {detection.name} ({Math.round(detection.confidence * 100)}%)
                  </div>
                </div>
              )
            ))}

            {/* Auto-scan indicator */}
            {autoScanEnabled && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-400/30">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Auto-scan
                </Badge>
              </div>
            )}

            {/* Camera controls overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleCamera}
                className="glass-morphism text-white border-white/20 hover:bg-white/10"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>

              <div className="flex space-x-2">
                <Button
                  variant={autoScanEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAutoScanEnabled(!autoScanEnabled)}
                  className={cn(
                    autoScanEnabled 
                      ? "bg-emerald-500 hover:bg-emerald-600" 
                      : "glass-morphism text-white border-white/20 hover:bg-white/10"
                  )}
                  disabled={!cameraReady}
                >
                  {autoScanEnabled ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>

                <Button
                  onClick={captureImage}
                  disabled={!cameraReady || isProcessing}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/20 px-8"
                  size="lg"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Scan
                </Button>
              </div>

              <div className="w-16" /> {/* Spacer for balance */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Results Display */}
      {currentDetections.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Live Detections</h3>
          <div className="grid gap-3">
            {currentDetections.map((detection) => (
              <Card key={detection.id} className="mineral-card mineral-shimmer">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{detection.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {getConfidenceLabel(detection.confidence)} confidence
                      </p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn("mineral-glow", getConfidenceColor(detection.confidence))}
                    >
                      {Math.round(detection.confidence * 100)}%
                    </Badge>
                  </div>

                  {/* Enhanced confidence bar */}
                  <div className="space-y-2">
                    <div className="confidence-bar-enhanced">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${detection.confidence * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Mineral properties */}
                  {detection.properties && (
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      {detection.properties.hardness && (
                        <div className="glass-morphism p-2 rounded">
                          <span className="text-muted-foreground">Hardness:</span>
                          <span className="ml-1 font-semibold">{detection.properties.hardness}</span>
                        </div>
                      )}
                      {detection.properties.color && (
                        <div className="glass-morphism p-2 rounded">
                          <span className="text-muted-foreground">Color:</span>
                          <span className="ml-1 font-semibold">{detection.properties.color}</span>
                        </div>
                      )}
                      {detection.properties.luster && (
                        <div className="glass-morphism p-2 rounded">
                          <span className="text-muted-foreground">Luster:</span>
                          <span className="ml-1 font-semibold">{detection.properties.luster}</span>
                        </div>
                      )}
                      {detection.properties.density && (
                        <div className="glass-morphism p-2 rounded">
                          <span className="text-muted-foreground">Density:</span>
                          <span className="ml-1 font-semibold">{detection.properties.density}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Camera status indicator */}
      {!cameraReady && (
        <Card className="glass-morphism">
          <CardContent className="p-4 text-center">
            <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Initializing camera...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}