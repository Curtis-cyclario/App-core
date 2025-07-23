import { useContext, useState, useEffect } from 'react';
import { WebSocketContext } from '../contexts/WebSocketContext';
import { Notification, Activity } from '../types';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export function useNotifications() {
  const { lastMessage } = useContext(WebSocketContext);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch initial notifications
  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoading(true);
        const response = await apiRequest('GET', '/api/notifications');
        const data = await response.json();
        setNotifications(data);
        
        // Also fetch unread count
        const countResponse = await apiRequest('GET', '/api/notifications/count');
        const countData = await countResponse.json();
        setUnreadCount(countData.count);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
        setError('Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();
  }, []);

  // Update notifications from WebSocket messages
  useEffect(() => {
    if (lastMessage && lastMessage.type === 'notification') {
      // Add new notification to the list
      setNotifications(prev => [lastMessage.data, ...prev]);
      // Increment unread count
      setUnreadCount(prev => prev + 1);
      
      // Show toast notification
      toast({
        title: getNotificationTitle(lastMessage.data.level),
        description: lastMessage.data.message,
        variant: getNotificationVariant(lastMessage.data.level),
      });
    }
  }, [lastMessage, toast]);

  // Helper functions to map notification level to UI elements
  function getNotificationTitle(level: string): string {
    switch(level) {
      case 'danger': return 'Alert';
      case 'warning': return 'Warning';
      case 'info': default: return 'Information';
    }
  }
  
  function getNotificationVariant(level: string): 'default' | 'destructive' | null {
    switch(level) {
      case 'danger': return 'destructive';
      default: return 'default';
    }
  }

  // Mark notification as read
  const markAsRead = async (id: number) => {
    try {
      await apiRequest('POST', `/api/notifications/read/${id}`);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      setError('Failed to update notification');
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await apiRequest('POST', '/api/notifications/read-all');
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      
      // Reset unread count
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
      setError('Failed to update notifications');
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead
  };
}

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch activities
  useEffect(() => {
    async function fetchActivities() {
      try {
        setLoading(true);
        const response = await apiRequest('GET', '/api/activities');
        const data = await response.json();
        setActivities(data);
      } catch (err) {
        console.error('Failed to fetch activities:', err);
        setError('Failed to fetch activities');
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  return {
    activities,
    loading,
    error
  };
}
