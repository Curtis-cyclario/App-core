import { useEffect, useState, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import ScanInterface from "@/components/ScanInterface";
import MineralDetectionResults from "@/components/MineralDetectionResults";
import RecentScans from "@/components/RecentScans";
import LocationMenu from "@/components/LocationMenu";
import ScanningGuide from "@/components/ScanningGuide";
import FieldGeologyScanner from "@/components/FieldGeologyScanner";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Detection } from "@/components/ScanInterface";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, RefreshCw, Zap, Layers, Camera } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { exportScanToPdf } from "@/lib/pdfExport";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Scan, type MlAnalysis, type Mineral } from "@shared/schema";
import { type LiDARMeasurement, type GeologicalFeatures } from "@/lib/lidarScanning";

export default function ScanPage() {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("live");
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [scanSession, setScanSession] = useState<{id: number, startTime: Date} | null>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [lidarData, setLidarData] = useState<LiDARMeasurement | null>(null);
  const [geologicalFeatures, setGeologicalFeatures] = useState<GeologicalFeatures | null>(null);
  const [enhanced3D, setEnhanced3D] = useState(false);
  
  const isMobile = window.innerWidth < 1024;
  const { coords } = useGeolocation();
  const { toast } = useToast();
  const scanResultsRef = useRef<HTMLDivElement>(null);
  
  // Get active ML model
  const { data: activeModel } = useQuery({
    queryKey: ['/api/ml-models/active'],
  });
  
  // Mutation for creating a new scan
  const createScanMutation = useMutation({
    mutationFn: async (scanData: any) => {
      const response = await fetch('/api/detect-minerals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scanData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      // Update detections
      if (data.minerals) {
        const newDetections = data.minerals.map((mineral: any) => ({
          id: `${mineral.name}-${Date.now()}`,
          name: mineral.name,
          confidence: mineral.confidence,
        }));
        setDetections(newDetections);
        
        // Set the scan session
        setScanSession({
          id: data.scan.id,
          startTime: new Date()
        });
        
        // Add success toast
        toast({
          title: "Scan Complete",
          description: `Detected ${data.minerals.length} minerals with ${(data.overallConfidence * 100).toFixed(0)}% confidence.`,
          variant: "default",
        });
        
        // Scroll to results
        if (scanResultsRef.current) {
          scanResultsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Refresh recent scans data
        queryClient.invalidateQueries({ queryKey: ['/api/scans'] });
      }
    },
    onError: (error) => {
      console.error('Scan error:', error);
      toast({
        title: "Scan Failed",
        description: "Unable to process the scan. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsProcessing(false);
    }
  });

  const handleLiDARScanComplete = (measurement: LiDARMeasurement, features: GeologicalFeatures) => {
    setLidarData(measurement);
    setGeologicalFeatures(features);
    setEnhanced3D(true);
    
    toast({
      title: "3D Scan Complete",
      description: "Geological analysis ready - your next mineral scan will be enhanced with depth data",
    });
  };
  
  // Get details about the current scan if we have a session
  const {
    data: currentScan,
  } = useQuery<Scan>({
    queryKey: ['/api/scans', scanSession?.id],
    enabled: !!scanSession?.id,
  });
  
  const {
    data: currentAnalysis,
  } = useQuery<MlAnalysis>({
    queryKey: ['/api/scans', scanSession?.id, 'analyses'],
    enabled: !!scanSession?.id,
  });
  
  const {
    data: scanMinerals,
  } = useQuery<Mineral[]>({
    queryKey: ['/api/scans', scanSession?.id, 'minerals'],
    enabled: !!scanSession?.id,
  });
  
  useEffect(() => {
    document.title = "Scan Minerals - GeoScan Pro";
  }, []);
  
  // Handle initiating a scan
  const handleScan = async (imageData: string) => {
    setIsProcessing(true);
    
    // Create a new scan
    createScanMutation.mutate({
      imageData,
      userId: 1, // Hardcoded for demo
      latitude: coords?.latitude,
      longitude: coords?.longitude,
      location: coords ? `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}` : undefined,
      modelId: activeModel?.id
    });
  };
  
  const handleExportPdf = () => {
    if (currentScan && scanMinerals) {
      exportScanToPdf(currentScan, currentAnalysis, scanMinerals);
      setExportDialogOpen(false);
      
      toast({
        title: "Export Complete",
        description: "Scan report has been downloaded.",
        variant: "default",
      });
    }
  };
  
  // In a desktop view, we'd typically have this data pre-loaded
  // or synchronized from mobile device scans
  if (!isMobile) {
    return (
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">Mineral Scanning</h1>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowLocationMenu(!showLocationMenu)}
                >
                  View Location
                </Button>
                
                {scanSession && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setExportDialogOpen(true)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Export Results
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-7">
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>Scan Interface</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScanInterface onScan={handleScan} />
                  </CardContent>
                  <CardFooter>
                    {activeModel && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Zap className="h-4 w-4 mr-1 text-primary" />
                        Using {activeModel.name} model ({(activeModel.accuracy * 100).toFixed(0)}% accuracy)
                      </div>
                    )}
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Scan Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="mb-4">
                        <TabsTrigger value="live">Live Feed</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="live" ref={scanResultsRef}>
                        <MineralDetectionResults 
                          detections={detections} 
                          isLoading={isProcessing} 
                        />
                      </TabsContent>
                      
                      <TabsContent value="history">
                        <RecentScans />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
              
              <div className="col-span-5">
                <Card>
                  <CardHeader>
                    <CardTitle>Real-time Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4 text-center">
                          <p className="text-sm text-muted-foreground mb-1">Minerals Detected</p>
                          <p className="text-2xl font-bold">{detections.length}</p>
                        </div>
                        
                        <div className="border rounded-lg p-4 text-center">
                          <p className="text-sm text-muted-foreground mb-1">Average Confidence</p>
                          <p className="text-2xl font-bold">
                            {detections.length > 0 
                              ? (detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length * 100).toFixed(0) 
                              : 0}%
                          </p>
                        </div>
                      </div>
                      
                      {scanSession && (
                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">Current Session</h3>
                            <Badge variant="outline">
                              {new Date().getTime() - scanSession.startTime.getTime() < 60000
                                ? 'New'
                                : 'Active'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Session started {scanSession.startTime.toLocaleTimeString()}
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2 w-full"
                            onClick={() => setScanSession(null)}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            New Session
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        
        {showLocationMenu && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="max-w-md w-full p-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Location Details</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowLocationMenu(false)}
                    >
                      Close
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {coords ? (
                    <div className="space-y-4">
                      <div className="bg-muted rounded-md p-3 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Coordinates</p>
                        <p className="font-mono text-lg">
                          {coords.latitude.toFixed(6)}, {coords.longitude.toFixed(6)}
                        </p>
                      </div>
                      
                      <div className="h-40 rounded-md overflow-hidden bg-muted/50">
                        {/* Placeholder for map */}
                        <div className="w-full h-full flex items-center justify-center">
                          <p className="text-sm text-muted-foreground">
                            Map view (requires API key)
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No location data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mobile view - Advanced Field Geology Scanner
  return (
    <div className="w-full h-full overflow-y-auto pb-20">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Field Geology Scanner</h1>
          <ScanningGuide />
        </div>
        
        <FieldGeologyScanner />
        
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Recent Field Data</h2>
          <RecentScans />
        </div>
      </div>
      
      {/* Location menu (drag-up from bottom) */}
      <LocationMenu
        latitude={coords?.latitude}
        longitude={coords?.longitude}
        initiallyOpen={false}
      />
      
      {/* Export PDF Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Scan Results</DialogTitle>
            <DialogDescription>
              Generate a report containing all detected minerals and analysis details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Report Contents</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Badge variant="outline" className="mr-2">✓</Badge>
                  Scan details and timestamp
                </li>
                <li className="flex items-center">
                  <Badge variant="outline" className="mr-2">✓</Badge>
                  {detections.length} detected minerals
                </li>
                <li className="flex items-center">
                  <Badge variant="outline" className="mr-2">✓</Badge>
                  ML analysis results
                </li>
                {coords && (
                  <li className="flex items-center">
                    <Badge variant="outline" className="mr-2">✓</Badge>
                    Location coordinates
                  </li>
                )}
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExportPdf}>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
