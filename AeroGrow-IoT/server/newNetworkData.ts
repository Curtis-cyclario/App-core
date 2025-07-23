import { NetworkData } from "@shared/schema";

// Define the grid system for organic layout
const GRID_SIZE = 100;
const CENTER_X = 400;
const CENTER_Y = 300;

/**
 * Creates a visually appealing organic layout for the network topology
 * 
 * The design principles:
 * 1. Central pipeline with hub nodes aligned horizontally
 * 2. Tower nodes surrounding the central pipeline in a semi-circular pattern
 * 3. Slight randomness for organic feel with controlled boundaries
 * 4. Visual grouping of related components
 */
function getPosition(nodeType: string, index: number, total: number, variant: string = 'default'): { x: number, y: number } {
  // Base coordinates
  let x = CENTER_X;
  let y = CENTER_Y;
  
  // Golden ratio for aesthetically pleasing spiral positioning
  const goldenRatio = 1.618033988749895;
  
  switch(nodeType) {
    case 'hub':
      // Main pipeline hubs are positioned horizontally in the center
      // with equal spacing
      const hubSpacing = 180;
      const hubOffset = (total - 1) * hubSpacing / 2;
      x = CENTER_X - hubOffset + (index * hubSpacing);
      y = CENTER_Y;
      
      // Add a slight vertical variance for organic feel
      const verticalVariance = 20;
      y += Math.sin(index * Math.PI/2) * verticalVariance;
      break;
      
    case 'tower':
      // Position towers in a semicircle around the central pipeline
      // Distribute 1-5 in top semicircle, 6-10 in bottom semicircle
      const radius = 220;
      let angle;
      
      if (index < 5) {
        // Top semicircle (towers 1-5)
        angle = Math.PI - (Math.PI * (index + 1) / 6);
      } else {
        // Bottom semicircle (towers 6-10)
        angle = Math.PI * (index - 4) / 6;
      }
      
      // Apply golden ratio influenced offset for organic feel
      const offsetMagnitude = 20;
      const offsetAngle = (index * goldenRatio) % (2 * Math.PI);
      const offsetX = Math.cos(offsetAngle) * offsetMagnitude;
      const offsetY = Math.sin(offsetAngle) * offsetMagnitude;
      
      x = CENTER_X + Math.cos(angle) * radius + offsetX;
      y = CENTER_Y + Math.sin(angle) * radius + offsetY;
      break;
      
    case 'sensor':
      // Position sensors near their respective towers
      // The variant parameter indicates which tower this sensor belongs to
      if (variant.startsWith('tower-')) {
        const towerNumber = parseInt(variant.split('-')[1]);
        const towerIndex = towerNumber - 1;
        
        // Get the associated tower's position
        const towerPos = getPosition('tower', towerIndex, 10);
        
        // Orbital positioning around the tower
        const sensorAngle = (index * 2.5);
        const sensorRadius = 40;
        
        x = towerPos.x + Math.cos(sensorAngle) * sensorRadius;
        y = towerPos.y + Math.sin(sensorAngle) * sensorRadius;
      } else {
        // For general sensors
        const sensorRadius = 80;
        const angle = Math.PI * 2 * (index / total);
        x = CENTER_X + Math.cos(angle) * sensorRadius;
        y = CENTER_Y + Math.sin(angle) * sensorRadius;
      }
      break;
      
    case 'subsystem':
      // Position subsystems (pumps, controllers, etc.) near their parent hub
      if (variant) {
        // Identify the parent system
        const systemType = variant.split('-')[0]; // e.g., "water" from "water-pump"
        
        // Get the hub index based on system type
        let hubIndex = 0;
        if (systemType === 'water') hubIndex = 0;
        else if (systemType === 'light') hubIndex = 1;
        else if (systemType === 'sensor') hubIndex = 2;
        else if (systemType === 'data') hubIndex = 3;
        
        // Get the hub position
        const hubPos = getPosition('hub', hubIndex, 4);
        
        // Position in a circle around the hub
        const subAngle = Math.PI * 2 * (index / 3) + (hubIndex * Math.PI/2);
        const subRadius = 70;
        
        x = hubPos.x + Math.cos(subAngle) * subRadius;
        y = hubPos.y + Math.sin(subAngle) * subRadius;
      }
      break;
      
    default:
      // Use a spiral arrangement for any other node types
      const spiralAngle = index * 0.5 * goldenRatio;
      const spiralRadius = 20 + (8 * index);
      
      x = CENTER_X + Math.cos(spiralAngle) * spiralRadius;
      y = CENTER_Y + Math.sin(spiralAngle) * spiralRadius;
  }
  
  return { x, y };
}

