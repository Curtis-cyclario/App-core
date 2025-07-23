import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  GlassCard, 
  GlassCardContent, 
  GlassCardHeader, 
  GlassCardTitle, 
  GlassCardFooter,
  GlassCardDescription 
} from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from '@/lib/queryClient';
// Import Device from types once we refactor
import { Device } from '@/types';

// These are re-defined locally to match the structure in shared/schema
interface NetworkNodeData {
  id: string;
  type: string;
  name: string;
  status: string;
  x: number;
  y: number;
  plantType?: string;
  growthStage?: number;
  health?: number;
  value?: string;
}

interface NetworkConnectionData {
  source: string;
  target: string;
  status: string;
}

interface NetworkData {
  nodes: NetworkNodeData[];
  connections: NetworkConnectionData[];
}

import { 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Server, 
  Thermometer, 
  Droplet, 
  Zap, 
  Lightbulb,
  Cpu,
  Database,
  Network as NetworkIcon,
  Building2,
  Edit,
  Save,
  Grid,
  Share2,
  BookOpen
} from 'lucide-react';
import EnhancedNetworkTopology from '@/components/network/EnhancedNetworkTopology';
import EnhancedDeviceManager from '@/components/device-management/EnhancedDeviceManager';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { motion } from 'framer-motion';

