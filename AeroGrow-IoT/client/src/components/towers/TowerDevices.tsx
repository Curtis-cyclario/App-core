import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent,
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from '@/lib/queryClient';
import { 
  RefreshCw, 
  PlusCircle, 
  ArrowLeft,
  Server,
  Thermometer,
  Droplet,
  Lightbulb,
  Signal,
  Battery,
  Activity,
  Cpu
} from 'lucide-react';
import { TowerType, TowerDeviceType, DeviceBySectionType } from './types';

export interface TowerDevicesProps {
  towerId: number;
  onBack: () => void;
}

const TowerDevices: React.FC<TowerDevicesProps> = ({ towerId, onBack }) => {
  const [tower, setTower] = useState<TowerType | null>(null);
  const [devices, setDevices] = useState<TowerDeviceType[]>([]);
  const [devicesBySection, setDevicesBySection] = useState<DeviceBySectionType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: '',
    type: 'sensor',
    status: 'online',
    towerId: towerId,
    column: null as number | null,
    pod: null as number | null,
    ipAddress: '',
    macAddress: '',
    firmwareVersion: ''
  });

  // Fetch tower details
  const fetchTower = async () => {
    try {
      const response = await apiRequest('GET', `/api/towers/${towerId}`);
      const data = await response.json();
      setTower(data);
    } catch (error) {
      console.error('Failed to fetch tower details:', error);
    }
  };

  // Fetch devices for this tower
  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('GET', `/api/devices?towerId=${towerId}`);
      const data = await response.json();
      setDevices(data);
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTower();
    fetchDevices();
  }, [towerId]);

  // Organize devices by section (based on addressing type)
  useEffect(() => {
    if (!tower || !devices.length) {
      setDevicesBySection([]);
      return;
    }

    if (tower.addressingType === 'column') {
      // Group by column
      const columns: { [key: string]: TowerDeviceType[] } = {};
      
      // Initialize columns
      for (let i = 1; i <= tower.totalColumns; i++) {
        columns[`Column ${i}`] = [];
      }
      
      // Group devices by column
      devices.forEach(device => {
        if (device.column) {
          const sectionTitle = `Column ${device.column}`;
          if (!columns[sectionTitle]) {
            columns[sectionTitle] = [];
          }
          columns[sectionTitle].push(device);
        } else {
          if (!columns['Unassigned']) {
            columns['Unassigned'] = [];
          }
          columns['Unassigned'].push(device);
        }
      });
      
      // Convert to array format for rendering
      const sectionsArray: DeviceBySectionType[] = Object.keys(columns).map(title => ({
        sectionTitle: title,
        devices: columns[title]
      }));
      
      setDevicesBySection(sectionsArray);
    } else if (tower.addressingType === 'pod') {
      // Group by pod
      const pods: { [key: string]: TowerDeviceType[] } = {};
      
      // Initialize pods
      for (let i = 1; i <= tower.totalPods; i++) {
        pods[`Pod ${i}`] = [];
      }
      
      // Group devices by pod
      devices.forEach(device => {
        if (device.pod) {
          const sectionTitle = `Pod ${device.pod}`;
          if (!pods[sectionTitle]) {
            pods[sectionTitle] = [];
          }
          pods[sectionTitle].push(device);
        } else {
          if (!pods['Unassigned']) {
            pods['Unassigned'] = [];
          }
          pods['Unassigned'].push(device);
        }
      });
      
      // Convert to array format for rendering
      const sectionsArray: DeviceBySectionType[] = Object.keys(pods).map(title => ({
        sectionTitle: title,
        devices: pods[title]
      }));
      
      setDevicesBySection(sectionsArray);
    } else {
      // No addressing, just show all devices
      setDevicesBySection([
        {
          sectionTitle: 'All Devices',
          devices: devices
        }
      ]);
    }
  }, [tower, devices]);

  const handleAddDevice = async () => {
    try {
      const response = await apiRequest('POST', '/api/devices', newDevice);
      const data = await response.json();
      setDevices([...devices, data]);
      setIsAddDeviceOpen(false);
      setNewDevice({
        name: '',
        type: 'sensor',
        status: 'online',
        towerId: towerId,
        column: null,
        pod: null,
        ipAddress: '',
        macAddress: '',
        firmwareVersion: ''
      });
    } catch (error) {
      console.error('Failed to add device:', error);
    }
  };

  // Get icon for device type
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'hub':
        return <Server className="h-4 w-4" />;
      case 'sensor':
        return <Thermometer className="h-4 w-4" />;
      case 'pump':
        return <Droplet className="h-4 w-4" />;
      case 'light':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <Cpu className="h-4 w-4" />;
    }
  };

  // Device status indicator
  const DeviceStatus: React.FC<{ status: string }> = ({ status }) => {
    return (
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full mr-2 ${
          status === 'online' ? 'bg-green-500' : 
          status === 'offline' ? 'bg-red-500' : 
          status === 'maintenance' ? 'bg-yellow-500' : 
          'bg-gray-500'
        }`} />
        <span className="text-xs">{status}</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h2 className="text-xl font-semibold">
            {tower ? tower.name : 'Loading...'}
            {tower && <span className="text-sm font-normal ml-2 text-muted-foreground">({tower.type})</span>}
          </h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchDevices}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setIsAddDeviceOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Device
          </Button>
        </div>
      </div>

      {/* Tower info card */}
      {tower && (
        <Card className="bg-primary/5">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p>{tower.location || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Addressing</p>
                <p>{tower.addressingType} ({tower.addressingType === 'column' ? `${tower.totalColumns} columns` : tower.addressingType === 'pod' ? `${tower.totalPods} pods` : 'none'})</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Plants</p>
                <p>{tower.currentOccupancy} / {tower.plantCapacity}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant={tower.status === 'active' ? 'default' : tower.status === 'maintenance' ? 'secondary' : 'destructive'}>
                  {tower.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Devices by section */}
      {loading ? (
        <div className="text-center py-8">Loading devices...</div>
      ) : devices.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No devices assigned to this tower</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setIsAddDeviceOpen(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Your First Device
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {devicesBySection.map((section) => (
            <div key={section.sectionTitle}>
              <h3 className="text-md font-medium mb-3">{section.sectionTitle}</h3>
              {section.devices.length === 0 ? (
                <p className="text-sm text-muted-foreground">No devices in this section</p>
              ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {section.devices.map((device) => (
                    <Card key={device.id} className="hover:shadow-md transition-all">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            {getDeviceIcon(device.type)}
                            <CardTitle className="text-sm ml-2">{device.name}</CardTitle>
                          </div>
                          <DeviceStatus status={device.status} />
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div>
                            <span className="text-xs text-muted-foreground">Type</span>
                            <p className="capitalize">{device.type}</p>
                          </div>
                          {device.column && (
                            <div>
                              <span className="text-xs text-muted-foreground">Column</span>
                              <p>{device.column}</p>
                            </div>
                          )}
                          {device.pod && (
                            <div>
                              <span className="text-xs text-muted-foreground">Pod</span>
                              <p>{device.pod}</p>
                            </div>
                          )}
                          {device.ipAddress && (
                            <div>
                              <span className="text-xs text-muted-foreground">IP</span>
                              <p className="font-mono text-xs">{device.ipAddress}</p>
                            </div>
                          )}
                          {device.lastSeen && (
                            <div>
                              <span className="text-xs text-muted-foreground">Last Seen</span>
                              <p>{new Date(device.lastSeen).toLocaleString()}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Device Dialog */}
      <Dialog open={isAddDeviceOpen} onOpenChange={setIsAddDeviceOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Device</DialogTitle>
            <DialogDescription>
              Add a device to {tower?.name || 'this tower'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="deviceName" className="text-sm font-medium">Name</label>
                <Input
                  id="deviceName"
                  placeholder="Device name"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="deviceType" className="text-sm font-medium">Type</label>
                <Select 
                  value={newDevice.type} 
                  onValueChange={(value) => setNewDevice({ ...newDevice, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="sensor">
                        <div className="flex items-center">
                          <Thermometer className="mr-2 h-4 w-4" />
                          <span>Sensor</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="pump">
                        <div className="flex items-center">
                          <Droplet className="mr-2 h-4 w-4" />
                          <span>Pump</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="light">
                        <div className="flex items-center">
                          <Lightbulb className="mr-2 h-4 w-4" />
                          <span>Light</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="hub">
                        <div className="flex items-center">
                          <Server className="mr-2 h-4 w-4" />
                          <span>Hub</span>
                        </div>
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Addressing fields - show only if tower has addressing */}
            {tower?.addressingType !== 'none' && (
              <div className="grid grid-cols-2 gap-4">
                {tower?.addressingType === 'column' && (
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="column" className="text-sm font-medium">Column</label>
                    <Select 
                      value={newDevice.column?.toString() || ''} 
                      onValueChange={(value) => setNewDevice({ ...newDevice, column: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select column" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Array.from({ length: tower.totalColumns }, (_, i) => i + 1).map((col) => (
                            <SelectItem key={col} value={col.toString()}>
                              Column {col}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {(tower?.addressingType === 'pod' || (tower?.addressingType === 'column' && newDevice.column)) && (
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="pod" className="text-sm font-medium">Pod</label>
                    <Select 
                      value={newDevice.pod?.toString() || ''} 
                      onValueChange={(value) => setNewDevice({ ...newDevice, pod: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select pod" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Array.from({ length: tower.totalPods }, (_, i) => i + 1).map((pod) => (
                            <SelectItem key={pod} value={pod.toString()}>
                              Pod {pod}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="ipAddress" className="text-sm font-medium">IP Address</label>
                <Input
                  id="ipAddress"
                  placeholder="192.168.1.100"
                  value={newDevice.ipAddress}
                  onChange={(e) => setNewDevice({ ...newDevice, ipAddress: e.target.value })}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="macAddress" className="text-sm font-medium">MAC Address</label>
                <Input
                  id="macAddress"
                  placeholder="00:1B:44:11:3A:B7"
                  value={newDevice.macAddress}
                  onChange={(e) => setNewDevice({ ...newDevice, macAddress: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="firmwareVersion" className="text-sm font-medium">Firmware Version</label>
              <Input
                id="firmwareVersion"
                placeholder="v1.0.0"
                value={newDevice.firmwareVersion}
                onChange={(e) => setNewDevice({ ...newDevice, firmwareVersion: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDeviceOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleAddDevice}
              disabled={!newDevice.name}
            >
              Add Device
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TowerDevices;