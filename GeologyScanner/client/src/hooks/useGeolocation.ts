import { useState, useEffect } from "react";

interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface GeolocationHook {
  coords: GeolocationPosition | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation(): GeolocationHook {
  const [coords, setCoords] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    const successHandler = (position: GeolocationPosition) => {
      setCoords({
        latitude: position.latitude,
        longitude: position.longitude,
        accuracy: position.accuracy
      });
      setLoading(false);
    };

    const errorHandler = (error: GeolocationPositionError) => {
      let errorMessage: string;
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "User denied the request for geolocation";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable";
          break;
        case error.TIMEOUT:
          errorMessage = "The request to get user location timed out";
          break;
        default:
          errorMessage = "An unknown error occurred";
          break;
      }
      
      setError(errorMessage);
      setLoading(false);
    };

    // For testing purposes, use a placeholder location if geolocation is unavailable
    const testCoords = {
      latitude: 34.0522,
      longitude: -118.2437,
      accuracy: 10
    };

    if (process.env.NODE_ENV === 'development') {
      // Use test coordinates in development
      setTimeout(() => {
        successHandler(testCoords);
      }, 1000);
    } else {
      // Use real geolocation in production
      navigator.geolocation.getCurrentPosition(
        (position) => {
          successHandler({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        errorHandler,
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    }
  }, []);

  return { coords, error, loading };
}
