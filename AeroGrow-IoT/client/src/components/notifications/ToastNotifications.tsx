import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ToastNotificationsProps {
  enabled: boolean;
}

interface PopupNotification {
  id: number;
  title: string;
  message: string;
  level: string;
  timestamp: Date;
  timeout?: number;
}

const ToastNotifications: React.FC<ToastNotificationsProps> = ({ enabled }) => {
  const [popupQueue, setPopupQueue] = useState<PopupNotification[]>([]);
  const { notifications } = useNotifications();
  const { toast } = useToast();

  // Track the last processed notification ID to avoid duplicates
  const [lastProcessedId, setLastProcessedId] = useState<number>(0);

  useEffect(() => {
    if (!enabled || notifications.length === 0) return;

    // Find new notifications that haven't been processed
    const newNotifications = notifications.filter(n => n.id > lastProcessedId);
    
    if (newNotifications.length > 0) {
      // Update the last processed ID
      const latestId = Math.max(...newNotifications.map(n => n.id));
      setLastProcessedId(latestId);

      // Process new notifications
      newNotifications.forEach(notification => {
        const popupNotification: PopupNotification = {
          id: notification.id,
          title: getNotificationTitle(notification.level),
          message: notification.message,
          level: notification.level,
          timestamp: new Date(notification.timestamp),
          timeout: getNotificationTimeout(notification.level)
        };

        // Add to popup queue
        setPopupQueue(prev => [...prev, popupNotification]);

        // Also trigger toast notification
        toast({
          title: popupNotification.title,
          description: popupNotification.message,
          variant: getToastVariant(notification.level),
          duration: popupNotification.timeout
        });
      });
    }
  }, [notifications, enabled, lastProcessedId, toast]);

  const getNotificationTitle = (level: string): string => {
    switch (level) {
      case 'danger':
        return 'Critical Alert';
      case 'warning':
        return 'Warning';
      case 'info':
        return 'Information';
      case 'success':
        return 'Success';
      default:
        return 'Notification';
    }
  };

  const getNotificationTimeout = (level: string): number => {
    switch (level) {
      case 'danger':
        return 8000; // 8 seconds for critical alerts
      case 'warning':
        return 6000; // 6 seconds for warnings
      default:
        return 4000; // 4 seconds for info/success
    }
  };

  const getToastVariant = (level: string) => {
    switch (level) {
      case 'danger':
        return 'destructive' as const;
      default:
        return 'default' as const;
    }
  };

  const getNotificationIcon = (level: string) => {
    switch (level) {
      case 'danger':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationColors = (level: string) => {
    switch (level) {
      case 'danger':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'success':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      default:
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const dismissNotification = (id: number) => {
    setPopupQueue(prev => prev.filter(n => n.id !== id));
  };

  // Auto-dismiss notifications after their timeout
  useEffect(() => {
    popupQueue.forEach(notification => {
      if (notification.timeout) {
        const timer = setTimeout(() => {
          dismissNotification(notification.id);
        }, notification.timeout);

        return () => clearTimeout(timer);
      }
    });
  }, [popupQueue]);

  if (!enabled) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm w-full">
      <AnimatePresence>
        {popupQueue.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.9 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 30,
              duration: 0.3 
            }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className={`shadow-lg border-l-4 ${getNotificationColors(notification.level)}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getNotificationIcon(notification.level)}
                    <CardTitle className="text-sm font-semibold">
                      {notification.title}
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-60 hover:opacity-100"
                    onClick={() => dismissNotification(notification.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                  {notification.message}
                </CardDescription>
                <p className="text-xs text-gray-400 mt-2">
                  {notification.timestamp.toLocaleTimeString()}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastNotifications;