import { useContext, useState, useEffect } from 'react';
import { WebSocketContext } from '../contexts/WebSocketContext';
import { SensorData } from '../types';
import { apiRequest } from '@/lib/queryClient';

export function useSensorData() {
  const { lastMessage } = useContext(WebSocketContext);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial sensor data
  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoading(true);
        const response = await apiRequest('GET', '/api/sensor-data');
        const data = await response.json();
        setSensorData(data);
      } catch (err) {
        console.error('Failed to fetch initial sensor data:', err);
        setError('Failed to fetch sensor data');
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();
  }, []);

  // Update sensor data from WebSocket messages
  useEffect(() => {
    if (lastMessage && lastMessage.type === 'sensorData') {
      setSensorData(lastMessage.data);
      // Clear any previous error when we get valid data
      setError(null);
    }
  }, [lastMessage]);

  // Send command to control equipment
  const sendCommand = useContext(WebSocketContext).sendMessage;

  const togglePump = (active: boolean) => {
    sendCommand({
      type: 'command',
      data: {
        target: 'pump',
        action: active ? 'start' : 'stop'
      }
    });
  };

  const toggleLight = (on: boolean) => {
    sendCommand({
      type: 'command',
      data: {
        target: 'light',
        action: on ? 'on' : 'off'
      }
    });
  };

  // Calculate device statuses from sensor data
  const deviceStatus = {
    pump: {
      status: sensorData?.pumpStatus === 'active' ? 'Active' : 'Inactive',
      active: sensorData?.pumpStatus === 'active'
    },
    light: {
      status: sensorData?.lightStatus === 'on' ? 'On' : 'Off',
      active: sensorData?.lightStatus === 'on'
    }
  };

  return {
    sensorData,
    loading,
    error,
    togglePump,
    toggleLight,
    deviceStatus,
    lastUpdated: sensorData?.timestamp ? new Date(sensorData.timestamp) : null
  };
}

export function useSensorHistory(hours: number = 24) {
  const [history, setHistory] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true);
        const response = await apiRequest('GET', `/api/sensor-history?hours=${hours}`);
        const data = await response.json();
        setHistory(data);
      } catch (err) {
        console.error('Failed to fetch sensor history:', err);
        setError('Failed to fetch sensor history');
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [hours]);

  // Format data for Chart.js
  const chartData = {
    temperature: history.map(d => ({ x: new Date(d.timestamp), y: parseFloat(d.temperature) })),
    humidity: history.map(d => ({ x: new Date(d.timestamp), y: parseFloat(d.humidity) })),
    waterLevel: history.map(d => ({ x: new Date(d.timestamp), y: parseFloat(d.waterLevel) })),
    nutrientLevel: history.map(d => ({ x: new Date(d.timestamp), y: parseFloat(d.nutrientLevel) }))
  };

  return {
    history,
    chartData,
    loading,
    error
  };
}
