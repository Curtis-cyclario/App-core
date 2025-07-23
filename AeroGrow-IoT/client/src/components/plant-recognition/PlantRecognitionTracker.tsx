import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from '@/lib/queryClient';
import { 
  Calendar, 
  Camera, 
  CheckSquare, 
  Crop, 
  Droplet, 
  FilePlus2, 
  FlaskConical, 
  Gauge,
  ImageIcon, 
  Leaf, 
  LineChart, 
  Microscope, 
  Sprout, 
  RefreshCw, 
  Ruler, 
  Search,
  Shrub, 
  ThermometerSun, 
  Timer, 
  Upload, 
  Zap 
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface SproutData {
  id: number;
  name: string;
  scientificName: string;
  growthPhase: string;
  age: number; // days
  height: number; // cm
  healthScore: number; // 0-100
  lastScanned: string;
  plantedDate: string;
  estimatedHarvestDate: string;
  location: string;
  images: SproutImage[];
  growthHistory: GrowthRecord[];
  healthHistory: HealthRecord[];
}

interface SproutImage {
  id: number;
  url: string;
  date: string;
  type: 'regular' | 'health_scan' | 'disease' | 'analysis';
  notes?: string;
}

interface GrowthRecord {
  date: string;
  height: number;
  leafCount: number;
  stemDiameter: number;
  notes?: string;
}

interface HealthRecord {
  date: string;
  overallHealth: number;
  issues: string[];
  nutrientLevels: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  notes?: string;
}

interface AnomalyDetection {
  id: number;
  plantId: number;
  date: string;
  type: 'disease' | 'pest' | 'nutrient_deficiency' | 'growth_anomaly';
  severity: 'low' | 'medium' | 'high';
  description: string;
  affectedArea: string;
  recommendations: string[];
  resolved: boolean;
  imageUrl?: string;
}

// Mock data for demonstration
const mockSprouts: SproutData[] = [
  {
    id: 1,
    name: 'Basil - Tower 1',
    scientificName: 'Ocimum basilicum',
    growthPhase: 'vegetative',
    age: 24,
    height: 18.5,
    healthScore: 92,
    lastScanned: new Date().toISOString(),
    plantedDate: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedHarvestDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Tower 1, Column 2, Pod 3',
    images: [
      {
        id: 1,
        url: 'https://placehold.co/600x400/green/white?text=Basil+Sprout+Image',
        date: new Date().toISOString(),
        type: 'regular'
      },
      {
        id: 2,
        url: 'https://placehold.co/600x400/green/white?text=Basil+Health+Scan',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'health_scan'
      }
    ],
    growthHistory: [
      { 
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), 
        height: 5.2, 
        leafCount: 6,
        stemDiameter: 0.3
      },
      { 
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), 
        height: 9.7, 
        leafCount: 12,
        stemDiameter: 0.5
      },
      { 
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), 
        height: 14.3, 
        leafCount: 24,
        stemDiameter: 0.7
      },
      { 
        date: new Date().toISOString(), 
        height: 18.5, 
        leafCount: 36,
        stemDiameter: 0.9
      }
    ],
    healthHistory: [
      {
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        overallHealth: 88,
        issues: [],
        nutrientLevels: {
          nitrogen: 85,
          phosphorus: 82,
          potassium: 80
        }
      },
      {
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        overallHealth: 90,
        issues: [],
        nutrientLevels: {
          nitrogen: 87,
          phosphorus: 86,
          potassium: 83
        }
      },
      {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        overallHealth: 92,
        issues: [],
        nutrientLevels: {
          nitrogen: 90,
          phosphorus: 88,
          potassium: 85
        }
      },
      {
        date: new Date().toISOString(),
        overallHealth: 92,
        issues: [],
        nutrientLevels: {
          nitrogen: 90,
          phosphorus: 89,
          potassium: 86
        }
      }
    ]
  },
  {
    id: 2,
    name: 'Lettuce - Tower 2',
    scientificName: 'Lactuca sativa',
    growthPhase: 'mature',
    age: 32,
    height: 15.2,
    healthScore: 85,
    lastScanned: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    plantedDate: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedHarvestDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Tower 2, Column 1, Pod 5',
    images: [
      {
        id: 3,
        url: 'https://placehold.co/600x400/green/white?text=Lettuce+Sprout+Image',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'regular'
      }
    ],
    growthHistory: [
      { 
        date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), 
        height: 4.3, 
        leafCount: 5,
        stemDiameter: 0.2
      },
      { 
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), 
        height: 7.6, 
        leafCount: 10,
        stemDiameter: 0.4
      },
      { 
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), 
        height: 11.8, 
        leafCount: 16,
        stemDiameter: 0.6
      },
      { 
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), 
        height: 14.5, 
        leafCount: 20,
        stemDiameter: 0.8
      },
      { 
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
        height: 15.2, 
        leafCount: 22,
        stemDiameter: 0.9
      }
    ],
    healthHistory: [
      {
        date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
        overallHealth: 90,
        issues: [],
        nutrientLevels: {
          nitrogen: 88,
          phosphorus: 85,
          potassium: 86
        }
      },
      {
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        overallHealth: 92,
        issues: [],
        nutrientLevels: {
          nitrogen: 90,
          phosphorus: 87,
          potassium: 88
        }
      },
      {
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        overallHealth: 88,
        issues: ['Slight nitrogen deficiency'],
        nutrientLevels: {
          nitrogen: 82,
          phosphorus: 87,
          potassium: 88
        }
      },
      {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        overallHealth: 85,
        issues: ['Nitrogen deficiency'],
        nutrientLevels: {
          nitrogen: 78,
          phosphorus: 86,
          potassium: 87
        }
      },
      {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        overallHealth: 85,
        issues: ['Nitrogen deficiency'],
        nutrientLevels: {
          nitrogen: 78,
          phosphorus: 86,
          potassium: 88
        }
      }
    ]
  },
  {
    id: 3,
    name: 'Spinach - Tower 3',
    scientificName: 'Spinacia oleracea',
    growthPhase: 'seedling',
    age: 12,
    height: 7.3,
    healthScore: 94,
    lastScanned: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    plantedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedHarvestDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Tower 3, Column 4, Pod 2',
    images: [
      {
        id: 4,
        url: 'https://placehold.co/600x400/green/white?text=Spinach+Sprout+Image',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'regular'
      }
    ],
    growthHistory: [
      { 
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), 
        height: 2.1, 
        leafCount: 2,
        stemDiameter: 0.1
      },
      { 
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), 
        height: 3.8, 
        leafCount: 4,
        stemDiameter: 0.2
      },
      { 
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), 
        height: 5.5, 
        leafCount: 6,
        stemDiameter: 0.3
      },
      { 
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), 
        height: 7.3, 
        leafCount: 8,
        stemDiameter: 0.4
      }
    ],
    healthHistory: [
      {
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        overallHealth: 92,
        issues: [],
        nutrientLevels: {
          nitrogen: 90,
          phosphorus: 88,
          potassium: 91
        }
      },
      {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        overallHealth: 93,
        issues: [],
        nutrientLevels: {
          nitrogen: 91,
          phosphorus: 89,
          potassium: 92
        }
      },
      {
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        overallHealth: 93,
        issues: [],
        nutrientLevels: {
          nitrogen: 92,
          phosphorus: 89,
          potassium: 92
        }
      },
      {
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        overallHealth: 94,
        issues: [],
        nutrientLevels: {
          nitrogen: 93,
          phosphorus: 90,
          potassium: 93
        }
      }
    ]
  }
];

