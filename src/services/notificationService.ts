import { supabase, handleSupabaseError } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Notification = Database['public']['Tables']['notifications']['Row'];
type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];

export interface NotificationWithMetadata extends Notification {
  formattedTime?: string;
  actionLabel?: string;
  canDismiss?: boolean;
  requiresAction?: boolean;
}

export class NotificationService {
  // Get notifications for a user
  static async getNotifications(userId: string, limit: number = 50): Promise<NotificationWithMetadata[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Enhance notifications with additional metadata
      const enhancedNotifications = (data || []).map(notification => ({
        ...notification,
        canDismiss: notification.notification_type !== 'system',
        requiresAction: notification.priority === 'urgent' || notification.action_url !== null,
        actionLabel: this.getActionLabel(notification.notification_type),
      }));

      return enhancedNotifications;
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  }

  // Get unread notification count
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      handleSupabaseError(error);
      return 0;
    }
  }

  // Create a notification
  static async createNotification(notificationData: NotificationInsert): Promise<Notification | null> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notificationData)
        .select()
        .single();

      if (error) throw error;

      // Trigger real-time notification if user is online
      this.triggerRealTimeNotification(notificationData.user_id, data);

      return data;
    } catch (error) {
      handleSupabaseError(error);
      return null;
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      handleSupabaseError(error);
      return false;
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return true;
    } catch (error) {
      handleSupabaseError(error);
      return false;
    }
  }

  // Delete a notification
  static async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      handleSupabaseError(error);
      return false;
    }
  }

  // Create message notification
  static async createMessageNotification(
    recipientId: string,
    senderName: string,
    conversationId: string,
    messagePreview: string,
    priority: 'normal' | 'high' | 'urgent' = 'normal'
  ): Promise<void> {
    await this.createNotification({
      user_id: recipientId,
      title: `New message from ${senderName}`,
      message: messagePreview,
      notification_type: 'message',
      priority,
      action_url: `/messages?conversation=${conversationId}`,
      metadata: { 
        conversation_id: conversationId,
        sender_name: senderName 
      },
    });
  }

  // Create appointment reminder notification
  static async createAppointmentReminder(
    userId: string,
    appointmentId: string,
    appointmentDate: string,
    appointmentTime: string,
    doctorName: string,
    reminderType: 'day_before' | 'hour_before' | '15_min_before' = 'day_before'
  ): Promise<void> {
    const reminderMessages = {
      day_before: `You have an appointment with ${doctorName} tomorrow at ${appointmentTime}`,
      hour_before: `Your appointment with ${doctorName} is in 1 hour at ${appointmentTime}`,
      '15_min_before': `Your appointment with ${doctorName} starts in 15 minutes`
    };

    await this.createNotification({
      user_id: userId,
      title: 'Appointment Reminder',
      message: reminderMessages[reminderType],
      notification_type: 'appointment',
      priority: reminderType === '15_min_before' ? 'high' : 'normal',
      action_url: `/appointments`,
      metadata: { 
        appointment_id: appointmentId,
        doctor_name: doctorName,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        reminder_type: reminderType
      },
    });
  }

  // Create test result notification
  static async createTestResultNotification(
    userId: string,
    testName: string,
    testId: string,
    isAbnormal: boolean = false
  ): Promise<void> {
    await this.createNotification({
      user_id: userId,
      title: 'Test Results Available',
      message: `Your ${testName} results are now available for review${isAbnormal ? '. Please review with your healthcare provider.' : '.'}`,
      notification_type: 'test_result',
      priority: isAbnormal ? 'high' : 'normal',
      action_url: `/results`,
      metadata: { 
        test_id: testId,
        test_name: testName,
        is_abnormal: isAbnormal
      },
    });
  }

  // Create medication reminder notification
  static async createMedicationReminder(
    userId: string,
    medicationName: string,
    medicationId: string,
    dosage: string,
    scheduledTime: string
  ): Promise<void> {
    await this.createNotification({
      user_id: userId,
      title: 'Medication Reminder',
      message: `Time to take your ${medicationName} ${dosage}`,
      notification_type: 'medication',
      priority: 'normal',
      action_url: `/tracking`,
      metadata: { 
        medication_id: medicationId,
        medication_name: medicationName,
        dosage: dosage,
        scheduled_time: scheduledTime
      },
    });
  }

  // Create system notification
  static async createSystemNotification(
    userId: string,
    title: string,
    message: string,
    priority: 'normal' | 'high' | 'urgent' = 'normal',
    actionUrl?: string,
    metadata?: any
  ): Promise<void> {
    await this.createNotification({
      user_id: userId,
      title,
      message,
      notification_type: 'system',
      priority,
      action_url: actionUrl,
      metadata: metadata || {},
    });
  }

  // Get action label for notification type
  private static getActionLabel(notificationType: string): string {
    switch (notificationType) {
      case 'message': return 'Reply';
      case 'appointment': return 'View';
      case 'test_result': return 'Review';
      case 'medication': return 'Mark Taken';
      case 'system': return 'View';
      default: return 'View';
    }
  }

  // Trigger real-time notification (placeholder for WebSocket/SSE implementation)
  private static triggerRealTimeNotification(userId: string, notification: Notification): void {
    // In a real implementation, this would trigger a real-time notification
    // via WebSocket, Server-Sent Events, or push notification service
    console.log(`Real-time notification triggered for user ${userId}:`, notification);
    
    // Example: Browser notification API
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.svg',
        tag: notification.id,
      });
    }
  }

  // Request browser notification permission
  static async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  // Subscribe to real-time notifications
  static subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    return supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as Notification);
        }
      )
      .subscribe();
  }
}