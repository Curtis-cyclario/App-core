import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a confidence value (0-100) to display with appropriate styling
 */
export function formatConfidence(confidence: number): {
  value: string;
  color: string;
} {
  const value = `${confidence.toFixed(1)}%`;
  
  if (confidence >= 90) {
    return { value, color: "text-secondary" };
  } else if (confidence >= 75) {
    return { value, color: "text-primary" };
  } else if (confidence >= 60) {
    return { value, color: "text-accent" };
  } else {
    return { value, color: "text-muted-foreground" };
  }
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format coordinates to a readable string
 */
export function formatCoordinates(lat: number | undefined, lng: number | undefined): string {
  if (lat === undefined || lng === undefined) return "No coordinates";
  
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}

/**
 * Format time ago (e.g., "3h ago", "Yesterday")
 */
export function timeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  if (seconds < 60) {
    return "Just now";
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  
  const days = Math.floor(hours / 24);
  if (days === 1) {
    return "Yesterday";
  }
  
  if (days < 7) {
    return `${days}d ago`;
  }
  
  return formatDate(date);
}

/**
 * Gets a color for a mineral tag
 */
export function getMineralColor(mineralName: string): string {
  const colorMap: Record<string, string> = {
    "Iron Ore": "primary",
    "Gold": "accent",
    "Copper": "secondary",
    "Quartz": "muted-foreground",
    "Silver": "muted-foreground",
  };
  
  return colorMap[mineralName] || "muted-foreground";
}