/**
 * Generate tower nodes in a beautiful organic arrangement
 * - Positions towers in a semicircle around the central pipeline
 * - Adds unique sensor configurations to each tower
 * - Creates a visually balanced and organic layout
 */
const generateTowerNodes = (count: number) => {
  const towerNodes = [];
  const plantTypes = ['Lettuce', 'Basil', 'Spinach', 'Kale', 'Arugula', 'Mint', 'Bok Choy', 'Strawberry', 'Herbs Mix', 'Microgreens'];
  
  // Generate exactly 10 active towers
  for (let i = 1; i <= count; i++) {
    const position = getPosition('tower', i-1, count);
    const plantType = plantTypes[i-1]; // Assign a unique plant type to each tower
    
    // Random health and growth values that are consistently high
    const health = 85 + Math.floor(Math.random() * 15);
    const growthStage = Math.floor(Math.random() * 100);
    
    // Add tower with distinct styling
    towerNodes.push({
      id: `tower-${i}`,
      type: 'tower',
      name: `Tower ${i}`,
      status: Math.random() > 0.15 ? 'online' : 'warning',
      x: position.x,
      y: position.y,
      plantType,
      growthStage,
      health
    });
    
    // Add tower-specific sensors with orbital positioning
    
    // Every tower has a temperature sensor
    towerNodes.push({
      id: `tower-${i}-temp`,
      type: 'sensor',
      name: `T${i} Temp`,
      status: 'online',
      ...getPosition('sensor', 0, 3, `tower-${i}`),
      value: (20 + Math.random() * 4).toFixed(1) // Temperature between 20-24°C
    });
    
    // Every tower has a humidity sensor
    towerNodes.push({
      id: `tower-${i}-humidity`,
      type: 'sensor',
      name: `T${i} Humidity`,
      status: 'online',
      ...getPosition('sensor', 1, 3, `tower-${i}`),
      value: (65 + Math.random() * 15).toFixed(1) // Humidity between 65-80%
    });
    
    // Every third tower (1, 4, 7, 10) has a pH sensor
    if (i % 3 === 1) {
      towerNodes.push({
        id: `tower-${i}-ph`,
        type: 'sensor',
        name: `T${i} pH`,
        status: 'online',
        ...getPosition('sensor', 2, 3, `tower-${i}`),
        value: (5.8 + Math.random() * 1.2).toFixed(1) // pH between 5.8-7.0
      });
    }
    
    // Every fourth tower (2, 6, 10) has a nutrient sensor
    if (i % 4 === 2) {
      towerNodes.push({
        id: `tower-${i}-nutrient`,
        type: 'sensor',
        name: `T${i} EC`,
        status: 'online',
        ...getPosition('sensor', 2, 3, `tower-${i}`),
        value: (1.2 + Math.random() * 0.8).toFixed(2) // EC between 1.2-2.0
      });
    }
  }
  
  return towerNodes;
};

/**
 * Generate connections between nodes with organic flow patterns
 * - Creates central pipeline between hubs
 * - Connects towers to the appropriate systems
 * - Connects sensors to their towers and to the sensor hub
 */
const generateTowerConnections = (count: number) => {
  const connections = [];
  
  // Generate connections for each tower
  for (let i = 1; i <= count; i++) {
    // Tower to hub connections with curving patterns
    
    // Water hub connection
    connections.push({
      source: 'water-hub', 
      target: `tower-${i}`, 
      status: 'online',
      flowRate: Math.floor(10 + Math.random() * 5) // Flow rate data for animation
    });
    
    // Light hub connection 
    connections.push({
      source: 'light-hub', 
      target: `tower-${i}`, 
      status: 'online',
      intensity: Math.floor(80 + Math.random() * 20) // Light intensity for styling
    });
    
    // Connect tower to its sensors
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
    
    // Connect sensors to sensor hub with data flow visualization
    connections.push({
      source: `tower-${i}-temp`, 
      target: 'sensor-hub', 
      status: 'online',
      dataRate: Math.floor(1 + Math.random() * 5) // Data rate for animation
    });
    
    connections.push({
      source: `tower-${i}-humidity`, 
      target: 'sensor-hub', 
      status: 'online',
      dataRate: Math.floor(1 + Math.random() * 5)
    });
    
    // Connect pH sensors if they exist (every third tower)
    if (i % 3 === 1) {
      connections.push({
        source: `tower-${i}`, 
        target: `tower-${i}-ph`, 
        status: 'online'
      });
      
      connections.push({
        source: `tower-${i}-ph`, 
        target: 'sensor-hub', 
        status: 'online',
        dataRate: Math.floor(1 + Math.random() * 3)
      });
    }
    
    // Connect nutrient sensors if they exist (every fourth tower)
    if (i % 4 === 2) {
      connections.push({
        source: `tower-${i}`, 
        target: `tower-${i}-nutrient`, 
        status: 'online'
      });
      
      connections.push({
        source: `tower-${i}-nutrient`, 
        target: 'sensor-hub', 
        status: 'online',
        dataRate: Math.floor(1 + Math.random() * 3)
      });
    }
  }
  
  return connections;
};

