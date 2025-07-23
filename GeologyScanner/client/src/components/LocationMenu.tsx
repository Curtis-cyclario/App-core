import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronUp, X, Share2, Download } from "lucide-react";
import { formatCoordinates } from "@/lib/utils";
import { getGoogleMapsUrl } from "@/lib/mapUtils";
import { motion, useAnimation, PanInfo } from 'framer-motion';

interface LocationMenuProps {
  latitude?: number;
  longitude?: number;
  initiallyOpen?: boolean;
  onClose?: () => void;
}

export default function LocationMenu({ 
  latitude, 
  longitude, 
  initiallyOpen = false,
  onClose
}: LocationMenuProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimation();
  const menuRef = useRef<HTMLDivElement>(null);
  const dragConstraintsRef = useRef<HTMLDivElement>(null);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    setIsDragging(false);
    const shouldClose = info.offset.y > 100;
    if (shouldClose) {
      setIsOpen(false);
      controls.start("closed");
      if (onClose) onClose();
    } else {
      controls.start(isOpen ? "open" : "closed");
    }
  };

  const toggleMenu = () => {
    if (!isDragging) {
      setIsOpen(!isOpen);
      controls.start(isOpen ? "closed" : "open");
    }
  };

  useEffect(() => {
    controls.start(isOpen ? "open" : "closed");
  }, [isOpen, controls]);

  const handleShare = () => {
    if (latitude && longitude) {
      const url = getGoogleMapsUrl(latitude, longitude);
      if (navigator.share) {
        navigator.share({
          title: 'Geological Scan Location',
          text: `Check out this geological scan location at ${formatCoordinates(latitude, longitude)}`,
          url: url
        }).catch(error => console.log('Error sharing:', error));
      } else {
        // Fallback for browsers without share API
        navigator.clipboard.writeText(url)
          .then(() => alert('Location URL copied to clipboard!'))
          .catch(err => console.error('Failed to copy:', err));
      }
    }
  };

  const handleExportLocation = () => {
    if (latitude && longitude) {
      const locationData = {
        latitude,
        longitude,
        formattedCoordinates: formatCoordinates(latitude, longitude),
        timestamp: new Date().toISOString(),
        googleMapsUrl: getGoogleMapsUrl(latitude, longitude)
      };
      
      const fileContent = JSON.stringify(locationData, null, 2);
      const blob = new Blob([fileContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `location-data-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div ref={dragConstraintsRef} className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      <motion.div
        ref={menuRef}
        className="pointer-events-auto"
        initial="closed"
        animate={controls}
        drag="y"
        dragConstraints={dragConstraintsRef}
        dragElastic={0.2}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        variants={{
          open: { y: 0 },
          closed: { y: "calc(100% - 60px)" }
        }}
      >
        <div 
          className="bg-primary rounded-t-lg h-6 flex items-center justify-center cursor-pointer"
          onClick={toggleMenu}
        >
          <ChevronUp className={`h-5 w-5 text-primary-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
        
        <Card className="rounded-t-none border-t-0">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              Location Details
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => {
                setIsOpen(false);
                controls.start("closed");
                if (onClose) onClose();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent>
            {latitude && longitude ? (
              <div className="space-y-4">
                <div className="bg-muted rounded-md p-3 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Coordinates</p>
                  <p className="font-mono text-lg">{formatCoordinates(latitude, longitude)}</p>
                </div>
                
                <div className="h-40 rounded-md overflow-hidden bg-muted/50">
                  {/* Replace with actual map component when API key is available */}
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                    <span className="ml-2 text-sm text-muted-foreground">
                      Map view requires Google Maps API key
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No location data available</p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleShare}
              disabled={!latitude || !longitude}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              className="flex-1"
              onClick={handleExportLocation}
              disabled={!latitude || !longitude}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}