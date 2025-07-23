import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  Settings, 
  Trash2, 
  Edit, 
  Power, 
  PowerOff,
  RefreshCw,
  Cpu,
  HardDrive,
  Thermometer,
  Droplet,
  Zap,
  BatteryMedium,
  BarChart,
  Signal,
  Activity,
  Clock,
  Building2,
  Lightbulb,
  Filter,
  Database
} from 'lucide-react';
import { motion } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Type definitions for the devices and connections
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
  color?: string;
}

interface NetworkConnectionData {
  source: string;
  target: string;
  status: string;
  isCentral?: boolean;
}

interface NetworkData {
  nodes: NetworkNodeData[];
  connections: NetworkConnectionData[];
}

interface Tower {
  id: number;
  name: string;
  type: string;
  status: string;
  location?: string;
  plantCount?: number;
  lastHarvest?: string;
}

interface EnhancedDeviceManagerProps {
  networkData?: NetworkData | null;
}

const EnhancedDeviceManager: React.FC<EnhancedDeviceManagerProps> = ({
  networkData: initialNetworkData
}) => {
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<NetworkNodeData | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  const { toast } = useToast();
  
  // Fetch data on component mount if not provided
  useEffect(() => {
    if (initialNetworkData) {
      setNetworkData(initialNetworkData);
      setLoading(false);
    } else {
      fetchNetworkData();
    }
  }, [initialNetworkData]);
  
  // Fetch network data
  const fetchNetworkData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/network');
      if (!response.ok) {
        throw new Error(`Network fetch failed with status: ${response.status}`);
      }
      const data = await response.json();
      setNetworkData(data);
    } catch (error) {
      console.error('Failed to fetch network data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load network devices',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Filter nodes based on search term and filters
  const filteredNodes = networkData?.nodes.filter(node => {
    // Text search
    const matchesSearch = searchTerm === '' || 
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const matchesType = selectedType === 'all' || node.type === selectedType;
    
    // Status filter
    const matchesStatus = selectedStatus === 'all' || node.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  }) || [];
  
  // Get connected nodes for a given node
  const getConnectedNodes = (nodeId: string) => {
    if (!networkData) return [];
    
    const connections = networkData.connections.filter(conn => 
      conn.source === nodeId || conn.target === nodeId
    );
    
    const connectedNodeIds = connections.map(conn => 
      conn.source === nodeId ? conn.target : conn.source
    );
    
    return networkData.nodes.filter(node => connectedNodeIds.includes(node.id));
  };
  
  // Get icon for node type
  const getNodeIcon = (type: string, className: string = 'h-5 w-5') => {
    switch (type) {
      case 'hub': return <Database className={className} />;
      case 'tower': return <Building2 className={className} />;
      case 'sensor': return <Signal className={className} />;
      case 'controller': return <Cpu className={className} />;
      case 'pump': return <Droplet className={className} />;
      case 'light': return <Lightbulb className={className} />;
      case 'server': return <HardDrive className={className} />;
      case 'subsystem': return <Settings className={className} />;
      default: return <Settings className={className} />;
    }
  };
  
  // Get color for node type
  const getNodeColor = (type: string, status: string) => {
    // Status takes precedence for warnings/errors
    if (status === 'error' || status === 'offline') {
      return '#EF4444'; // Red
    } else if (status === 'warning') {
      return '#F59E0B'; // Amber
    }
    
    // Color by type
    switch (type) {
      case 'hub': return '#10B981'; // Emerald
      case 'tower': return '#2DD4BF'; // Teal
      case 'sensor': return '#3B82F6'; // Blue
      case 'controller': return '#7C3AED'; // Violet
      case 'pump': return '#8B5CF6'; // Purple
      case 'light': return '#F59E0B'; // Amber
      case 'server': return '#EC4899'; // Pink
      case 'subsystem': return '#6366F1'; // Indigo
      default: return '#6B7280'; // Gray
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            <Wifi className="h-3 w-3 mr-1" />
            Online
          </Badge>
        );
      case 'offline':
        return (
          <Badge variant="outline" className="text-red-500 border-red-500">
            <WifiOff className="h-3 w-3 mr-1" />
            Offline
          </Badge>
        );
      case 'warning':
        return (
          <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600 text-white">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Warning
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };
  
  // Toggle device status
  const toggleDeviceStatus = async (node: NetworkNodeData) => {
    try {
      const newStatus = node.status === 'online' ? 'offline' : 'online';
      // In a real app, you would call the API to update the device status
      // await apiRequest(`/api/devices/${node.id}/status`, 'POST', { status: newStatus });
      
      // For demo, update local state
      if (networkData) {
        const updatedNodes = networkData.nodes.map(n => 
          n.id === node.id ? { ...n, status: newStatus } : n
        );
        
        setNetworkData({
          ...networkData,
          nodes: updatedNodes
        });
        
        // Update selected node if it's the one being toggled
        if (selectedNode && selectedNode.id === node.id) {
          setSelectedNode({ ...selectedNode, status: newStatus });
        }
      }
      
      toast({
        description: `${node.name} ${newStatus === 'online' ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error('Failed to toggle device status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update device status',
        variant: 'destructive'
      });
    }
  };
  
  // Handle node selection
  const handleNodeSelect = (node: NetworkNodeData) => {
    setSelectedNode(node);
  };
  
  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Get node type label
  const getNodeTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  // Conditional rendering for node details card
  const renderNodeDetails = () => {
    if (!selectedNode) return null;
    
    const connectedNodes = getConnectedNodes(selectedNode.id);
    
    return (
      <Card className="mb-6 shadow-md border border-gray-100 dark:border-gray-800">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white mr-3"
                style={{ backgroundColor: getNodeColor(selectedNode.type, selectedNode.status) }}
              >
                {getNodeIcon(selectedNode.type)}
              </div>
              <div>
                <CardTitle>{selectedNode.name}</CardTitle>
                <CardDescription>
                  ID: {selectedNode.id} • {getNodeTypeLabel(selectedNode.type)}
                </CardDescription>
              </div>
            </div>
            {getStatusBadge(selectedNode.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">Device Information</h4>
              <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Type:</span>
                  <span className="font-medium">{getNodeTypeLabel(selectedNode.type)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Status:</span>
                  <span className="font-medium">{selectedNode.status}</span>
                </div>
                {selectedNode.value && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Value:</span>
                    <span className="font-medium">{selectedNode.value}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Position:</span>
                  <span className="font-medium">x:{selectedNode.x}, y:{selectedNode.y}</span>
                </div>
              </div>
            </div>
            
            {selectedNode.type === 'tower' && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Tower Details</h4>
                <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-3 space-y-2 text-sm">
                  {selectedNode.plantType && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Plant Type:</span>
                      <span className="font-medium">{selectedNode.plantType}</span>
                    </div>
                  )}
                  {selectedNode.growthStage !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Growth Stage:</span>
                      <span className="font-medium">{selectedNode.growthStage}%</span>
                    </div>
                  )}
                  {selectedNode.health !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Health:</span>
                      <span className="font-medium">{selectedNode.health}%</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-semibold mb-2">Connected Devices</h4>
              <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-3 max-h-40 overflow-y-auto">
                {connectedNodes.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No connected devices</p>
                ) : (
                  <div className="space-y-2">
                    {connectedNodes.map(node => (
                      <div 
                        key={node.id} 
                        className="flex items-center py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => setSelectedNode(node)}
                      >
                        <div 
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white mr-2"
                          style={{ backgroundColor: getNodeColor(node.type, node.status) }}
                        >
                          {getNodeIcon(node.type, 'h-3 w-3')}
                        </div>
                        <span className="text-sm font-medium">{node.name}</span>
                        <span className="ml-auto">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ 
                              backgroundColor: 
                                node.status === 'online' ? '#10B981' : 
                                node.status === 'warning' ? '#F59E0B' : 
                                node.status === 'offline' ? '#EF4444' : '#6B7280'
                            }}
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2 flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setSelectedNode(null)}>Close</Button>
          <Button variant="secondary">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button 
            variant={selectedNode.status === 'online' ? 'destructive' : 'default'}
            onClick={() => toggleDeviceStatus(selectedNode)}
          >
            {selectedNode.status === 'online' ? (
              <>
                <PowerOff className="h-4 w-4 mr-1" />
                Deactivate
              </>
            ) : (
              <>
                <Power className="h-4 w-4 mr-1" />
                Activate
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  // Get animation delay based on index
  const getAnimationDelay = (index: number) => {
    return {
      animationDelay: `${index * 0.05}s`
    };
  };
  
  return (
    <div className="device-manager w-full">
      {selectedNode && renderNodeDetails()}
      
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Search devices by name or type..."
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[130px]">
                <Filter className="h-4 w-4 mr-1" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="hub">Hubs</SelectItem>
                <SelectItem value="tower">Towers</SelectItem>
                <SelectItem value="sensor">Sensors</SelectItem>
                <SelectItem value="controller">Controllers</SelectItem>
                <SelectItem value="pump">Pumps</SelectItem>
                <SelectItem value="light">Lights</SelectItem>
                <SelectItem value="subsystem">Subsystems</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[130px]">
                <Activity className="h-4 w-4 mr-1" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchNetworkData}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                Add Device
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Device</DialogTitle>
                <DialogDescription>
                  Enter the details for the new device to add to the network.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select device type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hub">Hub</SelectItem>
                      <SelectItem value="tower">Tower</SelectItem>
                      <SelectItem value="sensor">Sensor</SelectItem>
                      <SelectItem value="controller">Controller</SelectItem>
                      <SelectItem value="pump">Pump</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="subsystem">Subsystem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select initial status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Device</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="grid" className="w-full">
        <TabsList>
          <TabsTrigger value="grid">
            <div className="flex items-center">
              <div className="grid grid-cols-3 gap-0.5 h-4 w-4 mr-1.5">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
              Grid View
            </div>
          </TabsTrigger>
          <TabsTrigger value="table">
            <div className="flex items-center">
              <BarChart className="h-4 w-4 mr-1.5" />
              Table View
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid" className="mt-6">
          {loading ? (
            <div className="h-60 flex items-center justify-center">
              <RefreshCw className="h-6 w-6 animate-spin text-gray-400 dark:text-gray-600" />
            </div>
          ) : filteredNodes.length === 0 ? (
            <div className="h-60 flex flex-col items-center justify-center text-center p-4">
              <AlertTriangle className="h-10 w-10 text-gray-400 dark:text-gray-600 mb-2" />
              <h3 className="text-lg font-medium mb-1">No devices found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                {searchTerm || selectedType !== 'all' || selectedStatus !== 'all'
                  ? "Try adjusting your search filters to find what you're looking for."
                  : "There are no devices available at this time. Click 'Add Device' to get started."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredNodes.map((node, index) => (
                <motion.div 
                  key={node.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  style={getAnimationDelay(index)}
                  whileHover={{ y: -4 }}
                  onClick={() => handleNodeSelect(node)}
                >
                  <Card className="cursor-pointer hover:shadow-md transition-all border-opacity-70 h-full flex flex-col">
                    <CardHeader className="pb-2 relative">
                      <div className="absolute top-3 right-3">
                        {getStatusBadge(node.status)}
                      </div>
                      <div className="flex items-center">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white mr-3"
                          style={{ backgroundColor: getNodeColor(node.type, node.status) }}
                        >
                          {getNodeIcon(node.type)}
                        </div>
                        <div>
                          <CardTitle className="text-base">{node.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {getNodeTypeLabel(node.type)} • ID: {node.id}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2 pt-0 flex-grow">
                      <div className="space-y-2">
                        {node.value && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Value:</span>
                            <span className="font-medium">{node.value}</span>
                          </div>
                        )}
                        {node.plantType && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Plant Type:</span>
                            <span className="font-medium">{node.plantType}</span>
                          </div>
                        )}
                        {node.growthStage !== undefined && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Growth:</span>
                            <span className="font-medium">{node.growthStage}%</span>
                          </div>
                        )}
                        {node.health !== undefined && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Health:</span>
                            <span className="font-medium">{node.health}%</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleNodeSelect(node);
                          }}>
                            <Settings className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Device
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            toggleDeviceStatus(node);
                          }}>
                            {node.status === 'online' ? (
                              <>
                                <PowerOff className="h-4 w-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Power className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 focus:text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="table">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Plant Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <RefreshCw className="h-5 w-5 animate-spin mx-auto text-gray-400 dark:text-gray-600" />
                      </TableCell>
                    </TableRow>
                  ) : filteredNodes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <AlertTriangle className="h-8 w-8 text-gray-400 dark:text-gray-600 mb-2" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            No devices found with the current filters
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredNodes.map((node, index) => (
                      <TableRow 
                        key={node.id} 
                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        onClick={() => handleNodeSelect(node)}
                      >
                        <TableCell>
                          <div className="flex items-center">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-2"
                              style={{ backgroundColor: getNodeColor(node.type, node.status) }}
                            >
                              {getNodeIcon(node.type, 'h-4 w-4')}
                            </div>
                            <div>
                              <div className="font-medium">{node.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">ID: {node.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getNodeTypeLabel(node.type)}</TableCell>
                        <TableCell>{getStatusBadge(node.status)}</TableCell>
                        <TableCell>{node.value || '—'}</TableCell>
                        <TableCell>{node.plantType || '—'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDeviceStatus(node);
                              }}
                            >
                              {node.status === 'online' ? (
                                <PowerOff className="h-4 w-4 text-gray-500 hover:text-red-500" />
                              ) : (
                                <Power className="h-4 w-4 text-gray-500 hover:text-green-500" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Edit functionality
                              }}
                            >
                              <Edit className="h-4 w-4 text-gray-500 hover:text-blue-500" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  handleNodeSelect(node);
                                }}>
                                  <Settings className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Device
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  toggleDeviceStatus(node);
                                }}>
                                  {node.status === 'online' ? (
                                    <>
                                      <PowerOff className="h-4 w-4 mr-2" />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <Power className="h-4 w-4 mr-2" />
                                      Activate
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedDeviceManager;