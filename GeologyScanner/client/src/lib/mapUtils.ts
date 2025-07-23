// Utility functions for working with maps and geospatial data

// Convert degrees to radians
export function toRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

// Calculate distance between two coordinates using the Haversine formula
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  
  return distance;
}

// Format coordinates to a human-readable string
export function formatCoordinates(
  latitude: number, 
  longitude: number
): string {
  const latDirection = latitude >= 0 ? 'N' : 'S';
  const lonDirection = longitude >= 0 ? 'E' : 'W';
  
  const latDegrees = Math.abs(latitude).toFixed(4);
  const lonDegrees = Math.abs(longitude).toFixed(4);
  
  return `${latDegrees}° ${latDirection}, ${lonDegrees}° ${lonDirection}`;
}

// Check if a point is within a radius of another point
export function isWithinRadius(
  centerLat: number, 
  centerLon: number, 
  pointLat: number, 
  pointLon: number, 
  radiusKm: number
): boolean {
  const distance = calculateDistance(centerLat, centerLon, pointLat, pointLon);
  return distance <= radiusKm;
}

// Get a list of points within a radius
export function getPointsWithinRadius(
  centerLat: number, 
  centerLon: number, 
  points: Array<{latitude: number, longitude: number, [key: string]: any}>, 
  radiusKm: number
): Array<{latitude: number, longitude: number, [key: string]: any}> {
  return points.filter(point => 
    isWithinRadius(centerLat, centerLon, point.latitude, point.longitude, radiusKm)
  );
}

// Create a Google Maps URL for a location
export function getGoogleMapsUrl(
  latitude: number, 
  longitude: number, 
  zoom = 15
): string {
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&zoom=${zoom}`;
}
