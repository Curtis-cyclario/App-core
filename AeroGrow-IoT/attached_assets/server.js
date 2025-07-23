const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// In-memory storage for connected clients and sensor data
const clients = new Set();
let sensorData = {
  temperature: '23.5',
  humidity: '68',
  waterLevel: '85',
  nutrientLevel: '76',
  pumpStatus: 'active',
  lightStatus: 'on',
  lastUpdated: new Date().toISOString()
};

// Simulate changes in sensor data
function updateSensorData() {
  // Add small random variations to simulate real sensor readings
  sensorData = {
    temperature: (parseFloat(sensorData.temperature) + (Math.random() * 0.6 - 0.3)).toFixed(1),
    humidity: Math.min(100, Math.max(30, parseFloat(sensorData.humidity) + (Math.random() * 3 - 1.5))).toFixed(0),
    waterLevel: Math.min(100, Math.max(0, parseFloat(sensorData.waterLevel) - Math.random() * 0.3)).toFixed(0),
    nutrientLevel: Math.min(100, Math.max(0, parseFloat(sensorData.nutrientLevel) - Math.random() * 0.2)).toFixed(0),
    pumpStatus: sensorData.pumpStatus,
    lightStatus: sensorData.lightStatus,
    lastUpdated: new Date().toISOString()
  };

  // Broadcast to all connected clients
  broadcastSensorData();
}

// Broadcast sensor data to all connected clients
function broadcastSensorData() {
  const message = JSON.stringify({
    type: 'sensorData',
    data: sensorData
  });

  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

// Process client commands
function processCommand(command, ws) {
  try {
    const parsedCommand = JSON.parse(command);

    if (parsedCommand.type === 'ping') {
      // Respond to ping messages
      ws.send(JSON.stringify({
        type: 'pong',
        data: { timestamp: parsedCommand.data.timestamp }
      }));
      return;
    }

    if (parsedCommand.type === 'command') {
      const { target, action, value } = parsedCommand.data;

      // Process different commands
      if (target === 'pump') {
        sensorData.pumpStatus = action === 'start' ? 'active' : 'inactive';
        console.log(`Pump ${action} command received`);
      } else if (target === 'light') {
        sensorData.lightStatus = action === 'on' ? 'on' : 'off';
        console.log(`Light ${action} command received`);
      }

      // Broadcast updated sensor data to all clients
      broadcastSensorData();

      // Send acknowledgment
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
    console.error('Error processing command:', error);
    ws.send(JSON.stringify({
      type: 'error',
      data: {
        message: 'Error processing command',
        details: error.message
      }
    }));
  }
}

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.add(ws);

  // Send current sensor data to new client
  ws.send(JSON.stringify({
    type: 'sensorData',
    data: sensorData
  }));

  // Handle messages from client
  ws.on('message', (message) => {
    console.log('Received:', message);
    processCommand(message, ws);
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });
});

// Update sensor data every 5 seconds
setInterval(updateSensorData, 5000);

// Send current time to all clients every minute
setInterval(() => {
  const message = JSON.stringify({
    type: 'systemStatus',
    data: {
      serverTime: new Date().toISOString(),
      activeConnections: clients.size,
      systemStatus: 'operational'
    }
  });

  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}, 60000);

// Send random notifications occasionally
setInterval(() => {
  if (Math.random() > 0.7) { // 30% chance to send a notification
    const notificationTypes = [
      { level: 'info', message: 'System performing routine maintenance' },
      { level: 'info', message: 'Fertilizer levels optimal' },
      { level: 'warning', message: 'Water level below 40%, consider refilling soon' },
      { level: 'warning', message: 'Nutrient imbalance detected in Tower 2' },
      { level: 'danger', message: 'Critical temperature increase detected in greenhouse section 3' }
    ];

    const notification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];

    const message = JSON.stringify({
      type: 'notification',
      data: {
        id: Date.now(),
        level: notification.level,
        message: notification.message,
        timestamp: new Date().toISOString()
      }
    });

    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }
}, 20000);

// Handle all remaining GET requests with the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server running at ws://localhost:${PORT}`);
});