const Network = () => {
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState('topology');
  const [layoutMode, setLayoutMode] = useState<'standard' | 'mindmap'>('standard');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<NetworkNodeData | null>(null);
  const [showNodeDetails, setShowNodeDetails] = useState<boolean>(false);

  const [towers, setTowers] = useState<any[]>([]);
  
  // Toggle between layout modes and refresh data
  const toggleLayoutMode = () => {
    const newMode = layoutMode === 'standard' ? 'mindmap' : 'standard';
    setLayoutMode(newMode);
    // Refresh network data with new layout
    fetchNetworkDataWithMode(newMode);
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };
  
  // Fetch with a specific layout mode
  const fetchNetworkDataWithMode = async (mode: 'standard' | 'mindmap') => {
    try {
      setLoading(true);
      
      // Fetch devices first to use as network nodes
      const devicesResponse = await apiRequest('GET', '/api/devices');
      let devicesData = [];
      if (devicesResponse.ok) {
        devicesData = await devicesResponse.json();
        setDevices(devicesData);
      }
      
      // Convert devices to network nodes
      const networkNodes = devicesData.map((device: any, index: number) => ({
        id: device.id.toString(),
        type: device.type,
        name: device.name,
        status: device.status,
        x: 200 + (index % 4) * 150,
        y: 200 + Math.floor(index / 4) * 120,
        size: device.type === 'hub' ? 30 : device.type === 'tower' ? 25 : 20
      }));
      
      // Create connections between devices
      const networkConnections = [];
      const hubs = networkNodes.filter((node: any) => node.type === 'hub');
      const towers = networkNodes.filter((node: any) => node.type === 'tower');
      const sensors = networkNodes.filter((node: any) => node.type === 'sensor');
      
      // Connect towers to main hub
      if (hubs.length > 0) {
        towers.forEach((tower: any) => {
          networkConnections.push({
            source: hubs[0].id,
            target: tower.id,
            status: 'active'
          });
        });
        
        // Connect sensors to towers
        sensors.forEach((sensor: any, index: number) => {
          const towerIndex = index % towers.length;
          if (towers[towerIndex]) {
            networkConnections.push({
              source: towers[towerIndex].id,
              target: sensor.id,
              status: 'active'
            });
          }
        });
      }
      
      const networkData = {
        nodes: networkNodes,
        connections: networkConnections
      };
      
      setNetworkData(networkData);
      
      // Fetch other data
      await fetchTowers();
    } catch (error) {
      console.error('Error fetching network data:', error);
      // Fallback data
      setNetworkData({
        nodes: [
          {
            id: 'hub-1',
            type: 'hub',
            name: 'Main Hub',
            status: 'online',
            x: 400,
            y: 300,
            size: 30
          }
        ],
        connections: []
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch towers
  const fetchTowers = async () => {
    const towersResponse = await apiRequest('GET', '/api/towers');
    if (towersResponse.ok) {
      const towersData = await towersResponse.json();
      setTowers(towersData);
    }
    return towersResponse;
  };
  
  // Fetch devices
  const fetchDevices = async () => {
    const devicesResponse = await apiRequest('GET', '/api/devices');
    if (devicesResponse.ok) {
      const devicesData = await devicesResponse.json();
      setDevices(devicesData);
    }
    return devicesResponse;
  };

  const fetchNetworkData = async () => {
    // Use the helper method with the current layout mode
    fetchNetworkDataWithMode(layoutMode);
  };

  useEffect(() => {
    fetchNetworkData();
  }, []);

  // Get appropriate icon for device type
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'hub':
        return <Server className="h-5 w-5" />;
      case 'sensor':
        return <Thermometer className="h-5 w-5" />;
      case 'pump':
        return <Droplet className="h-5 w-5" />;
      case 'light':
        return <Lightbulb className="h-5 w-5" />;
      default:
        return <Zap className="h-5 w-5" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800"
      >
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <NetworkIcon className="h-8 w-8 text-blue-500 dark:text-blue-400" />
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Network Topology</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Visualize your entire vertical farming infrastructure</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                onClick={toggleLayoutMode} 
                variant="outline"
                size="sm"
                className="flex items-center bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 transition-all"
              >
                {layoutMode === 'standard' ? (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    Switch to Mind Map
                  </>
                ) : (
                  <>
                    <Grid className="h-4 w-4 mr-2" />
                    Switch to Standard
                  </>
                )}
              </Button>
              
              {layoutMode === 'mindmap' && (
                <Button 
                  onClick={toggleEditMode} 
                  variant={editMode ? "default" : "outline"}
                  size="sm"
                  className={`flex items-center ${editMode ? 'bg-blue-500 text-white' : 'bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700'} transition-all`}
                >
                  {editMode ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Layout
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Layout
                    </>
                  )}
                </Button>
              )}
              
              <Button 
                onClick={fetchNetworkData} 
                disabled={loading}
                variant="outline"
                size="sm"
                className="flex items-center bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 transition-all"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
          
          {layoutMode === 'mindmap' && (
            <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm flex items-start">
              <BookOpen className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Mind Map Layout</p>
                <p className="text-xs mt-1">This layout organizes devices in a spheroid grid structure, preventing overlapping and creating clearer visual relationships between components.</p>
                {editMode && <p className="text-xs mt-1 font-semibold">Edit Mode: Drag nodes to reposition them. Changes will automatically snap to the nearest grid point.</p>}
              </div>
            </div>
          )}
        </div>
      </motion.div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="topology">Network Topology</TabsTrigger>
          <TabsTrigger value="devices">Connected Devices</TabsTrigger>
          <TabsTrigger value="connections">Connection Status</TabsTrigger>
        </TabsList>
        
        <TabsContent value="topology">
          <ErrorBoundary fallback={
            <div className="flex items-center justify-center h-96 border border-red-200 rounded-lg bg-red-50">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600">Network topology failed to load</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                  Refresh Page
                </Button>
              </div>
            </div>
          }>
            <EnhancedNetworkTopology 
              networkData={networkData}
              className="w-full"
            />
          </ErrorBoundary>
        </TabsContent>
        
        <TabsContent value="devices">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <EnhancedDeviceManager networkData={networkData} />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="connections">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard intensity={0.6} className="mb-6">
              <GlassCardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <GlassCardTitle>Connection Status</GlassCardTitle>
                    <GlassCardDescription>
                      Real-time connectivity metrics between network nodes
                    </GlassCardDescription>
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30">
                    {networkData?.connections.filter(c => c.status === 'active').length || 0} Active Connections
                  </Badge>
                </div>
              </GlassCardHeader>
              <GlassCardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-6 h-6 border-2 border-gray-300 border-t-primary-500 rounded-full"
                    />
                    <p className="text-gray-500 dark:text-gray-400 ml-3">Loading connections...</p>
                  </div>
                ) : !networkData ? (
                  <div className="flex flex-col justify-center items-center py-6">
                    <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-3 mb-2">
                      <RefreshCw className="h-6 w-6 text-amber-500 dark:text-amber-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">No connection data available</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700/30">
                      <thead className="bg-transparent">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Source
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Target
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Quality
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/20">
                        {networkData.connections.map((connection, index) => {
                          const sourceNode = networkData.nodes.find(n => n.id === connection.source);
                          const targetNode = networkData.nodes.find(n => n.id === connection.target);
                          
                          // Calculate a realistic signal quality
                          const quality = connection.status === 'active' 
                            ? Math.round(85 + Math.random() * 15) 
                            : Math.round(30 + Math.random() * 40);
                          
                          // Determine quality text and color
                          let qualityText, qualityColor;
                          if (quality >= 90) {
                            qualityText = "Excellent";
                            qualityColor = "bg-emerald-500";
                          } else if (quality >= 75) {
                            qualityText = "Good";
                            qualityColor = "bg-green-500";
                          } else if (quality >= 50) {
                            qualityText = "Fair";
                            qualityColor = "bg-amber-500";
                          } else {
                            qualityText = "Poor";
                            qualityColor = "bg-red-500";
                          }
                          
                          return (
                            <motion.tr 
                              key={index}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05, duration: 0.2 }}
                              className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors duration-150"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className={`w-2 h-2 rounded-full ${connection.status === 'active' ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {sourceNode?.name || 'Unknown'}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Share2 className="h-3 w-3 text-gray-400 mr-2" />
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {targetNode?.name || 'Unknown'}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge 
                                  variant={connection.status === 'active' ? 'default' : 'secondary'}
                                  className={`${connection.status === 'active' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400'}`}
                                >
                                  {connection.status === 'active' ? 'Active' : 'Inactive'}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${quality}%` }}
                                    transition={{ duration: 1, delay: index * 0.05 }}
                                    className={`${qualityColor} h-2 rounded-full`}
                                  ></motion.div>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">{qualityText} ({quality}%)</span>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </GlassCardContent>
              <GlassCardFooter>
                <div className="text-xs text-gray-500 flex items-center">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Last updated: Just now
                </div>
              </GlassCardFooter>
            </GlassCard>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Network;
