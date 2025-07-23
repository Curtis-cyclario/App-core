import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

interface WebSocketContextType {
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting' | 'error';
  sendMessage: (message: any) => void;
  lastMessage: any;
}

// Create context with default values
export const WebSocketContext = createContext<WebSocketContextType>({
  connectionStatus: 'disconnected',
  sendMessage: () => {},
  lastMessage: null
});

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting' | 'error'>('disconnected');
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        
        const websocket = new WebSocket(wsUrl);
        setWs(websocket);
        setConnectionStatus('reconnecting');

        websocket.onopen = () => {
          setConnectionStatus('connected');
          // Send initial ping
          websocket.send(JSON.stringify({ type: 'ping', data: { timestamp: Date.now() } }));
        };

        websocket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            
            // Handle ping-pong
            if (message.type === 'ping') {
              websocket.send(JSON.stringify({ type: 'pong', data: { timestamp: Date.now() } }));
              return;
            }
            
            // Filter out system messages
            if (message.type !== 'pong' && message.type !== 'response') {
              setLastMessage({ ...message, timestamp: new Date() });
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        websocket.onclose = () => {
          setConnectionStatus('disconnected');
          // Attempt to reconnect after 3 seconds
          setTimeout(connectWebSocket, 3000);
        };

        websocket.onerror = () => {
          setConnectionStatus('error');
        };

      } catch (error) {
        console.error('WebSocket connection error:', error);
        setConnectionStatus('error');
      }
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const sendMessage = (message: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  };

  return (
    <WebSocketContext.Provider value={{
      connectionStatus,
      sendMessage,
      lastMessage
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use WebSocket context
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
