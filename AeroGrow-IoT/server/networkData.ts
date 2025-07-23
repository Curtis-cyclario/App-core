import { NetworkData } from "@shared/schema";

// Helper function to generate towers
const generateTowerNodes = (count: number) => {
  const towerNodes = [];
  const towerY = [120, 240, 360];
  
  for (let i = 1; i <= count; i++) {
    // Distribute towers in 3 rows
    const row = Math.floor((i - 1) / Math.ceil(count / 3));
    const col = (i - 1) % Math.ceil(count / 3);
    const xPos = 360 + col * 80; // Increase spacing between columns
    const yPos = towerY[row] + (i % 2) * 25; // Slight vertical offset for odd/even numbered towers
    
    // Add tower
    towerNodes.push({
      id: `tower-${i}`,
      type: 'tower',
      name: `Tower ${i}`,
      status: Math.random() > 0.1 ? 'online' : 'warning',
      x: xPos,
      y: yPos,
      plantType: ['Lettuce', 'Basil', 'Spinach', 'Kale', 'Arugula'][Math.floor(Math.random() * 5)],
      growthStage: Math.floor(Math.random() * 100),
      health: 85 + Math.floor(Math.random() * 15)
    });
    
    // Add tower-specific sensors - restructured to display tower-specific readings
    towerNodes.push({
      id: `tower-${i}-temp`,
      type: 'sensor',
      name: `T${i} Temp`,
      status: 'online',
      x: xPos - 30,
      y: yPos - 35,
      value: (19 + Math.random() * 5).toFixed(1) // Temperature between 19-24°C
    });
    
    towerNodes.push({
      id: `tower-${i}-humidity`,
      type: 'sensor',
      name: `T${i} Humidity`,
      status: 'online',
      x: xPos + 30,
      y: yPos - 35,
      value: (65 + Math.random() * 15).toFixed(1) // Humidity between 65-80%
    });
    
    // Some towers have pH sensors
    if (i % 3 === 0) {
      towerNodes.push({
        id: `tower-${i}-ph`,
        type: 'sensor',
        name: `T${i} pH`,
        status: 'online',
        x: xPos,
        y: yPos + 40,
        value: (5.8 + Math.random() * 1.2).toFixed(1) // pH between 5.8-7.0
      });
    }
  }
  
  return towerNodes;
};

// Helper function to generate connections for towers
const generateTowerConnections = (count: number) => {
  const connections = [];
  
  for (let i = 1; i <= count; i++) {
    // Connect water to tower
    connections.push({
      source: 'water-hub', 
      target: `tower-${i}`, 
      status: 'online'
    });
    
    // Connect light to tower
    connections.push({
      source: 'light-hub', 
      target: `tower-${i}`, 
      status: 'online'
    });
    
    // Connect tower to sensors
    connections.push({
      source: `tower-${i}`, 
      target: `tower-${i}-temp`, 
      status: 'online'
    });
    
    connections.push({
      source: `tower-${i}`, 
      target: `tower-${i}-humidity`, 
      status: 'online'
    });
    
    // Connect sensors to sensor hub
    connections.push({
      source: `tower-${i}-temp`, 
      target: 'sensor-hub', 
      status: 'online'
    });
    
    connections.push({
      source: `tower-${i}-humidity`, 
      target: 'sensor-hub', 
      status: 'online'
    });
    
    // Connect pH sensors if they exist
    if (i % 3 === 0) {
      connections.push({
        source: `tower-${i}`, 
        target: `tower-${i}-ph`, 
        status: 'online'
      });
      
      connections.push({
        source: `tower-${i}-ph`, 
        target: 'sensor-hub', 
        status: 'online'
      });
    }
  }
  
  return connections;
};

// Network topology with left-to-right flow as specified:
// Water | Lights | Tower | Sensors | Data Delivery
export const defaultNetworkTopology: NetworkData = {
  nodes: [
    // Water system
    { id: 'water-hub', type: 'hub', name: 'Water Hub', status: 'online', x: 80, y: 240 },
    { id: 'water-pump', type: 'pump', name: 'Main Pump', status: 'online', x: 80, y: 320 },
    { id: 'water-reservoir', type: 'reservoir', name: 'Reservoir', status: 'online', x: 80, y: 400 },
    
    // Lighting system
    { id: 'light-hub', type: 'hub', name: 'Light Hub', status: 'online', x: 220, y: 240 },
    { id: 'light-controller', type: 'controller', name: 'Light Controller', status: 'online', x: 220, y: 320 },
    { id: 'light-panel', type: 'light', name: 'LED Array', status: 'online', x: 220, y: 400 },
    
    // Sensor system
    { id: 'sensor-hub', type: 'hub', name: 'Sensor Hub', status: 'online', x: 520, y: 100 },
    { id: 'sensor-master', type: 'controller', name: 'Master Controller', status: 'online', x: 520, y: 180 },
    
    // Data delivery
    { id: 'data-hub', type: 'hub', name: 'Data Hub', status: 'online', x: 680, y: 100 },
    { id: 'data-server', type: 'server', name: 'Analytics', status: 'online', x: 680, y: 180 },
    { id: 'data-storage', type: 'storage', name: 'Storage', status: 'online', x: 680, y: 260 },
    
    // Add 10 towers with their sensors
    ...generateTowerNodes(10)
  ],
  connections: [
    // Water connections
    { source: 'water-hub', target: 'water-pump', status: 'online' },
    { source: 'water-hub', target: 'water-reservoir', status: 'online' },
    
    // Light connections
    { source: 'light-hub', target: 'light-controller', status: 'online' },
    { source: 'light-hub', target: 'light-panel', status: 'online' },
    
    // Sensor connections
    { source: 'sensor-hub', target: 'sensor-master', status: 'online' },
    
    // Data connections
    { source: 'sensor-hub', target: 'data-hub', status: 'online' },
    { source: 'data-hub', target: 'data-server', status: 'online' },
    { source: 'data-hub', target: 'data-storage', status: 'online' },
    
    // System-to-system connections
    { source: 'water-hub', target: 'light-hub', status: 'online' },
    { source: 'light-hub', target: 'sensor-hub', status: 'online' },
    
    // Add connections for all 10 towers
    ...generateTowerConnections(10)
  ]
};