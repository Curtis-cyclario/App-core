import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Camera, 
  Zap, 
  Brain, 
  Target, 
  Sparkles,
  Activity,
  Layers,
  Database,
  FlaskConical
} from 'lucide-react';
import Webcam from 'react-webcam';
import { mineralAI, MINERAL_DATABASE } from '@/lib/advancedMineralAI';
import { motion, AnimatePresence } from 'framer-motion';

interface Detection {
  mineral: string;
  confidence: number;
  properties: any;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface ScanResult {
  detections: Detection[];
  overallConfidence: number;
  processingTime: number;
}

export default function AIScanner() {
  const webcamRef = useRef<Webcam>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [modelReady, setModelReady] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);

  useEffect(() => {
    // Check if model is ready
    const checkModel = () => {
      if (mineralAI.isReady()) {
        setModelReady(true);
      } else {
        setTimeout(checkModel, 500);
      }
    };
    checkModel();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAutoMode && modelReady) {
      interval = setInterval(async () => {
        await performScan();
      }, 3000); // Auto-scan every 3 seconds
    }
    
    return () => clearInterval(interval);
  }, [isAutoMode, modelReady]);

  const performScan = useCallback(async () => {
    if (!webcamRef.current || !modelReady) return;

    setIsScanning(true);
    setProcessingProgress(0);

    try {
      // Simulate processing progress
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        throw new Error('Failed to capture image');
      }

      const result = await mineralAI.analyzeImage(imageSrc);
      
      clearInterval(progressInterval);
      setProcessingProgress(100);
      
      setScanResult(result);
      setScanHistory(prev => [result, ...prev.slice(0, 4)]); // Keep last 5 scans
      
      setTimeout(() => setProcessingProgress(0), 1000);
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setIsScanning(false);
    }
  }, [modelReady]);

  const toggleAutoMode = () => {
    setIsAutoMode(!isAutoMode);
    if (!isAutoMode) {
      setScanResult(null);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.9) return 'Excellent';
    if (confidence >= 0.8) return 'Very Good';
    if (confidence >= 0.7) return 'Good';
    if (confidence >= 0.6) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Brain className="h-10 w-10 text-blue-400" />
            Advanced AI Mineral Scanner
          </h1>
          <p className="text-blue-200 text-lg">
            Professional-grade geological analysis powered by deep learning
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Camera Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="bg-black/40 backdrop-blur-lg border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Live Camera Feed
                  {modelReady && (
                    <Badge variant="outline" className="ml-auto text-green-400 border-green-400">
                      <Activity className="h-3 w-3 mr-1" />
                      Model Ready
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                    mirrored={false}
                  />
                  
                  {/* Processing Overlay */}
                  {isScanning && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center"
                    >
                      <div className="text-center text-white">
                        <Sparkles className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-400" />
                        <p className="text-lg font-medium mb-2">Analyzing Sample...</p>
                        <Progress value={processingProgress} className="w-64" />
                      </div>
                    </motion.div>
                  )}

                  {/* Detection Overlays */}
                  {scanResult && scanResult.detections.length > 0 && (
                    <div className="absolute inset-0 pointer-events-none">
                      {scanResult.detections.slice(0, 3).map((detection, index) => (
                        detection.boundingBox && (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute border-2 border-blue-400 bg-blue-400/20 rounded"
                            style={{
                              left: `${detection.boundingBox.x * 100}%`,
                              top: `${detection.boundingBox.y * 100}%`,
                              width: `${detection.boundingBox.width * 100}%`,
                              height: `${detection.boundingBox.height * 100}%`,
                            }}
                          >
                            <div className="absolute -top-8 left-0 bg-blue-600 text-white px-2 py-1 rounded text-sm">
                              {MINERAL_DATABASE[detection.mineral as keyof typeof MINERAL_DATABASE]?.name} 
                              ({Math.round(detection.confidence * 100)}%)
                            </div>
                          </motion.div>
                        )
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Controls */}
                <div className="p-4 flex gap-3 justify-center">
                  <Button
                    onClick={performScan}
                    disabled={!modelReady || isScanning}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isScanning ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Target className="h-4 w-4 mr-2" />
                        Single Scan
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={toggleAutoMode}
                    disabled={!modelReady}
                    variant={isAutoMode ? "destructive" : "outline"}
                    className={isAutoMode ? "" : "border-blue-400 text-blue-400 hover:bg-blue-400/10"}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    {isAutoMode ? 'Stop Auto' : 'Auto Mode'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Current Results */}
            <Card className="bg-black/40 backdrop-blur-lg border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FlaskConical className="h-5 w-5" />
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {scanResult ? (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      {/* Overall Confidence */}
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                          {Math.round(scanResult.overallConfidence * 100)}%
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`${getConfidenceColor(scanResult.overallConfidence)} text-white border-0`}
                        >
                          {getConfidenceLabel(scanResult.overallConfidence)}
                        </Badge>
                        <p className="text-sm text-gray-400 mt-2">
                          Processed in {scanResult.processingTime.toFixed(0)}ms
                        </p>
                      </div>

                      <Separator className="bg-white/20" />

                      {/* Top Detections */}
                      <div className="space-y-3">
                        {scanResult.detections.slice(0, 3).map((detection, index) => {
                          const mineral = MINERAL_DATABASE[detection.mineral as keyof typeof MINERAL_DATABASE];
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-white/10 rounded-lg p-3"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-white">{mineral?.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {Math.round(detection.confidence * 100)}%
                                </Badge>
                              </div>
                              <Progress 
                                value={detection.confidence * 100} 
                                className="h-2 mb-2"
                              />
                              <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                                <div>Hardness: {mineral?.hardness}</div>
                                <div>Density: {mineral?.density}</div>
                                <div className="col-span-2">
                                  Formula: {mineral?.formula}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="no-results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-gray-400 py-8"
                    >
                      <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No scan results yet</p>
                      <p className="text-sm">Point camera at mineral sample</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Model Info */}
            <Card className="bg-black/40 backdrop-blur-lg border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  AI Model Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <Badge variant={modelReady ? "default" : "destructive"}>
                      {modelReady ? "Ready" : "Loading..."}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Backend:</span>
                    <span className="text-white">{mineralAI.getModelInfo().backend}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Parameters:</span>
                    <span className="text-white">
                      {(mineralAI.getModelInfo().totalParams / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Minerals:</span>
                    <span className="text-white">{Object.keys(MINERAL_DATABASE).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scan History */}
            {scanHistory.length > 0 && (
              <Card className="bg-black/40 backdrop-blur-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Recent Scans</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {scanHistory.map((scan, index) => (
                    <div key={index} className="bg-white/5 rounded p-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-300">
                          {MINERAL_DATABASE[scan.detections[0]?.mineral as keyof typeof MINERAL_DATABASE]?.name || 'Unknown'}
                        </span>
                        <span className="text-white">
                          {Math.round(scan.detections[0]?.confidence * 100 || 0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}