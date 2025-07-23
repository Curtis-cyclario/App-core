import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Camera, 
  ImagePlus, 
  Leaf, 
  Droplet, 
  PlayCircle, 
  PauseCircle,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles
} from 'lucide-react';
import PlantHealthScanner from '@/components/ai/PlantHealthScanner';
import LiveCameraFeed from '@/components/camera/LiveCameraFeed';

// Define plant health analysis types
interface PlantHealthResult {
  id: string;
  timestamp: string;
  status: 'healthy' | 'warning' | 'danger';
  confidence: number;
  issues?: string[];
  recommendations?: string[];
}

const AIVision = () => {
  const [activeTab, setActiveTab] = useState('live-view');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedResult, setSelectedResult] = useState<PlantHealthResult | null>(null);

  // Simulate scanning process
  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  // Mock plant health results for visualization purposes
  const healthResults: PlantHealthResult[] = [
    {
      id: '1',
      timestamp: '2023-06-20T14:30:00Z',
      status: 'healthy',
      confidence: 92,
      recommendations: ['Continue current watering schedule', 'Maintain lighting at current levels']
    },
    {
      id: '2',
      timestamp: '2023-06-19T10:15:00Z',
      status: 'warning',
      confidence: 78,
      issues: ['Slight nutrient deficiency detected', 'Minor signs of leaf discoloration'],
      recommendations: ['Increase nutrient solution by 10%', 'Monitor for 48 hours']
    },
    {
      id: '3',
      timestamp: '2023-06-18T09:45:00Z',
      status: 'danger',
      confidence: 85,
      issues: ['Possible fungal infection detected', 'Leaf wilting observed'],
      recommendations: ['Isolate affected plants', 'Apply organic fungicide', 'Reduce humidity by 10%']
    }
  ];

  // Get appropriate icon and color based on plant health status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'danger':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'danger':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">AI Vision</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="flex items-center"
          >
            <ImagePlus className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
          <Button 
            onClick={startScan}
            disabled={isScanning}
            className="flex items-center"
          >
            <Camera className="h-4 w-4 mr-2" />
            {isScanning ? 'Scanning...' : 'Start Scan'}
          </Button>
        </div>
      </div>
      
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        AI-powered plant health monitoring and anomaly detection for optimal crop management.
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="live-view">Live View</TabsTrigger>
          <TabsTrigger value="live-camera">
            <Camera className="w-4 h-4 mr-2" />
            Live Camera AI
          </TabsTrigger>
          <TabsTrigger value="health-scanner">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Health Scanner
          </TabsTrigger>
          <TabsTrigger value="analysis">Analysis Results</TabsTrigger>
          <TabsTrigger value="history">Scan History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="live-view">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">Camera Feed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gray-800 rounded-md h-[400px] flex flex-col items-center justify-center">
                    <div className="text-white text-center p-6">
                      <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-300">Camera feed visualization</p>
                      <p className="text-xs text-gray-400 mt-2">Live plant monitoring with computer vision</p>
                    </div>
                    
                    {isScanning && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center rounded-md">
                        <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
                          <div 
                            className="h-full bg-primary-500 rounded-full" 
                            style={{ width: `${scanProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-white">AI Vision Analysis: {scanProgress}%</p>
                      </div>
                    )}
                    
                    <div className="absolute bottom-4 right-4 flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="rounded-full h-10 w-10 p-0 flex items-center justify-center"
                      >
                        <RotateCw className="h-5 w-5" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="rounded-full h-10 w-10 p-0 flex items-center justify-center"
                      >
                        {true ? <PauseCircle className="h-5 w-5" /> : <PlayCircle className="h-5 w-5" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">Detection Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        Detection Sensitivity
                      </label>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-2">Low</span>
                        <input 
                          type="range" 
                          min="1" 
                          max="10" 
                          value="7" 
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                        <span className="text-xs text-gray-500 ml-2">High</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        AI Analysis Model
                      </label>
                      <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-dark-700 dark:border-dark-600 dark:text-white">
                        <option value="standard">Standard Plant Health</option>
                        <option value="advanced">Advanced Diagnostics</option>
                        <option value="nutritional">Nutritional Analysis</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        Detection Targets
                      </label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="target-disease" className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4" checked />
                          <label htmlFor="target-disease" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Disease Detection
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="target-nutrient" className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4" checked />
                          <label htmlFor="target-nutrient" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Nutrient Deficiency
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="target-growth" className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4" checked />
                          <label htmlFor="target-growth" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Growth Analysis
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="target-pests" className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4" checked />
                          <label htmlFor="target-pests" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Pest Detection
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        Scan Schedule
                      </label>
                      <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-dark-700 dark:border-dark-600 dark:text-white">
                        <option value="hourly">Every Hour</option>
                        <option value="4hours">Every 4 Hours</option>
                        <option value="12hours">Every 12 Hours</option>
                        <option value="daily">Once Daily</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Apply Settings</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="health-scanner">
          <PlantHealthScanner />
        </TabsContent>
        
        <TabsContent value="live-camera">
          <LiveCameraFeed />
        </TabsContent>
        
        <TabsContent value="analysis">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
                    Plant Health Analysis
                  </CardTitle>
                  {selectedResult && (
                    <CardDescription>
                      Analysis from {formatDate(selectedResult.timestamp)}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {!selectedResult ? (
                    <div className="h-[400px] flex items-center justify-center bg-gray-50 dark:bg-dark-700 rounded-md">
                      <div className="text-center">
                        <Leaf className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">Select an analysis result to view details</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-[400px] bg-gray-50 dark:bg-dark-700 rounded-md p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          {getStatusIcon(selectedResult.status)}
                          <span className="ml-2 text-lg font-medium">
                            Plant Health: <span className={`${selectedResult.status === 'healthy' ? 'text-green-600' : selectedResult.status === 'warning' ? 'text-yellow-600' : 'text-red-600'}`}>
                              {selectedResult.status.charAt(0).toUpperCase() + selectedResult.status.slice(1)}
                            </span>
                          </span>
                        </div>
                        <Badge className={getStatusClass(selectedResult.status)}>
                          {selectedResult.confidence}% Confidence
                        </Badge>
                      </div>
                      
                      {selectedResult.issues && selectedResult.issues.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Detected Issues:</h3>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                            {selectedResult.issues.map((issue, index) => (
                              <li key={index}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {selectedResult.recommendations && selectedResult.recommendations.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Recommendations:</h3>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                            {selectedResult.recommendations.map((rec, index) => (
                              <li key={index}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="mt-8 bg-white dark:bg-dark-800 rounded-md p-4">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Visual Analysis:</h3>
                        <div className="bg-gray-800 rounded-md h-[150px] flex items-center justify-center text-white">
                          Plant image visualization with detection overlays
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">Recent Analyses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {healthResults.map((result) => (
                      <div 
                        key={result.id}
                        className={`p-4 rounded-md border cursor-pointer ${
                          selectedResult?.id === result.id 
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                            : 'border-gray-200 dark:border-dark-600 hover:border-primary-300 dark:hover:border-primary-700'
                        }`}
                        onClick={() => setSelectedResult(result)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            {getStatusIcon(result.status)}
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {result.status.charAt(0).toUpperCase() + result.status.slice(1)} {result.confidence}%
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(result.timestamp)}
                              </p>
                            </div>
                          </div>
                          <Badge className={getStatusClass(result.status)}>
                            {result.status}
                          </Badge>
                        </div>
                        {result.issues && result.issues.length > 0 && (
                          <p className="mt-2 text-xs text-gray-700 dark:text-gray-300 truncate">
                            {result.issues[0]}
                            {result.issues.length > 1 ? ` +${result.issues.length - 1} more` : ''}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View All Analyses</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">Analysis History</CardTitle>
              <div className="mt-4 sm:mt-0">
                <Input 
                  type="search"
                  placeholder="Search analyses..." 
                  className="max-w-xs"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-dark-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Confidence
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Issues
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {healthResults.map((result) => (
                      <tr key={result.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(result.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusClass(result.status)}>
                            {result.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {result.confidence}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {result.issues ? result.issues.length : 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button 
                            variant="link" 
                            size="sm"
                            className="p-0 h-auto"
                            onClick={() => {
                              setSelectedResult(result);
                              setActiveTab('analysis');
                            }}
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing 3 of 3 results
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" disabled>Next</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIVision;
