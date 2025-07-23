import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Scan, 
  Layers, 
  Zap, 
  Camera, 
  AlertCircle, 
  CheckCircle, 
  Ruler, 
  Mountain,
  Activity
} from "lucide-react";
import { lidarScanner, type LiDARMeasurement, type GeologicalFeatures } from "@/lib/lidarScanning";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LiDARScanInterfaceProps {
  onScanComplete?: (measurement: LiDARMeasurement, features: GeologicalFeatures) => void;
  className?: string;
}

export default function LiDARScanInterface({ onScanComplete, className }: LiDARScanInterfaceProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lidarSupported, setLidarSupported] = useState(false);
  const [measurement, setMeasurement] = useState<LiDARMeasurement | null>(null);
  const [features, setFeatures] = useState<GeologicalFeatures | null>(null);
  const [scanPhase, setScanPhase] = useState<'idle' | 'initializing' | 'scanning' | 'processing' | 'complete'>('idle');

  useEffect(() => {
    const checkSupport = async () => {
      setLidarSupported(lidarScanner.isLiDARSupported());
    };
    checkSupport();
  }, []);

  const initializeLiDAR = async () => {
    setScanPhase('initializing');
    const success = await lidarScanner.initializeLiDAR();
    setIsInitialized(success);
    if (success) {
      setScanPhase('idle');
    }
  };

  const performScan = async () => {
    if (!isInitialized && lidarSupported) {
      await initializeLiDAR();
    }

    setIsScanning(true);
    setScanPhase('scanning');
    setScanProgress(0);

    // Simulate scanning progress
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    try {
      // Perform the actual LiDAR scan
      const scanResult = await lidarScanner.performDepthScan();
      
      if (scanResult) {
        setScanPhase('processing');
        
        // Analyze geological features
        const geologicalFeatures = lidarScanner.analyzeGeologicalFeatures(scanResult);
        
        setMeasurement(scanResult);
        setFeatures(geologicalFeatures);
        setScanPhase('complete');
        
        if (onScanComplete) {
          onScanComplete(scanResult, geologicalFeatures);
        }
      }
    } catch (error) {
      console.error('LiDAR scan failed:', error);
      setScanPhase('idle');
    } finally {
      clearInterval(progressInterval);
      setIsScanning(false);
      setScanProgress(100);
    }
  };

  const resetScan = () => {
    setMeasurement(null);
    setFeatures(null);
    setScanProgress(0);
    setScanPhase('idle');
  };

  const formatNumber = (num: number, decimals: number = 3) => {
    return num.toFixed(decimals);
  };

  const getHardnessDescription = (hardness: number) => {
    if (hardness <= 2) return "Very Soft";
    if (hardness <= 4) return "Soft";
    if (hardness <= 6) return "Medium";
    if (hardness <= 8) return "Hard";
    return "Very Hard";
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Layers className="h-5 w-5 mr-2" />
            3D Geological Scanner
            {lidarSupported && (
              <Badge variant="secondary" className="ml-2">
                <Zap className="h-3 w-3 mr-1" />
                LiDAR Ready
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!lidarSupported && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                LiDAR not detected. Using advanced photogrammetry for depth analysis.
              </AlertDescription>
            </Alert>
          )}

          {/* Scan Controls */}
          <div className="space-y-3">
            <div className="flex space-x-2">
              <Button 
                onClick={performScan} 
                disabled={isScanning}
                className="flex-1"
              >
                {isScanning ? (
                  <>
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Scan className="h-4 w-4 mr-2" />
                    Start 3D Scan
                  </>
                )}
              </Button>
              {measurement && (
                <Button onClick={resetScan} variant="outline">
                  New Scan
                </Button>
              )}
            </div>

            {/* Scan Progress */}
            {isScanning && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    {scanPhase === 'scanning' && 'Capturing depth data...'}
                    {scanPhase === 'processing' && 'Analyzing geological features...'}
                  </span>
                  <span>{scanProgress}%</span>
                </div>
                <Progress value={scanProgress} className="w-full" />
              </div>
            )}
          </div>

          {/* Results */}
          {measurement && features && (
            <Tabs defaultValue="measurements" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="measurements">Measurements</TabsTrigger>
                <TabsTrigger value="features">Geological Features</TabsTrigger>
              </TabsList>

              <TabsContent value="measurements" className="space-y-3 mt-3">
                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-3">
                    <div className="flex items-center space-x-2">
                      <Ruler className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">Surface Area</p>
                        <p className="text-lg font-bold">{formatNumber(measurement.surfaceArea * 10000)} cm²</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-3">
                    <div className="flex items-center space-x-2">
                      <Mountain className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">Volume</p>
                        <p className="text-lg font-bold">{formatNumber(measurement.volume * 1000000)} cm³</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-3">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-orange-500" />
                      <div>
                        <p className="text-sm font-medium">Roughness</p>
                        <p className="text-lg font-bold">{formatNumber(measurement.roughness * 1000)} mm</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-3">
                    <div className="flex items-center space-x-2">
                      <Scan className="h-4 w-4 text-purple-500" />
                      <div>
                        <p className="text-sm font-medium">Data Points</p>
                        <p className="text-lg font-bold">{measurement.points.length.toLocaleString()}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Dimensions</h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Width:</span>
                      <p className="font-mono">{formatNumber((measurement.boundingBox.maxX - measurement.boundingBox.minX) * 100)} cm</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Height:</span>
                      <p className="font-mono">{formatNumber((measurement.boundingBox.maxY - measurement.boundingBox.minY) * 100)} cm</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Depth:</span>
                      <p className="font-mono">{formatNumber((measurement.boundingBox.maxZ - measurement.boundingBox.minZ) * 100)} cm</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="features" className="space-y-3 mt-3">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Surface Texture</span>
                    <Badge variant="outline">{features.surfaceTexture}</Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-medium">Grain Size</span>
                    <Badge variant="outline">{features.grainSize}</Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-medium">Layering</span>
                    <Badge variant={features.layering ? "default" : "secondary"}>
                      {features.layering ? "Present" : "Absent"}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-medium">Fractures</span>
                    <Badge variant="outline">{features.fractures}</Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-medium">Estimated Hardness</span>
                    <div className="text-right">
                      <Badge variant="outline">{features.estimatedHardness}/10</Badge>
                      <p className="text-xs text-muted-foreground">{getHardnessDescription(features.estimatedHardness)}</p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    3D analysis complete. These measurements enhance mineral identification accuracy.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}