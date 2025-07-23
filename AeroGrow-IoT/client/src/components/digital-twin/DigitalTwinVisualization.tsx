import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from '@/lib/queryClient';
import { 
  ArrowDown, 
  ArrowUp, 
  Crop, 
  Droplet, 
  Eye, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  RotateCw, 
  ThermometerSun, 
  Waves, 
  Zap
} from 'lucide-react';
import { Tower, BlockchainRecord, BlockchainVerificationResponse, TowerSection as ITowerSection, TowerPosition as ITowerPosition } from '@/types';
import TowerScene from './3d/TowerScene';

interface SensorData {
  id: number;
  timestamp: string;
  temperature: number;
  humidity: number;
  light: number;
  co2: number;
  ph: number;
  nutrientLevel: number;
  waterFlow: number;
  waterTemperature: number;
  energyUsage: number;
}

// Use local interface compatible with the imported types
interface TowerPosition extends ITowerPosition {}

interface TowerSection {
  id: number;
  name: string;
  temperature: number;
  humidity: number;
  plantCount: number;
  health: 'optimal' | 'warning' | 'danger';
}

const DigitalTwinVisualization = () => {
  const [selectedTower, setSelectedTower] = useState<Tower | null>(null);
  const [towers, setTowers] = useState<Tower[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [towerPosition, setTowerPosition] = useState<TowerPosition>({
    x: 0,
    y: 0,
    z: 0,
    rotationY: 0,
    scale: 1
  });
  const [activeDataType, setActiveDataType] = useState<string>('temperature');
  const [towerSections, setTowerSections] = useState<TowerSection[]>([]);
  const [timeOfDay, setTimeOfDay] = useState<string>('current');
  const [blockchainRecords, setBlockchainRecords] = useState<BlockchainRecord[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const fetchTowers = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('GET', '/api/towers');
      const data = await response.json();
      setTowers(data);
      if (data.length > 0) {
        setSelectedTower(data[0]);
        fetchSensorData(data[0].id);
        generateTowerSections(data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch towers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSensorData = async (towerId: number) => {
    try {
      // In a real implementation, this would fetch actual sensor data for this tower
      // For this example, we'll use the general sensor data endpoint
      const response = await apiRequest('GET', '/api/sensor-data');
      const data = await response.json();
      setSensorData(data);
      
      // In a real implementation, this would also include validating the data against the blockchain
      if (data && data.id) {
        // Initialization of the verification status message
        setVerificationStatus(`Tower ${towerId} data integrity is ensured through blockchain. Verify individual records for details.`);
      }
    } catch (error) {
      console.error('Failed to fetch sensor data:', error);
    }
  };

  const generateTowerSections = (tower: Tower) => {
    // In a real implementation, this would calculate the sections dynamically
    // based on the tower's configuration (columns, pods, etc.)
    const sections: TowerSection[] = [];
    
    for (let i = 1; i <= tower.totalColumns; i++) {
      const section: TowerSection = {
        id: i,
        name: `Column ${i}`,
        temperature: 23 + Math.random() * 2, // Random temperature between 23-25°C
        humidity: 55 + Math.random() * 10, // Random humidity between 55-65%
        plantCount: Math.floor(Math.random() * 10) + 5, // Random plant count between 5-15
        health: Math.random() > 0.8 ? 'warning' : Math.random() > 0.95 ? 'danger' : 'optimal' // Mostly optimal, some warnings, few dangers
      };
      sections.push(section);
    }
    
    setTowerSections(sections);
  };
  
  // Blockchain record fetching function
  const fetchBlockchainRecords = async (towerId: number) => {
    try {
      // This would be a real API call in a production implementation
      // For this example, we'll generate some sample blockchain records
      const mockBlockchainRecords: BlockchainRecord[] = [
        {
          id: 'bc1',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          towerIds: [towerId],
          deviceIds: [1, 2, 3],
          dataHash: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
          transactionId: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
          blockNumber: 15481394,
          blockchainType: 'ethereum',
          verificationStatus: 'verified',
          dataType: 'sensorData',
          metaData: {
            source: 'Tower Sensors',
            readings: 24,
            checksum: '0xa2e351f91'
          }
        },
        {
          id: 'bc2',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          towerIds: [towerId],
          deviceIds: [4, 5],
          dataHash: '0x6d5f1d367b4e56b145591d65e546d9cf3457d2ea6a11a7ad7fae33fa80e7a325',
          transactionId: '0xbe0eb53f46cd790cd13851d5eff43d12404d33e8',
          blockNumber: 15481201,
          blockchainType: 'hyperledger',
          verificationStatus: 'verified',
          dataType: 'maintenanceRecord',
          metaData: {
            maintainer: 'System',
            duration: '45min',
            components: ['water pump', 'nutrient dispenser']
          }
        },
        {
          id: 'bc3',
          timestamp: new Date().toISOString(),
          towerIds: [towerId],
          deviceIds: [1, 2, 3, 4, 5],
          dataHash: '0x02ab169d4c5e47076db2a3d68a62c02e69bce78cb8915934553d3cd9a5c61688',
          transactionId: '0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326',
          blockNumber: 15481400,
          blockchainType: 'polygon',
          verificationStatus: 'pending',
          dataType: 'harvestRecord',
          metaData: {
            yield: '12.5kg',
            quality: 'premium',
            plants: ['lettuce', 'basil']
          }
        }
      ];
      
      setBlockchainRecords(mockBlockchainRecords);
    } catch (error) {
      console.error('Failed to fetch blockchain records:', error);
    }
  };
  
  // Function to verify data integrity through blockchain
  const verifyBlockchainData = async (recordId: string) => {
    try {
      setIsVerifying(true);
      setVerificationStatus('Verifying data integrity on blockchain...');
      
      // In a real implementation, this would be an API call to a blockchain verification service
      // For this example, we'll simulate a verification process with a delay
      setTimeout(() => {
        const response: BlockchainVerificationResponse = {
          status: 'success',
          message: 'Data verified successfully on the blockchain',
          recordId,
          timestamp: new Date().toISOString(),
          verifiedBy: 'VertiGrow Blockchain Oracle'
        };
        
        // Update the blockchain record status
        setBlockchainRecords(prevRecords => 
          prevRecords.map(record => 
            record.id === recordId 
              ? { ...record, verificationStatus: 'verified' }
              : record
          )
        );
        
        setVerificationStatus(`Verification successful: ${response.message}`);
        setIsVerifying(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to verify blockchain data:', error);
      setVerificationStatus('Verification failed: Unable to connect to blockchain');
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    fetchTowers();
  }, []);

  // Function to handle the rotation of the 3D model
  const handleRotate = (direction: 'left' | 'right') => {
    setTowerPosition(prev => ({
      ...prev,
      rotationY: prev.rotationY + (direction === 'left' ? -30 : 30)
    }));
  };

  // Function to handle the zoom of the 3D model
  const handleZoom = (direction: 'in' | 'out') => {
    setTowerPosition(prev => ({
      ...prev,
      scale: direction === 'in' 
        ? Math.min(prev.scale + 0.1, 2) // Limit max zoom in to 2x
        : Math.max(prev.scale - 0.1, 0.5) // Limit max zoom out to 0.5x
    }));
  };

  // Function to reset the view
  const handleResetView = () => {
    setTowerPosition({
      x: 0,
      y: 0,
      z: 0,
      rotationY: 0,
      scale: 1
    });
  };

  const handleSectionClick = (section: TowerSection) => {
    // In a real implementation, this would show detailed information about the selected section
    console.log('Section clicked:', section);
  };

  const getDataTypeIcon = (dataType: string) => {
    switch (dataType) {
      case 'temperature':
        return <ThermometerSun className="h-5 w-5" />;
      case 'humidity':
        return <Droplet className="h-5 w-5" />;
      case 'light':
        return <Zap className="h-5 w-5" />;
      case 'water':
        return <Waves className="h-5 w-5" />;
      default:
        return <Eye className="h-5 w-5" />;
    }
  };

  const getDataTypeColor = (dataType: string) => {
    switch (dataType) {
      case 'temperature':
        return 'text-red-500';
      case 'humidity':
        return 'text-blue-500';
      case 'light':
        return 'text-yellow-500';
      case 'water':
        return 'text-cyan-500';
      default:
        return 'text-gray-500';
    }
  };

  const getColorClassForTemperature = (temp: number) => {
    if (temp > 26) return 'fill-red-500';
    if (temp > 24) return 'fill-orange-400';
    if (temp > 22) return 'fill-green-500';
    if (temp > 20) return 'fill-blue-400';
    return 'fill-blue-500';
  };

  const getColorClassForHumidity = (humidity: number) => {
    if (humidity > 70) return 'fill-blue-600';
    if (humidity > 60) return 'fill-blue-400';
    if (humidity > 50) return 'fill-green-500';
    if (humidity > 40) return 'fill-yellow-400';
    return 'fill-red-500';
  };

  // Function to get the appropriate color based on the data type and value
  const getColorForSection = (section: TowerSection) => {
    switch (activeDataType) {
      case 'temperature':
        return getColorClassForTemperature(section.temperature);
      case 'humidity':
        return getColorClassForHumidity(section.humidity);
      case 'health':
        return section.health === 'optimal' 
          ? 'fill-green-500' 
          : section.health === 'warning' 
            ? 'fill-yellow-500' 
            : 'fill-red-500';
      default:
        return 'fill-green-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Crop className="h-6 w-6 text-primary" />
            Digital Twin Visualization
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar - Tower selection and controls */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Tower Selection</CardTitle>
                <CardDescription>
                  Choose a tower to visualize
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select
                    value={selectedTower?.id.toString()}
                    onValueChange={(value) => {
                      const tower = towers.find(t => t.id === parseInt(value));
                      if (tower) {
                        setSelectedTower(tower);
                        fetchSensorData(tower.id);
                        generateTowerSections(tower);
                        fetchBlockchainRecords(tower.id);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a tower" />
                    </SelectTrigger>
                    <SelectContent>
                      {towers.map((tower) => (
                        <SelectItem key={tower.id} value={tower.id.toString()}>
                          {tower.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedTower && (
                    <div className="space-y-4 pt-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Visualization Controls</h3>
                        <div className="grid grid-cols-3 gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleRotate('left')}>
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleResetView}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleRotate('right')}>
                            <RotateCw className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleZoom('in')}>
                            <Maximize className="h-4 w-4" />
                          </Button>
                          <div className="flex justify-center items-center">
                            {Math.round(towerPosition.scale * 100)}%
                          </div>
                          <Button variant="outline" size="sm" onClick={() => handleZoom('out')}>
                            <Minimize className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">Data Visualization</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant={activeDataType === 'temperature' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setActiveDataType('temperature')}
                            className={activeDataType === 'temperature' ? 'bg-red-500 hover:bg-red-600' : ''}
                          >
                            <ThermometerSun className="h-4 w-4 mr-1" />
                            Temperature
                          </Button>
                          <Button
                            variant={activeDataType === 'humidity' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setActiveDataType('humidity')}
                            className={activeDataType === 'humidity' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                          >
                            <Droplet className="h-4 w-4 mr-1" />
                            Humidity
                          </Button>
                          <Button
                            variant={activeDataType === 'light' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setActiveDataType('light')}
                            className={activeDataType === 'light' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                          >
                            <Zap className="h-4 w-4 mr-1" />
                            Light
                          </Button>
                          <Button
                            variant={activeDataType === 'health' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setActiveDataType('health')}
                            className={activeDataType === 'health' ? 'bg-green-500 hover:bg-green-600' : ''}
                          >
                            <Crop className="h-4 w-4 mr-1" />
                            Plant Health
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">Time of Day</h3>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            variant={timeOfDay === 'morning' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setTimeOfDay('morning')}
                          >
                            Morning
                          </Button>
                          <Button
                            variant={timeOfDay === 'noon' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setTimeOfDay('noon')}
                          >
                            Noon
                          </Button>
                          <Button
                            variant={timeOfDay === 'evening' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setTimeOfDay('evening')}
                          >
                            Evening
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content - 3D visualization */}
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>{selectedTower?.name || 'Tower Visualization'}</CardTitle>
                  {selectedTower && (
                    <Badge 
                      variant={selectedTower.status === 'active' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {selectedTower.status.toUpperCase()}
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  {activeDataType.charAt(0).toUpperCase() + activeDataType.slice(1)} visualization
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow relative">
                {!selectedTower ? (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500">Select a tower to view</p>
                  </div>
                ) : (
                  <div className="relative h-[500px] w-full overflow-hidden rounded-md">
                    {/* 3D Tower visualization using React Three Fiber */}
                    <TowerScene 
                      tower={selectedTower}
                      sections={towerSections.map(section => ({
                        ...section,
                        type: 'pod',
                        plantType: 'Mixed Greens',
                        plantedDate: new Date().toISOString(),
                        metrics: {
                          temperature: section.temperature,
                          humidity: section.humidity,
                          light: 800 + Math.random() * 400,
                          co2: 400 + Math.random() * 200,
                          nutrient: 5 + Math.random() * 3,
                          ph: 6 + Math.random(),
                          ec: 1.2 + Math.random() * 0.5
                        }
                      }))}
                      activeDataType={activeDataType}
                      position={towerPosition}
                      timeOfDay={timeOfDay}
                      onSectionClick={(sectionIndex) => {
                        if (towerSections[sectionIndex]) {
                          handleSectionClick(towerSections[sectionIndex]);
                        }
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar - Data and insights */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Tower Details</CardTitle>
                <CardDescription>
                  Status and metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedTower ? (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500">Select a tower to view details</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Tower Specifications</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Type:</span>
                          <span>{selectedTower.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Addressing:</span>
                          <span className="capitalize">{selectedTower.addressingType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Columns:</span>
                          <span>{selectedTower.totalColumns}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Pods:</span>
                          <span>{selectedTower.totalPods}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Plant Capacity:</span>
                          <span>{selectedTower.plantCapacity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Current Plants:</span>
                          <span>{selectedTower.currentOccupancy}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Environment</h3>
                      {sensorData ? (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1 text-gray-500">
                              <ThermometerSun className="h-4 w-4 text-red-500" />
                              Temperature:
                            </span>
                            <span>{sensorData.temperature}°C</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1 text-gray-500">
                              <Droplet className="h-4 w-4 text-blue-500" />
                              Humidity:
                            </span>
                            <span>{sensorData.humidity}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1 text-gray-500">
                              <Zap className="h-4 w-4 text-yellow-500" />
                              Light Level:
                            </span>
                            <span>{sensorData.light} lux</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1 text-gray-500">
                              <Waves className="h-4 w-4 text-cyan-500" />
                              Water Flow:
                            </span>
                            <span>{sensorData.waterFlow} L/min</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500">Loading sensor data...</p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Blockchain Data Integrity</h3>
                      {blockchainRecords.length > 0 ? (
                        <div className="space-y-2">
                          {verificationStatus && (
                            <div className={`text-sm p-2 rounded ${isVerifying ? 'bg-blue-100 dark:bg-blue-900' : 'bg-green-100 dark:bg-green-900'}`}>
                              {verificationStatus}
                            </div>
                          )}
                          
                          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                            {blockchainRecords.map(record => (
                              <div key={record.id} className="border p-2 rounded-md text-xs space-y-1 bg-background">
                                <div className="flex justify-between">
                                  <span className="font-medium">ID: {record.id}</span>
                                  <Badge 
                                    variant={
                                      record.verificationStatus === 'verified' ? 'default' :
                                      record.verificationStatus === 'pending' ? 'secondary' : 'destructive'
                                    }
                                    className="text-[10px]"
                                  >
                                    {record.verificationStatus}
                                  </Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span>Type: {record.dataType}</span>
                                  <span>Chain: {record.blockchainType}</span>
                                </div>
                                <div className="truncate text-gray-500">
                                  Hash: {record.dataHash.substring(0, 10)}...
                                </div>
                                <div className="text-right">
                                  {record.verificationStatus === 'pending' && (
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-[10px] h-6 px-2"
                                      onClick={() => verifyBlockchainData(record.id)}
                                      disabled={isVerifying}
                                    >
                                      Verify
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          No blockchain records found for this tower
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Actions</h3>
                      <div className="flex gap-2 flex-wrap">
                        <Button variant="outline" size="sm">
                          Take Photo
                        </Button>
                        <Button variant="outline" size="sm">
                          Run Analysis
                        </Button>
                        <Button variant="outline" size="sm">
                          Adjust Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalTwinVisualization;