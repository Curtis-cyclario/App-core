export interface SensorData {
  id: number;
  timestamp: string;
  temperature: string;
  humidity: string;
  waterLevel: string;
  nutrientLevel: string;
  pumpStatus: string;
  lightStatus: string;
  reservoirLevel: string;
  waterUsed: string;
  waterEvaporated: string;
  waterCycled: string;
  temperatureSetPoint: string;
  isTemperatureControlActive: boolean;
  lightIntensity: string;
  waterFlowRate: string;
  plantType: string;
}

export interface Device {
  id: number;
  name: string;
  type: string;
  status: string;
  lastSeen?: string | null;
  location?: string | null;
  towerId?: number | null;
  column?: number | null;
  pod?: number | null;
  ipAddress?: string | null;
  macAddress?: string | null;
  firmwareVersion?: string | null;
  batteryLevel?: number | null;
  maintenanceStatus?: string | null;
  alertThreshold?: number | null;
  manufacturer?: string | null;
  modelNumber?: string | null;
  installationDate?: string | null;
}

export interface Tower {
  id: number;
  name: string;
  type: string;
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
  plantType?: string | null;
  currentCrop?: string | null;
  harvestDate?: string | null;
  yieldEstimate?: number | null;
  blockchainVerified?: boolean;
  nftTokenId?: string | null;
}

export type ThemeType = 'light' | 'dark';
export type ThemePreset = 'organic' | 'modern' | 'cyber';

export interface ThemeContextType {
  theme: ThemeType;
  themePreset: ThemePreset;
  setTheme: (theme: ThemeType) => void;
  setThemePreset: (preset: ThemePreset) => void;
  toggleTheme: () => void;
}

// Digital Twin Types
export interface TowerSection {
  id: number;
  name: string;
  type: string;
  column?: number | null;
  pod?: number | null;
  plantType?: string | null;
  plantedDate?: string | null;
  harvestDate?: string | null;
  growthStage?: string | null;
  metrics: {
    temperature: number;
    humidity: number;
    light: number;
    co2: number;
    nutrient: number;
    ph: number;
    ec: number;
  };
}

export interface TowerPosition {
  x: number;
  y: number;
  z: number;
  rotationY: number;
  scale: number;
}

// Digital Twin Blockchain Integration Types
export type BlockchainRecord = {
  id: string;
  timestamp: string;
  towerIds: number[];
  deviceIds: number[];
  dataHash: string;
  transactionId: string;
  blockNumber: number;
  blockchainType: 'ethereum' | 'hyperledger' | 'polygon';
  verificationStatus: 'pending' | 'verified' | 'failed';
  dataType: 'sensorData' | 'maintenanceRecord' | 'harvestRecord' | 'supplyChain';
  metaData: Record<string, any>;
};

export type BlockchainVerificationResponse = {
  status: 'success' | 'failure';
  message: string;
  recordId: string;
  timestamp: string;
  verifiedBy: string;
};

// Notification and Activity Types
export interface Notification {
  id: number;
  timestamp: string;
  level: string; // 'info' | 'warning' | 'danger'
  message: string;
  read: boolean;
}

export interface Activity {
  id: number;
  timestamp: string;
  type: string;
  description: string;
  icon?: string;
}

// Network Topology Types
export interface NetworkNodeData {
  id: string;
  type: string;
  name: string;
  status: string;
  x: number;
  y: number;
  plantType?: string;
  growthStage?: number;
  health?: number;
  value?: string;
}

export interface NetworkConnectionData {
  source: string;
  target: string;
  status: string;
}

export interface NetworkData {
  nodes: NetworkNodeData[];
  connections: NetworkConnectionData[];
}