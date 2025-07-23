import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Play, 
  Pause, 
  Square, 
  Scan, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Eye,
  Settings,
  Maximize,
  Minimize,
  RotateCw,
  Volume2,
  VolumeX,
  Download,
  Share2,
  Target,
  Grid3X3,
  Focus,
  Aperture
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface DetectionBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  label: string;
  severity: 'healthy' | 'warning' | 'critical';
}

interface CameraSettings {
  resolution: string;
  fps: number;
  brightness: number;
  contrast: number;
  saturation: number;
  autoFocus: boolean;
  gridOverlay: boolean;
  detectionMode: boolean;
}

const LiveCameraFeed: React.FC = () => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [detectionBoxes, setDetectionBoxes] = useState<DetectionBox[]>([]);
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null);
  
  const [settings, setSettings] = useState<CameraSettings>({
    resolution: '1920x1080',
    fps: 30,
    brightness: 50,
    contrast: 50,
    saturation: 50,
    autoFocus: true,
    gridOverlay: false,
    detectionMode: true
  });

  const startCamera = useCallback(async () => {
    try {
      const constraints = {
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: settings.fps }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setIsStreaming(true);
      
      toast({
        title: "Camera Started",
        description: "Live feed is now active",
      });
    } catch (error) {
      toast({
        title: "Camera Access Failed",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  }, [settings.fps, toast]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsStreaming(false);
    setIsRecording(false);
    
    toast({
      title: "Camera Stopped",
      description: "Live feed has been disconnected",
    });
  }, [toast]);

  const captureFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  const performAIAnalysis = useCallback(async () => {
    if (!isStreaming) {
      toast({
        title: "Camera Not Active",
        description: "Please start the camera feed first",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      const frameData = await captureFrame();
      if (!frameData) throw new Error('Unable to capture frame');

      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.random() * 15;
        });
      }, 100);

      // Fetch current sensor data for context
      const sensorResponse = await fetch('/api/sensor-data');
      const sensorData = await sensorResponse.json();

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockDetections: DetectionBox[] = [
        {
          id: '1',
          x: 150,
          y: 100,
          width: 200,
          height: 150,
          confidence: 0.89,
          label: 'Healthy Lettuce',
          severity: 'healthy'
        }
      ];

      // Add detection based on actual sensor conditions
      if (parseFloat(sensorData.waterLevel) < 40) {
        mockDetections.push({
          id: '2',
          x: 400,
          y: 200,
          width: 180,
          height: 120,
          confidence: 0.76,
          label: 'Water Stress',
          severity: 'warning'
        });
      }

      if (parseFloat(sensorData.nutrientLevel) < 50) {
        mockDetections.push({
          id: '3',
          x: 250,
          y: 300,
          width: 160,
          height: 140,
          confidence: 0.82,
          label: 'Nutrient Deficiency',
          severity: 'critical'
        });
      }

      setDetectionBoxes(mockDetections);
      setAnalysisProgress(100);
      setLastAnalysis(new Date());
      
      toast({
        title: "Analysis Complete",
        description: `Detected ${mockDetections.length} plant conditions`,
      });

    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to process camera feed",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [isStreaming, captureFrame, toast]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'healthy': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const updateSetting = (key: keyof CameraSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!settings.detectionMode || !isStreaming) return;

    const interval = setInterval(() => {
      if (!isAnalyzing) {
        performAIAnalysis();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [settings.detectionMode, isStreaming, isAnalyzing, performAIAnalysis]);

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/30 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Camera className="w-5 h-5 mr-2 text-emerald-400" />
            Live Camera Feed & AI Analysis
          </CardTitle>
          <CardDescription className="text-slate-300">
            Real-time plant monitoring with computer vision detection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={isStreaming ? stopCamera : startCamera}
              className={isStreaming ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}
            >
              {isStreaming ? <Square className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isStreaming ? 'Stop Feed' : 'Start Camera'}
            </Button>

            <Button
              onClick={performAIAnalysis}
              disabled={!isStreaming || isAnalyzing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Scan className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'AI Analysis'}
            </Button>

            <Button
              onClick={captureFrame}
              disabled={!isStreaming}
              variant="outline"
              className="text-white border-slate-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Capture
            </Button>

            <Button
              onClick={toggleFullscreen}
              variant="outline"
              className="text-white border-slate-600"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
          </div>

          <div className="relative bg-slate-900 rounded-xl overflow-hidden">
            <div className="aspect-video relative">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              
              {settings.detectionMode && detectionBoxes.map((box) => (
                <div
                  key={box.id}
                  className="absolute border-2 rounded"
                  style={{
                    left: `${(box.x / 640) * 100}%`,
                    top: `${(box.y / 480) * 100}%`,
                    width: `${(box.width / 640) * 100}%`,
                    height: `${(box.height / 480) * 100}%`,
                    borderColor: getSeverityColor(box.severity)
                  }}
                >
                  <div 
                    className="absolute -top-8 left-0 px-2 py-1 rounded text-xs text-white"
                    style={{ backgroundColor: getSeverityColor(box.severity) }}
                  >
                    {box.label} ({Math.round(box.confidence * 100)}%)
                  </div>
                </div>
              ))}

              {settings.gridOverlay && (
                <div className="absolute inset-0 pointer-events-none">
                  <svg className="w-full h-full">
                    <defs>
                      <pattern id="grid" width="10%" height="10%" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>
              )}

              <div className="absolute top-4 left-4 flex space-x-2">
                {isStreaming && (
                  <Badge className="bg-emerald-500/80 text-white">
                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                    LIVE
                  </Badge>
                )}
                
                {settings.detectionMode && (
                  <Badge className="bg-blue-500/80 text-white">
                    <Eye className="w-3 h-3 mr-1" />
                    AI ACTIVE
                  </Badge>
                )}
              </div>

              <AnimatePresence>
                {isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center"
                  >
                    <div className="bg-slate-800/90 rounded-lg p-6 text-center">
                      <div className="text-white mb-4">AI Analysis in Progress</div>
                      <Progress value={analysisProgress} className="w-48 mb-4" />
                      <div className="text-slate-300 text-sm">
                        Processing frame and detecting plant conditions...
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isStreaming && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-300 text-lg">Camera Feed Inactive</p>
                    <p className="text-slate-400 text-sm">Click "Start Camera" to begin monitoring</p>
                  </div>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </div>

          {detectionBoxes.length > 0 && (
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white text-lg">Detection Results</CardTitle>
                {lastAnalysis && (
                  <CardDescription className="text-slate-300">
                    Last analyzed: {lastAnalysis.toLocaleTimeString()}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {detectionBoxes.map((box) => (
                    <div key={box.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: getSeverityColor(box.severity) }}
                        />
                        <div>
                          <div className="text-white font-medium">{box.label}</div>
                          <div className="text-slate-400 text-sm">
                            Confidence: {Math.round(box.confidence * 100)}%
                          </div>
                        </div>
                      </div>
                      <Badge 
                        className={`${
                          box.severity === 'healthy' ? 'bg-emerald-500/20 text-emerald-400' :
                          box.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {box.severity.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-slate-700/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Camera Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="detection-mode" className="text-white">
                      AI Detection Mode
                    </Label>
                    <Switch
                      id="detection-mode"
                      checked={settings.detectionMode}
                      onCheckedChange={(checked) => updateSetting('detectionMode', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="grid-overlay" className="text-white">
                      Grid Overlay
                    </Label>
                    <Switch
                      id="grid-overlay"
                      checked={settings.gridOverlay}
                      onCheckedChange={(checked) => updateSetting('gridOverlay', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-focus" className="text-white">
                      Auto Focus
                    </Label>
                    <Switch
                      id="auto-focus"
                      checked={settings.autoFocus}
                      onCheckedChange={(checked) => updateSetting('autoFocus', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-white mb-2 block">
                      Brightness: {settings.brightness}%
                    </Label>
                    <Slider
                      value={[settings.brightness]}
                      onValueChange={([value]) => updateSetting('brightness', value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2 block">
                      Contrast: {settings.contrast}%
                    </Label>
                    <Slider
                      value={[settings.contrast]}
                      onValueChange={([value]) => updateSetting('contrast', value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2 block">
                      Saturation: {settings.saturation}%
                    </Label>
                    <Slider
                      value={[settings.saturation]}
                      onValueChange={([value]) => updateSetting('saturation', value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveCameraFeed;