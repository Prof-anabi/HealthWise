import { supabase, handleSupabaseError } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Notification = Database['public']['Tables']['notifications']['Row'];
type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];

export class NotificationService {
  // Get notifications for a user
  static async getNotifications(userId: string, limit: number = 50): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
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

  // Create appointment reminder notification
  static async createAppointmentReminder(
    userId: string,
    appointmentId: string,
    appointmentDate: string,
    doctorName: string
  ): Promise<void> {
    await this.createNotification({
      user_id: userId,
      title: 'Appointment Reminder',
      message: `You have an appointment with ${doctorName} tomorrow at ${appointmentDate}`,
      notification_type: 'appointment',
      priority: 'normal',
      action_url: `/appointments`,
      metadata: { appointment_id: appointmentId },
    });
  }

  // Create test result notification
  static async createTestResultNotification(
    userId: string,
    testName: string,
    testId: string
  ): Promise<void> {
    await this.createNotification({
      user_id: userId,
      title: 'Test Results Available',
      message: `Your ${testName} results are now available for review`,
      notification_type: 'test_result',
      priority: 'high',
      action_url: `/results`,
      metadata: { test_id: testId },
    });
  }

  // Create medication reminder notification
  static async createMedicationReminder(
    userId: string,
    medicationName: string,
    medicationId: string
  ): Promise<void> {
    await this.createNotification({
      user_id: userId,
      title: 'Medication Reminder',
      message: `Time to take your ${medicationName}`,
      notification_type: 'medication',
      priority: 'normal',
      action_url: `/tracking`,
      metadata: { medication_id: medicationId },
    });
  }

  // Create message notification
  static async createMessageNotification(
    userId: string,
    senderName: string,
    conversationId: string,
    priority: 'normal' | 'high' | 'urgent' = 'normal'
  ): Promise<void> {
    await this.createNotification({
      user_id: userId,
      title: 'New Message',
      message: `You have a new message from ${senderName}`,
      notification_type: 'message',
      priority,
      action_url: `/messages`,
      metadata: { conversation_id: conversationId },
    });
  }
}