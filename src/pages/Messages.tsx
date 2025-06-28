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

// Mock message data
const mockConversations = [
  {
    id: '1',
    participants: [
      { id: '1', name: 'Sarah Johnson', role: 'patient', avatar: '👩' },
      { id: '2', name: 'Dr. Michael Smith', role: 'doctor', avatar: '👨‍⚕️' },
    ],
    lastMessage: {
      id: '5',
      senderId: '1',
      content: 'Thank you for the medication adjustment. I\'m feeling much better now.',
      timestamp: '2024-01-20T15:30:00Z',
      type: 'text',
      isRead: true,
      priority: 'normal',
    },
    unreadCount: 0,
    isArchived: false,
    isStarred: false,
    subject: 'Medication Follow-up',
    category: 'follow-up',
  },
  {
    id: '2',
    participants: [
      { id: '1', name: 'Sarah Johnson', role: 'patient', avatar: '👩' },
      { id: '3', name: 'Nurse Jessica Martinez', role: 'nurse', avatar: '👩‍⚕️' },
    ],
    lastMessage: {
      id: '8',
      senderId: '3',
      content: 'Your lab results are ready for review. Please check the test results section.',
      timestamp: '2024-01-20T14:15:00Z',
      type: 'text',
      isRead: false,
      priority: 'high',
    },
    unreadCount: 2,
    isArchived: false,
    isStarred: true,
    subject: 'Lab Results Available',
    category: 'results',
  },
  {
    id: '3',
    participants: [
      { id: '2', name: 'Dr. Michael Smith', role: 'doctor', avatar: '👨‍⚕️' },
      { id: '3', name: 'Nurse Jessica Martinez', role: 'nurse', avatar: '👩‍⚕️' },
    ],
    lastMessage: {
      id: '12',
      senderId: '2',
      content: 'Please monitor patient Johnson\'s blood pressure q4h and report any readings >140/90',
      timestamp: '2024-01-20T13:45:00Z',
      type: 'text',
      isRead: true,
      priority: 'high',
    },
    unreadCount: 0,
    isArchived: false,
    isStarred: false,
    subject: 'Patient Monitoring Instructions',
    category: 'clinical',
  },
];

const mockMessages = [
  {
    id: '1',
    conversationId: '1',
    senderId: '2',
    content: 'Hello Sarah, I hope you\'re feeling better after our last appointment. How are you responding to the new medication?',
    timestamp: '2024-01-20T10:00:00Z',
    type: 'text',
    isRead: true,
    priority: 'normal',
    attachments: [],
  },
  {
    id: '2',
    conversationId: '1',
    senderId: '1',
    content: 'Hi Dr. Smith, thank you for checking in. The new medication is working well, but I\'ve been experiencing some mild nausea in the mornings.',
    timestamp: '2024-01-20T10:30:00Z',
    type: 'text',
    isRead: true,
    priority: 'normal',
    attachments: [],
  },
  {
    id: '3',
    conversationId: '1',
    senderId: '2',
    content: 'That\'s a common side effect that usually subsides after a few weeks. Try taking the medication with food. If it persists, we can adjust the dosage.',
    timestamp: '2024-01-20T11:00:00Z',
    type: 'text',
    isRead: true,
    priority: 'normal',
    attachments: [],
  },
  {
    id: '4',
    conversationId: '1',
    senderId: '1',
    content: 'I\'ll try that. Should I be concerned about any other side effects?',
    timestamp: '2024-01-20T11:15:00Z',
    type: 'text',
    isRead: true,
    priority: 'normal',
    attachments: [],
  },
  {
    id: '5',
    conversationId: '1',
    senderId: '1',
    content: 'Thank you for the medication adjustment. I\'m feeling much better now.',
    timestamp: '2024-01-20T15:30:00Z',
    type: 'text',
    isRead: true,
    priority: 'normal',
    attachments: [],
  },
];

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
  const [selectedConversation, setSelectedConversation] = React.useState<string | null>('1');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [newMessage, setNewMessage] = React.useState('');
  const [showNewMessageModal, setShowNewMessageModal] = React.useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = React.useState(false);

  const filteredConversations = mockConversations.filter(conversation => {
    const matchesSearch = conversation.participants.some(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || conversation.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'urgent' && conversation.lastMessage.priority === 'high') ||
      (selectedCategory === 'starred' && conversation.isStarred) ||
      (selectedCategory === 'archived' && conversation.isArchived) ||
      conversation.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const selectedConversationData = selectedConversation 
    ? mockConversations.find(c => c.id === selectedConversation)
    : null;

  const conversationMessages = selectedConversation
    ? mockMessages.filter(m => m.conversationId === selectedConversation)
    : [];

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

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const NewMessageModal = () => (
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
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Select recipient...</option>
              {user?.role === 'patient' && (
                <>
                  <option value="doctor">My Doctor</option>
                  <option value="nurse">My Nurse</option>
                </>
              )}
              {user?.role === 'doctor' && (
                <>
                  <option value="patient">Patient</option>
                  <option value="nurse">Nurse</option>
                </>
              )}
              {user?.role === 'nurse' && (
                <>
                  <option value="doctor">Doctor</option>
                  <option value="patient">Patient</option>
                </>
              )}
            </select>
          </div>
          
          <Input label="Subject" placeholder="Enter message subject..." />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
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
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Type your message..."
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowNewMessageModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowNewMessageModal(false)}>
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
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
                    2
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
                    <div className="text-2xl">{otherParticipant?.avatar}</div>
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
                        {getParticipantIcon(otherParticipant?.role || 'patient')}
                      </div>
                      <div className="flex items-center space-x-1">
                        {conversation.isStarred && (
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        )}
                        {conversation.lastMessage.priority === 'high' && (
                          <AlertCircle className="w-3 h-3 text-red-500" />
                        )}
                        <span className="text-xs text-gray-500">
                          {formatMessageTime(conversation.lastMessage.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm font-medium text-gray-700 mb-1 truncate">
                      {conversation.subject}
                    </p>
                    
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage.content}
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
                  <div className="text-2xl">
                    {selectedConversationData.participants.find(p => p.id !== user?.id)?.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedConversationData.participants.find(p => p.id !== user?.id)?.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {getParticipantIcon(selectedConversationData.participants.find(p => p.id !== user?.id)?.role || 'patient')}
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
                  <Button variant="outline" size="sm">
                    <Star className="w-4 h-4" />
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
              {conversationMessages.map((message) => {
                const isOwnMessage = message.senderId === user?.id;
                const sender = selectedConversationData.participants.find(p => p.id === message.senderId);
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                      {!isOwnMessage && (
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs">{sender?.avatar}</span>
                          <span className="text-xs font-medium text-gray-700">{sender?.name}</span>
                          {getParticipantIcon(sender?.role || 'patient')}
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
                          {format(new Date(message.timestamp), 'HH:mm')}
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