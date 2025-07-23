import { WebSocketMessage } from '../types';

class WebSocketClient {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectTimeout = 2000;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private url: string = '';

  constructor() {
    this.setupSocket();
  }

  private setupSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    this.url = `${protocol}//${window.location.host}/ws`;
    
    console.log('Attempting to connect to WebSocket at:', this.url);
    
    try {
      this.socket = new WebSocket(this.url);
      
      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        this.reconnectAttempts = 0;
        this.emit('connection', { status: 'connected' });
        
        // Send ping to server
        this.sendPing();
      };
      
      this.socket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.emit(message.type, message.data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
        this.emit('connection', { status: 'disconnected' });
        this.attemptReconnect();
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', { error: 'Connection error' });
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      this.fallbackToSimulatedData();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnect attempts reached, falling back to simulated data');
      this.fallbackToSimulatedData();
      return;
    }
    
    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    
    setTimeout(() => {
      this.setupSocket();
    }, this.reconnectTimeout * this.reconnectAttempts);
  }

  private fallbackToSimulatedData() {
    console.log('Falling back to simulated data mode');
    this.emit('connection', { status: 'simulated' });
    
    // Start sending simulated sensor data
    this.startSimulatedDataInterval();
  }

  private startSimulatedDataInterval() {
    // Initial simulated data
    let simulatedData = {
      temperature: '23.5',
      humidity: '68',
      waterLevel: '85',
      nutrientLevel: '76',
      pumpStatus: 'active',
      lightStatus: 'on',
      id: 1,
      timestamp: new Date().toISOString()
    };
    
    // Emit initial data
    this.emit('sensorData', simulatedData);
    
    // Update simulated data every 5 seconds
    setInterval(() => {
      // Add small random variations
      simulatedData = {
        ...simulatedData,
        temperature: (parseFloat(simulatedData.temperature) + (Math.random() * 0.6 - 0.3)).toFixed(1),
        humidity: Math.min(100, Math.max(30, parseFloat(simulatedData.humidity) + (Math.random() * 3 - 1.5))).toFixed(0),
        waterLevel: Math.min(100, Math.max(0, parseFloat(simulatedData.waterLevel) - Math.random() * 0.3)).toFixed(0),
        nutrientLevel: Math.min(100, Math.max(0, parseFloat(simulatedData.nutrientLevel) - Math.random() * 0.2)).toFixed(0),
        timestamp: new Date().toISOString()
      };
      
      this.emit('sensorData', simulatedData);
    }, 5000);
    
    // Occasionally send notifications
    setInterval(() => {
      if (Math.random() > 0.7) {
        const notificationTypes = [
          { level: 'info' as const, message: 'System performing routine maintenance' },
          { level: 'info' as const, message: 'Fertilizer levels optimal' },
          { level: 'warning' as const, message: 'Water level below 40%, consider refilling soon' },
          { level: 'warning' as const, message: 'Nutrient imbalance detected in Tower 2' },
          { level: 'danger' as const, message: 'Critical temperature increase detected in greenhouse section 3' }
        ];
        
        const notification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        
        this.emit('notification', {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          level: notification.level,
          message: notification.message,
          read: false
        });
      }
    }, 20000);
    
    // Send system status updates
    setInterval(() => {
      this.emit('systemStatus', {
        serverTime: new Date().toISOString(),
        activeConnections: 1,
        systemStatus: 'simulated'
      });
    }, 60000);
  }

  private sendPing() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'ping',
        data: { timestamp: Date.now() }
      }));
      
      // Schedule next ping
      setTimeout(() => this.sendPing(), 30000);
    }
  }

  public on(type: string, callback: (data: any) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    
    this.listeners.get(type)?.add(callback);
    
    return () => {
      this.listeners.get(type)?.delete(callback);
    };
  }

  private emit(type: string, data: any) {
    if (this.listeners.has(type)) {
      this.listeners.get(type)?.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in listener for ${type}:`, error);
        }
      });
    }
  }

  public send(message: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, handling locally');
      
      // Handle special case for commands in simulated mode
      if (message.type === 'command') {
        const { target, action } = message.data;
        
        if (target === 'pump') {
          this.emit('commandResponse', {
            status: 'success',
            message: `${target} ${action} command processed successfully`,
            target,
            action
          });
          
          this.emit('sensorData', {
            temperature: (23 + Math.random()).toFixed(1),
            humidity: Math.floor(65 + Math.random() * 10),
            waterLevel: Math.floor(80 + Math.random() * 10),
            nutrientLevel: Math.floor(70 + Math.random() * 10),
            pumpStatus: action === 'start' ? 'active' : 'inactive',
            lightStatus: Math.random() > 0.5 ? 'on' : 'off',
            id: Date.now(),
            timestamp: new Date().toISOString()
          });
        } 
        else if (target === 'light') {
          this.emit('commandResponse', {
            status: 'success',
            message: `${target} ${action} command processed successfully`,
            target,
            action
          });
          
          this.emit('sensorData', {
            temperature: (23 + Math.random()).toFixed(1),
            humidity: Math.floor(65 + Math.random() * 10),
            waterLevel: Math.floor(80 + Math.random() * 10),
            nutrientLevel: Math.floor(70 + Math.random() * 10),
            pumpStatus: Math.random() > 0.5 ? 'active' : 'inactive',
            lightStatus: action === 'on' ? 'on' : 'off',
            id: Date.now(),
            timestamp: new Date().toISOString()
          });
        }
      }
    }
  }

  public isConnected() {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  public close() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

// Create a singleton instance
export const webSocketClient = new WebSocketClient();