const mockAnomalies: AnomalyDetection[] = [
  {
    id: 1,
    plantId: 2,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'nutrient_deficiency',
    severity: 'medium',
    description: 'Nitrogen deficiency detected in lettuce plants',
    affectedArea: 'Leaves',
    recommendations: [
      'Increase nitrogen in nutrient solution by 15%',
      'Monitor for 3 days and reassess'
    ],
    resolved: false,
    imageUrl: 'https://placehold.co/600x400/yellow/white?text=Nitrogen+Deficiency'
  },
  {
    id: 2,
    plantId: 1,
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'pest',
    severity: 'low',
    description: 'Small aphid colony detected on basil plants',
    affectedArea: 'Stem and new growth',
    recommendations: [
      'Apply organic pest control solution',
      'Isolate affected plants if possible',
      'Increase beneficial insect presence'
    ],
    resolved: true,
    imageUrl: 'https://placehold.co/600x400/red/white?text=Aphid+Infestation'
  }
];

const SproutRecognitionTracker = () => {
  const [plants, setSprouts] = useState<SproutData[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyDetection[]>([]);
  const [selectedSprout, setSelectedSprout] = useState<SproutData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScanDialog, setShowScanDialog] = useState(false);
  const [scanType, setScanType] = useState<'health' | 'growth' | 'identification'>('health');
  const [showAnomalyDetails, setShowAnomalyDetails] = useState<AnomalyDetection | null>(null);
  const { theme } = useTheme();

  // Filter plants based on search query
  const filteredSprouts = plants.filter(plant => 
    plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plant.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch plant data
  const fetchSproutData = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would fetch from an API
      // For this prototype, we'll use mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSprouts(mockSprouts);
      setAnomalies(mockAnomalies);
      
      if (mockSprouts.length > 0) {
        setSelectedSprout(mockSprouts[0]);
      }
    } catch (error) {
      console.error('Failed to fetch plant data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSproutData();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysFromNow = (dateString: string): number => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleScan = () => {
    setShowScanDialog(false);
    
    // In a real implementation, this would trigger the camera or file upload
    // and process the image using computer vision
    
    // For this prototype, we'll just show a success message
    // and update the last scanned date
    if (selectedSprout) {
      const updatedSprout = {
        ...selectedSprout,
        lastScanned: new Date().toISOString()
      };
      
      setSelectedSprout(updatedSprout);
      setSprouts(plants.map(plant => 
        plant.id === updatedSprout.id ? updatedSprout : plant
      ));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sprout className="h-6 w-6 text-primary" />
            Sprout Recognition & Growth Tracking
          </h1>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search plants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-[200px]"
              />
            </div>
            
            <Button variant="outline" onClick={fetchSproutData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button onClick={() => setShowScanDialog(true)}>
              <Camera className="h-4 w-4 mr-2" />
              New Scan
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar - Sprout list */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Sprout List</CardTitle>
                <CardDescription>
                  Select a plant to view details
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center p-8">
                    <RefreshCw className="animate-spin h-8 w-8 text-primary" />
                  </div>
                ) : filteredSprouts.length === 0 ? (
                  <div className="text-center py-8">
                    <Sprout className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No plants found</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredSprouts.map((plant) => (
                      <div 
                        key={plant.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 
                          ${selectedSprout?.id === plant.id 
                            ? 'bg-primary/10 border border-primary/30' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'
                          }`}
                        onClick={() => setSelectedSprout(plant)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div className="font-medium">{plant.name}</div>
                          <Badge variant={
                            plant.healthScore >= 90 ? 'default' : 
                            plant.healthScore >= 80 ? 'secondary' : 
                            'destructive'
                          }>
                            {plant.healthScore}%
                          </Badge>
                        </div>
                        
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <div>{plant.scientificName}</div>
                          <div className="flex justify-between mt-1">
                            <span>Age: {plant.age} days</span>
                            <span>Height: {plant.height} cm</span>
                          </div>
                          <div className="mt-1">Location: {plant.location}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Anomalies section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Detected Anomalies</CardTitle>
                <CardDescription>
                  Issues requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-20 flex items-center justify-center">
                    <RefreshCw className="animate-spin h-6 w-6 text-primary" />
                  </div>
                ) : anomalies.length === 0 ? (
                  <div className="text-center py-4">
                    <CheckSquare className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-500">No anomalies detected</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {anomalies.filter(a => !a.resolved).map((anomaly) => (
                      <div 
                        key={anomaly.id}
                        className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                        onClick={() => setShowAnomalyDetails(anomaly)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div className="font-medium flex items-center gap-1 text-sm">
                            {anomaly.type === 'disease' && <Microscope className="h-4 w-4 text-red-500" />}
                            {anomaly.type === 'pest' && <Shrub className="h-4 w-4 text-orange-500" />}
                            {anomaly.type === 'nutrient_deficiency' && <FlaskConical className="h-4 w-4 text-purple-500" />}
                            {anomaly.type === 'growth_anomaly' && <Ruler className="h-4 w-4 text-blue-500" />}
                            {anomaly.type.replace('_', ' ')}
                          </div>
                          <Badge variant={
                            anomaly.severity === 'high' ? 'destructive' : 
                            anomaly.severity === 'medium' ? 'secondary' : 
                            'outline'
                          }>
                            {anomaly.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{anomaly.description}</p>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(anomaly.date)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Main content - Sprout details */}
          <div className="lg:col-span-3">
            {!selectedSprout ? (
              <Card className="h-full flex justify-center items-center">
                <CardContent className="text-center py-12">
                  <Sprout className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Select a plant to view details</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Sprout header card */}
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div>
                        <CardTitle className="text-xl mb-1">{selectedSprout.name}</CardTitle>
                        <CardDescription>
                          {selectedSprout.scientificName}
                        </CardDescription>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowScanDialog(true)}>
                          <Camera className="h-4 w-4 mr-2" />
                          Scan Now
                        </Button>
                        
                        <Button variant="outline" size="sm">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          View All Images
                        </Button>
                        
                        <Button variant="outline" size="sm">
                          <FilePlus2 className="h-4 w-4 mr-2" />
                          Add Manual Data
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                      {/* Left column - Sprout image */}
                      <div className="md:col-span-2">
                        <div className="rounded-lg overflow-hidden">
                          {selectedSprout.images && selectedSprout.images.length > 0 ? (
                            <img 
                              src={selectedSprout.images[0].url} 
                              alt={selectedSprout.name} 
                              className="w-full h-auto object-cover aspect-square"
                            />
                          ) : (
                            <div className="bg-gray-100 dark:bg-gray-800 w-full aspect-square flex items-center justify-center">
                              <Sprout className="h-16 w-16 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-2 text-center">
                          Last scanned: {formatDate(selectedSprout.lastScanned)}
                        </div>
                      </div>
                      
                      {/* Right column - Sprout stats */}
                      <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                            <ThermometerSun className="h-4 w-4" />
                            Growth Phase
                          </div>
                          <div className="font-medium capitalize">
                            {selectedSprout.growthPhase}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Age: {selectedSprout.age} days
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Sprouted
                          </div>
                          <div className="font-medium">
                            {formatDate(selectedSprout.plantedDate)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Location: {selectedSprout.location}
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                            <Timer className="h-4 w-4" />
                            Harvest Date
                          </div>
                          <div className="font-medium">
                            {formatDate(selectedSprout.estimatedHarvestDate)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            In {getDaysFromNow(selectedSprout.estimatedHarvestDate)} days
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                            <Ruler className="h-4 w-4" />
                            Current Height
                          </div>
                          <div className="font-medium">
                            {selectedSprout.height} cm
                          </div>
                          {selectedSprout.growthHistory.length >= 2 && (
                            <div className="text-xs text-green-500 mt-1">
                              +{(selectedSprout.height - selectedSprout.growthHistory[selectedSprout.growthHistory.length - 2].height).toFixed(1)} cm growth
                            </div>
                          )}
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                            <Leaf className="h-4 w-4" />
                            Leaf Count
                          </div>
                          <div className="font-medium">
                            {selectedSprout.growthHistory[selectedSprout.growthHistory.length - 1].leafCount}
                          </div>
                          {selectedSprout.growthHistory.length >= 2 && (
                            <div className="text-xs text-green-500 mt-1">
                              +{selectedSprout.growthHistory[selectedSprout.growthHistory.length - 1].leafCount - 
                                selectedSprout.growthHistory[selectedSprout.growthHistory.length - 2].leafCount} new leaves
                            </div>
                          )}
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                            <Gauge className="h-4 w-4" />
                            Health Score
                          </div>
                          <div className="font-medium flex items-center gap-2">
                            {selectedSprout.healthScore}%
                            <div className="flex-grow">
                              <Progress value={selectedSprout.healthScore} className="h-2" />
                            </div>
                          </div>
                          <div className={`text-xs mt-1 ${
                            selectedSprout.healthScore >= 90 ? 'text-green-500' : 
                            selectedSprout.healthScore >= 80 ? 'text-yellow-500' : 
                            'text-red-500'
                          }`}>
                            {selectedSprout.healthScore >= 90 ? 'Excellent' : 
                             selectedSprout.healthScore >= 80 ? 'Good' : 
                             selectedSprout.healthScore >= 70 ? 'Fair' : 'Poor'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Tabs for detailed data */}
                <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="h-full">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="overview">Growth Trend</TabsTrigger>
                    <TabsTrigger value="health">Health Analysis</TabsTrigger>
                    <TabsTrigger value="images">Image History</TabsTrigger>
                  </TabsList>
                  
                  {/* Growth Trend Tab */}
                  <TabsContent value="overview" className="h-full">
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle>Growth Progress</CardTitle>
                        <CardDescription>
                          Historical growth measurements
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {/* Height Chart */}
                          <div className="h-64">
                            <h3 className="text-sm font-medium mb-2">Height Progression (cm)</h3>
                            <div className="h-52 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                              {/* This would be a real chart component in production */}
                              <div className="h-full flex items-end">
                                {selectedSprout.growthHistory.map((record, index) => (
                                  <div key={index} className="flex-1 flex flex-col items-center justify-end">
                                    <div 
                                      className="w-full max-w-[30px] bg-green-500 rounded-t-sm mx-1"
                                      style={{ height: `${(record.height / 20) * 100}%` }}
                                    ></div>
                                    <div className="text-xs mt-1">{record.height.toFixed(1)}</div>
                                    <div className="text-xs text-gray-500">
                                      {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          {/* Growth Metrics Table */}
                          <div>
                            <h3 className="text-sm font-medium mb-2">Detailed Growth Records</h3>
                            <div className="overflow-x-auto">
                              <table className="w-full border-collapse">
                                <thead>
                                  <tr className="bg-gray-50 dark:bg-gray-800">
                                    <th className="text-left p-2 text-xs">Date</th>
                                    <th className="text-left p-2 text-xs">Height (cm)</th>
                                    <th className="text-left p-2 text-xs">Leaf Count</th>
                                    <th className="text-left p-2 text-xs">Stem (mm)</th>
                                    <th className="text-left p-2 text-xs">Growth Rate</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedSprout.growthHistory.map((record, index) => {
                                    // Calculate growth rate
                                    const prevRecord = index > 0 ? selectedSprout.growthHistory[index - 1] : null;
                                    const growthRate = prevRecord 
                                      ? ((record.height - prevRecord.height) / record.height * 100).toFixed(1)
                                      : '-';
                                    
                                    return (
                                      <tr key={index} className="border-t border-gray-100 dark:border-gray-700">
                                        <td className="p-2 text-xs">
                                          {formatDate(record.date)}
                                        </td>
                                        <td className="p-2 text-xs">{record.height.toFixed(1)}</td>
                                        <td className="p-2 text-xs">{record.leafCount}</td>
                                        <td className="p-2 text-xs">{record.stemDiameter.toFixed(1)}</td>
                                        <td className="p-2 text-xs">
                                          {growthRate !== '-' ? (
                                            <span className="text-green-500">+{growthRate}%</span>
                                          ) : '-'}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          
                          {/* Growth Predictions */}
                          <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                              <LineChart className="h-4 w-4 text-blue-500" />
                              Growth Predictions
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="text-gray-500">Estimated Final Height</div>
                                <div className="font-medium">28-32 cm</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Days to Maturity</div>
                                <div className="font-medium">{getDaysFromNow(selectedSprout.estimatedHarvestDate)} days</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Yield Estimate</div>
                                <div className="font-medium">90-120g</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Health Analysis Tab */}
                  <TabsContent value="health" className="h-full">
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle>Health Analysis</CardTitle>
                        <CardDescription>
                          Sprout health metrics and nutrient levels
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {/* Health Score Chart */}
                          <div className="h-64">
                            <h3 className="text-sm font-medium mb-2">Health Score Trend</h3>
                            <div className="h-52 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                              {/* This would be a real chart component in production */}
                              <div className="h-full flex items-end">
                                {selectedSprout.healthHistory.map((record, index) => (
                                  <div key={index} className="flex-1 flex flex-col items-center justify-end">
                                    <div 
                                      className={`w-full max-w-[30px] rounded-t-sm mx-1 ${
                                        record.overallHealth >= 90 ? 'bg-green-500' : 
                                        record.overallHealth >= 80 ? 'bg-yellow-500' : 
                                        'bg-red-500'
                                      }`}
                                      style={{ height: `${record.overallHealth}%` }}
                                    ></div>
                                    <div className="text-xs mt-1">{record.overallHealth}%</div>
                                    <div className="text-xs text-gray-500">
                                      {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          {/* Nutrient Levels */}
                          <div>
                            <h3 className="text-sm font-medium mb-2">Nutrient Levels</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* Nitrogen */}
                              <div className="border rounded-lg p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <div className="text-sm font-medium flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    Nitrogen (N)
                                  </div>
                                  <div className="text-sm">
                                    {selectedSprout.healthHistory[selectedSprout.healthHistory.length - 1].nutrientLevels.nitrogen}%
                                  </div>
                                </div>
                                <Progress 
                                  value={selectedSprout.healthHistory[selectedSprout.healthHistory.length - 1].nutrientLevels.nitrogen} 
                                  className="h-2 bg-gray-100 dark:bg-gray-700" 
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>Low</span>
                                  <span>Optimal</span>
                                  <span>High</span>
                                </div>
                              </div>
                              
                              {/* Phosphorus */}
                              <div className="border rounded-lg p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <div className="text-sm font-medium flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                    Phosphorus (P)
                                  </div>
                                  <div className="text-sm">
                                    {selectedSprout.healthHistory[selectedSprout.healthHistory.length - 1].nutrientLevels.phosphorus}%
                                  </div>
                                </div>
                                <Progress 
                                  value={selectedSprout.healthHistory[selectedSprout.healthHistory.length - 1].nutrientLevels.phosphorus} 
                                  className="h-2 bg-gray-100 dark:bg-gray-700" 
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>Low</span>
                                  <span>Optimal</span>
                                  <span>High</span>
                                </div>
                              </div>
                              
                              {/* Potassium */}
                              <div className="border rounded-lg p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <div className="text-sm font-medium flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    Potassium (K)
                                  </div>
                                  <div className="text-sm">
                                    {selectedSprout.healthHistory[selectedSprout.healthHistory.length - 1].nutrientLevels.potassium}%
                                  </div>
                                </div>
                                <Progress 
                                  value={selectedSprout.healthHistory[selectedSprout.healthHistory.length - 1].nutrientLevels.potassium} 
                                  className="h-2 bg-gray-100 dark:bg-gray-700" 
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>Low</span>
                                  <span>Optimal</span>
                                  <span>High</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Health Issues */}
                          <div>
                            <h3 className="text-sm font-medium mb-2">Health Issues</h3>
                            {selectedSprout.healthHistory[selectedSprout.healthHistory.length - 1].issues.length === 0 ? (
                              <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                                <div className="flex items-center gap-2">
                                  <CheckSquare className="h-5 w-5 text-green-500" />
                                  <span className="font-medium">No health issues detected</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  Sprout is healthy and growing well
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {selectedSprout.healthHistory[selectedSprout.healthHistory.length - 1].issues.map((issue, index) => (
                                  <div key={index} className="border rounded-lg p-3 bg-amber-50 dark:bg-amber-900/20">
                                    <div className="flex items-start gap-2">
                                      <Droplet className="h-5 w-5 text-amber-500 mt-0.5" />
                                      <div>
                                        <div className="font-medium">{issue}</div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                          {issue.toLowerCase().includes('nitrogen') 
                                            ? 'Yellowing of older leaves starting from the tips and progressing along the midrib. Stunted growth and reduced vigor.'
                                            : 'Issue detected through visual analysis.'}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <div className="mt-2 ml-7">
                                      <Button variant="outline" size="sm">
                                        View Recommendations
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Image History Tab */}
                  <TabsContent value="images" className="h-full">
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle>Image History</CardTitle>
                        <CardDescription>
                          Visual record of plant growth and health
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {selectedSprout.images.length === 0 ? (
                          <div className="text-center py-12">
                            <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No images available</p>
                            <Button className="mt-4" onClick={() => setShowScanDialog(true)}>
                              <Camera className="h-4 w-4 mr-2" />
                              Take First Image
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {selectedSprout.images.map((image) => (
                                <div key={image.id} className="border rounded-lg overflow-hidden">
                                  <div className="aspect-square relative">
                                    <img 
                                      src={image.url} 
                                      alt={`${selectedSprout.name} - ${image.type}`} 
                                      className="w-full h-full object-cover"
                                    />
                                    <Badge 
                                      className="absolute top-2 right-2"
                                      variant={
                                        image.type === 'health_scan' ? 'secondary' : 
                                        image.type === 'disease' ? 'destructive' : 
                                        'default'
                                      }
                                    >
                                      {image.type.replace('_', ' ')}
                                    </Badge>
                                  </div>
                                  <div className="p-3">
                                    <div className="text-sm font-medium">
                                      {image.type === 'regular' ? 'Regular Scan' : 
                                       image.type === 'health_scan' ? 'Health Analysis' : 
                                       image.type === 'disease' ? 'Disease Detection' : 
                                       'Growth Analysis'}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      {formatDate(image.date)}
                                    </div>
                                    {image.notes && (
                                      <div className="text-xs mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                        {image.notes}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                              
                              {/* Add New Image Card */}
                              <div className="border rounded-lg flex flex-col items-center justify-center h-full aspect-square cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                                onClick={() => setShowScanDialog(true)}
                              >
                                <div className="p-4 flex flex-col items-center text-center">
                                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                  <div className="text-sm font-medium">Add New Image</div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    Scan or upload a new photo
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-sm font-medium mb-2">Visual Growth Timeline</h3>
                              <div className="relative">
                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0"></div>
                                <div className="relative z-10 flex justify-between">
                                  {selectedSprout.growthHistory.map((record, index) => (
                                    <div key={index} className="flex flex-col items-center">
                                      <div className="w-3 h-3 rounded-full bg-primary mb-2"></div>
                                      <div className="text-xs text-gray-500">
                                        {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                      </div>
                                      <div className="text-xs font-medium mt-1">
                                        {record.height.toFixed(1)} cm
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Scan Dialog */}
      <Dialog open={showScanDialog} onOpenChange={setShowScanDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Sprout Scan</DialogTitle>
            <DialogDescription>
              Use the camera to capture a new plant image or upload a photo
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="scan-type">Scan Type</Label>
              <Select value={scanType} onValueChange={(value: any) => setScanType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select scan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="health">Health Analysis</SelectItem>
                  <SelectItem value="growth">Growth Measurement</SelectItem>
                  <SelectItem value="identification">Sprout Identification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center gap-2">
              <Camera className="h-8 w-8 text-gray-400" />
              <div className="text-sm font-medium">Take a photo or upload an image</div>
              <div className="text-xs text-gray-500 max-w-xs">
                Position the plant in the center of the frame for best results. Ensure good lighting.
              </div>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Use Camera
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between items-center">
            <Button variant="ghost" onClick={() => setShowScanDialog(false)}>Cancel</Button>
            <Button onClick={handleScan}>Analyze Sprout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Anomaly Details Dialog */}
      <Dialog open={!!showAnomalyDetails} onOpenChange={() => setShowAnomalyDetails(null)}>
        {showAnomalyDetails && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {showAnomalyDetails.type === 'disease' && <Microscope className="h-5 w-5 text-red-500" />}
                {showAnomalyDetails.type === 'pest' && <Shrub className="h-5 w-5 text-orange-500" />}
                {showAnomalyDetails.type === 'nutrient_deficiency' && <FlaskConical className="h-5 w-5 text-purple-500" />}
                {showAnomalyDetails.type === 'growth_anomaly' && <Ruler className="h-5 w-5 text-blue-500" />}
                {showAnomalyDetails.type.replace('_', ' ')} Detected
              </DialogTitle>
              <DialogDescription>
                Detailed information about the detected anomaly on {formatDate(showAnomalyDetails.date)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              {showAnomalyDetails.imageUrl && (
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={showAnomalyDetails.imageUrl} 
                    alt={showAnomalyDetails.description} 
                    className="w-full h-auto"
                  />
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium mb-1">Description</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {showAnomalyDetails.description}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Severity</h4>
                  <Badge variant={
                    showAnomalyDetails.severity === 'high' ? 'destructive' : 
                    showAnomalyDetails.severity === 'medium' ? 'secondary' : 
                    'outline'
                  }>
                    {showAnomalyDetails.severity.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Affected Area</h4>
                  <p className="text-sm">{showAnomalyDetails.affectedArea}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Recommendations</h4>
                <ul className="text-sm space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                  {showAnomalyDetails.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <DialogFooter className="flex justify-between items-center">
              <Button variant="ghost" onClick={() => setShowAnomalyDetails(null)}>Close</Button>
              <Button onClick={() => {
                // In a real implementation, this would mark the issue as resolved
                const updatedAnomalies = anomalies.map(anomaly => 
                  anomaly.id === showAnomalyDetails.id ? { ...anomaly, resolved: true } : anomaly
                );
                setAnomalies(updatedAnomalies);
                setShowAnomalyDetails(null);
              }}>
                Mark as Resolved
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default SproutRecognitionTracker;