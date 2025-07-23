import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Thermometer,
  Droplet,
  Zap,
  Timer,
  ToggleLeft,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Leaf,
  ThermometerSnowflake,
  ThermometerSun,
  Clock,
  Settings2,
  Sliders,
  Gauge
} from 'lucide-react';
import { motion } from 'framer-motion';

// Define preset plant profiles with optimum ranges
const plantProfiles = {
  lettuce: {
    name: 'Lettuce',
    temperatureDay: { min: 15, max: 20, ideal: 18 },
    temperatureNight: { min: 10, max: 15, ideal: 12 },
    humidity: { min: 60, max: 80, ideal: 70 },
    light: { intensity: 60, hoursPerDay: 14, spectrum: 'blue-dominant' },
    pHRange: { min: 5.5, max: 6.5, ideal: 6.0 },
    ecRange: { min: 0.8, max: 1.2, ideal: 1.0 },
    description: 'Cool-season leafy green that prefers moderate temperatures and high humidity.'
  },
  basil: {
    name: 'Basil',
    temperatureDay: { min: 20, max: 30, ideal: 25 },
    temperatureNight: { min: 15, max: 20, ideal: 18 },
    humidity: { min: 50, max: 70, ideal: 60 },
    light: { intensity: 70, hoursPerDay: 16, spectrum: 'balanced' },
    pHRange: { min: 5.5, max: 6.5, ideal: 6.0 },
    ecRange: { min: 1.0, max: 1.6, ideal: 1.4 },
    description: 'Aromatic herb that loves warmth and bright light. Sensitive to cold temperatures.'
  },
  spinach: {
    name: 'Spinach',
    temperatureDay: { min: 16, max: 24, ideal: 18 },
    temperatureNight: { min: 10, max: 15, ideal: 12 },
    humidity: { min: 50, max: 80, ideal: 65 },
    light: { intensity: 55, hoursPerDay: 12, spectrum: 'blue-dominant' },
    pHRange: { min: 6.0, max: 7.0, ideal: 6.5 },
    ecRange: { min: 1.0, max: 1.5, ideal: 1.2 },
    description: 'Cold-tolerant leafy green that performs best in cool conditions with moderate light.'
  },
  tomato: {
    name: 'Tomato',
    temperatureDay: { min: 21, max: 29, ideal: 25 },
    temperatureNight: { min: 16, max: 20, ideal: 18 },
    humidity: { min: 50, max: 70, ideal: 65 },
    light: { intensity: 85, hoursPerDay: 16, spectrum: 'red-dominant' },
    pHRange: { min: 5.8, max: 6.8, ideal: 6.3 },
    ecRange: { min: 2.0, max: 4.0, ideal: 2.5 },
    description: 'Fruit-bearing plant that requires warm temperatures and strong light. Moderate to high nutrient needs.'
  },
  strawberry: {
    name: 'Strawberry',
    temperatureDay: { min: 18, max: 25, ideal: 22 },
    temperatureNight: { min: 10, max: 15, ideal: 13 },
    humidity: { min: 65, max: 75, ideal: 70 },
    light: { intensity: 75, hoursPerDay: 12, spectrum: 'balanced' },
    pHRange: { min: 5.5, max: 6.5, ideal: 6.0 },
    ecRange: { min: 1.2, max: 1.8, ideal: 1.5 },
    description: 'Perennial fruit that benefits from day-night temperature differentials and sufficient light.'
  },
  kale: {
    name: 'Kale',
    temperatureDay: { min: 16, max: 25, ideal: 20 },
    temperatureNight: { min: 10, max: 15, ideal: 12 },
    humidity: { min: 55, max: 75, ideal: 65 },
    light: { intensity: 65, hoursPerDay: 14, spectrum: 'balanced' },
    pHRange: { min: 5.5, max: 6.8, ideal: 6.2 },
    ecRange: { min: 1.2, max: 1.8, ideal: 1.5 },
    description: 'Hardy leafy green with good temperature adaptability and moderate light requirements.'
  }
};

