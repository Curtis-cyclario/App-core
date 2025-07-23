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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Device, Tower, NetworkData } from '@/types';
import { apiRequest } from '@/lib/queryClient';
import { 
  AlertCircle,
  AlertTriangle,
  Battery,
  Camera,
  CheckCircle,
  ChevronRight,
  Cpu,
  Droplet, 
  Download,
  FileSpreadsheet,
  FileDown,
  Filter,
  Fingerprint,
  FolderInput,
  Info,
  Lightbulb,
  LucideIcon,
  MoveHorizontal,
  Network,
  PlusCircle, 
  QrCode,
  RefreshCw, 
  Search,
  Server,
  Settings,
  Sprout,
  Thermometer,
  Trash2,
  Wallet,
  Zap,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import TowerList from '@/components/towers/TowerList';
import TowerDevices from '@/components/towers/TowerDevices';
import EnhancedNetworkTopology from '@/components/network/EnhancedNetworkTopology';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const DeviceManagement = () => {
  const [view, setView] = useState<'devices' | 'towers' | 'tower-details'>('towers');
  const [selectedTowerId, setSelectedTowerId] = useState<number | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [unassignedDevices, setUnassignedDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUnassigned, setShowUnassigned] = useState(false);
  const [isBulkAssignOpen, setIsBulkAssignOpen] = useState(false);
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: '',
    type: 'sensor',
    status: 'offline',
    location: ''
  });

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('GET', '/api/devices');
      const data = await response.json();
      setDevices(data);
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // Fetch unassigned devices (devices without a tower)
  const fetchUnassignedDevices = async () => {
    try {
      const response = await apiRequest('GET', '/api/devices');
      const data = await response.json();
      setUnassignedDevices(data.filter((device: Device) => !device.towerId));
    } catch (error) {
      console.error('Failed to fetch unassigned devices:', error);
    }
  };

  useEffect(() => {
    fetchUnassignedDevices();
  }, [devices]);

  // States for towers
  const [towers, setTowers] = useState<Tower[]>([]);
  const [loadingTowers, setLoadingTowers] = useState<boolean>(true);

  // Fetch towers
  const fetchTowers = async () => {
    try {
      setLoadingTowers(true);
      const response = await apiRequest('GET', '/api/towers');
      const data = await response.json();
      setTowers(data);
    } catch (error) {
      console.error('Failed to fetch towers:', error);
    } finally {
      setLoadingTowers(false);
    }
  };

  useEffect(() => {
    fetchTowers();
  }, []);

  // Filter devices based on tab and search query
  const filteredDevices = devices.filter(device => {
    const matchesTab = activeTab === 'all' || device.type === activeTab;
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        device.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const showDevice = showUnassigned ? true : (device.towerId !== null && device.towerId !== undefined);
    return matchesTab && matchesSearch && showDevice;
  });

  const handleAddDevice = async () => {
    try {
      await apiRequest('POST', '/api/devices', newDevice);
      setIsAddDeviceOpen(false);
      setNewDevice({
        name: '',
        type: 'sensor',
        status: 'offline',
        location: ''
      });
      fetchDevices();
    } catch (error) {
      console.error('Failed to add device:', error);
    }
  };

  const handleSelectTower = (towerId: number) => {
    setSelectedTowerId(towerId);
    setView('tower-details');
  };

  const handleBackToTowers = () => {
    setView('towers');
    setSelectedTowerId(null);
  };

  // Get the correct icon for each device type
  const getDeviceIcon = (type: string) => {
    switch(type) {
      case 'hub':
        return <Server className="h-5 w-5 text-primary" />;
      case 'light':
        return <Lightbulb className="h-5 w-5 text-yellow-500" />;
      case 'pump':
        return <Droplet className="h-5 w-5 text-blue-500" />;
      case 'sensor':
        return <Thermometer className="h-5 w-5 text-indigo-500" />;
      default:
        return <Zap className="h-5 w-5 text-gray-500" />;
    }
  };

  // State for bulk assignment
  const [selectedDevices, setSelectedDevices] = useState<{[key: number]: boolean}>({});
  const [targetTowerId, setTargetTowerId] = useState<number | null>(null);
  const [targetSection, setTargetSection] = useState<number | null>(null);
  const [sectionType, setSectionType] = useState<'column' | 'pod'>('column');
  const [selectedTower, setSelectedTower] = useState<Tower | null>(null);

  // Handle bulk device assignment
  const handleBulkAssign = async () => {
    const deviceIds = Object.keys(selectedDevices)
      .filter(id => selectedDevices[parseInt(id)])
      .map(id => parseInt(id));
    
    if (deviceIds.length === 0 || !targetTowerId) {
      return;
    }

    try {
      const updates = deviceIds.map(id => ({
        id,
        towerId: targetTowerId,
        [sectionType]: targetSection
      }));

      for (const update of updates) {
        await apiRequest('PATCH', `/api/devices/${update.id}`, update);
      }

      setIsBulkAssignOpen(false);
      setSelectedDevices({});
      setTargetTowerId(null);
      setTargetSection(null);
      fetchDevices();
    } catch (error) {
      console.error('Failed to assign devices:', error);
    }
  };

  // Update selected tower info when target tower changes
  useEffect(() => {
    if (targetTowerId) {
      const tower = towers.find(t => t.id === targetTowerId);
      setSelectedTower(tower || null);
      setSectionType(tower?.addressingType === 'pod' ? 'pod' : 'column');
      setTargetSection(null);
    } else {
      setSelectedTower(null);
    }
  }, [targetTowerId, towers]);
  
  // Network topology integration
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [showTopology, setShowTopology] = useState(false);

  // Fetch network topology data
  const fetchNetworkData = async () => {
    try {
      const response = await apiRequest('GET', '/api/network');
      const data = await response.json();
      setNetworkData(data);
    } catch (error) {
      console.error('Failed to fetch network data:', error);
    }
  };

  useEffect(() => {
    fetchNetworkData();
  }, []);

  // Export functions
  const exportToPDF = () => {
    try {
      // Use a simpler approach to create PDF since autoTable is having issues
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('VertiGrow Device Management Report', 14, 22);
      doc.setFontSize(12);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
      
      // Tower section
      doc.setFontSize(16);
      doc.text('Tower Summary', 14, 45);
      
      let yPos = 60;
      
      // Create tower section manually
      doc.setFontSize(10);
      towers.forEach((tower, index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFillColor(240, 240, 240);
        doc.rect(14, yPos-5, 180, 25, 'F');
        doc.setTextColor(0, 0, 0);
        
        doc.setFontSize(12);
        doc.text(`Tower ${tower.id}: ${tower.name}`, 16, yPos);
        doc.setFontSize(10);
        doc.text(`Type: ${tower.type} | Status: ${tower.status}`, 16, yPos + 8);
        doc.text(`Plant: ${tower.plantType || 'N/A'} | Crop: ${tower.currentCrop || 'N/A'}`, 16, yPos + 15);
        
        yPos += 30;
      });
      
      // Device section
      yPos += 10;
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(16);
      doc.text('Device Inventory', 14, yPos);
      yPos += 15;
      
      // Create device section manually
      doc.setFontSize(10);
      devices.forEach((device, index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        
        // Alternate background colors
        if (index % 2 === 0) {
          doc.setFillColor(245, 247, 250);
        } else {
          doc.setFillColor(255, 255, 255);
        }
        doc.rect(14, yPos-5, 180, 20, 'F');
        
        const towerName = device.towerId 
          ? towers.find(t => t.id === device.towerId)?.name || 'N/A' 
          : 'Unassigned';
        
        doc.setFontSize(11);
        doc.text(`Device ${device.id}: ${device.name}`, 16, yPos);
        doc.setFontSize(9);
        doc.text(`Type: ${device.type} | Status: ${device.status} | Tower: ${towerName}`, 16, yPos + 8);
        
        yPos += 20;
      });
      
      // Network Map summary
      if (networkData) {
        yPos += 10;
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFontSize(16);
        doc.text('Network Overview', 14, yPos);
        yPos += 15;
        
        doc.setFontSize(10);
        doc.text(`Total Nodes: ${networkData.nodes.length}`, 16, yPos);
        yPos += 8;
        doc.text(`Total Connections: ${networkData.connections.length}`, 16, yPos);
        yPos += 8;
        
        // Count online/offline nodes
        const onlineNodes = networkData.nodes.filter(n => n.status === 'online').length;
        const offlineNodes = networkData.nodes.length - onlineNodes;
        
        doc.text(`Online Nodes: ${onlineNodes}`, 16, yPos);
        yPos += 8;
        doc.text(`Offline/Warning Nodes: ${offlineNodes}`, 16, yPos);
      }
      
      // Add footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${pageCount} - VertiGrow IoT Platform - ${new Date().toLocaleDateString()}`, 14, 290);
      }
      
      // Save the PDF
      doc.save('VertiGrow-Network-Report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report. Please try again.');
    }
  };
  
  const exportToCSV = () => {
    // Create tower CSV
    let towerCSV = 'ID,Name,Type,Status,Plant Type,Current Crop\n';
    towers.forEach(tower => {
      towerCSV += `${tower.id},"${tower.name}","${tower.type}","${tower.status}","${tower.plantType || 'N/A'}","${tower.currentCrop || 'N/A'}"\n`;
    });
    
    // Create device CSV
    let deviceCSV = 'ID,Name,Type,Status,Assigned Tower\n';
    devices.forEach(device => {
      const towerName = device.towerId ? towers.find(t => t.id === device.towerId)?.name || 'N/A' : 'Unassigned';
      deviceCSV += `${device.id},"${device.name}","${device.type}","${device.status}","${towerName}"\n`;
    });
    
    // Create download links
    const towerBlob = new Blob([towerCSV], { type: 'text/csv' });
    const deviceBlob = new Blob([deviceCSV], { type: 'text/csv' });
    
    const towerURL = URL.createObjectURL(towerBlob);
    const deviceURL = URL.createObjectURL(deviceBlob);
    
    // Create and click download link for towers
    const towerLink = document.createElement('a');
    towerLink.href = towerURL;
    towerLink.download = 'VertiGrow-Towers.csv';
    document.body.appendChild(towerLink);
    towerLink.click();
    
    // Create and click download link for devices
    setTimeout(() => {
      const deviceLink = document.createElement('a');
      deviceLink.href = deviceURL;
      deviceLink.download = 'VertiGrow-Devices.csv';
      document.body.appendChild(deviceLink);
      deviceLink.click();
      
      // Clean up
      URL.revokeObjectURL(towerURL);
      URL.revokeObjectURL(deviceURL);
      document.body.removeChild(towerLink);
      document.body.removeChild(deviceLink);
    }, 100);
  };
  
  // Camera and scanner function
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  
  const handleCameraScan = () => {
    setIsCameraActive(true);
    // In a real implementation, this would access the device camera
    // For demo purposes, we'll simulate a successful scan after a delay
    setTimeout(() => {
      setScanResult('Plant identified: Basil (Ocimum basilicum)\nHealth: 92%\nGrowth stage: Mature\nRecommended action: Harvest ready in 2 days');
      setIsCameraActive(false);
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-900 relative overflow-hidden">
      <div className="container mx-auto px-4 py-8 relative z-10 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Device Management</h1>
        
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchDevices} className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsAddDeviceOpen(true)} className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Device
            </Button>
          </div>
        </div>
      
      {/* Action buttons for reports, camera and blockchain */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Export */}
        <Card className="organic-card border-blue-500/20 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium mb-1 text-white">Export Data</h3>
                <p className="text-sm text-blue-200">Generate reports and export device data</p>
              </div>
              <FileDown className="h-6 w-6 text-blue-400" />
            </div>
            <div className="flex mt-4 gap-2">
              <Button size="sm" variant="outline" onClick={exportToPDF} className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10">
                <FileDown className="h-4 w-4 mr-1" />
                PDF Report
              </Button>
              <Button size="sm" variant="outline" onClick={exportToCSV} className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10">
                <FileSpreadsheet className="h-4 w-4 mr-1" />
                CSV Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Camera and Computer Vision */}
        <Card className="organic-card border-green-500/20 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium mb-1 text-white">Plant Scanner</h3>
                <p className="text-sm text-green-200">Analyze plants using computer vision</p>
              </div>
              <Camera className="h-6 w-6 text-green-400" />
            </div>
            <div className="flex mt-4">
              <Button 
                size="sm" 
                variant={isCameraActive ? "default" : "outline"}
                onClick={handleCameraScan}
                disabled={isCameraActive}
                className="w-full"
              >
                {isCameraActive ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <QrCode className="h-4 w-4 mr-1" />
                    Scan Plant
                  </>
                )}
              </Button>
            </div>
            {scanResult && (
              <div className="mt-2 text-xs bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-200 dark:border-green-900">
                <p className="font-medium text-sm text-green-800 dark:text-green-400 mb-1">Scan Result:</p>
                <p className="whitespace-pre-line text-green-700 dark:text-green-300">{scanResult}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Blockchain Integration */}
        <Card className="bg-white/50 dark:bg-gray-900/50 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium mb-1">Crop Tokenization</h3>
                <p className="text-sm text-muted-foreground">Prepare crop data for blockchain</p>
              </div>
              <Wallet className="h-6 w-6 text-purple-500" />
            </div>
            <div className="flex mt-2 flex-col gap-2">
              {/* Tower & crop selection */}
              <div className="grid grid-cols-2 gap-2">
                <Select defaultValue="tower1">
                  <SelectTrigger className="text-xs h-8">
                    <SelectValue placeholder="Select tower" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tower1">Tower 1</SelectItem>
                    <SelectItem value="tower2">Tower 2</SelectItem>
                    <SelectItem value="tower3">Tower 3</SelectItem>
                    <SelectItem value="tower4">Tower 4</SelectItem>
                    <SelectItem value="tower5">Tower 5</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select defaultValue="basil">
                  <SelectTrigger className="text-xs h-8">
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basil">Basil</SelectItem>
                    <SelectItem value="spinach">Spinach</SelectItem>
                    <SelectItem value="lettuce">Lettuce</SelectItem>
                    <SelectItem value="kale">Kale</SelectItem>
                    <SelectItem value="arugula">Arugula</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Crop data summary */}
              <div className="mt-1 bg-slate-50 dark:bg-slate-900/40 p-2 rounded border border-slate-200 dark:border-slate-800 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Growth Cycle:</span>
                  <span className="font-medium">42 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Yield Estimate:</span>
                  <span className="font-medium">2.3 kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Water Used:</span>
                  <span className="font-medium">12.7 L</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Energy Used:</span>
                  <span className="font-medium">5.8 kWh</span>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    alert('Viewing detailed crop growth logs and sensor data... (Demo only)');
                  }}
                >
                  <Sprout className="h-4 w-4 mr-1" />
                  View Crop Data
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    alert('Preparing data for blockchain integration... (Demo only)');
                  }}
                >
                  <Cpu className="h-4 w-4 mr-1" />
                  Prepare Data
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    alert('Verifying origin and growth conditions... (Demo only)');
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Verify Origin
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    alert('Generating crop token on blockchain... (Demo only)');
                  }}
                >
                  <Wallet className="h-4 w-4 mr-1" />
                  Mint Token
                </Button>
              </div>
              
              {/* Previous token info */}
              <div className="text-xs bg-purple-50 dark:bg-purple-900/20 p-2 rounded border border-purple-200 dark:border-purple-900 mt-1">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-xs text-purple-800 dark:text-purple-400">Previous Token:</p>
                  <Badge variant="outline" className="h-5 text-xs">Verified</Badge>
                </div>
                <p className="text-purple-700 dark:text-purple-300 truncate">0xf7e3b...4a91</p>
                <div className="flex justify-between text-xs mt-1 text-purple-600 dark:text-purple-300">
                  <span>Basil #42 (Tower 3)</span>
                  <span>05/08/2025</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full mb-6">
        <TabsList className="w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="all" className="text-xs sm:text-sm h-8">All Devices</TabsTrigger>
          <TabsTrigger value="hubs" className="text-xs sm:text-sm h-8">Hubs</TabsTrigger>
          <TabsTrigger value="lights" className="text-xs sm:text-sm h-8">Lights</TabsTrigger>
          <TabsTrigger value="pumps" className="text-xs sm:text-sm h-8">Pumps</TabsTrigger>
          <TabsTrigger value="sensors" className="text-xs sm:text-sm h-8">Sensors</TabsTrigger>
          <TabsTrigger value="towers" className="text-xs sm:text-sm h-8">Towers</TabsTrigger>
          <TabsTrigger value="network" className="text-xs sm:text-sm h-8">Network</TabsTrigger>
          {selectedTowerId && <TabsTrigger value="tower-details" className="text-xs sm:text-sm h-8">Current Tower</TabsTrigger>}
        </TabsList>
        
        {/* Search & filter bar */}
        <div className="my-4 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search devices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Select defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="hub">Hubs</SelectItem>
                <SelectItem value="sensor">Sensors</SelectItem>
                <SelectItem value="pump">Pumps</SelectItem>
                <SelectItem value="light">Lights</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-1 ml-2">
              <Switch
                id="show-unassigned"
                checked={showUnassigned}
                onCheckedChange={setShowUnassigned}
              />
              <Label htmlFor="show-unassigned" className="cursor-pointer text-sm">
                Show Unassigned
              </Label>
            </div>
            
            {unassignedDevices.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsBulkAssignOpen(true)}
                className="ml-2"
              >
                <FolderInput className="h-4 w-4 mr-2" />
                Bulk Assign
              </Button>
            )}
          </div>
        </div>
        
        <TabsContent value="all" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">All Devices & Towers</h2>
          </div>
          
          {/* Growing Towers section */}
          {!loadingTowers && towers.length > 0 && (
            <>
              <h3 className="text-lg font-medium mb-3 mt-6">Growing Towers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {towers.map((tower) => (
                  <Card key={`tower-${tower.id}`} className="overflow-hidden hover:shadow-md transition-shadow border-green-500/20">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <Sprout className="h-5 w-5 text-green-500" />
                          <CardTitle className="ml-2 text-lg font-medium">{tower.name}</CardTitle>
                        </div>
                        <Badge variant={tower.status === 'active' ? 'default' : tower.status === 'maintenance' ? 'secondary' : 'destructive'}>
                          {tower.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 pt-0 pb-4">
                      <div className="text-sm grid gap-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium capitalize">{tower.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Location:</span>
                          <span className="font-medium">{tower.location || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Plants:</span>
                          <span className="font-medium">{tower.currentOccupancy} / {tower.plantCapacity}</span>
                        </div>
                        <div className="flex justify-end mt-2">
                          <Button 
                            variant="link" 
                            className="h-auto p-0 text-primary"
                            onClick={() => handleSelectTower(tower.id)}
                          >
                            View Tower Devices <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
          
          {/* Regular Devices section */}
          <h3 className="text-lg font-medium mb-3">Connected Devices</h3>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading devices...</p>
            </div>
          ) : filteredDevices.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <p className="text-gray-500 mb-4">No devices found</p>
                <Button onClick={() => setIsAddDeviceOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Device
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDevices.map((device) => (
                <Card key={`device-${device.id}`} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2 pt-4 px-4">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        {getDeviceIcon(device.type)}
                        <CardTitle className="ml-2 text-lg font-medium">{device.name}</CardTitle>
                      </div>
                      <Badge variant={device.status === 'online' ? 'default' : 'destructive'}>
                        {device.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pt-0 pb-4">
                    <div className="text-sm grid gap-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium capitalize">{device.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">{device.location || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Seen:</span>
                        <span className="font-medium">
                          {device.lastSeen 
                            ? new Date(device.lastSeen).toLocaleString() 
                            : 'Never'
                          }
                        </span>
                      </div>
                      {device.towerId && (
                        <div className="flex justify-between mt-2">
                          <span className="text-muted-foreground">Tower:</span>
                          <Button 
                            variant="link" 
                            className="h-auto p-0 text-primary"
                            onClick={() => device.towerId && handleSelectTower(device.towerId)}
                          >
                            View Tower
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="hubs" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Hub Devices</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {devices.filter(d => d.type === 'hub').map((device) => (
              <Card key={device.id} className="overflow-hidden hover:shadow-md transition-shadow border-primary/20">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Server className="h-5 w-5 text-primary" />
                      <CardTitle className="ml-2 text-lg font-medium">{device.name}</CardTitle>
                    </div>
                    <Badge variant={device.status === 'online' ? 'default' : 'destructive'}>
                      {device.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pt-0 pb-4">
                  <div className="text-sm grid gap-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium">{device.location || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IP Address:</span>
                      <span className="font-medium">{device.ipAddress || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Seen:</span>
                      <span className="font-medium">
                        {device.lastSeen 
                          ? new Date(device.lastSeen).toLocaleString() 
                          : 'Never'
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="lights" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Light Devices</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {devices.filter(d => d.type === 'light').map((device) => (
              <Card key={device.id} className="overflow-hidden hover:shadow-md transition-shadow border-yellow-500/20">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      <CardTitle className="ml-2 text-lg font-medium">{device.name}</CardTitle>
                    </div>
                    <Badge variant={device.status === 'online' ? 'default' : 'destructive'}>
                      {device.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pt-0 pb-4">
                  <div className="text-sm grid gap-1">
                    {device.towerId && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tower:</span>
                        <Button 
                          variant="link" 
                          className="h-auto p-0 text-primary"
                          onClick={() => handleSelectTower(device.towerId!)}
                        >
                          View Tower
                        </Button>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Seen:</span>
                      <span className="font-medium">
                        {device.lastSeen 
                          ? new Date(device.lastSeen).toLocaleString() 
                          : 'Never'
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="pumps" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Pump Devices</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {devices.filter(d => d.type === 'pump').map((device) => (
              <Card key={device.id} className="overflow-hidden hover:shadow-md transition-shadow border-blue-500/20">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Droplet className="h-5 w-5 text-blue-500" />
                      <CardTitle className="ml-2 text-lg font-medium">{device.name}</CardTitle>
                    </div>
                    <Badge variant={device.status === 'online' ? 'default' : 'destructive'}>
                      {device.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pt-0 pb-4">
                  <div className="text-sm grid gap-1">
                    {device.towerId && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tower:</span>
                        <Button 
                          variant="link" 
                          className="h-auto p-0 text-primary"
                          onClick={() => handleSelectTower(device.towerId!)}
                        >
                          View Tower
                        </Button>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Seen:</span>
                      <span className="font-medium">
                        {device.lastSeen 
                          ? new Date(device.lastSeen).toLocaleString() 
                          : 'Never'
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="sensors" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Sensor Devices</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {devices.filter(d => d.type === 'sensor').map((device) => (
              <Card key={device.id} className="overflow-hidden hover:shadow-md transition-shadow border-indigo-500/20">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Thermometer className="h-5 w-5 text-indigo-500" />
                      <CardTitle className="ml-2 text-lg font-medium">{device.name}</CardTitle>
                    </div>
                    <Badge variant={device.status === 'online' ? 'default' : 'destructive'}>
                      {device.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pt-0 pb-4">
                  <div className="text-sm grid gap-1">
                    {device.towerId && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tower:</span>
                        <Button 
                          variant="link" 
                          className="h-auto p-0 text-primary"
                          onClick={() => handleSelectTower(device.towerId!)}
                        >
                          View Tower
                        </Button>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Seen:</span>
                      <span className="font-medium">
                        {device.lastSeen 
                          ? new Date(device.lastSeen).toLocaleString() 
                          : 'Never'
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="towers" className="mt-6">
          <TowerList onSelectTower={handleSelectTower} />
        </TabsContent>
        
        <TabsContent value="network" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Network Topology</h2>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center mr-2">
                <div className="w-[130px]">
                  <Select defaultValue="all">
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="View" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Devices</SelectItem>
                      <SelectItem value="towers">Towers Only</SelectItem>
                      <SelectItem value="sensors">Sensors Only</SelectItem>
                      <SelectItem value="critical">Critical Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => {
                // Refresh network data
                fetchNetworkData();
              }}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
          
          <Card className="overflow-hidden mb-6">
            <CardContent className="p-6">
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-4 border border-gray-200 dark:border-gray-800 relative">
                <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                  <Badge variant="outline" className="bg-white/90 dark:bg-gray-800/90">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div> Online
                  </Badge>
                  <Badge variant="outline" className="bg-white/90 dark:bg-gray-800/90">
                    <div className="h-2 w-2 rounded-full bg-red-500 mr-1"></div> Offline
                  </Badge>
                  <Badge variant="outline" className="bg-white/90 dark:bg-gray-800/90">
                    <div className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></div> Warning
                  </Badge>
                </div>
                
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <div className="flex items-center bg-white/90 dark:bg-gray-800/90 rounded-full">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-l-full" title="Zoom In">
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 " title="Zoom Out">
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-r-full" title="Reset View">
                      <MoveHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Network visualization using real data */}
                <div className="h-[600px] w-full relative flex items-center justify-center overflow-hidden"
                  style={{ touchAction: 'none' }} // Required for proper touch handling
                >
                  {networkData && networkData.nodes ? (
                    <>
                      {/* Connection lines */}
                      <svg className="absolute inset-0 w-full h-full z-0" style={{ pointerEvents: 'none' }}>
                        {networkData.connections.map((connection, index) => {
                          const source = networkData.nodes.find(n => n.id === connection.source);
                          const target = networkData.nodes.find(n => n.id === connection.target);
                          
                          if (!source || !target) return null;
                          
                          // Calculate percentages for positions
                          const sourceX = (source.x / 720) * 100;
                          const sourceY = (source.y / 600) * 100;
                          const targetX = (target.x / 720) * 100;
                          const targetY = (target.y / 600) * 100;
                          
                          // Determine line style based on connection status
                          let strokeColor = "rgba(59, 130, 246, 0.5)"; // Default blue
                          let strokeDash = "";
                          
                          if (connection.status === "warning") {
                            strokeColor = "rgba(234, 179, 8, 0.5)"; // Yellow for warning
                            strokeDash = "5,5";
                          } else if (connection.status === "offline") {
                            strokeColor = "rgba(220, 38, 38, 0.5)"; // Red for offline
                            strokeDash = "2,2";
                          }
                          
                          return (
                            <line 
                              key={`connection-${index}`}
                              x1={`${sourceX}%`} 
                              y1={`${sourceY}%`} 
                              x2={`${targetX}%`} 
                              y2={`${targetY}%`} 
                              stroke={strokeColor} 
                              strokeWidth="2"
                              strokeDasharray={strokeDash}
                            />
                          );
                        })}
                      </svg>
                      
                      {/* Node elements */}
                      {networkData.nodes.map(node => {
                        // Calculate position as percentage of container
                        const posX = (node.x / 720) * 100;
                        const posY = (node.y / 600) * 100;
                        
                        // Determine node styling based on type and status
                        let bgColor = "bg-blue-100 dark:bg-blue-900/30";
                        let borderColor = "border-blue-500";
                        let textColor = "text-blue-600 dark:text-blue-400";
                        let nodeSize = "h-12 w-12";
                        let iconSize = "h-5 w-5";
                        let NodeIcon = Server;
                        
                        if (node.type === "hub" || node.type === "controller") {
                          NodeIcon = Cpu;
                        } else if (node.type === "pump") {
                          NodeIcon = Droplet;
                          bgColor = "bg-blue-100 dark:bg-blue-900/30";
                          borderColor = "border-blue-500";
                          textColor = "text-blue-600 dark:text-blue-400";
                        } else if (node.type === "light") {
                          NodeIcon = Lightbulb;
                          bgColor = "bg-yellow-100 dark:bg-yellow-900/30";
                          borderColor = "border-yellow-500";
                          textColor = "text-yellow-600 dark:text-yellow-400";
                        } else if (node.type === "sensor") {
                          NodeIcon = Thermometer;
                          bgColor = "bg-indigo-100 dark:bg-indigo-900/30";
                          borderColor = "border-indigo-500";
                          textColor = "text-indigo-600 dark:text-indigo-400";
                          nodeSize = "h-10 w-10";
                          iconSize = "h-4 w-4";
                        } else if (node.type.includes("tower")) {
                          NodeIcon = Sprout;
                          bgColor = "bg-green-100 dark:bg-green-900/30";
                          borderColor = "border-green-500";
                          textColor = "text-green-600 dark:text-green-400";
                          nodeSize = "h-16 w-16";
                          iconSize = "h-6 w-6";
                        } else if (node.type === "server" || node.type === "storage") {
                          NodeIcon = Server;
                        }
                        
                        // Status-based styling
                        if (node.status === "offline") {
                          borderColor = "border-red-500";
                          bgColor = "bg-red-50 dark:bg-red-900/20";
                        } else if (node.status === "warning") {
                          borderColor = "border-yellow-500";
                          bgColor = "bg-yellow-50 dark:bg-yellow-900/20";
                        }
                        
                        return (
                          <div 
                            key={node.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2"
                            style={{ 
                              left: `${posX}%`, 
                              top: `${posY}%`,
                              // Offset overlapping nodes
                              transform: `translate(-50%, -50%) translateX(${node.id.charCodeAt(0) % 5 - 2}px) translateY(${node.id.charCodeAt(1) % 5 - 2}px)`,
                              zIndex: node.type.includes("tower") ? 5 : node.type === "hub" ? 4 : 3,
                              transition: "all 0.3s ease-out"
                            }}
                          >
                            <div className={`${nodeSize} rounded-full ${bgColor} border-2 ${borderColor} 
                              flex items-center justify-center shadow-md hover:shadow-lg
                              transition-all duration-200 cursor-pointer
                              hover:scale-110`}
                              onClick={() => {
                                if (node.type.includes("tower")) {
                                  // Find matching tower and open it
                                  const matchingTower = towers.find(t => t.name.toLowerCase().includes(node.name.toLowerCase()));
                                  if (matchingTower) {
                                    handleSelectTower(matchingTower.id);
                                  }
                                } else {
                                  // Show device details
                                  alert(`Device: ${node.name}\nType: ${node.type}\nStatus: ${node.status}`);
                                }
                              }}
                            >
                              <NodeIcon className={`${iconSize} ${textColor}`} />
                            </div>
                            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap
                                            bg-white/80 dark:bg-gray-800/80 px-1.5 py-0.5 rounded shadow-sm">
                              {node.name}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p>Loading network topology...</p>
                    </div>
                  )}
                  
                  {/* Touch/drag instructions */}
                  <div className="absolute bottom-4 right-4 text-xs text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded">
                    <div className="flex items-center gap-1">
                      <Fingerprint className="h-3 w-3" />
                      <span>Drag to pan, pinch to zoom</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-base font-semibold">Connection Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {networkData && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Nodes:</span>
                        <span className="font-medium">{networkData.nodes.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Connections:</span>
                        <span className="font-medium">{networkData.connections.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Healthy Connections:</span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {networkData.connections.filter(c => c.status === 'online').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Warning Connections:</span>
                        <span className="font-medium text-yellow-600 dark:text-yellow-400">
                          {networkData.connections.filter(c => c.status === 'warning').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Failed Connections:</span>
                        <span className="font-medium text-red-600 dark:text-red-400">
                          {networkData.connections.filter(c => c.status === 'offline').length}
                        </span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Network Uptime:</span>
                        <span className="font-medium">99.7%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Avg Response Time:</span>
                        <span className="font-medium">42ms</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-base font-semibold">Recent Events</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border-t">
                  <div className="py-3 px-4 border-b flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Tower D Connectivity Warning</p>
                      <p className="text-xs text-muted-foreground">Signal strength degraded to 62%</p>
                      <p className="text-xs text-muted-foreground mt-1">12 minutes ago</p>
                    </div>
                  </div>
                  <div className="py-3 px-4 border-b flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">New Sensor Connected</p>
                      <p className="text-xs text-muted-foreground">pH Sensor added to Tower B</p>
                      <p className="text-xs text-muted-foreground mt-1">43 minutes ago</p>
                    </div>
                  </div>
                  <div className="py-3 px-4 border-b flex items-start gap-3">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Connection Lost</p>
                      <p className="text-xs text-muted-foreground">Water Level Sensor in Tower C</p>
                      <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                    </div>
                  </div>
                  <div className="py-3 px-4 flex items-start gap-3">
                    <RefreshCw className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Network Topology Updated</p>
                      <p className="text-xs text-muted-foreground">Added redundant connection path</p>
                      <p className="text-xs text-muted-foreground mt-1">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tower-details" className="mt-6">
          {selectedTowerId && (
            <TowerDevices 
              towerId={selectedTowerId} 
              onBack={handleBackToTowers} 
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Add Device Dialog */}
      <Dialog open={isAddDeviceOpen} onOpenChange={setIsAddDeviceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Device</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new device to the system.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input
                id="name"
                value={newDevice.name}
                onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                placeholder="Enter device name"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="type" className="text-sm font-medium">Type</label>
              <Select
                value={newDevice.type}
                onValueChange={(value) => setNewDevice({ ...newDevice, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hub">Hub</SelectItem>
                  <SelectItem value="sensor">Sensor</SelectItem>
                  <SelectItem value="pump">Pump</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="status" className="text-sm font-medium">Status</label>
              <Select
                value={newDevice.status}
                onValueChange={(value) => setNewDevice({ ...newDevice, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="location" className="text-sm font-medium">Location</label>
              <Input
                id="location"
                value={newDevice.location}
                onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
                placeholder="Device location"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDeviceOpen(false)}>Cancel</Button>
            <Button onClick={handleAddDevice} disabled={!newDevice.name}>Add Device</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Bulk Assign Dialog */}
      <Dialog open={isBulkAssignOpen} onOpenChange={setIsBulkAssignOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Bulk Assign Devices</DialogTitle>
            <DialogDescription>
              Assign multiple unassigned devices to a tower at once.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            {/* Tower Selection */}
            <div className="grid gap-2">
              <Label htmlFor="tower">Select Target Tower</Label>
              <Select 
                value={targetTowerId?.toString() || ''} 
                onValueChange={(value) => setTargetTowerId(value ? parseInt(value) : null)}
              >
                <SelectTrigger id="tower">
                  <SelectValue placeholder="Select a tower" />
                </SelectTrigger>
                <SelectContent>
                  {towers.map((tower) => (
                    <SelectItem key={tower.id} value={tower.id.toString()}>
                      {tower.name} ({tower.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Section Selection - Only show if tower is selected and has addressing */}
            {selectedTower && selectedTower.addressingType !== 'none' && (
              <div className="grid gap-2">
                <Label htmlFor="section">
                  Select {selectedTower.addressingType === 'pod' ? 'Pod' : 'Column'}
                </Label>
                <Select 
                  value={targetSection?.toString() || ''} 
                  onValueChange={(value) => setTargetSection(value ? parseInt(value) : null)}
                >
                  <SelectTrigger id="section">
                    <SelectValue placeholder={`Select a ${selectedTower.addressingType}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(
                      { length: selectedTower.addressingType === 'pod' 
                        ? selectedTower.totalPods 
                        : selectedTower.totalColumns 
                      }, 
                      (_, i) => i + 1
                    ).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {selectedTower.addressingType === 'pod' ? 'Pod' : 'Column'} {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Device List */}
            <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto">
              <h3 className="font-medium mb-2">Unassigned Devices</h3>
              {unassignedDevices.length === 0 ? (
                <p className="text-sm text-muted-foreground">No unassigned devices found</p>
              ) : (
                <div className="space-y-2">
                  {unassignedDevices.map((device) => (
                    <div key={device.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`device-${device.id}`} 
                        checked={!!selectedDevices[device.id]} 
                        onCheckedChange={(checked) => {
                          setSelectedDevices({
                            ...selectedDevices,
                            [device.id]: !!checked
                          });
                        }}
                      />
                      <Label htmlFor={`device-${device.id}`} className="cursor-pointer flex items-center">
                        {getDeviceIcon(device.type)}
                        <span className="ml-2">{device.name}</span>
                        <Badge variant="outline" className="ml-2">{device.type}</Badge>
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsBulkAssignOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleBulkAssign}
              disabled={
                Object.keys(selectedDevices).filter(id => selectedDevices[parseInt(id)]).length === 0 || 
                !targetTowerId ||
                (selectedTower?.addressingType !== 'none' && targetSection === null)
              }
            >
              Assign Devices
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
};

export default DeviceManagement;
