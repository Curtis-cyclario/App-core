import { useRef, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface MapMarker {
  lat: number;
  lng: number;
  title?: string;
  icon?: string;
}

interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: MapMarker[];
  mapContainerStyle?: React.CSSProperties;
  onMapClick?: (lat: number, lng: number) => void;
}

export default function GoogleMap({
  center,
  zoom = 8,
  markers = [],
  mapContainerStyle = { height: "400px" },
  onMapClick
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapMarkers, setMapMarkers] = useState<google.maps.Marker[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || map) return;

    try {
      const mapInstance = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#263c3f" }],
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b9a76" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#38414e" }],
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#212a37" }],
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca5b3" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#746855" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2835" }],
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#f3d19c" }],
          },
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#2f3948" }],
          },
          {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#515c6d" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#17263c" }],
          },
        ],
      });

      // Add click handler if provided
      if (onMapClick) {
        mapInstance.addListener("click", (event: google.maps.MapMouseEvent) => {
          const lat = event.latLng?.lat();
          const lng = event.latLng?.lng();
          if (lat !== undefined && lng !== undefined) {
            onMapClick(lat, lng);
          }
        });
      }

      setMap(mapInstance);
      setIsLoaded(true);
    } catch (error) {
      console.error("Error initializing Google Map:", error);
    }
  }, [center, zoom, map, onMapClick]);

  // Update center if it changes
  useEffect(() => {
    if (map) {
      map.setCenter(center);
    }
  }, [center, map]);

  // Update markers when they change
  useEffect(() => {
    // Clean up old markers
    mapMarkers.forEach((marker) => marker.setMap(null));
    
    if (!map) return;
    
    // Create new markers
    const newMarkers = markers.map((markerData) => {
      return new google.maps.Marker({
        position: { lat: markerData.lat, lng: markerData.lng },
        map,
        title: markerData.title,
        icon: markerData.icon,
      });
    });
    
    setMapMarkers(newMarkers);
    
    // Clean up on unmount
    return () => {
      newMarkers.forEach((marker) => marker.setMap(null));
    };
  }, [markers, map]);

  return (
    <>
      {!isLoaded && <Skeleton className="w-full h-full" />}
      <div ref={mapRef} style={{ ...mapContainerStyle, display: isLoaded ? 'block' : 'none' }} />
    </>
  );
}
