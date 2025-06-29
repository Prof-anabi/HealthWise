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
  UserCheck,
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
  Activity,
  Bell,
  Circle,
  Check,
  CheckCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';

// Mock data for conversations and messages
const mockConversations = [
  {
    id: '1',
    participants: [
      { id: '1', name: 'Dr. Sarah Johnson', role: 'doctor', avatar: '👩‍⚕️', specialty: 'Primary Care', isOnline: true },
      { id: '2', name: 'John Patient', role: 'patient', avatar: '👨', isOnline: false }
    ],
    subject: 'Blood Pressure Medication Question',
    lastMessage: {
      id: '1',
      content: 'Thank you for the clarification. I\'ll adjust my medication timing as suggested.',
      senderId: '2',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      isRead: true,
      priority: 'normal'
    },
    unreadCount: 0,
    isStarred: false,
    isArchived: false,
    category: 'medical',
    priority: 'normal',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: '2',
    participants: [
      { id: '3', name: 'Nurse Emily Rodriguez', role: 'nurse', avatar: '👩‍⚕️', specialty: 'Patient Care', isOnline: true },
      { id: '2', name: 'John Patient', role: 'patient', avatar: '👨', isOnline: false }
    ],
    subject: 'Appointment Reminder & Pre-visit Instructions',
    lastMessage: {
      id: '2',
      content: 'Please remember to bring your insurance card and arrive 15 minutes early for your appointment tomorrow.',
      senderId: '3',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: false,
      priority: 'high'
    },
    unreadCount: 2,
    isStarred: true,
    isArchived: false,
    category: 'appointment',
    priority: 'high',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: '3',
    participants: [
      { id: '4', name: 'Dr. Michael Chen', role: 'doctor', avatar: '👨‍⚕️', specialty: 'Cardiology', isOnline: false },
      { id: '2', name: 'John Patient', role: 'patient', avatar: '👨', isOnline: false }
    ],
    subject: 'Test Results Discussion',
    lastMessage: {
      id: '3',
      content: 'Your recent EKG results look good. Let\'s schedule a follow-up in 3 months.',
      senderId: '4',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      isRead: true,
      priority: 'normal'
    },
    unreadCount: 0,
    isStarred: false,
    isArchived: false,
    category: 'results',
    priority: 'normal',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
];

const initialMessages = {
  '1': [
    {
      id: '1',
      content: 'Hi Dr. Johnson, I have a question about my blood pressure medication. I\'ve been experiencing some dizziness in the mornings.',
      senderId: '2',
      senderName: 'John Patient',
      senderRole: 'patient',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isRead: true,
      priority: 'normal',
      attachments: [],
      reactions: [],
      isEdited: false,
    },
    {
      id: '2',
      content: 'Thank you for reaching out. Morning dizziness can be a side effect when starting blood pressure medication. How long have you been taking it, and what time do you usually take your dose?',
      senderId: '1',
      senderName: 'Dr. Sarah Johnson',
      senderRole: 'doctor',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      isRead: true,
      priority: 'normal',
      attachments: [],
      reactions: [],
      isEdited: false,
    },
    {
      id: '3',
      content: 'I\'ve been taking it for about 2 weeks now. I usually take it right when I wake up, around 7 AM.',
      senderId: '2',
      senderName: 'John Patient',
      senderRole: 'patient',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: true,
      priority: 'normal',
      attachments: [],
      reactions: [],
      isEdited: false,
    },
    {
      id: '4',
      content: 'That timing might be contributing to the dizziness. Try taking it with breakfast instead of on an empty stomach, and make sure to stand up slowly in the mornings. If the dizziness persists after a few days, let me know.',
      senderId: '1',
      senderName: 'Dr. Sarah Johnson',
      senderRole: 'doctor',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      isRead: true,
      priority: 'normal',
      attachments: [],
      reactions: [],
      isEdited: false,
    },
    {
      id: '5',
      content: 'Thank you for the clarification. I\'ll adjust my medication timing as suggested.',
      senderId: '2',
      senderName: 'John Patient',
      senderRole: 'patient',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: true,
      priority: 'normal',
      attachments: [],
      reactions: [],
      isEdited: false,
    },
  ],
  '2': [
    {
      id: '6',
      content: 'Hi John! This is a reminder about your appointment tomorrow at 10:00 AM with Dr. Johnson.',
      senderId: '3',
      senderName: 'Nurse Emily Rodriguez',
      senderRole: 'nurse',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isRead: true,
      priority: 'high',
      attachments: [],
      reactions: [],
      isEdited: false,
    },
    {
      id: '7',
      content: 'Please remember to bring your insurance card and arrive 15 minutes early for your appointment tomorrow.',
      senderId: '3',
      senderName: 'Nurse Emily Rodriguez',
      senderRole: 'nurse',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
      priority: 'high',
      attachments: [
        { id: '1', name: 'Pre-visit-checklist.pdf', type: 'pdf', size: '245 KB' }
      ],
      reactions: [],
      isEdited: false,
    },
  ],
  '3': [
    {
      id: '8',
      content: 'Your recent EKG results look good. Let\'s schedule a follow-up in 3 months.',
      senderId: '4',
      senderName: 'Dr. Michael Chen',
      senderRole: 'doctor',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isRead: true,
      priority: 'normal',
      attachments: [],
      reactions: [],
      isEdited: false,
    },
  ],
};

const mockNotifications = [
  {
    id: '1',
    type: 'message',
    title: 'New message from Dr. Sarah Johnson',
    message: 'That timing might be contributing to the dizziness...',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    isRead: false,
    priority: 'normal',
    actionUrl: '/messages?conversation=1',
    metadata: { conversationId: '1', senderId: '1' }
  },
  {
    id: '2',
    type: 'appointment',
    title: 'Appointment reminder',
    message: 'You have an appointment with Dr. Johnson tomorrow at 10:00 AM',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: false,
    priority: 'high',
    actionUrl: '/appointments',
    metadata: { appointmentId: '123' }
  },
  {
    id: '3',
    type: 'test_result',
    title: 'Test results available',
    message: 'Your blood work results are now available for review',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isRead: true,
    priority: 'normal',
    actionUrl: '/test-results',
    metadata: { testId: '456' }
  },
];

const messageCategories = [
  { id: 'all', label: 'All Messages', icon: MessageSquare, count: 3 },
  { id: 'unread', label: 'Unread', icon: Circle, count: 2 },
  { id: 'starred', label: 'Starred', icon: Star, count: 1 },
  { id: 'medical', label: 'Medical', icon: Stethoscope, count: 1 },
  { id: 'appointment', label: 'Appointments', icon: Clock, count: 1 },
  { id: 'results', label: 'Results', icon: FileText, count: 1 },
  { id: 'archived', label: 'Archived', icon: Archive, count: 0 },
];

export const Messages: React.FC = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = React.useState<string | null>('1');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [newMessage, setNewMessage] = React.useState('');
  const [showNewMessageModal, setShowNewMessageModal] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = React.useState(false);
  const [messagePriority, setMessagePriority] = React.useState<'normal' | 'high' | 'urgent'>('normal');
  const [messages, setMessages] = React.useState(initialMessages);

  const filteredConversations = mockConversations.filter(conversation => {
    const matchesSearch = conversation.participants.some(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || conversation.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'unread' && conversation.unreadCount > 0) ||
      (selectedCategory === 'starred' && conversation.isStarred) ||
      (selectedCategory === 'archived' && conversation.isArchived) ||
      conversation.category === selectedCategory;
    
    return matchesSearch && matchesCategory && !conversation.isArchived;
  });

  const selectedConversationData = selectedConversation 
    ? mockConversations.find(c => c.id === selectedConversation)
    : null;

  const currentMessages = selectedConversation ? messages[selectedConversation] || [] : [];

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
      case 'high': return 'warning';
      case 'urgent': return 'danger';
      default: return 'default';
    }
  };

  const formatMessageTime = (timestamp: Date) => {
    if (isToday(timestamp)) {
      return format(timestamp, 'HH:mm');
    } else if (isYesterday(timestamp)) {
      return 'Yesterday';
    } else {
      return format(timestamp, 'MMM d');
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    // Create new message
    const newMsg = {
      id: `msg_${Date.now()}`,
      content: newMessage.trim(),
      senderId: user.id,
      senderName: `${user.first_name} ${user.last_name}`,
      senderRole: user.role,
      timestamp: new Date(),
      isRead: true,
      priority: messagePriority,
      attachments: [],
      reactions: [],
      isEdited: false,
    };

    // Add message to the conversation
    setMessages(prev => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), newMsg]
    }));

    // Create notification for recipient
    const conversation = mockConversations.find(c => c.id === selectedConversation);
    if (conversation) {
      const recipient = conversation.participants.find(p => p.id !== user?.id);
      if (recipient) {
        console.log('Creating notification for:', recipient.name);
      }
    }

    setNewMessage('');
    setMessagePriority('normal');
  };

  const NewMessageModal = () => {
    const [formData, setFormData] = React.useState({
      recipient: '',
      subject: '',
      message: '',
      priority: 'normal' as 'normal' | 'high' | 'urgent',
    });

    const availableContacts = [
      { id: '1', name: 'Dr. Sarah Johnson', role: 'doctor', specialty: 'Primary Care' },
      { id: '3', name: 'Nurse Emily Rodriguez', role: 'nurse', specialty: 'Patient Care' },
      { id: '4', name: 'Dr. Michael Chen', role: 'doctor', specialty: 'Cardiology' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (formData.recipient && formData.subject && formData.message) {
        console.log('Creating new conversation:', formData);
        setShowNewMessageModal(false);
        setFormData({ recipient: '', subject: '', message: '', priority: 'normal' });
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                {availableContacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.name} ({contact.role} - {contact.specialty})
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
                rows={6}
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

  const NotificationPanel = () => (
    <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          <Button variant="ghost" size="sm">
            Mark all read
          </Button>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {mockNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 hover:bg-gray-50 cursor-pointer ${
              !notification.isRead ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                notification.isRead ? 'bg-gray-300' : 'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                  {notification.priority === 'high' && (
                    <Badge variant="warning" size="sm">High</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
                <p className="text-xs text-gray-500">{formatMessageTime(notification.timestamp)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <Button variant="outline" size="sm" className="w-full">
          View All Notifications
        </Button>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="w-4 h-4" />
                  {mockNotifications.filter(n => !n.isRead).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {mockNotifications.filter(n => !n.isRead).length}
                    </span>
                  )}
                </Button>
                {showNotifications && <NotificationPanel />}
              </div>
              <Button size="sm" onClick={() => setShowNewMessageModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New
              </Button>
            </div>
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
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <category.icon className="w-4 h-4 mr-3" />
                  {category.label}
                </div>
                {category.count > 0 && (
                  <Badge variant="default" size="sm">
                    {category.count}
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
                    {otherParticipant?.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900 truncate">
                          {otherParticipant?.name}
                        </h4>
                        <span className="text-xs text-gray-500 capitalize">
                          {otherParticipant?.role}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {conversation.isStarred && (
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        )}
                        {conversation.lastMessage?.priority === 'high' && (
                          <AlertCircle className="w-3 h-3 text-orange-500" />
                        )}
                        {conversation.lastMessage?.priority === 'urgent' && (
                          <AlertCircle className="w-3 h-3 text-red-500" />
                        )}
                        <span className="text-xs text-gray-500">
                          {conversation.lastMessage && formatMessageTime(conversation.lastMessage.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm font-medium text-gray-700 mb-1 truncate">
                      {conversation.subject}
                    </p>
                    
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage?.content}
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
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {getParticipantIcon(selectedConversationData.participants.find(p => p.id !== user?.id)?.role || 'patient')}
                    </div>
                    {selectedConversationData.participants.find(p => p.id !== user?.id)?.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedConversationData.participants.find(p => p.id !== user?.id)?.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 capitalize">
                        {selectedConversationData.participants.find(p => p.id !== user?.id)?.role}
                      </span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">
                        {selectedConversationData.participants.find(p => p.id !== user?.id)?.specialty}
                      </span>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${
                          selectedConversationData.participants.find(p => p.id !== user?.id)?.isOnline 
                            ? 'bg-green-500' 
                            : 'bg-gray-400'
                        }`}></div>
                        <span className="text-xs text-gray-500">
                          {selectedConversationData.participants.find(p => p.id !== user?.id)?.isOnline ? 'Online' : 'Offline'}
                        </span>
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
                  <Button variant="outline" size="sm">
                    <Star className={`w-4 h-4 ${selectedConversationData.isStarred ? 'fill-current text-yellow-500' : ''}`} />
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
              {currentMessages.map((message) => {
                const isOwnMessage = message.senderId === user?.id;
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                      {!isOwnMessage && (
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                            {getParticipantIcon(message.senderRole)}
                          </div>
                          <span className="text-xs font-medium text-gray-700">
                            {message.senderName}
                          </span>
                          {message.priority !== 'normal' && (
                            <Badge variant={getPriorityColor(message.priority) as any} size="sm">
                              {message.priority}
                            </Badge>
                          )}
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
                        
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map((attachment) => (
                              <div
                                key={attachment.id}
                                className={`flex items-center space-x-2 p-2 rounded ${
                                  isOwnMessage ? 'bg-primary-700' : 'bg-gray-200'
                                }`}
                              >
                                <FileText className="w-4 h-4" />
                                <span className="text-xs">{attachment.name}</span>
                                <span className="text-xs opacity-75">({attachment.size})</span>
                                <Button variant="ghost" size="sm">
                                  <Download className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className={`flex items-center space-x-2 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs text-gray-500">
                          {format(message.timestamp, 'HH:mm')}
                        </span>
                        {isOwnMessage && (
                          <div className="flex items-center">
                            {message.isRead ? (
                              <CheckCheck className="w-3 h-3 text-green-500" />
                            ) : (
                              <Check className="w-3 h-3 text-gray-400" />
                            )}
                          </div>
                        )}
                        {message.isEdited && (
                          <span className="text-xs text-gray-400">edited</span>
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
                
                <div className="flex items-center space-x-2">
                  <select
                    value={messagePriority}
                    onChange={(e) => setMessagePriority(e.target.value as any)}
                    className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-3"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
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