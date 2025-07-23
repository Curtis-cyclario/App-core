export interface TowerType {
  id: number;
  name: string;
  type: string; // vertical, aframe, horizontal, etc.
  status: string;
  location: string | null;
  totalColumns: number;
  totalPods: number;
  addressingType: 'column' | 'pod' | 'none';
  createdAt: string;
  updatedAt: string;
  plantCapacity: number;
  currentOccupancy: number;
  maintenanceSchedule: string | null;
  lastMaintenanceDate: string | null;
  nutrientProfile: string | null;
  lightingSchedule: string | null;
  waterUsageRate: number | null;
  energyEfficiencyRating: string | null;
  notes: string | null;
}

export interface TowerDeviceType {
  id: number;
  name: string;
  type: string;
  status: string;
  lastSeen: string | null;
  location: string | null;
  towerId: number | null;
  column: number | null;
  pod: number | null;
  ipAddress: string | null;
  macAddress: string | null;
  firmwareVersion: string | null;
  batteryLevel: number | null;
  maintenanceStatus: string | null;
  alertThreshold: number | null;
  manufacturer: string | null;
  modelNumber: string | null;
  installationDate: string | null;
}

export interface DeviceBySectionType {
  sectionTitle: string;
  devices: TowerDeviceType[];
}