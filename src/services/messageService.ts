import { supabase, handleSupabaseError } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Message = Database['public']['Tables']['messages']['Row'];
type MessageInsert = Database['public']['Tables']['messages']['Insert'];
type Conversation = Database['public']['Tables']['conversations']['Row'];
type ConversationInsert = Database['public']['Tables']['conversations']['Insert'];
type ConversationParticipant = Database['public']['Tables']['conversation_participants']['Row'];

export interface ConversationWithParticipants extends Conversation {
  participants: {
    id: string;
    first_name: string;
    last_name: string;
    role: string;
    avatar_url?: string;
  }[];
  last_message?: Message;
  unread_count: number;
}

export interface MessageWithSender extends Message {
  sender: {
    id: string;
    first_name: string;
    last_name: string;
    role: string;
    avatar_url?: string;
  };
}

export class MessageService {
  // Get all conversations for a user
  static async getConversations(userId: string): Promise<ConversationWithParticipants[]> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          conversation_participants!inner (
            user_id,
            last_read_at,
            profiles!conversation_participants_user_id_fkey (
              id,
              first_name,
              last_name,
              role,
              avatar_url
            )
          ),
          messages (
            id,
            content,
            created_at,
            sender_id,
            priority,
            message_type
          )
        `)
        .eq('conversation_participants.user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Process the data to match our interface
      const conversations: ConversationWithParticipants[] = data.map((conv: any) => {
        const participants = conv.conversation_participants
          .map((cp: any) => cp.profiles)
          .filter((p: any) => p.id !== userId);

        const lastMessage = conv.messages.length > 0 
          ? conv.messages.sort((a: any, b: any) => 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )[0]
          : null;

        // Calculate unread count (simplified - in real app, compare with last_read_at)
        const unreadCount = conv.messages.filter((m: any) => 
          m.sender_id !== userId && 
          new Date(m.created_at) > new Date(conv.conversation_participants.find((cp: any) => cp.user_id === userId)?.last_read_at || 0)
        ).length;

        return {
          ...conv,
          participants,
          last_message: lastMessage,
          unread_count: unreadCount,
        };
      });

      return conversations;
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  }

  // Get messages for a conversation
  static async getMessages(conversationId: string): Promise<MessageWithSender[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles!messages_sender_id_fkey (
            id,
            first_name,
            last_name,
            role,
            avatar_url
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data.map((message: any) => ({
        ...message,
        sender: message.profiles,
      }));
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  }

  // Send a message
  static async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    priority: 'normal' | 'high' | 'urgent' = 'normal',
    attachments: any[] = []
  ): Promise<Message | null> {
    try {
      const messageData: MessageInsert = {
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        priority,
        attachments,
        message_type: 'text',
      };

      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();

      if (error) throw error;

      // Update conversation updated_at
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return data;
    } catch (error) {
      handleSupabaseError(error);
      return null;
    }
  }

  // Create a new conversation
  static async createConversation(
    subject: string,
    participantIds: string[],
    category: string = 'general'
  ): Promise<string | null> {
    try {
      // Create conversation
      const conversationData: ConversationInsert = {
        subject,
        category,
      };

      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert(conversationData)
        .select()
        .single();

      if (convError) throw convError;

      // Add participants
      const participantData = participantIds.map(userId => ({
        conversation_id: conversation.id,
        user_id: userId,
      }));

      const { error: participantError } = await supabase
        .from('conversation_participants')
        .insert(participantData);

      if (participantError) throw participantError;

      return conversation.id;
    } catch (error) {
      handleSupabaseError(error);
      return null;
    }
  }

  // Mark conversation as read
  static async markAsRead(conversationId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('conversation_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
    }
  }

  // Star/unstar conversation
  static async toggleStar(conversationId: string, isStarred: boolean): Promise<void> {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ is_starred: isStarred })
        .eq('id', conversationId);

      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
    }
  }

  // Archive/unarchive conversation
  static async toggleArchive(conversationId: string, isArchived: boolean): Promise<void> {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ is_archived: isArchived })
        .eq('id', conversationId);

      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
    }
  }

  // Get healthcare providers for messaging
  static async getHealthcareProviders(userRole: string): Promise<any[]> {
    try {
      let roles: string[] = [];
      
      if (userRole === 'patient') {
        roles = ['doctor', 'nurse'];
      } else if (userRole === 'doctor') {
        roles = ['nurse', 'patient'];
      } else if (userRole === 'nurse') {
        roles = ['doctor', 'patient'];
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role, avatar_url, specialties')
        .in('role', roles)
        .limit(50);

      if (error) throw error;

      return data || [];
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  }
}