// Network topology with modern organic layout and central pipeline
export const newNetworkTopology: NetworkData = {
  nodes: [
    // Water system - first hub in the pipeline
    { 
      id: 'water-hub', 
      type: 'hub', 
      name: 'Water Hub', 
      status: 'online', 
      ...getPosition('hub', 0, 4)
    },
    { 
      id: 'water-pump', 
      type: 'subsystem', 
      name: 'Main Pump', 
      status: 'online', 
      ...getPosition('subsystem', 0, 3, 'water-pump')
    },
    { 
      id: 'water-reservoir', 
      type: 'subsystem', 
      name: 'Reservoir', 
      status: 'online', 
      ...getPosition('subsystem', 1, 3, 'water-reservoir')
    },
    
    // Lighting system - second hub in the pipeline
    { 
      id: 'light-hub', 
      type: 'hub', 
      name: 'Light Hub', 
      status: 'online', 
      ...getPosition('hub', 1, 4)
    },
    { 
      id: 'light-controller', 
      type: 'subsystem', 
      name: 'Light Controller', 
      status: 'online', 
      ...getPosition('subsystem', 0, 3, 'light-controller')
    },
    { 
      id: 'light-panel', 
      type: 'subsystem', 
      name: 'LED Array', 
      status: 'online', 
      ...getPosition('subsystem', 1, 3, 'light-panel')
    },
    
    // Sensor system - third hub in the pipeline
    { 
      id: 'sensor-hub', 
      type: 'hub', 
      name: 'Sensor Hub', 
      status: 'online', 
      ...getPosition('hub', 2, 4)
    },
    { 
      id: 'sensor-master', 
      type: 'subsystem', 
      name: 'Master Controller', 
      status: 'online', 
      ...getPosition('subsystem', 0, 2, 'sensor-master')
    },
    
    // Data system - fourth hub in the pipeline
    { 
      id: 'data-hub', 
      type: 'hub', 
      name: 'Data Hub', 
      status: 'online', 
      ...getPosition('hub', 3, 4)
    },
    { 
      id: 'data-server', 
      type: 'subsystem', 
      name: 'Analytics', 
      status: 'online', 
      ...getPosition('subsystem', 0, 3, 'data-server')
    },
    { 
      id: 'data-storage', 
      type: 'subsystem', 
      name: 'Storage', 
      status: 'online', 
      ...getPosition('subsystem', 1, 3, 'data-storage')
    },
    
    // Generate 10 towers with their sensors
    ...generateTowerNodes(10)
  ],
  connections: [
    // Central pipeline connections
    { source: 'water-hub', target: 'light-hub', status: 'online', isCentral: true },
    { source: 'light-hub', target: 'sensor-hub', status: 'online', isCentral: true },
    { source: 'sensor-hub', target: 'data-hub', status: 'online', isCentral: true },
    
    // Water system internal connections
    { source: 'water-hub', target: 'water-pump', status: 'online' },
    { source: 'water-hub', target: 'water-reservoir', status: 'online' },
    
    // Light system internal connections
    { source: 'light-hub', target: 'light-controller', status: 'online' },
    { source: 'light-controller', target: 'light-panel', status: 'online' },
    
    // Sensor system internal connections
    { source: 'sensor-hub', target: 'sensor-master', status: 'online' },
    
    // Data system internal connections
    { source: 'data-hub', target: 'data-server', status: 'online' },
    { source: 'data-hub', target: 'data-storage', status: 'online' },
    
    // Add tower connections
    ...generateTowerConnections(10)
  ]
};