// Function to get temperature status indicator
const getTemperatureStatus = (current: number, min: number, max: number, ideal: number) => {
  if (current < min) {
    return { status: 'too-cold', icon: <ThermometerSnowflake className="h-4 w-4 text-blue-500" />, text: 'Too Cold', color: 'text-blue-500' };
  } else if (current > max) {
    return { status: 'too-hot', icon: <ThermometerSun className="h-4 w-4 text-red-500" />, text: 'Too Hot', color: 'text-red-500' };
  } else if (Math.abs(current - ideal) <= 1) {
    return { status: 'optimal', icon: <CheckCircle2 className="h-4 w-4 text-green-500" />, text: 'Optimal', color: 'text-green-500' };
  } else {
    return { status: 'acceptable', icon: <AlertTriangle className="h-4 w-4 text-amber-500" />, text: 'Acceptable', color: 'text-amber-500' };
  }
};

interface TemperatureControllerProps {
  defaultProfile?: string;
  allowManualControl?: boolean;
}

const TemperatureController: React.FC<TemperatureControllerProps> = ({ 
  defaultProfile = 'lettuce',
  allowManualControl = true
}) => {
  // Current selected plant profile
  const [selectedProfile, setSelectedProfile] = useState<string>(defaultProfile);
  const [isAutoMode, setIsAutoMode] = useState<boolean>(true);
  const [temperatureDialogOpen, setTemperatureDialogOpen] = useState<boolean>(false);
  const [humidityDialogOpen, setHumidityDialogOpen] = useState<boolean>(false);
  const [lightingDialogOpen, setLightingDialogOpen] = useState<boolean>(false);
  
  // Current environment values (simulated for demo)
  const [currentTemp, setCurrentTemp] = useState<number>(23.5);
  const [currentHumidity, setCurrentHumidity] = useState<number>(65);
  const [currentLightIntensity, setCurrentLightIntensity] = useState<number>(65);
  
  // Target settings (set based on plant profile but can be overridden)
  const [targetTemp, setTargetTemp] = useState<number>(plantProfiles[selectedProfile].temperatureDay.ideal);
  const [targetHumidity, setTargetHumidity] = useState<number>(plantProfiles[selectedProfile].humidity.ideal);
  const [targetLightIntensity, setTargetLightIntensity] = useState<number>(plantProfiles[selectedProfile].light.intensity);
  const [lightHours, setLightHours] = useState<number>(plantProfiles[selectedProfile].light.hoursPerDay);
  const [lightingSchedule, setLightingSchedule] = useState({
    start: '06:00',
    end: '22:00'
  });
  
  // Settings for temperature control
  const [tempControlSettings, setTempControlSettings] = useState({
    adjustmentSpeed: 'medium', // slow, medium, fast
    dayNightDiff: true, // whether to have different day/night settings
    dayTemp: plantProfiles[selectedProfile].temperatureDay.ideal,
    nightTemp: plantProfiles[selectedProfile].temperatureNight.ideal,
    alertThreshold: 2.5 // alert if temperature deviates by this amount
  });
  
  // Get the current selected profile data
  const profileData = plantProfiles[selectedProfile];
  
  // Get temperature status
  const tempStatus = getTemperatureStatus(
    currentTemp, 
    profileData.temperatureDay.min, 
    profileData.temperatureDay.max, 
    profileData.temperatureDay.ideal
  );
  
  // Get humidity status
  const getHumidityStatus = () => {
    const { min, max, ideal } = profileData.humidity;
    if (currentHumidity < min) {
      return { status: 'too-dry', icon: <XCircle className="h-4 w-4 text-red-500" />, text: 'Too Dry', color: 'text-red-500' };
    } else if (currentHumidity > max) {
      return { status: 'too-humid', icon: <Droplet className="h-4 w-4 text-blue-500" />, text: 'Too Humid', color: 'text-blue-500' };
    } else if (Math.abs(currentHumidity - ideal) <= 5) {
      return { status: 'optimal', icon: <CheckCircle2 className="h-4 w-4 text-green-500" />, text: 'Optimal', color: 'text-green-500' };
    } else {
      return { status: 'acceptable', icon: <AlertTriangle className="h-4 w-4 text-amber-500" />, text: 'Acceptable', color: 'text-amber-500' };
    }
  };
  
  // Handle profile change
  const handleProfileChange = (profile: string) => {
    setSelectedProfile(profile);
    
    if (isAutoMode) {
      // Update targets based on new profile
      setTargetTemp(plantProfiles[profile].temperatureDay.ideal);
      setTargetHumidity(plantProfiles[profile].humidity.ideal);
      setTargetLightIntensity(plantProfiles[profile].light.intensity);
      setLightHours(plantProfiles[profile].light.hoursPerDay);
      
      // Update control settings
      setTempControlSettings({
        ...tempControlSettings,
        dayTemp: plantProfiles[profile].temperatureDay.ideal,
        nightTemp: plantProfiles[profile].temperatureNight.ideal
      });
    }
  };
  
  // Handle auto/manual mode toggle
  const handleModeToggle = (isAuto: boolean) => {
    setIsAutoMode(isAuto);
    
    if (isAuto) {
      // Reset to profile defaults when switching to auto
      setTargetTemp(plantProfiles[selectedProfile].temperatureDay.ideal);
      setTargetHumidity(plantProfiles[selectedProfile].humidity.ideal);
      setTargetLightIntensity(plantProfiles[selectedProfile].light.intensity);
      setLightHours(plantProfiles[selectedProfile].light.hoursPerDay);
    }
  };
  
  return (
    <Card className="shadow-md border border-gray-100 dark:border-gray-800">
      <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sliders className="h-5 w-5 text-green-600 dark:text-green-500" />
            <CardTitle className="text-xl text-gray-900 dark:text-gray-100">Environmental Control System</CardTitle>
          </div>
          
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 bg-white/90 dark:bg-gray-800/90">
                  <Leaf className="h-4 w-4 text-green-600 dark:text-green-500" />
                  <span>{plantProfiles[selectedProfile].name}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <div className="flex flex-col p-3">
                  <h3 className="font-medium text-sm pb-2 border-b border-gray-200 dark:border-gray-700">
                    Plant Profile Selection
                  </h3>
                  <p className="text-xs text-muted-foreground py-2">
                    Choose a plant profile to automatically configure optimal growth conditions
                  </p>
                  <Select 
                    value={selectedProfile} 
                    onValueChange={handleProfileChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a plant" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(plantProfiles).map(([key, profile]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center">
                            <Leaf className="h-3.5 w-3.5 mr-2 text-green-600" />
                            {profile.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <h4 className="text-xs font-medium mb-2 flex items-center">
                      <Info className="h-3 w-3 mr-1 text-blue-500" />
                      Current Profile Details
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {profileData.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Temp Range:</span>
                        <span className="ml-1 font-medium">
                          {profileData.temperatureDay.min}°C - {profileData.temperatureDay.max}°C
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Humidity:</span>
                        <span className="ml-1 font-medium">
                          {profileData.humidity.min}% - {profileData.humidity.max}%
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Light Hours:</span>
                        <span className="ml-1 font-medium">
                          {profileData.light.hoursPerDay}h
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className="text-gray-500 dark:text-gray-400">pH Range:</span>
                        <span className="ml-1 font-medium">
                          {profileData.pHRange.min} - {profileData.pHRange.max}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <div className="flex items-center">
              <Label htmlFor="auto-mode" className="text-xs mr-2">
                {isAutoMode ? 'Auto' : 'Manual'}
              </Label>
              <Switch
                id="auto-mode"
                checked={isAutoMode}
                onCheckedChange={handleModeToggle}
                disabled={!allowManualControl}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Temperature Control */}
          <Card className="border border-gray-100 dark:border-gray-800 overflow-hidden">
            <CardHeader className="py-3 px-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-gray-900/50 dark:to-gray-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <h3 className="font-medium text-sm">Temperature Control</h3>
                </div>
                
                <Dialog open={temperatureDialogOpen} onOpenChange={setTemperatureDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="h-6 w-6">
                      <Settings2 className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Temperature Control Settings</DialogTitle>
                      <DialogDescription>
                        Configure temperature parameters for optimal plant growth
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="day-night-toggle" className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-blue-500" />
                          Day/Night Cycle
                        </Label>
                        <Switch 
                          id="day-night-toggle"
                          checked={tempControlSettings.dayNightDiff}
                          onCheckedChange={(checked) => setTempControlSettings({
                            ...tempControlSettings,
                            dayNightDiff: checked
                          })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Daytime Temperature (°C)</Label>
                        <div className="flex items-center space-x-2">
                          <Slider 
                            value={[tempControlSettings.dayTemp]}
                            min={15}
                            max={30}
                            step={0.5}
                            onValueChange={(value) => setTempControlSettings({
                              ...tempControlSettings,
                              dayTemp: value[0]
                            })}
                          />
                          <div className="w-12 text-right font-medium">
                            {tempControlSettings.dayTemp}°C
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Optimal: {profileData.temperatureDay.ideal}°C</span>
                          <span>Range: {profileData.temperatureDay.min}°C - {profileData.temperatureDay.max}°C</span>
                        </div>
                      </div>
                      
                      {tempControlSettings.dayNightDiff && (
                        <div className="space-y-2">
                          <Label>Nighttime Temperature (°C)</Label>
                          <div className="flex items-center space-x-2">
                            <Slider 
                              value={[tempControlSettings.nightTemp]}
                              min={10}
                              max={25}
                              step={0.5}
                              onValueChange={(value) => setTempControlSettings({
                                ...tempControlSettings,
                                nightTemp: value[0]
                              })}
                            />
                            <div className="w-12 text-right font-medium">
                              {tempControlSettings.nightTemp}°C
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Optimal: {profileData.temperatureNight.ideal}°C</span>
                            <span>Range: {profileData.temperatureNight.min}°C - {profileData.temperatureNight.max}°C</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Label>Adjustment Speed</Label>
                        <Select 
                          value={tempControlSettings.adjustmentSpeed}
                          onValueChange={(value) => setTempControlSettings({
                            ...tempControlSettings,
                            adjustmentSpeed: value
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select adjustment speed" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="slow">Slow (±0.5°C/hr)</SelectItem>
                            <SelectItem value="medium">Medium (±1.0°C/hr)</SelectItem>
                            <SelectItem value="fast">Fast (±1.5°C/hr)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Alert Threshold (°C)</Label>
                        <div className="flex items-center space-x-2">
                          <Slider 
                            value={[tempControlSettings.alertThreshold]}
                            min={0.5}
                            max={5}
                            step={0.5}
                            onValueChange={(value) => setTempControlSettings({
                              ...tempControlSettings,
                              alertThreshold: value[0]
                            })}
                          />
                          <div className="w-12 text-right font-medium">
                            ±{tempControlSettings.alertThreshold}°C
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          Alerts will trigger if temperature deviates from target by more than this amount
                        </p>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setTemperatureDialogOpen(false)}>Cancel</Button>
                      <Button onClick={() => {
                        setTargetTemp(tempControlSettings.dayTemp);
                        setTemperatureDialogOpen(false);
                      }}>Apply Settings</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="flex items-center">
                    <h4 className="text-2xl font-bold">{currentTemp.toFixed(1)}</h4>
                    <span className="text-sm ml-1 text-gray-500">°C</span>
                  </div>
                  <span className={`text-xs flex items-center gap-1 ${tempStatus.color}`}>
                    {tempStatus.icon}
                    {tempStatus.text}
                  </span>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center justify-end">
                    <span className="text-sm text-gray-500 mr-1">Target:</span>
                    <h4 className="text-lg font-medium">{targetTemp.toFixed(1)}°C</h4>
                  </div>
                  <span className="text-xs text-gray-500">
                    Range: {profileData.temperatureDay.min}-{profileData.temperatureDay.max}°C
                  </span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      currentTemp < profileData.temperatureDay.min ? 'bg-blue-500' :
                      currentTemp > profileData.temperatureDay.max ? 'bg-red-500' :
                      currentTemp === profileData.temperatureDay.ideal ? 'bg-green-500' :
                      'bg-amber-500'
                    }`}
                    style={{ 
                      width: `${Math.min(Math.max((currentTemp / 40) * 100, 0), 100)}%` 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5°C</span>
                  <span>15°C</span>
                  <span>25°C</span>
                  <span>35°C</span>
                </div>
              </div>
              
              {!isAutoMode && (
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Manual Temperature Adjustment</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      value={[targetTemp]}
                      min={15}
                      max={30}
                      step={0.5}
                      onValueChange={(value) => setTargetTemp(value[0])}
                    />
                    <span className="w-12 text-sm font-medium text-right">{targetTemp}°C</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
          
          {/* Humidity Control */}
          <Card className="border border-gray-100 dark:border-gray-800 overflow-hidden">
            <CardHeader className="py-3 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900/50 dark:to-gray-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Droplet className="h-4 w-4 text-blue-500" />
                  <h3 className="font-medium text-sm">Humidity Control</h3>
                </div>
                
                <Dialog open={humidityDialogOpen} onOpenChange={setHumidityDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="h-6 w-6">
                      <Settings2 className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Humidity Control Settings</DialogTitle>
                      <DialogDescription>
                        Configure humidity parameters and vapor pressure deficit
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Target Humidity (%)</Label>
                          <div className="flex items-center space-x-2 mt-2">
                            <Slider 
                              value={[targetHumidity]}
                              min={40}
                              max={90}
                              step={1}
                              onValueChange={(value) => setTargetHumidity(value[0])}
                            />
                            <div className="w-12 text-right font-medium">
                              {targetHumidity}%
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <h4 className="text-xs font-medium mb-2">VPD Estimation</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            VPD: 0.8 kPa
                          </p>
                          <Badge variant={currentTemp > 25 && currentHumidity < 60 ? "destructive" : "outline"} className="text-xs">
                            {currentTemp > 25 && currentHumidity < 60 
                              ? 'VPD too high'
                              : currentTemp < 20 && currentHumidity > 80
                                ? 'VPD too low'
                                : 'Optimal VPD'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Acceptable Range</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs text-gray-500">Minimum</Label>
                            <Input 
                              type="number" 
                              min={30} 
                              max={targetHumidity}
                              value={profileData.humidity.min}
                              disabled
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Maximum</Label>
                            <Input 
                              type="number" 
                              min={targetHumidity} 
                              max={95}
                              value={profileData.humidity.max}
                              disabled
                            />
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          These values are set based on the selected plant profile
                        </div>
                      </div>
                      
                      <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium flex items-center">
                            <Gauge className="h-4 w-4 mr-1 text-blue-500" />
                            Humidity Analytics
                          </h4>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          <p>• Condensation Risk: <span className={currentHumidity > 85 ? "text-red-500 font-medium" : ""}>
                            {currentHumidity > 85 ? 'High' : 'Low'}
                          </span></p>
                          <p>• Mold Risk: <span className={currentHumidity > 80 ? "text-amber-500 font-medium" : ""}>
                            {currentHumidity > 80 ? 'Moderate' : 'Low'}
                          </span></p>
                          <p>• Plant Transpiration: <span className={
                            currentHumidity < 50 ? "text-amber-500 font-medium" : 
                            currentHumidity > 80 ? "text-amber-500 font-medium" : 
                            "text-green-500 font-medium"
                          }>
                            {currentHumidity < 50 ? 'High (Water Stress)' : 
                             currentHumidity > 80 ? 'Low (Poor Nutrient Uptake)' : 
                             'Optimal'}
                          </span></p>
                          <p>• Water Absorption: <span className={
                            currentHumidity < 40 ? "text-red-500 font-medium" : 
                            currentHumidity < 60 ? "text-amber-500 font-medium" : 
                            "text-green-500 font-medium"
                          }>
                            {currentHumidity < 40 ? 'Low' : 
                             currentHumidity < 60 ? 'Moderate' : 
                             'Optimal'}
                          </span></p>
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setHumidityDialogOpen(false)}>Cancel</Button>
                      <Button onClick={() => setHumidityDialogOpen(false)}>Apply Settings</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="flex items-center">
                    <h4 className="text-2xl font-bold">{currentHumidity.toFixed(0)}</h4>
                    <span className="text-sm ml-1 text-gray-500">%</span>
                  </div>
                  <span className={`text-xs flex items-center gap-1 ${getHumidityStatus().color}`}>
                    {getHumidityStatus().icon}
                    {getHumidityStatus().text}
                  </span>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center justify-end">
                    <span className="text-sm text-gray-500 mr-1">Target:</span>
                    <h4 className="text-lg font-medium">{targetHumidity}%</h4>
                  </div>
                  <span className="text-xs text-gray-500">
                    Range: {profileData.humidity.min}-{profileData.humidity.max}%
                  </span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      currentHumidity < profileData.humidity.min ? 'bg-red-500' :
                      currentHumidity > profileData.humidity.max ? 'bg-blue-500' :
                      Math.abs(currentHumidity - profileData.humidity.ideal) <= 5 ? 'bg-green-500' :
                      'bg-amber-500'
                    }`}
                    style={{ 
                      width: `${Math.min(Math.max((currentHumidity / 100) * 100, 0), 100)}%` 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>
              
              {!isAutoMode && (
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Manual Humidity Adjustment</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      value={[targetHumidity]}
                      min={40}
                      max={90}
                      step={1}
                      onValueChange={(value) => setTargetHumidity(value[0])}
                    />
                    <span className="w-12 text-sm font-medium text-right">{targetHumidity}%</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
          
          {/* Lighting Control */}
          <Card className="border border-gray-100 dark:border-gray-800 overflow-hidden">
            <CardHeader className="py-3 px-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-gray-900/50 dark:to-gray-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <h3 className="font-medium text-sm">Lighting Control</h3>
                </div>
                
                <Dialog open={lightingDialogOpen} onOpenChange={setLightingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="h-6 w-6">
                      <Settings2 className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Lighting Control Settings</DialogTitle>
                      <DialogDescription>
                        Configure lighting intensity, spectrum, and schedule
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Tabs defaultValue="intensity" className="mt-4">
                      <TabsList className="grid grid-cols-3 w-full">
                        <TabsTrigger value="intensity">Intensity</TabsTrigger>
                        <TabsTrigger value="spectrum">Spectrum</TabsTrigger>
                        <TabsTrigger value="schedule">Schedule</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="intensity" className="mt-4 space-y-4">
                        <div className="space-y-2">
                          <Label>Light Intensity (%)</Label>
                          <div className="flex items-center space-x-2">
                            <Slider 
                              value={[targetLightIntensity]}
                              min={0}
                              max={100}
                              step={1}
                              onValueChange={(value) => setTargetLightIntensity(value[0])}
                            />
                            <div className="w-12 text-right font-medium">
                              {targetLightIntensity}%
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">
                            Recommended: {profileData.light.intensity}% for {profileData.name}
                          </p>
                        </div>
                        
                        <div className="rounded-md p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30">
                          <div className="flex items-center mb-2">
                            <Info className="h-4 w-4 text-amber-500 mr-2" />
                            <h4 className="text-sm font-medium">Light Intensity Guide</h4>
                          </div>
                          <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                            <p><span className="font-medium">0-25%:</span> Low intensity for seedlings or shade plants</p>
                            <p><span className="font-medium">25-50%:</span> Medium intensity for leafy greens</p>
                            <p><span className="font-medium">50-75%:</span> High intensity for flowering/fruiting plants</p>
                            <p><span className="font-medium">75-100%:</span> Maximum intensity for high-light plants</p>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="spectrum" className="mt-4 space-y-4">
                        <div className="rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                          <h4 className="text-sm font-medium mb-2">Light Spectrum Composition</h4>
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-xs">
                                <span>Red (Growth)</span>
                                <span className="font-medium">35%</span>
                              </div>
                              <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                                <div 
                                  className="h-1.5 rounded-full bg-red-500" 
                                  style={{ width: '35%' }}
                                ></div>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-xs">
                                <span>Blue (Flowering)</span>
                                <span className="font-medium">45%</span>
                              </div>
                              <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                                <div 
                                  className="h-1.5 rounded-full bg-blue-500" 
                                  style={{ width: '45%' }}
                                ></div>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-xs">
                                <span>Green (Structure)</span>
                                <span className="font-medium">10%</span>
                              </div>
                              <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                                <div 
                                  className="h-1.5 rounded-full bg-green-500" 
                                  style={{ width: '10%' }}
                                ></div>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-xs">
                                <span>White (Full Spectrum)</span>
                                <span className="font-medium">10%</span>
                              </div>
                              <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                                <div 
                                  className="h-1.5 rounded-full bg-gray-400" 
                                  style={{ width: '10%' }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Spectrum Preset</Label>
                          <Select defaultValue={profileData.light.spectrum}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a spectrum" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="balanced">Balanced (Default)</SelectItem>
                              <SelectItem value="red-dominant">Red Dominant (Leafy Growth)</SelectItem>
                              <SelectItem value="blue-dominant">Blue Dominant (Compact Growth)</SelectItem>
                              <SelectItem value="flowering">Flowering Boost</SelectItem>
                              <SelectItem value="fruiting">Fruiting Boost</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="schedule" className="mt-4 space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Label>Light Duration (hours)</Label>
                            <div className="text-sm font-medium">{lightHours} hours</div>
                          </div>
                          <Slider 
                            value={[lightHours]}
                            min={8}
                            max={18}
                            step={0.5}
                            onValueChange={(value) => setLightHours(value[0])}
                          />
                          <p className="text-xs text-gray-500">
                            Recommended: {profileData.light.hoursPerDay}h for {profileData.name}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="light-start">Start Time</Label>
                            <Input 
                              id="light-start"
                              type="time" 
                              value={lightingSchedule.start}
                              onChange={(e) => setLightingSchedule({
                                ...lightingSchedule,
                                start: e.target.value
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="light-end">End Time</Label>
                            <Input 
                              id="light-end"
                              type="time" 
                              value={lightingSchedule.end}
                              onChange={(e) => setLightingSchedule({
                                ...lightingSchedule,
                                end: e.target.value
                              })}
                            />
                          </div>
                        </div>
                        
                        <div className="rounded-md p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-blue-500 mr-2" />
                            <h4 className="text-sm font-medium">Current Schedule</h4>
                          </div>
                          <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                            Lights are ON from {lightingSchedule.start} to {lightingSchedule.end} 
                            ({lightHours} hours per day)
                          </p>
                          <Badge 
                            variant="outline" 
                            className="mt-2 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          >
                            Currently Active
                          </Badge>
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <DialogFooter className="mt-4">
                      <Button variant="outline" onClick={() => setLightingDialogOpen(false)}>Cancel</Button>
                      <Button onClick={() => setLightingDialogOpen(false)}>Apply Settings</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="flex items-center">
                    <h4 className="text-2xl font-bold">{currentLightIntensity.toFixed(0)}</h4>
                    <span className="text-sm ml-1 text-gray-500">%</span>
                  </div>
                  <span className="text-xs flex items-center gap-1 text-amber-500">
                    <Zap className="h-3 w-3" />
                    Active
                  </span>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center justify-end">
                    <span className="text-sm text-gray-500 mr-1">Target:</span>
                    <h4 className="text-lg font-medium">{targetLightIntensity}%</h4>
                  </div>
                  <span className="text-xs text-gray-500">
                    {lightHours} hours/day
                  </span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500"
                    style={{ 
                      width: `${currentLightIntensity}%` 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Schedule: {lightingSchedule.start} - {lightingSchedule.end}</span>
                </div>
                <div className="flex items-center">
                  <Timer className="h-3 w-3 mr-1" />
                  <span>{lightHours} hours/day</span>
                </div>
              </div>
              
              {!isAutoMode && (
                <div className="mt-3">
                  <Label className="text-xs text-gray-500 mb-1 block">Manual Light Adjustment</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      value={[targetLightIntensity]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => setTargetLightIntensity(value[0])}
                    />
                    <span className="w-12 text-sm font-medium text-right">{targetLightIntensity}%</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemperatureController;