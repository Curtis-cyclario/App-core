import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { calculateFacilityEnvironment } from "./facilityEnvironment";
import { 
  InsertNotification, 
  InsertSensorData, 
  SensorData, 
  InsertTower,
  InsertDevice
} from "@shared/schema";
import { newNetworkTopology } from "./newNetworkData";

// Set for active WebSocket clients
const clients = new Set<WebSocket>();

// Function to broadcast to all connected clients
function broadcast(message: any) {
  const messageString = JSON.stringify(message);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageString);
    }
  });
}

// Function to check and adjust temperature to avoid exactly 47°C (too hot)
function checkTemperature(temp: number): number {
  // Round to one decimal place for comparison
  const roundedTemp = Math.round(temp * 10) / 10;
  
  // If temperature is 47°C or higher, cap it at 46.8°C (still hot but not 47°C)
  if (roundedTemp >= 47.0) {
    return 46.8;
  }
  
  // Otherwise keep the temperature as is but ensure it's in a reasonable range
  return Math.min(46.8, Math.max(18.0, roundedTemp));
}

// Plant-specific temperature ranges
const plantTemperatureRanges = {
  'lettuce': { min: 18.0, optimal: 21.0, max: 24.0 },
  'basil': { min: 20.0, optimal: 24.0, max: 27.0 },
  'strawberry': { min: 18.0, optimal: 22.0, max: 26.0 },
  'tomato': { min: 21.0, optimal: 25.0, max: 29.0 },
  'pepper': { min: 22.0, optimal: 26.0, max: 30.0 },
  'cucumber': { min: 21.0, optimal: 24.0, max: 28.0 },
  'kale': { min: 16.0, optimal: 19.0, max: 23.0 },
  'spinach': { min: 16.0, optimal: 18.0, max: 22.0 },
  'mixed': { min: 18.0, optimal: 23.2, max: 26.0 },
};

// Function to calculate water usage and evaporation based on temperature and humidity
function calculateWaterUsage(
  currentTemp: number, 
  targetTemp: number, 
  flowRate: number, 
  reservoirLevel: number,
  humidity: number = 70
): { 
  waterUsed: number, 
  waterEvaporated: number,
  waterCycled: number,
  adjustedFlowRate: number, 
  newReservoirLevel: number 
} {
  // Constants for the water usage model
  const MINUTES_PER_INTERVAL = 5;
  const ABSOLUTE_ZERO_C = -273.15;
  const WATER_DENSITY = 1000; // kg/m³
  const LATENT_HEAT_VAPORIZATION = 2260; // kJ/kg at 100°C
  const SURFACE_AREA_FACTOR = 0.1; // m² of exposed water surface per tower section

  // Base water cycling rate in liters per interval (flow rate in L/min * interval time)
  const baseWaterCycled = flowRate * MINUTES_PER_INTERVAL / 60;
  
  // Temperature differential - positive means we need cooling
  const tempDifferential = Math.max(0, currentTemp - targetTemp);
  
  // Water used for cooling increases with temperature differential
  // Cooling formula: more water circulation is needed as temperature rises
  const coolingWater = tempDifferential * 0.25 * Math.sqrt(baseWaterCycled);
  
  // Total water cycled through system (base + cooling needs)
  const waterCycled = baseWaterCycled + coolingWater;
  
  // Calculate saturated vapor pressure using Magnus-Tetens formula
  // P(T) = 6.1078 * 10^((7.5*T)/(T+237.3)) where T is in °C
  const satVaporPressure = 6.1078 * Math.pow(10, (7.5 * currentTemp) / (currentTemp + 237.3));
  
  // Relative humidity factor (0-1 scale)
  const relHumidity = humidity / 100;
  
  // Actual vapor pressure
  const actualVaporPressure = satVaporPressure * relHumidity;
  
  // Vapor pressure deficit (VPD) - the driving force for evaporation
  const vpd = satVaporPressure - actualVaporPressure;
  
  // Evaporation rate calculation based on VPD and temperature
  // Using a simplified Penman equation focusing on temperature and humidity effects
  // E = k * VPD * f(T) where k is a coefficient and f(T) is a temperature function
  
  // Temperature factor: evaporation increases exponentially with temperature
  const tempFactor = Math.exp(0.05 * (currentTemp - 20)); // normalized to 20°C
  
  // VPD factor: higher VPD increases evaporation rate
  const vpdFactor = Math.max(0, vpd * 0.015);
  
  // Surface area factor: more exposed water = more evaporation
  const surfaceArea = SURFACE_AREA_FACTOR * (1 + 0.1 * tempDifferential);
  
  // Calculate evaporation rate (liters per interval)
  // This combines physical principles with empirical adjustments
  const evaporated = vpdFactor * tempFactor * surfaceArea * MINUTES_PER_INTERVAL;
  
  // Adjust flow rate based on reservoir level and temperature needs
  let adjustedFlowRate = flowRate;
  if (reservoirLevel < 200) {
    // Conservation mode: reduce flow rate when reservoir is low
    adjustedFlowRate = flowRate * (0.6 + (reservoirLevel / 500));
  } else if (tempDifferential > 3) {
    // Cooling mode: increase flow rate for better temperature management
    adjustedFlowRate = Math.min(10, flowRate * (1 + tempDifferential / 10));
  }
  
  // Calculate total water used (what actually leaves the reservoir)
  // This includes water lost to evaporation and any water used for other purposes
  const totalUsed = evaporated;
  
  // Calculate new reservoir level
  const newLevel = Math.max(0, reservoirLevel - totalUsed);
  
  return {
    waterUsed: totalUsed,
    waterEvaporated: evaporated,
    waterCycled: waterCycled,
    adjustedFlowRate: adjustedFlowRate,
    newReservoirLevel: newLevel
  };
}

// Function to adjust lighting based on temperature requirements
function adjustLighting(currentTemp: number, targetTemp: number, currentIntensity: number): number {
  if (currentTemp < targetTemp - 2) {
    // Too cold, increase lighting intensity
    return Math.min(100, currentIntensity + 5);
  } else if (currentTemp > targetTemp + 2) {
    // Too hot, decrease lighting intensity
    return Math.max(30, currentIntensity - 8);
  }
  // Within acceptable range, make minor adjustments
  return Math.min(100, Math.max(30, currentIntensity + (Math.random() * 4 - 2)));
}

// Function to update sensor data with intelligent control systems
function updateSensorData(currentData: SensorData): InsertSensorData {
  // Parse current values
  const temp = parseFloat(currentData.temperature);
  const humidity = parseFloat(currentData.humidity);
  const waterLevel = parseFloat(currentData.waterLevel);
  const nutrientLevel = parseFloat(currentData.nutrientLevel);
  const reservoirLevel = parseFloat(currentData.reservoirLevel || "1000");
  const waterUsed = parseFloat(currentData.waterUsed || "0");
  const waterEvaporated = parseFloat(currentData.waterEvaporated || "0");
  const currentWaterFlowRate = parseFloat(currentData.waterFlowRate || "3.5");
  const lightIntensity = parseFloat(currentData.lightIntensity || "32");
  const plantType = currentData.plantType || "mixed";
  const isControlActive = currentData.isTemperatureControlActive !== false;

  // Get target temperature for current plant type
  const plantRange = plantTemperatureRanges[plantType as keyof typeof plantTemperatureRanges] || 
                     plantTemperatureRanges.mixed;
  const targetTemp = plantRange.optimal;
  
  // Initialize the data with small random variations
  let updatedTemp = temp + (Math.random() * 0.6 - 0.3);
  
  // Temperature control logic
  if (isControlActive) {
    if (updatedTemp > targetTemp + 0.5) {
      // Too hot - increase water flow to cool down
      updatedTemp -= 0.4; // Cooling effect from increased water flow
    } else if (updatedTemp < targetTemp - 0.5) {
      // Too cold - increase light intensity
      updatedTemp += 0.3; // Heating effect from increased lighting
    }
  }
  
  // Apply temperature safety check
  updatedTemp = checkTemperature(updatedTemp);
  
  // Calculate water usage and adjust flow rate based on temperature and humidity
  const waterCalc = calculateWaterUsage(
    updatedTemp,
    targetTemp,
    currentWaterFlowRate,
    reservoirLevel,
    humidity // Pass humidity to the calculation
  );
  
  // Adjust lighting based on temperature needs
  const newLightIntensity = adjustLighting(updatedTemp, targetTemp, lightIntensity);
  
  // Determine pump status based on water needs
  const newPumpStatus = waterCalc.newReservoirLevel > 5 ? 'active' : 'warning';
  
  // Determine light status
  const newLightStatus = newLightIntensity > 40 ? 'on' : 'dimmed';

  // Return updated sensor data
  return {
    temperature: updatedTemp.toFixed(1),
    humidity: Math.min(100, Math.max(30, humidity + (Math.random() * 3 - 1.5))).toFixed(0),
    waterLevel: Math.min(100, Math.max(0, waterLevel - (Math.random() * 0.3))).toFixed(0),
    nutrientLevel: Math.min(100, Math.max(0, nutrientLevel - (Math.random() * 0.2))).toFixed(0),
    pumpStatus: newPumpStatus,
    lightStatus: newLightStatus,
    // Water tracking fields
    reservoirLevel: waterCalc.newReservoirLevel.toFixed(1),
    waterUsed: (waterUsed + waterCalc.waterUsed).toFixed(1),
    waterEvaporated: (waterEvaporated + waterCalc.waterEvaporated).toFixed(1),
    waterCycled: waterCalc.waterCycled.toFixed(1),  // Add the water cycled through the system
    // Temperature control fields
    temperatureSetPoint: targetTemp.toFixed(1),
    isTemperatureControlActive: isControlActive,
    lightIntensity: newLightIntensity.toFixed(0),
    waterFlowRate: waterCalc.adjustedFlowRate.toFixed(1),
    plantType: plantType
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // Create WebSocket server
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws'
  });

  // API Routes
  app.get('/api/sensor-data', async (req, res) => {
    try {
      const data = await storage.getSensorData();
      res.json(data || { error: 'No sensor data available' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch sensor data' });
    }
  });

  app.get('/api/sensor-history', async (req, res) => {
    try {
      const hours = parseInt(req.query.hours as string) || 24;
      const data = await storage.getSensorHistory(hours);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch sensor history' });
    }
  });

  app.get('/api/notifications', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const notifications = await storage.getNotifications(limit);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  });

  app.get('/api/notifications/count', async (req, res) => {
    try {
      const count = await storage.getUnreadNotificationsCount();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notification count' });
    }
  });

  app.post('/api/notifications/read/:id', async (req, res) => {
    try {
      const success = await storage.markNotificationAsRead(parseInt(req.params.id));
      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: 'Failed to mark notification as read' });
    }
  });

  app.post('/api/notifications/read-all', async (req, res) => {
    try {
      const success = await storage.markAllNotificationsAsRead();
      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: 'Failed to mark all notifications as read' });
    }
  });

  app.get('/api/activities', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const activities = await storage.getActivities(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch activities' });
    }
  });

  // Tower API Routes
  app.get('/api/towers', async (req, res) => {
    try {
      const towers = await storage.getTowers();
      res.json(towers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch towers' });
    }
  });

  app.get('/api/towers/:id', async (req, res) => {
    try {
      const tower = await storage.getTower(parseInt(req.params.id));
      if (!tower) {
        return res.status(404).json({ error: 'Tower not found' });
      }
      res.json(tower);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tower' });
    }
  });

  app.post('/api/towers', async (req, res) => {
    try {
      const newTower = await storage.createTower(req.body as InsertTower);
      
      // Create activity for tower creation
      await storage.createActivity({
        type: 'tower',
        description: `Tower "${newTower.name}" created`,
        icon: 'tower'
      });
      
      res.status(201).json(newTower);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create tower' });
    }
  });

  app.put('/api/towers/:id', async (req, res) => {
    try {
      const updatedTower = await storage.updateTower(parseInt(req.params.id), req.body);
      if (!updatedTower) {
        return res.status(404).json({ error: 'Tower not found' });
      }
      
      // Create activity for tower update
      await storage.createActivity({
        type: 'tower',
        description: `Tower "${updatedTower.name}" updated`,
        icon: 'tower'
      });
      
      res.json(updatedTower);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update tower' });
    }
  });

  app.delete('/api/towers/:id', async (req, res) => {
    try {
      const result = await storage.deleteTower(parseInt(req.params.id));
      if (!result) {
        return res.status(404).json({ error: 'Tower not found' });
      }
      
      // Create activity for tower deletion
      await storage.createActivity({
        type: 'tower',
        description: `Tower deleted`,
        icon: 'tower'
      });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete tower' });
    }
  });

  // Device API Routes
  app.get('/api/devices', async (req, res) => {
    try {
      const towerId = req.query.towerId ? parseInt(req.query.towerId as string) : null;
      
      if (towerId) {
        const devices = await storage.getDevicesByTower(towerId);
        res.json(devices);
      } else {
        const devices = await storage.getDevices();
        res.json(devices);
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch devices' });
    }
  });

  app.get('/api/devices/:id', async (req, res) => {
    try {
      const device = await storage.getDevice(parseInt(req.params.id));
      if (!device) {
        return res.status(404).json({ error: 'Device not found' });
      }
      res.json(device);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch device' });
    }
  });

  app.post('/api/devices', async (req, res) => {
    try {
      const newDevice = await storage.createDevice(req.body as InsertDevice);
      
      // Create activity for device creation
      await storage.createActivity({
        type: 'device',
        description: `Device "${newDevice.name}" added`,
        icon: 'device'
      });
      
      res.status(201).json(newDevice);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create device' });
    }
  });

  app.put('/api/devices/:id', async (req, res) => {
    try {
      const updatedDevice = await storage.updateDevice(parseInt(req.params.id), req.body);
      if (!updatedDevice) {
        return res.status(404).json({ error: 'Device not found' });
      }
      
      // Create activity for device update
      await storage.createActivity({
        type: 'device',
        description: `Device "${updatedDevice.name}" updated`,
        icon: 'device'
      });
      
      res.json(updatedDevice);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update device' });
    }
  });

  app.delete('/api/devices/:id', async (req, res) => {
    try {
      const result = await storage.deleteDevice(parseInt(req.params.id));
      if (!result) {
        return res.status(404).json({ error: 'Device not found' });
      }
      
      // Create activity for device deletion
      await storage.createActivity({
        type: 'device',
        description: `Device deleted`,
        icon: 'device'
      });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete device' });
    }
  });

  app.get('/api/network', async (req, res) => {
    try {
      // Check if we should use the new mind map structure
      const useNewLayout = req.query.layout === 'mindmap';
      
      if (useNewLayout) {
        // Return the new mindmap network topology with spheroid bounds
        res.json(newNetworkTopology);
        return;
      }
      
      // Otherwise use the original network topology
      const network = await storage.getNetworkTopology();
      
      // Add connections between analytics and master controller if they don't exist
      const analyticsNode = network.nodes.find(n => 
        (n.type === 'server' && n.name.toLowerCase().includes('analytics')) ||
        (n.type === 'server' && n.name.toLowerCase().includes('data'))
      );
      
      const masterNode = network.nodes.find(n => 
        (n.type === 'hub' && n.name.toLowerCase().includes('master')) ||
        (n.type === 'hub' && n.name.toLowerCase().includes('control'))
      );
      
      // Ensure we have 10 towers and they're properly connected
      const towerNodes = network.nodes.filter(n => n.type === 'tower');
      
      // If both exist, ensure they're connected
      if (analyticsNode && masterNode) {
        const connectionExists = network.connections.some(c => 
          (c.source === analyticsNode.id && c.target === masterNode.id) || 
          (c.source === masterNode.id && c.target === analyticsNode.id)
        );
        
        if (!connectionExists) {
          network.connections.push({
            source: analyticsNode.id,
            target: masterNode.id,
            status: 'active'
          });
        }
        
        // Connect all towers to master controller for better visualization
        towerNodes.forEach(tower => {
          const towerToMasterExists = network.connections.some(c => 
            (c.source === tower.id && c.target === masterNode.id) ||
            (c.source === masterNode.id && c.target === tower.id)
          );
          
          if (!towerToMasterExists) {
            network.connections.push({
              source: masterNode.id,
              target: tower.id,
              status: 'active'
            });
          }
        });
      }
      
      res.json(network);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch network topology' });
    }
  });

  // WebSocket connection handling
  wss.on('connection', (ws) => {
    console.log('New WebSocket client connected');
    clients.add(ws);

    // Send initial data to the new client
    storage.getSensorData().then(latestData => {
      if (latestData) {
        ws.send(JSON.stringify({
          type: 'sensorData',
          data: latestData
        }));
      }
    });

    // Handle incoming messages
    ws.on('message', async (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        
        // Handle ping messages (don't log to reduce noise)
        if (parsedMessage.type === 'ping') {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'pong',
              data: { timestamp: parsedMessage.data.timestamp }
            }));
          }
          return;
        }
        
        // Handle pong responses
        if (parsedMessage.type === 'pong') {
          return;
        }
        
        console.log('Received message:', parsedMessage);

        // Handle command messages
        if (parsedMessage.type === 'command') {
          const { target, action } = parsedMessage.data;
          
          // Get current sensor data
          const currentData = await storage.getSensorData();
          if (!currentData) {
            ws.send(JSON.stringify({
              type: 'error',
              data: { message: 'No sensor data available' }
            }));
            return;
          }

          // Update sensor data based on command
          let updatedData: InsertSensorData = { ...currentData };
          let activityDescription = '';
          
          if (target === 'pump') {
            updatedData.pumpStatus = action === 'start' ? 'active' : 'inactive';
            activityDescription = `Pump turned ${action === 'start' ? 'on' : 'off'} by user`;
          } 
          else if (target === 'light') {
            updatedData.lightStatus = action === 'on' ? 'on' : 'off';
            activityDescription = `Lights turned ${action} by user`;
          }

          // Save updated sensor data
          const savedData = await storage.saveSensorData(updatedData);
          
          // Create activity log
          await storage.createActivity({
            type: 'command',
            description: activityDescription,
            icon: target === 'pump' ? 'pump' : 'light'
          });

          // Broadcast updated sensor data to all clients
          broadcast({
            type: 'sensorData',
            data: savedData
          });

          // Send command acknowledgment
          ws.send(JSON.stringify({
            type: 'commandResponse',
            data: {
              status: 'success',
              message: `${target} ${action} command processed successfully`,
              target,
              action
            }
          }));
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
        ws.send(JSON.stringify({
          type: 'error',
          data: { message: 'Error processing message' }
        }));
      }
    });

    // Handle disconnection
    ws.on('close', (code, reason) => {
      console.log(`WebSocket client disconnected: ${code} ${reason}`);
      clients.delete(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket client error:', error);
      clients.delete(ws);
    });
  });

  // Set up simulated data updates
  setInterval(async () => {
    try {
      // Get latest sensor data
      const currentData = await storage.getSensorData();
      if (!currentData) return;

      // Update with small random variations
      const updatedData = updateSensorData(currentData);
      
      // Save to storage
      const savedData = await storage.saveSensorData(updatedData);
      
      // Broadcast to all clients
      broadcast({
        type: 'sensorData',
        data: savedData
      });
      
    } catch (error) {
      console.error('Error updating sensor data:', error);
    }
  }, 5000); // Update every 5 seconds

  // Generate random notifications occasionally
  setInterval(async () => {
    if (Math.random() > 0.7) { // 30% chance to send a notification
      try {
        const notificationTypes: InsertNotification[] = [
          { level: 'info', message: 'System performing routine maintenance' },
          { level: 'info', message: 'Fertilizer levels optimal' },
          { level: 'warning', message: 'Water level below 40%, consider refilling soon' },
          { level: 'warning', message: 'Nutrient imbalance detected in Tower 2' },
          { level: 'danger', message: 'Critical temperature increase detected in greenhouse section 3' }
        ];

        const notification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        
        // Save notification
        const savedNotification = await storage.createNotification(notification);
        
        // Broadcast to all clients
        broadcast({
          type: 'notification',
          data: savedNotification
        });
        
      } catch (error) {
        console.error('Error creating notification:', error);
      }
    }
  }, 20000); // Try to generate a notification every 20 seconds

  // Send system status updates periodically
  setInterval(() => {
    try {
      broadcast({
        type: 'systemStatus',
        data: {
          serverTime: new Date().toISOString(),
          activeConnections: clients.size,
          systemStatus: 'operational'
        }
      });
    } catch (error) {
      console.error('Error sending system status:', error);
    }
  }, 60000); // Every minute

  // Plant Marketplace endpoints
  app.get('/api/marketplace/listings', async (req, res) => {
    const listings = [
      {
        id: 1,
        title: "Beautiful Monstera Deliciosa",
        description: "Large, healthy monstera with fenestrated leaves. Perfect for bright indoor spaces.",
        plantType: "houseplant",
        variety: "Monstera Deliciosa",
        age: "2 years",
        condition: "excellent",
        location: "San Francisco, CA",
        price: 45,
        tradeOnly: false,
        wantedPlants: ["Fiddle Leaf Fig", "Snake Plant"],
        images: [],
        sellerId: 1,
        sellerName: "PlantMom87",
        sellerRating: 4.8,
        createdAt: new Date().toISOString(),
        status: "available",
        likes: 23,
        views: 156
      },
      {
        id: 2,
        title: "Rare Variegated Pothos Cuttings",
        description: "Gorgeous variegated pothos cuttings with beautiful cream and green patterns.",
        plantType: "houseplant",
        variety: "Pothos Marble Queen",
        age: "6 months",
        condition: "good",
        location: "Portland, OR",
        tradeOnly: true,
        wantedPlants: ["Monstera Adansonii", "Philodendron Pink Princess"],
        images: [],
        sellerId: 2,
        sellerName: "GreenThumb_Joe",
        sellerRating: 4.9,
        createdAt: new Date().toISOString(),
        status: "available",
        likes: 34,
        views: 203
      },
      {
        id: 3,
        title: "Organic Heirloom Tomato Seeds",
        description: "Cherokee Purple heirloom tomato seeds from my own harvest. High germination rate.",
        plantType: "vegetable",
        variety: "Cherokee Purple Tomato",
        age: "Fresh seeds",
        condition: "excellent",
        location: "Austin, TX",
        price: 12,
        tradeOnly: false,
        wantedPlants: ["Herb seeds", "Pepper seeds"],
        images: [],
        sellerId: 3,
        sellerName: "UrbanFarmer2024",
        sellerRating: 4.7,
        createdAt: new Date().toISOString(),
        status: "available",
        likes: 18,
        views: 89
      }
    ];
    res.json(listings);
  });

  app.get('/api/marketplace/offers', async (req, res) => {
    res.json([]);
  });

  app.post('/api/marketplace/listings', async (req, res) => {
    const newListing = {
      id: Date.now(),
      ...req.body,
      sellerId: 1,
      sellerName: "CurrentUser",
      sellerRating: 4.5,
      createdAt: new Date().toISOString(),
      status: "available",
      likes: 0,
      views: 0
    };
    res.json(newListing);
  });

  // Facility-specific sensor data endpoint
  app.get('/api/facilities/:id/sensors', async (req, res) => {
    try {
      const facilityId = parseInt(req.params.id);
      
      // Get facility details
      const towers = await storage.getTowers();
      const facilityTowers = towers.filter((t: any) => t.facilityId === facilityId);
      
      if (facilityTowers.length === 0) {
        return res.json({ message: 'No towers found for this facility' });
      }
      
      // Calculate environmental data for each tower in facility
      const sensorData = facilityTowers.map((tower: any) => {
        const envData = calculateFacilityEnvironment(
          tower.type || 'greenhouse',
          tower.location || 'San Francisco, CA',
          tower.id
        );
        
        return {
          towerId: tower.id,
          towerName: tower.name,
          ...envData,
          waterLevel: Math.max(20, Math.min(80, 60 + Math.floor(Math.random() * 20))),
          phLevel: (6.0 + Math.random() * 1.0).toFixed(2),
          soilMoisture: Math.max(30, Math.min(70, 50 + Math.floor(Math.random() * 20))),
          energyUsage: 200 + Math.floor(Math.random() * 200),
          timestamp: new Date().toISOString()
        };
      });
      
      res.json(sensorData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch facility sensor data' });
    }
  });

  return httpServer;
}
