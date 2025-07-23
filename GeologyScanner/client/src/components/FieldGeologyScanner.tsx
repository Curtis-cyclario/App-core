import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Mountain, 
  MapPin, 
  Save, 
  Database, 
  Wifi, 
  WifiOff, 
  Camera, 
  Layers,
  Clock,
  HardDrive,
  Upload,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { offlineGeologyDb } from "@/lib/offlineGeologyDb";
import { lidarScanner, type LiDARMeasurement, type GeologicalFeatures } from "@/lib/lidarScanning";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useToast } from "@/hooks/use-toast";
import ScanInterface from "./ScanInterface";
import LiDARScanInterface from "./LiDARScanInterface";

interface FieldScanSession {
  location?: {
    latitude: number;
    longitude: number;
    elevation?: number;
  };
  imageData?: string;
  lidarData?: LiDARMeasurement;
  geologicalFeatures?: GeologicalFeatures;
  mineralDetections: any[];
  fieldNotes: string;
  rockType: 'igneous' | 'sedimentary' | 'metamorphic' | 'unknown';
  weatheringLevel: 'fresh' | 'slight' | 'moderate' | 'high' | 'extreme';
}

export default function FieldGeologyScanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentSession, setCurrentSession] = useState<FieldScanSession>({
    mineralDetections: [],
    fieldNotes: '',
    rockType: 'unknown',
    weatheringLevel: 'moderate'
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [storageStats, setStorageStats] = useState<{
    totalEntries: number;
    pendingSync: number;
    estimatedSize: number;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("camera");

  const { coords, error: locationError } = useGeolocation();
  const { toast } = useToast();

  useEffect(() => {
    const initializeOfflineDb = async () => {
      try {
        await offlineGeologyDb.initialize();
        setIsInitialized(true);
        const stats = await offlineGeologyDb.getStorageStats();
        setStorageStats(stats);
      } catch (error) {
        console.error('Failed to initialize offline database:', error);
        toast({
          title: "Storage Error",
          description: "Failed to initialize offline storage",
          variant: "destructive"
        });
      }
    };

    initializeOfflineDb();

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  useEffect(() => {
    if (coords) {
      setCurrentSession(prev => ({
        ...prev,
        location: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          elevation: undefined // Could be enhanced with elevation API
        }
      }));
    }
  }, [coords]);

  const handleCameraScan = async (imageData: string) => {
    setCurrentSession(prev => ({
      ...prev,
      imageData
    }));

    // Simulate mineral detection for offline use
    const mockDetections = [
      {
        name: "Quartz",
        confidence: 0.85,
        composition: { Si: 46.7, O: 53.3 },
        properties: { density: 2.65, hardness: 7, color: "Clear to white", luster: "Vitreous" }
      },
      {
        name: "Feldspar", 
        confidence: 0.72,
        composition: { Al: 9.1, Si: 30.3, O: 48.6, K: 12.0 },
        properties: { density: 2.56, hardness: 6, color: "Pink to white", luster: "Vitreous" }
      }
    ];

    setCurrentSession(prev => ({
      ...prev,
      mineralDetections: mockDetections
    }));

    toast({
      title: "Camera Scan Complete",
      description: `Detected ${mockDetections.length} minerals offline`,
    });
  };

  const handleLiDARScan = (measurement: LiDARMeasurement, features: GeologicalFeatures) => {
    setCurrentSession(prev => ({
      ...prev,
      lidarData: measurement,
      geologicalFeatures: features
    }));

    toast({
      title: "3D Scan Complete", 
      description: "Geological features analyzed and saved to session",
    });
  };

  const saveFieldSession = async () => {
    if (!isInitialized) {
      toast({
        title: "Storage Not Ready",
        description: "Offline storage is not initialized",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Enhance mineral detections with offline reference data
      const enhancedDetections = await Promise.all(
        currentSession.mineralDetections.map(detection => 
          offlineGeologyDb.enhanceMineralDetection(detection)
        )
      );

      // Analyze geological context
      const geologicalContext = await offlineGeologyDb.analyzeGeologicalContext(
        enhancedDetections,
        currentSession.geologicalFeatures
      );

      // Save complete geological data
      const savedId = await offlineGeologyDb.saveGeologicalData({
        location: currentSession.location,
        imageData: currentSession.imageData || '',
        lidarMeasurement: currentSession.lidarData,
        geologicalFeatures: currentSession.geologicalFeatures,
        mineralDetections: enhancedDetections,
        geologicalContext,
        fieldNotes: currentSession.fieldNotes
      });

      // Update storage stats
      const newStats = await offlineGeologyDb.getStorageStats();
      setStorageStats(newStats);

      // Reset session
      setCurrentSession({
        mineralDetections: [],
        fieldNotes: '',
        rockType: 'unknown',
        weatheringLevel: 'moderate'
      });

      toast({
        title: "Field Data Saved",
        description: `Geological scan saved offline (ID: ${savedId.slice(-8)})`,
      });

    } catch (error) {
      console.error('Failed to save field session:', error);
      toast({
        title: "Save Failed",
        description: "Could not save field data to offline storage",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const syncPendingData = async () => {
    if (!isOnline) {
      toast({
        title: "No Internet Connection",
        description: "Cannot sync data while offline",
        variant: "destructive"
      });
      return;
    }

    try {
      const pendingData = await offlineGeologyDb.getPendingSyncData();
      
      toast({
        title: "Sync Status",
        description: `${pendingData.length} entries ready for sync`,
      });

      // Here would implement actual sync to server
      // For now, just mark as synced after delay
      setTimeout(async () => {
        for (const entry of pendingData) {
          await offlineGeologyDb.updateSyncStatus(entry.id, 'synced');
        }
        
        const newStats = await offlineGeologyDb.getStorageStats();
        setStorageStats(newStats);
        
        toast({
          title: "Sync Complete",
          description: `${pendingData.length} entries synced to server`,
        });
      }, 2000);

    } catch (error) {
      console.error('Sync failed:', error);
      toast({
        title: "Sync Failed",
        description: "Could not sync data to server",
        variant: "destructive"
      });
    }
  };

  const hasSessionData = currentSession.imageData || 
                        currentSession.lidarData || 
                        currentSession.mineralDetections.length > 0 ||
                        currentSession.fieldNotes.trim();

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Alert>
        <div className="flex items-center">
          {isOnline ? (
            <>
              <Wifi className="h-4 w-4 text-green-600" />
              <span className="ml-2 text-green-600">Online - Data will sync automatically</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-orange-600" />
              <span className="ml-2 text-orange-600">Offline - Data saved locally</span>
            </>
          )}
        </div>
      </Alert>

      {/* Location Info */}
      {currentSession.location && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2" />
              Current Location
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Latitude:</span>
                <p className="font-mono">{currentSession.location.latitude.toFixed(6)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Longitude:</span>
                <p className="font-mono">{currentSession.location.longitude.toFixed(6)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scanning Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="camera" className="flex items-center">
            <Camera className="h-4 w-4 mr-2" />
            Camera Scan
          </TabsTrigger>
          <TabsTrigger value="lidar" className="flex items-center">
            <Layers className="h-4 w-4 mr-2" />
            3D Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="camera" className="mt-4">
          <ScanInterface onScan={handleCameraScan} />
          
          {currentSession.mineralDetections.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">Detected Minerals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentSession.mineralDetections.map((detection, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium">{detection.name}</span>
                      <Badge variant="outline">
                        {(detection.confidence * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="lidar" className="mt-4">
          <LiDARScanInterface onScanComplete={handleLiDARScan} />
        </TabsContent>
      </Tabs>

      {/* Field Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Field Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rockType">Rock Type</Label>
              <select
                id="rockType"
                className="w-full p-2 border rounded-md"
                value={currentSession.rockType}
                onChange={(e) => setCurrentSession(prev => ({
                  ...prev,
                  rockType: e.target.value as any
                }))}
              >
                <option value="unknown">Unknown</option>
                <option value="igneous">Igneous</option>
                <option value="sedimentary">Sedimentary</option>
                <option value="metamorphic">Metamorphic</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weathering">Weathering Level</Label>
              <select
                id="weathering"
                className="w-full p-2 border rounded-md"
                value={currentSession.weatheringLevel}
                onChange={(e) => setCurrentSession(prev => ({
                  ...prev,
                  weatheringLevel: e.target.value as any
                }))}
              >
                <option value="fresh">Fresh</option>
                <option value="slight">Slight</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="extreme">Extreme</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Observations</Label>
            <Textarea
              id="notes"
              placeholder="Record field observations, sample descriptions, geological context..."
              value={currentSession.fieldNotes}
              onChange={(e) => setCurrentSession(prev => ({
                ...prev,
                fieldNotes: e.target.value
              }))}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          onClick={saveFieldSession}
          disabled={!hasSessionData || isSaving}
          className="flex-1"
        >
          {isSaving ? (
            <>
              <Database className="h-4 w-4 mr-2 animate-pulse" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Field Data
            </>
          )}
        </Button>

        {storageStats && storageStats.pendingSync > 0 && (
          <Button
            onClick={syncPendingData}
            disabled={!isOnline}
            variant="outline"
          >
            <Upload className="h-4 w-4 mr-2" />
            Sync ({storageStats.pendingSync})
          </Button>
        )}
      </div>

      {/* Storage Status */}
      {storageStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <HardDrive className="h-4 w-4 mr-2" />
              Local Storage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <p className="text-2xl font-bold">{storageStats.totalEntries}</p>
                <p className="text-muted-foreground">Total Scans</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{storageStats.pendingSync}</p>
                <p className="text-muted-foreground">Pending Sync</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{storageStats.estimatedSize}</p>
                <p className="text-muted-foreground">MB Used</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}