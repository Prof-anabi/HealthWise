import React from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import {
  MessageSquare,
  Send,
  Paperclip,
  Search,
  Filter,
  Star,
  Archive,
  Trash2,
  Phone,
  Video,
  MoreHorizontal,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Stethoscope,
  Heart,
  Plus,
  Image,
  FileText,
  Mic,
  X,
  Flag,
  Reply,
  Forward,
  Download,
  Eye,
  Shield,
  Zap,
  UserCheck,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { MessageService, type ConversationWithParticipants, type MessageWithSender } from '../services/messageService';
import { subscribeToMessages } from '../lib/supabase';

const messageCategories = [
  { id: 'all', label: 'All Messages', icon: MessageSquare },
  { id: 'urgent', label: 'Urgent', icon: AlertCircle },
  { id: 'follow-up', label: 'Follow-up', icon: Clock },
  { id: 'results', label: 'Results', icon: FileText },
  { id: 'clinical', label: 'Clinical', icon: Stethoscope },
  { id: 'starred', label: 'Starred', icon: Star },
  { id: 'archived', label: 'Archived', icon: Archive },
];

export const Messages: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = React.useState<ConversationWithParticipants[]>([]);
  const [messages, setMessages] = React.useState<MessageWithSender[]>([]);
  const [selectedConversation, setSelectedConversation] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [newMessage, setNewMessage] = React.useState('');
  const [showNewMessageModal, setShowNewMessageModal] = React.useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [healthcareProviders, setHealthcareProviders] = React.useState<any[]>([]);

  // Load conversations on mount
  React.useEffect(() => {
    if (user) {
      loadConversations();
      loadHealthcareProviders();
    }
  }, [user]);

  // Load messages when conversation is selected
  React.useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
      
      // Subscribe to real-time messages
      const subscription = subscribeToMessages(selectedConversation, (payload) => {
        if (payload.eventType === 'INSERT') {
          loadMessages(selectedConversation);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const data = await MessageService.getConversations(user.id);
      setConversations(data);
      
      // Auto-select first conversation if none selected
      if (!selectedConversation && data.length > 0) {
        setSelectedConversation(data[0].id);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const data = await MessageService.getMessages(conversationId);
      setMessages(data);
      
      // Mark conversation as read
      if (user) {
        await MessageService.markAsRead(conversationId, user.id);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadHealthcareProviders = async () => {
    if (!user) return;
    
    try {
      const providers = await MessageService.getHealthcareProviders(user.role);
      setHealthcareProviders(providers);
    } catch (error) {
      console.error('Error loading healthcare providers:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    try {
      await MessageService.sendMessage(
        selectedConversation,
        user.id,
        newMessage.trim()
      );
      
      setNewMessage('');
      // Messages will be reloaded via real-time subscription
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleCreateConversation = async (
    subject: string,
    recipientId: string,
    initialMessage: string,
    priority: 'normal' | 'high' | 'urgent' = 'normal'
  ) => {
    if (!user) return;

    try {
      const conversationId = await MessageService.createConversation(
        subject,
        [user.id, recipientId],
        'general'
      );

      if (conversationId) {
        await MessageService.sendMessage(
          conversationId,
          user.id,
          initialMessage,
          priority
        );
        
        setSelectedConversation(conversationId);
        await loadConversations();
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.participants.some(p => 
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    ) || conversation.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'urgent' && conversation.last_message?.priority === 'high') ||
      (selectedCategory === 'starred' && conversation.is_starred) ||
      (selectedCategory === 'archived' && conversation.is_archived) ||
      conversation.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const selectedConversationData = selectedConversation 
    ? conversations.find(c => c.id === selectedConversation)
    : null;

  const getParticipantIcon = (role: string) => {
    switch (role) {
      case 'doctor': return <Stethoscope className="w-4 h-4" />;
      case 'nurse': return <Heart className="w-4 h-4" />;
      case 'patient': return <User className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'urgent': return 'danger';
      case 'medium': return 'warning';
      default: return 'default';
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d');
    }
  };

  const NewMessageModal = () => {
    const [formData, setFormData] = React.useState({
      recipient: '',
      subject: '',
      message: '',
      priority: 'normal' as 'normal' | 'high' | 'urgent',
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (formData.recipient && formData.subject && formData.message) {
        await handleCreateConversation(
          formData.subject,
          formData.recipient,
          formData.message,
          formData.priority
        );
        setShowNewMessageModal(false);
        setFormData({ recipient: '', subject: '', message: '', priority: 'normal' });
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">New Message</h3>
              <button
                onClick={() => setShowNewMessageModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <select 
                value={formData.recipient}
                onChange={(e) => setFormData(prev => ({ ...prev, recipient: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Select recipient...</option>
                {healthcareProviders.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.first_name} {provider.last_name} ({provider.role})
                  </option>
                ))}
              </select>
            </div>
            
            <Input 
              label="Subject" 
              placeholder="Enter message subject..." 
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select 
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="normal">Normal</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Type your message..."
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => setShowNewMessageModal(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <Button size="sm" onClick={() => setShowNewMessageModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New
            </Button>
          </div>
          
          {/* Search */}
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            className="mb-4"
          />
          
          {/* Categories */}
          <div className="space-y-1">
            {messageCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <category.icon className="w-4 h-4 mr-3" />
                {category.label}
                {category.id === 'urgent' && (
                  <Badge variant="danger" size="sm" className="ml-auto">
                    {conversations.filter(c => c.last_message?.priority === 'high').length}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => {
            const otherParticipant = conversation.participants.find(p => p.id !== user?.id);
            
            return (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                  selectedConversation === conversation.id ? 'bg-primary-50 border-primary-200' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {getParticipantIcon(otherParticipant?.role || 'patient')}
                    </div>
                    {conversation.unread_count > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                        {conversation.unread_count}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900 truncate">
                          {otherParticipant?.first_name} {otherParticipant?.last_name}
                        </h4>
                        <span className="text-xs text-gray-500 capitalize">
                          {otherParticipant?.role}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {conversation.is_starred && (
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        )}
                        {conversation.last_message?.priority === 'high' && (
                          <AlertCircle className="w-3 h-3 text-red-500" />
                        )}
                        <span className="text-xs text-gray-500">
                          {conversation.last_message && formatMessageTime(conversation.last_message.created_at)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm font-medium text-gray-700 mb-1 truncate">
                      {conversation.subject}
                    </p>
                    
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.last_message?.content}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversationData ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {getParticipantIcon(selectedConversationData.participants.find(p => p.id !== user?.id)?.role || 'patient')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedConversationData.participants.find(p => p.id !== user?.id)?.first_name} {selectedConversationData.participants.find(p => p.id !== user?.id)?.last_name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 capitalize">
                        {selectedConversationData.participants.find(p => p.id !== user?.id)?.role}
                      </span>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-500">Online</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => MessageService.toggleStar(selectedConversationData.id, !selectedConversationData.is_starred)}
                  >
                    <Star className={`w-4 h-4 ${selectedConversationData.is_starred ? 'fill-current text-yellow-500' : ''}`} />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Subject */}
              <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">
                  Subject: {selectedConversationData.subject}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isOwnMessage = message.sender_id === user?.id;
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                      {!isOwnMessage && (
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                            {getParticipantIcon(message.sender.role)}
                          </div>
                          <span className="text-xs font-medium text-gray-700">
                            {message.sender.first_name} {message.sender.last_name}
                          </span>
                        </div>
                      )}
                      
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          isOwnMessage
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      
                      <div className={`flex items-center space-x-2 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs text-gray-500">
                          {format(new Date(message.created_at), 'HH:mm')}
                        </span>
                        {isOwnMessage && (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        )}
                        {message.priority === 'high' && (
                          <AlertCircle className="w-3 h-3 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <div className="relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      rows={1}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                      <button
                        onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                        <Mic className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Attachment Menu */}
                  {showAttachmentMenu && (
                    <div className="absolute bottom-16 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-2 space-y-1">
                      <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                        <Image className="w-4 h-4 mr-2" />
                        Photo
                      </button>
                      <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                        <FileText className="w-4 h-4 mr-2" />
                        Document
                      </button>
                      <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                        <Activity className="w-4 h-4 mr-2" />
                        Health Data
                      </button>
                    </div>
                  )}
                </div>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center space-x-2 mt-2">
                <Button variant="outline" size="sm">
                  <Flag className="w-3 h-3 mr-1" />
                  Mark Urgent
                </Button>
                <Button variant="outline" size="sm">
                  <Shield className="w-3 h-3 mr-1" />
                  Secure
                </Button>
                <Button variant="outline" size="sm">
                  <Clock className="w-3 h-3 mr-1" />
                  Schedule
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Conversation</h3>
              <p className="text-gray-600">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>

      {showNewMessageModal && <NewMessageModal />}
    </div>
  );
};