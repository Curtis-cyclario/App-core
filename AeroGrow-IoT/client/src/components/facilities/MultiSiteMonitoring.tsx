import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2,
  PlusCircle,
  Thermometer,
  Droplet,
  Signal,
  MoreVertical,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Map,
  ChevronRight,
  Bell,
  Activity,
  Zap
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Mock/simulated data types
interface Facility {
  id: number;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  totalTowers: number;
  operationalTowers: number;
  avgTemperature: number;
  avgHumidity: number;
  waterUsage: number;
  energyUsage: number;
  lastUpdated: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  alerts: number;
}

// Widget for showing the status of all sites
const MultiSiteMonitoring: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([
    {
      id: 1,
      name: "Facility 1 - Main Campus",
      location: "Seattle, WA",
      status: "online",
      totalTowers: 10,
      operationalTowers: 10,
      avgTemperature: 23.4,
      avgHumidity: 68,
      waterUsage: 487,
      energyUsage: 3.8,
      lastUpdated: new Date().toISOString(),
      coordinates: {
        lat: 47.6062,
        lng: -122.3321
      },
      alerts: 0
    },
    {
      id: 2,
      name: "Facility 2 - North Site",
      location: "Portland, OR",
      status: "online",
      totalTowers: 8,
      operationalTowers: 7,
      avgTemperature: 22.1,
      avgHumidity: 72,
      waterUsage: 412,
      energyUsage: 3.2,
      lastUpdated: new Date().toISOString(),
      coordinates: {
        lat: 45.5152,
        lng: -122.6784
      },
      alerts: 1
    },
    {
      id: 3,
      name: "Facility 3 - Research Center",
      location: "Bellevue, WA",
      status: "maintenance",
      totalTowers: 5,
      operationalTowers: 3,
      avgTemperature: 24.7,
      avgHumidity: 65,
      waterUsage: 245,
      energyUsage: 1.9,
      lastUpdated: new Date().toISOString(),
      coordinates: {
        lat: 47.6101,
        lng: -122.2015
      },
      alerts: 2
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [isAddFacilityOpen, setIsAddFacilityOpen] = useState(false);
  const [newFacility, setNewFacility] = useState({
    name: '',
    location: '',
    totalTowers: 0
  });
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [isEditFacilityOpen, setIsEditFacilityOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  
  const { toast } = useToast();

  // Fetch facilities (simulated)
  const fetchFacilities = () => {
    setLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      // Just use the existing facilities with refreshed timestamps
      setFacilities(prev => 
        prev.map(f => ({
          ...f,
          lastUpdated: new Date().toISOString(),
          // Randomize some values for simulation
          avgTemperature: f.avgTemperature + (Math.random() * 2 - 1),
          avgHumidity: f.avgHumidity + (Math.random() * 6 - 3),
          waterUsage: f.waterUsage + (Math.random() * 20 - 10),
          energyUsage: f.energyUsage + (Math.random() * 0.4 - 0.2),
        }))
      );
      setLoading(false);
    }, 800);
  };

  // Component mount effect
  useEffect(() => {
    fetchFacilities();
  }, []);

  // Handle adding a new facility
  const handleAddFacility = () => {
    if (!newFacility.name || !newFacility.location || !newFacility.totalTowers) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Create a new facility with simulated data
    const newFacilityData: Facility = {
      id: Date.now(),
      name: newFacility.name,
      location: newFacility.location,
      status: "online",
      totalTowers: newFacility.totalTowers,
      operationalTowers: newFacility.totalTowers,
      avgTemperature: 23 + (Math.random() * 2),
      avgHumidity: 65 + (Math.random() * 10),
      waterUsage: 400 + (Math.random() * 100),
      energyUsage: 3 + (Math.random() * 1),
      lastUpdated: new Date().toISOString(),
      coordinates: {
        // Random coordinates for demo
        lat: 47 + (Math.random() * 1),
        lng: -122 + (Math.random() * 1)
      },
      alerts: 0
    };
    
    setFacilities(prev => [...prev, newFacilityData]);
    setNewFacility({ name: '', location: '', totalTowers: 0 });
    setIsAddFacilityOpen(false);
    
    toast({
      title: "Facility Added",
      description: `${newFacilityData.name} has been added successfully.`,
      variant: "default"
    });
  };

  // Handle editing a facility
  const handleEditFacility = () => {
    if (!editingFacility) return;
    
    setFacilities(prev => 
      prev.map(f => 
        f.id === editingFacility.id ? editingFacility : f
      )
    );
    
    setIsEditFacilityOpen(false);
    setEditingFacility(null);
    
    toast({
      title: "Facility Updated",
      description: `${editingFacility.name} has been updated successfully.`,
      variant: "default"
    });
  };

  // Handle deleting a facility
  const handleDeleteFacility = (id: number) => {
    if (window.confirm("Are you sure you want to delete this facility? This action cannot be undone.")) {
      setFacilities(prev => prev.filter(f => f.id !== id));
      
      toast({
        title: "Facility Deleted",
        description: "The facility has been removed from the system.",
        variant: "default"
      });
    }
  };

  // Format timestamp for display
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get status indicator
  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'online':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            Online
          </Badge>
        );
      case 'offline':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-red-500"></span>
            Offline
          </Badge>
        );
      case 'maintenance':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-500"></span>
            Maintenance
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get operational status indicator
  const getOperationalStatus = (operational: number, total: number) => {
    const percentage = (operational / total) * 100;
    
    if (percentage === 100) {
      return (
        <div className="flex items-center">
          <span className="text-green-500 font-medium flex items-center">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            All Systems Operational
          </span>
        </div>
      );
    } else if (percentage >= 75) {
      return (
        <div className="flex items-center">
          <span className="text-amber-500 font-medium flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Partial Outage
          </span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center">
          <span className="text-red-500 font-medium flex items-center">
            <XCircle className="h-3 w-3 mr-1" />
            Major Outage
          </span>
        </div>
      );
    }
  };

  return (
    <>
      <Card className="organic-card-enhanced shadow-xl border border-emerald-500/20">
        <CardHeader className="pb-4 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-indigo-500" />
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Multi-Site Monitoring
              </CardTitle>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={fetchFacilities}
                disabled={loading}
                className="bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Dialog open={isAddFacilityOpen} onOpenChange={setIsAddFacilityOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="ml-2">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Facility
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Facility</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new vertical farming facility.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="facility-name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="facility-name"
                        value={newFacility.name}
                        onChange={(e) => setNewFacility({...newFacility, name: e.target.value})}
                        className="col-span-3"
                        placeholder="Facility Name"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="facility-location" className="text-right">
                        Location
                      </Label>
                      <Input
                        id="facility-location"
                        value={newFacility.location}
                        onChange={(e) => setNewFacility({...newFacility, location: e.target.value})}
                        className="col-span-3"
                        placeholder="City, State"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="facility-towers" className="text-right">
                        Towers
                      </Label>
                      <Input
                        id="facility-towers"
                        type="number"
                        min="1"
                        value={newFacility.totalTowers || ''}
                        onChange={(e) => setNewFacility({...newFacility, totalTowers: parseInt(e.target.value) || 0})}
                        className="col-span-3"
                        placeholder="Number of Towers"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddFacilityOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddFacility}>Add Facility</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Monitor and manage all your vertical farming operations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="map">Map View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list">
              <div className="space-y-4">
                <AnimatePresence>
                  {facilities.map((facility) => (
                    <motion.div
                      key={facility.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="overflow-hidden border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200">
                        <CardContent className="p-0">
                          <div className="flex flex-col sm:flex-row items-stretch">
                            {/* Status indicator sidebar */}
                            <div className={`w-full sm:w-1.5 h-1.5 sm:h-auto ${
                              facility.status === 'online' ? 'bg-green-500' : 
                              facility.status === 'offline' ? 'bg-red-500' : 
                              'bg-amber-500'
                            }`}></div>
                            
                            <div className="p-4 flex-1">
                              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-semibold">{facility.name}</h3>
                                    {getStatusIndicator(facility.status)}
                                    {facility.alerts > 0 && (
                                      <Badge variant="destructive" className="ml-2">
                                        {facility.alerts} {facility.alerts === 1 ? 'Alert' : 'Alerts'}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {facility.location} • Last updated: {formatTime(facility.lastUpdated)}
                                  </p>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="h-8"
                                    onClick={() => {
                                      // Navigate to facility - would link to detailed view
                                      console.log(`Navigating to facility ${facility.id}`);
                                    }}
                                  >
                                    View Details
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                  </Button>
                                  
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem 
                                        onClick={() => {
                                          setEditingFacility(facility);
                                          setIsEditFacilityOpen(true);
                                        }}
                                        className="cursor-pointer"
                                      >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Facility
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        onClick={() => handleDeleteFacility(facility.id)}
                                        className="cursor-pointer text-red-600 dark:text-red-400"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Facility
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                              
                              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="flex flex-col space-y-1 p-2 rounded-md bg-gray-50 dark:bg-gray-800/50">
                                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                    <Activity className="h-3.5 w-3.5 mr-1 text-blue-500" />
                                    Operational Status
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium">
                                      {facility.operationalTowers} / {facility.totalTowers} Towers
                                    </div>
                                    {getOperationalStatus(facility.operationalTowers, facility.totalTowers)}
                                  </div>
                                </div>
                                
                                <div className="flex flex-col space-y-1 p-2 rounded-md bg-gray-50 dark:bg-gray-800/50">
                                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                    <Thermometer className="h-3.5 w-3.5 mr-1 text-red-500" />
                                    Avg. Temperature / Humidity
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium">
                                      {facility.avgTemperature.toFixed(1)}°C
                                    </div>
                                    <div className="text-sm font-medium">
                                      {facility.avgHumidity.toFixed(0)}%
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex flex-col space-y-1 p-2 rounded-md bg-gray-50 dark:bg-gray-800/50">
                                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                    <Droplet className="h-3.5 w-3.5 mr-1 text-blue-500" />
                                    Water Usage
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium">
                                      {facility.waterUsage.toFixed(0)} L
                                    </div>
                                    <div className="text-xs text-green-500">
                                      -12% vs avg
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex flex-col space-y-1 p-2 rounded-md bg-gray-50 dark:bg-gray-800/50">
                                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                    <Zap className="h-3.5 w-3.5 mr-1 text-amber-500" />
                                    Energy Usage
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium">
                                      {facility.energyUsage.toFixed(1)} kWh
                                    </div>
                                    <div className="text-xs text-green-500">
                                      -8% vs avg
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {facilities.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                    <Building2 className="h-16 w-16 text-gray-300 dark:text-gray-700 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Facilities Added</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
                      You haven't added any vertical farming facilities yet. Get started by adding your first facility.
                    </p>
                    <Button 
                      onClick={() => setIsAddFacilityOpen(true)}
                      className="mt-2"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add First Facility
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {facilities.map((facility) => (
                  <motion.div
                    key={facility.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                      <div className={`h-1.5 w-full ${
                        facility.status === 'online' ? 'bg-green-500' : 
                        facility.status === 'offline' ? 'bg-red-500' : 
                        'bg-amber-500'
                      }`}></div>
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{facility.name}</CardTitle>
                            <CardDescription>{facility.location}</CardDescription>
                          </div>
                          {getStatusIndicator(facility.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div className="flex flex-col space-y-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <Signal className="h-3.5 w-3.5 mr-1" /> Status
                            </span>
                            <span className="text-sm font-medium">
                              {facility.operationalTowers}/{facility.totalTowers} Towers
                            </span>
                          </div>
                          <div className="flex flex-col space-y-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <Thermometer className="h-3.5 w-3.5 mr-1" /> Temperature
                            </span>
                            <span className="text-sm font-medium">
                              {facility.avgTemperature.toFixed(1)}°C / {facility.avgHumidity.toFixed(0)}%
                            </span>
                          </div>
                          <div className="flex flex-col space-y-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <Droplet className="h-3.5 w-3.5 mr-1" /> Water
                            </span>
                            <span className="text-sm font-medium">
                              {facility.waterUsage.toFixed(0)} L
                            </span>
                          </div>
                          <div className="flex flex-col space-y-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <Zap className="h-3.5 w-3.5 mr-1" /> Energy
                            </span>
                            <span className="text-sm font-medium">
                              {facility.energyUsage.toFixed(1)} kWh
                            </span>
                          </div>
                        </div>
                        
                        {facility.alerts > 0 && (
                          <div className="mt-3 p-2 rounded bg-red-50 dark:bg-red-900/20 flex items-center text-red-700 dark:text-red-400 text-sm">
                            <Bell className="h-4 w-4 mr-2" />
                            {facility.alerts} active {facility.alerts === 1 ? 'alert' : 'alerts'}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Updated at {formatTime(facility.lastUpdated)}
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-xs h-7 px-2"
                        >
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
                
                {/* Add Facility Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Card 
                    className="border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center min-h-[300px] cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
                    onClick={() => setIsAddFacilityOpen(true)}
                  >
                    <CardContent className="flex flex-col items-center justify-center h-full text-center p-6">
                      <PlusCircle className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Add New Facility</h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-xs">
                        Add another vertical farming facility to your monitoring network
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>
            
            <TabsContent value="map">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center h-[400px]">
                <Map className="h-16 w-16 text-gray-300 dark:text-gray-700 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Map View</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Map visualization would display all facilities with geographic context.
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  (Integration with mapping services like Google Maps or MapBox would be implemented here)
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Edit Facility Dialog */}
      <Dialog open={isEditFacilityOpen} onOpenChange={setIsEditFacilityOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Facility</DialogTitle>
            <DialogDescription>
              Update the details for this facility.
            </DialogDescription>
          </DialogHeader>
          {editingFacility && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-facility-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-facility-name"
                  value={editingFacility.name}
                  onChange={(e) => setEditingFacility({...editingFacility, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-facility-location" className="text-right">
                  Location
                </Label>
                <Input
                  id="edit-facility-location"
                  value={editingFacility.location}
                  onChange={(e) => setEditingFacility({...editingFacility, location: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-facility-towers" className="text-right">
                  Total Towers
                </Label>
                <Input
                  id="edit-facility-towers"
                  type="number"
                  min="1"
                  value={editingFacility.totalTowers}
                  onChange={(e) => setEditingFacility({...editingFacility, totalTowers: parseInt(e.target.value) || 0})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-facility-operational" className="text-right">
                  Operational
                </Label>
                <Input
                  id="edit-facility-operational"
                  type="number"
                  min="0"
                  max={editingFacility.totalTowers}
                  value={editingFacility.operationalTowers}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setEditingFacility({
                      ...editingFacility, 
                      operationalTowers: Math.min(value, editingFacility.totalTowers)
                    });
                  }}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-facility-status" className="text-right">
                  Status
                </Label>
                <select
                  id="edit-facility-status"
                  value={editingFacility.status}
                  onChange={(e) => setEditingFacility({
                    ...editingFacility, 
                    status: e.target.value as 'online' | 'offline' | 'maintenance'
                  })}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditFacilityOpen(false)}>Cancel</Button>
            <Button onClick={handleEditFacility}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MultiSiteMonitoring;