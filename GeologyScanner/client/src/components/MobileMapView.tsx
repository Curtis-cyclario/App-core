import { Button } from "@/components/ui/button";
import { Expand, MapPin } from "lucide-react";
import { formatCoordinates } from "@/lib/utils";
import GoogleMap from "@/components/maps/GoogleMap";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface MobileMapViewProps {
  latitude?: number;
  longitude?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
}

export default function MobileMapView({ 
  latitude = 37.7749, 
  longitude = -122.4194,
  onLocationSelect 
}: MobileMapViewProps) {
  const [isFullMapOpen, setIsFullMapOpen] = useState(false);
  
  const handleLocationSelect = (lat: number, lng: number) => {
    if (onLocationSelect) {
      onLocationSelect(lat, lng);
    }
  };
  
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">Location Data</h2>
      <div className="map-container rounded-lg overflow-hidden">
        <GoogleMap 
          center={{ lat: latitude, lng: longitude }}
          zoom={13}
          markers={[{ lat: latitude, lng: longitude }]}
          onMapClick={handleLocationSelect}
          mapContainerStyle={{ height: '100%', minHeight: '220px' }}
        />
      </div>
      <div className="mt-3 flex justify-between items-center text-sm">
        <div className="text-muted-foreground">
          <MapPin className="inline h-4 w-4 mr-1" /> 
          {formatCoordinates(latitude, longitude)}
        </div>
        <Button 
          variant="ghost" 
          className="text-primary font-medium"
          onClick={() => setIsFullMapOpen(true)}
        >
          <Expand className="h-4 w-4 mr-1" /> Full Map
        </Button>
      </div>
      
      {/* Full map dialog */}
      <Dialog open={isFullMapOpen} onOpenChange={setIsFullMapOpen}>
        <DialogContent className="w-full max-w-4xl p-0 h-[80vh]">
          <GoogleMap 
            center={{ lat: latitude, lng: longitude }}
            zoom={13}
            markers={[{ lat: latitude, lng: longitude }]}
            onMapClick={handleLocationSelect}
            mapContainerStyle={{ height: '100%' }}
          />
          <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-md">
            <div className="text-sm font-medium">
              {formatCoordinates(latitude, longitude)}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
