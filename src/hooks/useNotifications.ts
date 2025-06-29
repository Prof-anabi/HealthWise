import { useState, useEffect } from 'react';
import { NotificationService, type NotificationWithMetadata } from '../services/notificationService';
import { useAuth } from './useAuth';

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationWithMetadata[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load notifications
  const loadNotifications = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const [notificationsData, unreadCountData] = await Promise.all([
        NotificationService.getNotifications(user.id),
        NotificationService.getUnreadCount(user.id)
      ]);
      
      setNotifications(notificationsData);
      setUnreadCount(unreadCountData);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    const success = await NotificationService.markAsRead(notificationId);
    if (success) {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    return success;
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user) return false;
    
    const success = await NotificationService.markAllAsRead(user.id);
    if (success) {
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
      setUnreadCount(0);
    }
    return success;
  };

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    const success = await NotificationService.deleteNotification(notificationId);
    if (success) {
      setNotifications(prev => {
        const notification = prev.find(n => n.id === notificationId);
        const newNotifications = prev.filter(n => n.id !== notificationId);
        
        // Update unread count if the deleted notification was unread
        if (notification && !notification.is_read) {
          setUnreadCount(prevCount => Math.max(0, prevCount - 1));
        }
        
        return newNotifications;
      });
    }
    return success;
  };

  // Create notification
  const createNotification = async (
    type: 'message' | 'appointment' | 'test_result' | 'medication' | 'system',
    title: string,
    message: string,
    options?: {
      priority?: 'normal' | 'high' | 'urgent';
      actionUrl?: string;
      metadata?: any;
    }
  ) => {
    if (!user) return null;

    const notification = await NotificationService.createNotification({
      user_id: user.id,
      title,
      message,
      notification_type: type,
      priority: options?.priority || 'normal',
      action_url: options?.actionUrl,
      metadata: options?.metadata || {},
    });

    if (notification) {
      // Add to local state
      setNotifications(prev => [notification as NotificationWithMetadata, ...prev]);
      if (!notification.is_read) {
        setUnreadCount(prev => prev + 1);
      }
    }

    return notification;
  };

  // Request browser notification permission
  const requestPermission = async () => {
    return await NotificationService.requestNotificationPermission();
  };

  // Load notifications on mount and when user changes
  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!user) return;

    const subscription = NotificationService.subscribeToNotifications(
      user.id,
      (newNotification) => {
        setNotifications(prev => [newNotification as NotificationWithMetadata, ...prev]);
        if (!newNotification.is_read) {
          setUnreadCount(prev => prev + 1);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return {
    notifications,
    unreadCount,
    isLoading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    requestPermission,
  };
};