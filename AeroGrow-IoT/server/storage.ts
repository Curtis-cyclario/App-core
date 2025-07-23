import {
  users, type User, type InsertUser,
  sensorData, type SensorData, type InsertSensorData,
  notifications, type Notification, type InsertNotification,
  activities, type Activity, type InsertActivity,
  devices, type Device, type InsertDevice,
  towers, type Tower, type InsertTower,
  networkNodes, networkConnections,
  type NetworkData, type NetworkNodeData, type NetworkConnectionData,
  type NetworkNode, type NetworkConnection, type InsertNetworkNode, type InsertNetworkConnection
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Sensor data operations
  getSensorData(): Promise<SensorData | undefined>;
  saveSensorData(data: InsertSensorData): Promise<SensorData>;
  getSensorHistory(hours: number): Promise<SensorData[]>;
  
  // Notification operations
  getNotifications(limit?: number): Promise<Notification[]>;
  getUnreadNotificationsCount(): Promise<number>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<boolean>;
  markAllNotificationsAsRead(): Promise<boolean>;
  
  // Activity operations
  getActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Tower operations
  getTowers(): Promise<Tower[]>;
  getTower(id: number): Promise<Tower | undefined>;
  createTower(tower: InsertTower): Promise<Tower>;
  updateTower(id: number, data: Partial<InsertTower>): Promise<Tower | undefined>;
  deleteTower(id: number): Promise<boolean>;
  
  // Device operations
  getDevices(): Promise<Device[]>;
  getDevicesByTower(towerId: number): Promise<Device[]>;
  getDevice(id: number): Promise<Device | undefined>;
  createDevice(device: InsertDevice): Promise<Device>;
  updateDevice(id: number, data: Partial<InsertDevice>): Promise<Device | undefined>;
  updateDeviceStatus(id: number, status: string): Promise<Device | undefined>;
  deleteDevice(id: number): Promise<boolean>;
  
  // Network operations
  getNetworkTopology(): Promise<NetworkData>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private sensorDataHistory: SensorData[];
  private notificationsData: Notification[];
  private activitiesData: Activity[];
  private devicesData: Map<number, Device>;
  private networkTopology: NetworkData;
  private currentIds: {
    users: number;
    sensorData: number;
    notifications: number;
    activities: number;
    devices: number;
  };

  constructor() {
    this.users = new Map();
    this.sensorDataHistory = [];
    this.notificationsData = [];
    this.activitiesData = [];
    this.devicesData = new Map();
    
    this.currentIds = {
      users: 1,
      sensorData: 1,
      notifications: 1,
      activities: 1,
      devices: 1,
    };

    // Initialize with default data
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize sample devices
    const sampleDevices: InsertDevice[] = [
      { name: 'Main Hub', type: 'hub', status: 'online', location: 'Control Center' },
      { name: 'Temperature Sensor 1', type: 'sensor', status: 'online', location: 'Zone A' },
      { name: 'Humidity Sensor 1', type: 'sensor', status: 'online', location: 'Zone A' },
      { name: 'Water Level Sensor', type: 'sensor', status: 'online', location: 'Reservoir' },
      { name: 'Nutrient Pump', type: 'pump', status: 'online', location: 'Reservoir' },
      { name: 'LED Light Array 1', type: 'light', status: 'online', location: 'Zone A' }
    ];

    sampleDevices.forEach(device => this.createDevice(device));

    // Initialize network topology
    // Initialize modernized network topology with 10 tower nodes connected in parallel running left to right
    this.networkTopology = {
      nodes: [
        // Main system components
        { id: 'hub-1', type: 'hub', name: 'Main Control Hub', status: 'online', x: 150, y: 300 },
        { id: 'pump-1', type: 'pump', name: '1000L Main Pump', status: 'online', x: 250, y: 400 },
        { id: 'controller-1', type: 'controller', name: 'Master Controller', status: 'online', x: 200, y: 200 },
        
        // 10 Tower nodes in parallel (left to right)
        { id: 'tower-1', type: 'tower', name: 'Tower 1', status: 'online', x: 350, y: 300 },
        { id: 'tower-2', type: 'tower', name: 'Tower 2', status: 'online', x: 450, y: 300 },
        { id: 'tower-3', type: 'tower', name: 'Tower 3', status: 'online', x: 550, y: 300 },
        { id: 'tower-4', type: 'tower', name: 'Tower 4', status: 'online', x: 650, y: 300 },
        { id: 'tower-5', type: 'tower', name: 'Tower 5', status: 'online', x: 750, y: 300 },
        { id: 'tower-6', type: 'tower', name: 'Tower 6', status: 'online', x: 850, y: 300 },
        { id: 'tower-7', type: 'tower', name: 'Tower 7', status: 'online', x: 950, y: 300 },
        { id: 'tower-8', type: 'tower', name: 'Tower 8', status: 'online', x: 1050, y: 300 },
        { id: 'tower-9', type: 'tower', name: 'Tower 9', status: 'online', x: 1150, y: 300 },
        { id: 'tower-10', type: 'tower', name: 'Tower 10', status: 'online', x: 1250, y: 300 },
        
        // Tower sensors
        { id: 'sensor-1', type: 'sensor', name: 'Temperature Controller', status: 'online', x: 350, y: 200 },
        { id: 'sensor-2', type: 'sensor', name: 'Humidity Monitor', status: 'online', x: 450, y: 200 },
        { id: 'sensor-3', type: 'sensor', name: 'Water Flow Meter', status: 'online', x: 550, y: 400 },
        { id: 'sensor-4', type: 'sensor', name: 'Light Intensity', status: 'online', x: 650, y: 200 },
        { id: 'sensor-5', type: 'sensor', name: 'Reservoir Level', status: 'warning', x: 300, y: 400 }
      ],
      connections: [
        // Connect hub to controller and pump
        { source: 'hub-1', target: 'controller-1', status: 'active' },
        { source: 'hub-1', target: 'pump-1', status: 'active' },
        
        // Connect hub to all towers
        { source: 'hub-1', target: 'tower-1', status: 'active' },
        { source: 'hub-1', target: 'tower-2', status: 'active' },
        { source: 'hub-1', target: 'tower-3', status: 'active' },
        { source: 'hub-1', target: 'tower-4', status: 'active' },
        { source: 'hub-1', target: 'tower-5', status: 'active' },
        { source: 'hub-1', target: 'tower-6', status: 'active' },
        { source: 'hub-1', target: 'tower-7', status: 'active' },
        { source: 'hub-1', target: 'tower-8', status: 'active' },
        { source: 'hub-1', target: 'tower-9', status: 'active' },
        { source: 'hub-1', target: 'tower-10', status: 'active' },
        
        // Connect pump to all towers
        { source: 'pump-1', target: 'tower-1', status: 'active' },
        { source: 'pump-1', target: 'tower-2', status: 'active' },
        { source: 'pump-1', target: 'tower-3', status: 'active' },
        { source: 'pump-1', target: 'tower-4', status: 'active' },
        { source: 'pump-1', target: 'tower-5', status: 'active' },
        { source: 'pump-1', target: 'tower-6', status: 'active' },
        { source: 'pump-1', target: 'tower-7', status: 'active' },
        { source: 'pump-1', target: 'tower-8', status: 'active' },
        { source: 'pump-1', target: 'tower-9', status: 'active' },
        { source: 'pump-1', target: 'tower-10', status: 'active' },
        
        // Connect sensors to specific towers
        { source: 'sensor-1', target: 'tower-1', status: 'active' },
        { source: 'sensor-2', target: 'tower-2', status: 'active' },
        { source: 'sensor-3', target: 'tower-3', status: 'active' },
        { source: 'sensor-4', target: 'tower-4', status: 'active' },
        { source: 'sensor-5', target: 'pump-1', status: 'warning' }
      ]
    };

    // Create initial sensor data
    this.saveSensorData({
      temperature: '23.5',
      humidity: '68',
      waterLevel: '85',
      nutrientLevel: '76',
      pumpStatus: 'active',
      lightStatus: 'on'
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Sensor data operations
  async getSensorData(): Promise<SensorData | undefined> {
    if (this.sensorDataHistory.length === 0) return undefined;
    return this.sensorDataHistory[this.sensorDataHistory.length - 1];
  }

  async saveSensorData(data: InsertSensorData): Promise<SensorData> {
    const id = this.currentIds.sensorData++;
    const timestamp = new Date();
    
    const newData: SensorData = {
      ...data,
      id,
      timestamp
    };
    
    this.sensorDataHistory.push(newData);
    
    // Keep only the last 1000 entries to limit memory usage
    if (this.sensorDataHistory.length > 1000) {
      this.sensorDataHistory.shift();
    }
    
    return newData;
  }

  async getSensorHistory(hours: number = 24): Promise<SensorData[]> {
    const now = new Date();
    const cutoff = new Date(now.getTime() - hours * 60 * 60 * 1000);
    
    return this.sensorDataHistory.filter(data => data.timestamp >= cutoff);
  }

  // Notification operations
  async getNotifications(limit: number = 10): Promise<Notification[]> {
    // Sort by timestamp descending and limit
    return [...this.notificationsData]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getUnreadNotificationsCount(): Promise<number> {
    return this.notificationsData.filter(n => !n.read).length;
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = this.currentIds.notifications++;
    const timestamp = new Date();
    
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp,
      read: false
    };
    
    this.notificationsData.push(newNotification);
    
    // Keep only the last 100 notifications to limit memory usage
    if (this.notificationsData.length > 100) {
      this.notificationsData.shift();
    }
    
    return newNotification;
  }

  async markNotificationAsRead(id: number): Promise<boolean> {
    const index = this.notificationsData.findIndex(n => n.id === id);
    if (index === -1) return false;
    
    this.notificationsData[index].read = true;
    return true;
  }

  async markAllNotificationsAsRead(): Promise<boolean> {
    this.notificationsData.forEach(n => n.read = true);
    return true;
  }

  // Activity operations
  async getActivities(limit: number = 10): Promise<Activity[]> {
    // Sort by timestamp descending and limit
    return [...this.activitiesData]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.currentIds.activities++;
    const timestamp = new Date();
    
    const newActivity: Activity = {
      ...activity,
      id,
      timestamp
    };
    
    this.activitiesData.push(newActivity);
    
    // Keep only the last 100 activities to limit memory usage
    if (this.activitiesData.length > 100) {
      this.activitiesData.shift();
    }
    
    return newActivity;
  }

  // Device operations
  async getDevices(): Promise<Device[]> {
    return Array.from(this.devicesData.values());
  }

  async getDevice(id: number): Promise<Device | undefined> {
    return this.devicesData.get(id);
  }

  async createDevice(device: InsertDevice): Promise<Device> {
    const id = this.currentIds.devices++;
    const lastSeen = new Date();
    
    const newDevice: Device = {
      ...device,
      id,
      lastSeen
    };
    
    this.devicesData.set(id, newDevice);
    return newDevice;
  }

  async updateDeviceStatus(id: number, status: string): Promise<Device | undefined> {
    const device = this.devicesData.get(id);
    if (!device) return undefined;
    
    const updatedDevice = {
      ...device,
      status,
      lastSeen: new Date()
    };
    
    this.devicesData.set(id, updatedDevice);
    return updatedDevice;
  }

  // Network operations
  async getNetworkTopology(): Promise<NetworkData> {
    // Import the updated network topology with left-to-right flow
    const { defaultNetworkTopology } = await import('./networkData');
    return defaultNetworkTopology;
  }
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Sensor data operations
  async getSensorData(): Promise<SensorData | undefined> {
    const [data] = await db.select().from(sensorData).orderBy(desc(sensorData.timestamp)).limit(1);
    return data;
  }

  async saveSensorData(data: InsertSensorData): Promise<SensorData> {
    const [newData] = await db.insert(sensorData).values(data).returning();
    return newData;
  }

  async getSensorHistory(hours: number = 24): Promise<SensorData[]> {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - hours);
    
    return await db.select()
      .from(sensorData)
      .where(gte(sensorData.timestamp, cutoffDate))
      .orderBy(sensorData.timestamp);
  }

  // Notification operations
  async getNotifications(limit: number = 10): Promise<Notification[]> {
    return await db.select()
      .from(notifications)
      .orderBy(desc(notifications.timestamp))
      .limit(limit);
  }

  async getUnreadNotificationsCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(eq(notifications.read, false));
    
    return result[0]?.count || 0;
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications)
      .values(notification)
      .returning();
    
    return newNotification;
  }

  async markNotificationAsRead(id: number): Promise<boolean> {
    const result = await db.update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id))
      .returning();
    
    return result.length > 0;
  }

  async markAllNotificationsAsRead(): Promise<boolean> {
    await db.update(notifications)
      .set({ read: true })
      .where(eq(notifications.read, false));
    
    return true;
  }

  // Activity operations
  async getActivities(limit: number = 10): Promise<Activity[]> {
    return await db.select()
      .from(activities)
      .orderBy(desc(activities.timestamp))
      .limit(limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    // Ensure icon is never undefined, use null instead
    const sanitizedActivity = {
      ...activity,
      icon: activity.icon ?? null
    };

    const [newActivity] = await db.insert(activities)
      .values(sanitizedActivity)
      .returning();
    
    return newActivity;
  }

  // Tower operations
  async getTowers(): Promise<Tower[]> {
    return await db.select().from(towers);
  }

  async getTower(id: number): Promise<Tower | undefined> {
    const [tower] = await db.select().from(towers).where(eq(towers.id, id));
    return tower;
  }

  async createTower(tower: InsertTower): Promise<Tower> {
    // Ensure nullable fields are never undefined
    const sanitizedTower = {
      ...tower,
      location: tower.location ?? null,
      nutrientProfile: tower.nutrientProfile ?? null,
      lightingSchedule: tower.lightingSchedule ?? null,
      maintenanceSchedule: tower.maintenanceSchedule ?? null,
      notes: tower.notes ?? null
    };

    const [newTower] = await db.insert(towers).values(sanitizedTower).returning();
    return newTower;
  }

  async updateTower(id: number, data: Partial<InsertTower>): Promise<Tower | undefined> {
    const [updatedTower] = await db.update(towers)
      .set({ 
        ...data,
        updatedAt: new Date() 
      })
      .where(eq(towers.id, id))
      .returning();
    
    return updatedTower;
  }

  async deleteTower(id: number): Promise<boolean> {
    const result = await db.delete(towers)
      .where(eq(towers.id, id))
      .returning();
    
    return result.length > 0;
  }

  // Device operations
  async getDevices(): Promise<Device[]> {
    return await db.select().from(devices);
  }

  async getDevicesByTower(towerId: number): Promise<Device[]> {
    return await db.select()
      .from(devices)
      .where(eq(devices.towerId, towerId));
  }

  async getDevice(id: number): Promise<Device | undefined> {
    const [device] = await db.select().from(devices).where(eq(devices.id, id));
    return device;
  }

  async createDevice(device: InsertDevice): Promise<Device> {
    // Ensure nullable fields are never undefined
    const sanitizedDevice = {
      ...device,
      location: device.location ?? null,
      towerId: device.towerId ?? null,
      column: device.column ?? null,
      pod: device.pod ?? null,
      ipAddress: device.ipAddress ?? null,
      macAddress: device.macAddress ?? null,
      firmwareVersion: device.firmwareVersion ?? null
    };

    const [newDevice] = await db.insert(devices)
      .values(sanitizedDevice)
      .returning();
    
    return newDevice;
  }

  async updateDevice(id: number, data: Partial<InsertDevice>): Promise<Device | undefined> {
    const [updatedDevice] = await db.update(devices)
      .set({ 
        ...data,
        lastSeen: new Date() 
      })
      .where(eq(devices.id, id))
      .returning();
    
    return updatedDevice;
  }

  async updateDeviceStatus(id: number, status: string): Promise<Device | undefined> {
    const [updatedDevice] = await db.update(devices)
      .set({ 
        status, 
        lastSeen: new Date()
      })
      .where(eq(devices.id, id))
      .returning();
    
    return updatedDevice;
  }

  async deleteDevice(id: number): Promise<boolean> {
    const result = await db.delete(devices)
      .where(eq(devices.id, id))
      .returning();
    
    return result.length > 0;
  }

  // Network operations
  async getNetworkTopology(): Promise<NetworkData> {
    // Consistently use the updated network topology regardless of storage type
    const { defaultNetworkTopology } = await import('./networkData');
    return defaultNetworkTopology;
  }

  // Initialize with default data if database is empty
  async initializeDefaultData(): Promise<void> {
    // Check if we have any devices
    const existingDevices = await db.select().from(devices);
    if (existingDevices.length > 0) {
      return; // Data already exists, no need to initialize
    }

    // Sample devices
    const sampleDevices: InsertDevice[] = [
      { name: 'Main Hub', type: 'hub', status: 'online', location: 'Control Center' },
      { name: 'Temperature Sensor 1', type: 'sensor', status: 'online', location: 'Zone A' },
      { name: 'Humidity Sensor 1', type: 'sensor', status: 'online', location: 'Zone A' },
      { name: 'Water Level Sensor', type: 'sensor', status: 'online', location: 'Reservoir' },
      { name: 'Nutrient Pump', type: 'pump', status: 'online', location: 'Reservoir' },
      { name: 'LED Light Array 1', type: 'light', status: 'online', location: 'Zone A' }
    ];

    // Insert devices
    for (const device of sampleDevices) {
      await this.createDevice(device);
    }

    // Sample network nodes
    const sampleNodes: InsertNetworkNode[] = [
      { nodeId: '1', type: 'hub', name: 'Main Hub', status: 'online', x: 200, y: 100 },
      { nodeId: '2', type: 'sensor', name: 'Temperature Sensor 1', status: 'online', x: 100, y: 50 },
      { nodeId: '3', type: 'sensor', name: 'Humidity Sensor 1', status: 'online', x: 80, y: 150 },
      { nodeId: '4', type: 'pump', name: 'Nutrient Pump', status: 'online', x: 320, y: 60 },
      { nodeId: '5', type: 'light', name: 'LED Light Array 1', status: 'online', x: 300, y: 150 }
    ];

    // Insert network nodes
    for (const node of sampleNodes) {
      await db.insert(networkNodes).values(node);
    }

    // Sample connections
    const sampleConnections: InsertNetworkConnection[] = [
      { source: '1', target: '2', status: 'active' },
      { source: '1', target: '3', status: 'active' },
      { source: '1', target: '4', status: 'active' },
      { source: '1', target: '5', status: 'active' }
    ];

    // Insert connections
    for (const connection of sampleConnections) {
      await db.insert(networkConnections).values(connection);
    }

    // Initial sensor data
    await this.saveSensorData({
      temperature: '23.5',
      humidity: '68',
      waterLevel: '85',
      nutrientLevel: '76',
      pumpStatus: 'active',
      lightStatus: 'on'
    });

    // Sample notifications
    await this.createNotification({
      level: 'info',
      message: 'Fertilizer level is low. Consider refilling soon.'
    });

    await this.createNotification({
      level: 'warning',
      message: 'Temperature fluctuation detected in Zone A.'
    });
  }
}

// Initialize database storage
export const storage = new DatabaseStorage();

// Initialize default data when the application starts
storage.initializeDefaultData().catch(console.error);
