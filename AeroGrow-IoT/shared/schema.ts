import { pgTable, text, serial, integer, boolean, timestamp, json, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const sensorData = pgTable("sensor_data", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  temperature: text("temperature").notNull(),
  humidity: text("humidity").notNull(),
  waterLevel: text("water_level").notNull(),
  nutrientLevel: text("nutrient_level").notNull(),
  pumpStatus: text("pump_status").notNull(),
  lightStatus: text("light_status").notNull(),
  // New fields for water consumption tracking
  reservoirLevel: text("reservoir_level").notNull().default("1000"),
  waterUsed: text("water_used").notNull().default("0"),
  waterEvaporated: text("water_evaporated").notNull().default("0"),
  waterCycled: text("water_cycled").notNull().default("0"),
  // Temperature control automation
  temperatureSetPoint: text("temperature_set_point").notNull().default("24.0"),
  isTemperatureControlActive: boolean("is_temperature_control_active").notNull().default(true),
  lightIntensity: text("light_intensity").notNull().default("75"),
  waterFlowRate: text("water_flow_rate").notNull().default("3.5"),
  plantType: text("plant_type").notNull().default("mixed"),
});

export const insertSensorDataSchema = createInsertSchema(sensorData).omit({
  id: true,
  timestamp: true,
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  level: text("level").notNull(), // info, warning, danger
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  timestamp: true,
  read: true,
  resolvedAt: true,
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  icon: text("icon"),
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  timestamp: true,
});

export const towers = pgTable("towers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // vertical, aframe, horizontal, etc.
  status: text("status").notNull().default('active'),
  location: text("location"),
  totalColumns: integer("total_columns").default(0),
  totalPods: integer("total_pods").default(0),
  addressingType: text("addressing_type").notNull().default('none'), // column, pod, none
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  plantCapacity: integer("plant_capacity").default(0),
  currentOccupancy: integer("current_occupancy").default(0),
  maintenanceSchedule: text("maintenance_schedule"),
  lastMaintenanceDate: timestamp("last_maintenance_date"),
  nutrientProfile: text("nutrient_profile"),
  lightingSchedule: text("lighting_schedule"),
  waterUsageRate: real("water_usage_rate"),
  energyEfficiencyRating: text("energy_efficiency_rating"),
  notes: text("notes"),
});

export const devices = pgTable("devices", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull().default('offline'),
  lastSeen: timestamp("last_seen"),
  location: text("location"),
  towerId: integer("tower_id").references(() => towers.id),
  column: integer("column"),
  pod: integer("pod"),
  ipAddress: text("ip_address"),
  macAddress: text("mac_address"),
  firmwareVersion: text("firmware_version"),
  batteryLevel: integer("battery_level"),
  maintenanceStatus: text("maintenance_status"),
  alertThreshold: real("alert_threshold"),
  manufacturer: text("manufacturer"),
  modelNumber: text("model_number"),
  installationDate: timestamp("installation_date"),
});

export const insertTowerSchema = createInsertSchema(towers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDeviceSchema = createInsertSchema(devices).omit({
  id: true,
  lastSeen: true,
});

// Define the relationships between tables
export const deviceRelations = relations(devices, ({ one }) => ({
  tower: one(towers, {
    fields: [devices.towerId],
    references: [towers.id],
  }),
}));

export const towerRelations = relations(towers, ({ many }) => ({
  devices: many(devices),
}));

export const networkNodes = pgTable("network_nodes", {
  id: serial("id").primaryKey(),
  nodeId: text("node_id").notNull().unique(),
  type: text("type").notNull(),
  name: text("name").notNull(),
  status: text("status").notNull().default('offline'),
  x: real("x").notNull(),
  y: real("y").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const networkConnections = pgTable("network_connections", {
  id: serial("id").primaryKey(),
  source: text("source").notNull(),
  target: text("target").notNull(),
  status: text("status").notNull().default('active'),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertNetworkNodeSchema = createInsertSchema(networkNodes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNetworkConnectionSchema = createInsertSchema(networkConnections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type SensorData = typeof sensorData.$inferSelect;
export type InsertSensorData = z.infer<typeof insertSensorDataSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type Device = typeof devices.$inferSelect;
export type InsertDevice = z.infer<typeof insertDeviceSchema>;

export type Tower = typeof towers.$inferSelect;
export type InsertTower = z.infer<typeof insertTowerSchema>;

export type NetworkNode = typeof networkNodes.$inferSelect;
export type InsertNetworkNode = z.infer<typeof insertNetworkNodeSchema>;

export type NetworkConnection = typeof networkConnections.$inferSelect;
export type InsertNetworkConnection = z.infer<typeof insertNetworkConnectionSchema>;

// Additional types for the application
export type ThemeType = 'light' | 'dark';
export type ThemePreset = 'organic' | 'modern' | 'cyber';

export type WebSocketMessage = {
  type: string;
  data: any;
};

export type NetworkNodeData = {
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
  size?: number;   // Size for collision detection
  icon?: string;   // Icon override if needed
  color?: string;  // Custom color override
};

export type NetworkConnectionData = {
  source: string;
  target: string;
  status: string;
  isCentral?: boolean;
  flowRate?: number;
  intensity?: number;
  dataRate?: number;
};

export type NetworkData = {
  nodes: NetworkNodeData[];
  connections: NetworkConnectionData[];
};

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
  dataType: 'sensorData' | 'maintenanceRecord' | 'harvestRecord' | 'supplyChain' | 'cropToken';
  metaData: Record<string, any>;
};

export type BlockchainVerificationResponse = {
  status: 'success' | 'failure';
  message: string;
  recordId: string;
  timestamp: string;
  verifiedBy: string;
};

// Crop Tokenization Types
export type CropTokenStatus = 'planted' | 'growing' | 'harvested' | 'processed' | 'sold';

export type CropTokenizationData = {
  id: string;
  tokenId: string;
  plantType: string;
  plantVariety: string;
  plantedDate: string;
  harvestDate?: string;
  towerIds: number[];
  batchId: string;
  status: CropTokenStatus;
  nutritionalProfile?: NutritionalProfile;
  growthMetrics: GrowthMetric[];
  qualityScore: number;
  carbonFootprint: number;
  waterUsage: number;
  energyUsage: number;
  blockchainRecordIds: string[];
  ownershipHistory: OwnershipRecord[];
  certifications: string[];
  imageUrls: string[];
  marketValue: number;
  currentOwner: string;
};

export type NutritionalProfile = {
  vitamins: Record<string, number>;
  minerals: Record<string, number>;
  protein: number;
  fiber: number;
  antioxidants: number;
  otherNutrients: Record<string, number>;
};

export type GrowthMetric = {
  timestamp: string;
  height: number;
  leafCount: number;
  stemDiameter: number;
  healthScore: number;
  notes: string;
};

export type OwnershipRecord = {
  timestamp: string;
  owner: string;
  transactionId: string;
  price?: number;
};

export type CropMarketplaceItem = {
  tokenId: string;
  plantType: string;
  plantVariety: string;
  status: CropTokenStatus;
  imageUrl: string;
  qualityScore: number;
  isOrganic: boolean;
  price: number;
  seller: string;
  harvestDate?: string;
  availableQuantity: number;
  certifications: string[];
  carbonScore: number;
};
