import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Building2, 
  Plus, 
  Settings, 
  MapPin, 
  Activity,
  Users,
  Zap,
  Droplets,
  Thermometer,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

interface Facility {
  id: number;
  name: string;
  location: string;
  type: 'greenhouse' | 'warehouse' | 'processing' | 'research';
  status: 'active' | 'inactive' | 'maintenance';
  towerCount: number;
  deviceCount: number;
  capacity: number;
  currentYield: number;
  efficiency: number;
  createdAt: string;
}

interface NewFacility {
  name: string;
  location: string;
  type: 'greenhouse' | 'warehouse' | 'processing' | 'research';
  capacity: number;
}

const FacilityManagement = () => {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFacility, setNewFacility] = useState<NewFacility>({
    name: '',
    location: '',
    type: 'greenhouse',
    capacity: 100
  });

  const queryClient = useQueryClient();

  // Fetch facilities
  const { data: facilities = [], isLoading } = useQuery({
    queryKey: ['/api/facilities'],
    queryFn: async () => {
      const response = await fetch('/api/facilities');
      return response.json();
    }
  });

  // Fetch devices for selected facility
  const { data: facilityDevices = [] } = useQuery({
    queryKey: ['/api/devices', selectedFacility?.id],
    queryFn: async () => {
      const response = await fetch(`/api/devices?facilityId=${selectedFacility?.id}`);
      return response.json();
    },
    enabled: !!selectedFacility?.id
  });

  // Add facility mutation
  const addFacilityMutation = useMutation({
    mutationFn: async (facility: NewFacility) => {
      const response = await fetch('/api/facilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(facility)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/facilities'] });
      setShowAddForm(false);
      setNewFacility({ name: '', location: '', type: 'greenhouse', capacity: 100 });
    }
  });

  // Add device to facility mutation
  const addDeviceMutation = useMutation({
    mutationFn: async (device: any) => {
      const response = await fetch('/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(device)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/devices', selectedFacility?.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/facilities'] });
    }
  });

  const handleAddFacility = () => {
    if (newFacility.name && newFacility.location) {
      addFacilityMutation.mutate(newFacility);
    }
  };

  const handleAddDevice = (type: string) => {
    if (selectedFacility) {
      const deviceName = `${type.charAt(0).toUpperCase() + type.slice(1)} ${Math.floor(Math.random() * 1000)}`;
      addDeviceMutation.mutate({
        name: deviceName,
        type: type,
        facilityId: selectedFacility.id,
        status: 'active'
      });
    }
  };

  const getFacilityIcon = (type: string) => {
    switch (type) {
      case 'greenhouse': return '🌱';
      case 'warehouse': return '🏢';
      case 'processing': return '⚙️';
      case 'research': return '🔬';
      default: return '🏭';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'maintenance': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-900 overflow-hidden">
      <div className="absolute inset-0 z-1 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-radial from-emerald-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-gradient-radial from-teal-500/5 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 container mx-auto p-4 sm:p-6 space-y-6 max-w-7xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 organic-card p-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-emerald-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">Facility Management</h1>
                <p className="text-emerald-200">Manage facilities, devices, and live monitoring systems</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="organic-button-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Facility
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Facilities List */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="organic-card">
              <CardHeader>
                <CardTitle className="text-white">Facilities ({facilities.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoading ? (
                  <div className="text-emerald-300">Loading facilities...</div>
                ) : facilities.length === 0 ? (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No facilities yet</p>
                    <Button 
                      onClick={() => setShowAddForm(true)}
                      className="organic-button-secondary"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Facility
                    </Button>
                  </div>
                ) : (
                  facilities.map((facility: Facility) => (
                    <motion.div
                      key={facility.id}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                        selectedFacility?.id === facility.id 
                          ? 'border-emerald-500 bg-emerald-500/10' 
                          : 'border-gray-600 hover:border-emerald-400 bg-gray-800/50'
                      }`}
                      onClick={() => setSelectedFacility(facility)}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getFacilityIcon(facility.type)}</span>
                          <div>
                            <h3 className="font-semibold text-white text-sm">{facility.name}</h3>
                            <p className="text-xs text-emerald-300">{facility.location}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(facility.status)}>
                          {facility.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-gray-400">
                          <span className="text-emerald-400">{facility.towerCount || 0}</span> towers
                        </div>
                        <div className="text-gray-400">
                          <span className="text-teal-400">{facility.deviceCount || 0}</span> devices
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Add Facility Form */}
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="organic-card">
                  <CardHeader>
                    <CardTitle className="text-white">Add New Facility</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Facility Name"
                      value={newFacility.name}
                      onChange={(e) => setNewFacility(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-gray-800/50 border-emerald-500/20 text-white"
                    />
                    <Input
                      placeholder="Location"
                      value={newFacility.location}
                      onChange={(e) => setNewFacility(prev => ({ ...prev, location: e.target.value }))}
                      className="bg-gray-800/50 border-emerald-500/20 text-white"
                    />
                    <Select value={newFacility.type} onValueChange={(value: any) => setNewFacility(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger className="bg-gray-800/50 border-emerald-500/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-emerald-500/20">
                        <SelectItem value="greenhouse" className="text-white">🌱 Greenhouse</SelectItem>
                        <SelectItem value="warehouse" className="text-white">🏢 Warehouse</SelectItem>
                        <SelectItem value="processing" className="text-white">⚙️ Processing</SelectItem>
                        <SelectItem value="research" className="text-white">🔬 Research</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="Capacity"
                      value={newFacility.capacity}
                      onChange={(e) => setNewFacility(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                      className="bg-gray-800/50 border-emerald-500/20 text-white"
                    />
                    <div className="flex space-x-2">
                      <Button 
                        onClick={handleAddFacility}
                        disabled={addFacilityMutation.isPending}
                        className="organic-button-primary flex-1"
                      >
                        {addFacilityMutation.isPending ? 'Adding...' : 'Add Facility'}
                      </Button>
                      <Button 
                        onClick={() => setShowAddForm(false)}
                        className="organic-button-secondary"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Facility Details */}
          <div className="lg:col-span-2">
            {selectedFacility ? (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="organic-card p-2 flex flex-wrap justify-center gap-2">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-4 py-2">
                    <Eye className="h-4 w-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="devices" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-4 py-2">
                    <Settings className="h-4 w-4 mr-2" />
                    Devices
                  </TabsTrigger>
                  <TabsTrigger value="metrics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-4 py-2">
                    <Activity className="h-4 w-4 mr-2" />
                    Live Metrics
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="organic-card">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-white">
                          <span className="text-2xl">{getFacilityIcon(selectedFacility.type)}</span>
                          <div>
                            <span>{selectedFacility.name}</span>
                            <p className="text-sm text-emerald-300 font-normal">{selectedFacility.location}</p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
                            <div className="text-sm text-green-300 mb-1">Towers</div>
                            <div className="text-2xl font-bold text-white">{selectedFacility.towerCount || 0}</div>
                          </div>
                          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4">
                            <div className="text-sm text-blue-300 mb-1">Devices</div>
                            <div className="text-2xl font-bold text-white">{selectedFacility.deviceCount || 0}</div>
                          </div>
                          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
                            <div className="text-sm text-purple-300 mb-1">Capacity</div>
                            <div className="text-2xl font-bold text-white">{selectedFacility.capacity}</div>
                          </div>
                          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4">
                            <div className="text-sm text-orange-300 mb-1">Efficiency</div>
                            <div className="text-2xl font-bold text-white">{selectedFacility.efficiency || 95}%</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="devices">
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="organic-card">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white">Facility Devices</CardTitle>
                          <div className="flex space-x-2">
                            <Button onClick={() => handleAddDevice('sensor')} className="organic-button-secondary text-xs">
                              <Thermometer className="h-3 w-3 mr-1" />
                              Add Sensor
                            </Button>
                            <Button onClick={() => handleAddDevice('pump')} className="organic-button-secondary text-xs">
                              <Droplets className="h-3 w-3 mr-1" />
                              Add Pump
                            </Button>
                            <Button onClick={() => handleAddDevice('light')} className="organic-button-secondary text-xs">
                              <Zap className="h-3 w-3 mr-1" />
                              Add Light
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {facilityDevices.length === 0 ? (
                          <div className="text-center py-8">
                            <Settings className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400 mb-4">No devices in this facility</p>
                            <p className="text-sm text-gray-500">Add devices to monitor and control this facility</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {facilityDevices.map((device: any) => (
                              <div key={device.id} className="p-4 bg-gray-800/50 border border-emerald-500/20 rounded-xl">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    {device.type === 'sensor' && <Thermometer className="h-4 w-4 text-blue-400" />}
                                    {device.type === 'pump' && <Droplets className="h-4 w-4 text-cyan-400" />}
                                    {device.type === 'light' && <Zap className="h-4 w-4 text-yellow-400" />}
                                    <span className="font-medium text-white text-sm">{device.name}</span>
                                  </div>
                                  <Badge className={getStatusColor(device.status)}>
                                    {device.status}
                                  </Badge>
                                </div>
                                <div className="text-xs text-gray-400">
                                  Type: {device.type} • ID: {device.id}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="metrics">
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="organic-card">
                      <CardHeader>
                        <CardTitle className="text-white">Live Facility Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
                            <div className="flex items-center space-x-2 mb-2">
                              <Thermometer className="h-5 w-5 text-green-400" />
                              <span className="text-green-300 font-medium">Temperature</span>
                            </div>
                            <div className="text-2xl font-bold text-white">{22.5 + Math.random() * 2}°C</div>
                            <div className="text-sm text-green-400">Optimal Range</div>
                          </div>
                          
                          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl">
                            <div className="flex items-center space-x-2 mb-2">
                              <Droplets className="h-5 w-5 text-blue-400" />
                              <span className="text-blue-300 font-medium">Humidity</span>
                            </div>
                            <div className="text-2xl font-bold text-white">{60 + Math.random() * 10}%</div>
                            <div className="text-sm text-blue-400">Within Range</div>
                          </div>
                          
                          <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl">
                            <div className="flex items-center space-x-2 mb-2">
                              <Zap className="h-5 w-5 text-yellow-400" />
                              <span className="text-yellow-300 font-medium">Power Usage</span>
                            </div>
                            <div className="text-2xl font-bold text-white">{450 + Math.random() * 50} kW</div>
                            <div className="text-sm text-yellow-400">Efficient</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </Tabs>
            ) : (
              <Card className="organic-card">
                <CardContent className="text-center py-12">
                  <Building2 className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Select a Facility</h3>
                  <p className="text-gray-400">Choose a facility from the list to view details and manage devices</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityManagement;