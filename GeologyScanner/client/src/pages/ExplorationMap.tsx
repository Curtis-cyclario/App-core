import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, Filter, Target, Map as MapIcon, Mountain, Gem } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useQuery } from "@tanstack/react-query";

export default function ExplorationMap() {
  const [mapType, setMapType] = useState<'satellite' | 'terrain'>('satellite');
  const [showLayers, setShowLayers] = useState(false);
  const { coords } = useGeolocation();
  const isMobile = window.innerWidth < 1024;
  
  // Fetch scan locations
  const { data: scans } = useQuery({
    queryKey: ['/api/scans'],
  });
  
  useEffect(() => {
    document.title = "Exploration Map - GeoScan Pro";
  }, []);
  
  const mapLayers = [
    { id: 'minerals', name: 'Mineral Deposits', color: 'primary', icon: <Gem className="h-4 w-4" /> },
    { id: 'terrain', name: 'Terrain Features', color: 'secondary', icon: <Mountain className="h-4 w-4" /> },
    { id: 'scans', name: 'Scan Locations', color: 'accent', icon: <Target className="h-4 w-4" /> }
  ];
  
  const mapContent = (
    <div className="relative w-full h-full">
      {/* Placeholder for Google Maps - in a real app this would be a proper map */}
      <div className="absolute inset-0 bg-dark-lighter">
        <div className="w-full h-full bg-dark flex items-center justify-center">
          <div className="text-center">
            <MapIcon className="h-12 w-12 text-primary mx-auto mb-2" />
            <p className="text-sm text-light-dark">
              Google Maps {mapType === 'satellite' ? 'Satellite' : 'Terrain'} View
            </p>
            <p className="text-xs text-light-dark mt-2">
              Position: {coords?.latitude?.toFixed(4) || '0.0000'}° {coords?.latitude && coords.latitude >= 0 ? 'N' : 'S'}, 
              {coords?.longitude?.toFixed(4) || '0.0000'}° {coords?.longitude && coords.longitude >= 0 ? 'E' : 'W'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Example pin overlays - these would be positioned based on real coordinates */}
      <div className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-pulse">
          <Gem className="h-4 w-4 text-white" />
        </div>
      </div>
      
      <div className="absolute top-2/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center animate-pulse">
          <Target className="h-4 w-4 text-white" />
        </div>
      </div>
      
      <div className="absolute bottom-1/4 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center animate-pulse">
          <Mountain className="h-4 w-4 text-white" />
        </div>
      </div>
      
      {/* Controls overlaid on map */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <Tabs 
          defaultValue="satellite" 
          className="bg-dark-lighter rounded-md shadow-lg"
          onValueChange={(v) => setMapType(v as 'satellite' | 'terrain')}
        >
          <TabsList className="grid grid-cols-2 w-[200px]">
            <TabsTrigger value="satellite">Satellite</TabsTrigger>
            <TabsTrigger value="terrain">Terrain</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button 
          variant="outline" 
          className="bg-dark-lighter"
          onClick={() => setShowLayers(!showLayers)}
        >
          <Layers className="h-4 w-4 mr-1" />
          Layers
        </Button>
        
        {showLayers && (
          <Card className="bg-dark-lighter border-dark-light shadow-lg">
            <CardContent className="p-3 space-y-2">
              {mapLayers.map(layer => (
                <div key={layer.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`layer-${layer.id}`}
                    defaultChecked
                    className="mr-2"
                  />
                  <label 
                    htmlFor={`layer-${layer.id}`} 
                    className="flex items-center text-sm"
                  >
                    <div className={`w-3 h-3 rounded-full bg-${layer.color} mr-2`}></div>
                    <span className="mr-1">{layer.name}</span>
                    {layer.icon}
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        
        <Button variant="outline" className="bg-dark-lighter">
          <Target className="h-4 w-4 mr-1" />
          My Location
        </Button>
        
        <Button variant="outline" className="bg-dark-lighter">
          <Filter className="h-4 w-4 mr-1" />
          Filter
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="w-full h-full bg-dark">
        <div className="w-full h-[calc(100vh-112px)]">
          {mapContent}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-dark-lighter p-4 border-b border-dark-light">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Exploration Map</h1>
          </div>
        </div>
        
        <div className="flex-1 bg-dark">
          {mapContent}
        </div>
      </div>
    </div>
  );
}
