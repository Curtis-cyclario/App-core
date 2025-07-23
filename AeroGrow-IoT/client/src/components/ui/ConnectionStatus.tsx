import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, RotateCcw } from 'lucide-react';
import { useWebSocket } from '@/contexts/WebSocketContext';

export const ConnectionStatus: React.FC = () => {
  const { connectionStatus } = useWebSocket();

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: Wifi,
          text: 'Connected',
          className: 'connection-status connected',
          show: false, // Don't show when connected
        };
      case 'disconnected':
        return {
          icon: WifiOff,
          text: 'Disconnected',
          className: 'connection-status disconnected',
          show: true,
        };
      case 'reconnecting':
        return {
          icon: RotateCcw,
          text: 'Reconnecting...',
          className: 'connection-status reconnecting',
          show: true,
        };
      default:
        return {
          icon: WifiOff,
          text: 'Unknown',
          className: 'connection-status disconnected',
          show: true,
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {config.show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={config.className}
        >
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <span>{config.text}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};